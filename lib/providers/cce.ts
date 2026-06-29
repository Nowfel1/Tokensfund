import { CanonicalAsset, NormalizedQuote, QuoteRequest, SwapInstruction, SwapStatus } from "../types";
import { createHmac, randomBytes } from "crypto";

const BASE = "https://cce.cash/api/v1";
const API_KEY = process.env.CCE_API_KEY ?? "";
const API_SECRET = process.env.CCE_API_SECRET ?? "";

// ==================== AUTH ====================
function sign(nonce: string, timestamp: string, bodyString: string): string {
  const payload = API_KEY + nonce + timestamp + bodyString;
  return createHmac("sha256", API_SECRET).update(payload).digest("hex");
}

function getAuthHeaders(body: object): Record<string, string> {
  const nonce = randomBytes(16).toString("hex");
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const bodyString = JSON.stringify(body);
  const signature = sign(nonce, timestamp, bodyString);
  return {
    "Content-Type": "application/json",
    "X-Api-Key": API_KEY,
    "X-Api-Nonce": nonce,
    "X-Api-Timestamp": timestamp,
    "X-Api-Signature": signature,
  };
}

async function post<T>(path: string, body: object): Promise<T> {
  const headers = getAuthHeaders(body);
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
  const data = await res.json();

  // TEMPORARY DEBUG: logs CCE's raw response to your Vercel function logs.
  // Remove once tracking is confirmed working.
  console.log("CCE", path, "→", res.status, JSON.stringify(data));

  if (data.code !== 0) {
    throw new Error(`CCE Error: ${data.msg || "Unknown error"}`);
  }
  return data.data;
}

// ==================== QUOTE ====================
export async function getQuote(
  from: CanonicalAsset,
  to: CanonicalAsset,
  req: QuoteRequest
): Promise<NormalizedQuote> {
  const fromRef = from.providerIds.cce!;
  const toRef = to.providerIds.cce!;
  const body = {
    exchange_mode: "float",
    from_abbr: fromRef.abbr,
    from_chain: fromRef.chain,
    from_quantity: Number(req.amount),
    to_address: [
      {
        to_abbr: toRef.abbr,
        to_chain: toRef.chain,
        to_ratio: 1,
      },
    ],
  };
  const data = await post<any>("/openapi/order/calculate", body);
  const toData = data.to?.[0];
  if (!toData) {
    throw new Error("CCE returned no quote data.");
  }
  return {
    provider: "cce",
    providerLabel: "CCE.Cash",
    expectedOut: Number(toData.to_quantity),
    estimatedSeconds: 600,
    raw: data,
  };
}

// ==================== BUILD SWAP ====================
export async function buildSwap(
  _quote: NormalizedQuote,
  req: QuoteRequest,
  from: CanonicalAsset,
  to: CanonicalAsset
): Promise<SwapInstruction> {
  if (!req.destinationAddress) {
    throw new Error("Destination address is required for CCE.Cash");
  }
  const fromRef = from.providerIds.cce!;
  const toRef = to.providerIds.cce!;
  const body = {
    exchange_mode: "float",
    from_abbr: fromRef.abbr,
    from_chain: fromRef.chain,
    from_quantity: Number(req.amount),
    to_address: [
      {
        to_abbr: toRef.abbr,
        to_chain: toRef.chain,
        to_address: req.destinationAddress,
        to_ratio: 1,
      },
    ],
  };
  const data = await post<any>("/openapi/order/place", body);

  // CCE returns the order number as `no` (NOT `order_no`).
  // `query_code` is the human-facing inquiry code shown on cce.cash.
  // Read defensively in case the field name differs across endpoints.
  const orderId = data.no ?? data.order_no ?? data.query_code;
  if (!orderId) {
    throw new Error("CCE place response missing order id (no/order_no/query_code).");
  }
  return {
    provider: "cce",
    depositAddress: data.address,
    depositAmount: req.amount,
    trackingId: String(orderId),
    notes: `CCE.Cash Order #${data.query_code ?? orderId}`,
  };
}

// ==================== STATUS ====================
// CCE returns `status` as a NUMBER, and the order lifecycle in their UI is:
//   Waiting for deposit -> Deposited -> In Exchange -> Exchange completed
//
// Observed from real payloads:
//   status: 1  -> order created, no deposit yet (payfor_at/accept_at/finish_at all 0)
//   nested output[].status: 2 -> an outbound send completed
//
// !!! UNVERIFIED: the exact number for each stage is inferred, not confirmed.
// Confirm the "Exchange completed" number against a finished order and adjust.
const NUMERIC_STATE: Record<number, SwapStatus["state"]> = {
  0: "awaiting_deposit", // created / pending (guess)
  1: "awaiting_deposit", // confirmed-observed: created, awaiting deposit
  2: "deposit_detected", // deposit seen / in progress (inferred)
  3: "processing",       // exchanging (inferred)
  4: "success",          // completed (inferred — VERIFY)
  5: "refunded",         // (inferred — VERIFY)
  6: "failed",           // (inferred — VERIFY)
};

export async function getStatus(trackingId: string): Promise<SwapStatus> {
  // Users paste the reference exactly as displayed ("#IQ2SN93GW8DE"), so strip
  // any leading "#" and surrounding whitespace before querying.
  const cleanId = String(trackingId).trim().replace(/^#+/, "");

  // CCE returns BOTH `no` (8-char order number) and `query_code` (12-char
  // user-facing code shown on cce.cash). A manually-entered reference is
  // usually the query_code, so try that first, then fall back to `no`/`order_no`.
  const attempts = [
    { query_code: cleanId },
    { no: cleanId },
    { order_no: cleanId },
  ];

  try {
    let data: any | undefined;
    let lastErr: any;
    for (const body of attempts) {
      try {
        data = await post<any>("/openapi/order/query", body);
        break; // first one CCE accepts (code 0) wins
      } catch (e) {
        lastErr = e;
      }
    }
    if (data === undefined) {
      throw lastErr ?? new Error("CCE query failed for all id fields.");
    }

    const rawStatus = data.status;
    const mapped =
      typeof rawStatus === "number" ? NUMERIC_STATE[rawStatus] : undefined;

    // A completed order should have finish_at set — use it as a corroborating
    // signal so we don't falsely report "completed".
    const looksFinished = Number(data.finish_at) > 0;

    let state: SwapStatus["state"] = mapped ?? "unknown";
    if (state === "success" && !looksFinished) {
      // status says done but no finish timestamp — don't claim completion
      state = "processing";
    }

    return {
      provider: "cce",
      state,
      detail:
        mapped !== undefined
          ? `status=${rawStatus}${looksFinished ? " (finished)" : ""}`
          : `Unmapped CCE status: ${JSON.stringify(rawStatus)}`,
    };
  } catch (error: any) {
    return {
      provider: "cce",
      state: "unknown",
      detail: error?.message ?? "Status lookup failed",
    };
  }
}
