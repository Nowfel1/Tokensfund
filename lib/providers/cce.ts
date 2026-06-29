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

function getAuthHeadersRaw(bodyString: string): Record<string, string> {
  const nonce = randomBytes(16).toString("hex");
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const signature = sign(nonce, timestamp, bodyString);
  return {
    "Content-Type": "application/json",
    "X-Api-Key": API_KEY,
    "X-Api-Nonce": nonce,
    "X-Api-Timestamp": timestamp,
    "X-Api-Signature": signature,
  };
}

function getAuthHeaders(body: object): Record<string, string> {
  return getAuthHeadersRaw(JSON.stringify(body));
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

// CCE's order/query is a GET — params go in the URL query string, not a body.
async function get<T>(path: string, params: Record<string, string>): Promise<T> {
  const qs = new URLSearchParams(params).toString();
  const url = `${BASE}${path}${qs ? `?${qs}` : ""}`;

  // A GET has no body. The signature is most likely computed over an EMPTY body
  // string here. If CCE returns code 400009 ("Incorrect signature"), the body
  // string should instead be the query string — set SIGN_BODY = qs below.
  const SIGN_BODY = "";
  const headers = getAuthHeadersRaw(SIGN_BODY);

  const res = await fetch(url, { method: "GET", headers });
  const data = await res.json();

  // TEMPORARY DEBUG: remove once tracking is confirmed working.
  console.log("CCE GET", path, qs, "→", res.status, JSON.stringify(data));

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

  // CCE returns the order number as `no` (8-char) AND `query_code` (12-char,
  // the code shown on cce.cash). We don't know which the query endpoint keys
  // off, so store BOTH (joined with "~") and let getStatus try each.
  const orderNo = data.no ?? data.order_no;
  const queryCode = data.query_code;
  const orderId = orderNo ?? queryCode;
  if (!orderId) {
    throw new Error("CCE place response missing order id (no/order_no/query_code).");
  }
  return {
    provider: "cce",
    depositAddress: data.address,
    depositAmount: req.amount,
    trackingId: [orderNo, queryCode].filter(Boolean).map(String).join("~"),
    notes: `CCE.Cash Order #${queryCode ?? orderId}`,
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
  // trackingId is "no~query_code" (stored) or a single pasted code. Strip "#",
  // whitespace, and any dashes — CCE displays codes grouped as "QIC0-5HYH-92XV"
  // but stores/queries them unformatted ("QIC05HYH92XV").
  const parts = String(trackingId)
    .trim()
    .replace(/^#+/, "")
    .split("~")
    .map((s) => s.replace(/[\s-]/g, "").trim())
    .filter(Boolean);

  // 8-char value is the order `no`; 12-char is the `query_code`.
  const orderNo = parts.find((p) => p.length <= 8);
  const queryCode = parts.find((p) => p.length >= 9);

  // Try only the two natural pairings (no wasteful cross-product / endpoint hammering).
  const attempts: Array<Record<string, string>> = [];
  if (queryCode) attempts.push({ query_code: queryCode });
  if (orderNo) attempts.push({ no: orderNo });
  if (attempts.length === 0 && parts[0]) attempts.push({ query_code: parts[0] });

  let data: any | undefined;
  for (const params of attempts) {
    try {
      data = await get<any>("/openapi/order/query", params);
      break; // first pairing CCE accepts (code 0) wins
    } catch {
      // try the next pairing
    }
  }

  // If the query still fails, degrade gracefully and point the user to CCE's own
  // order page rather than surfacing an error.
  if (data === undefined) {
    const code = queryCode ?? orderNo ?? parts[0] ?? "";
    return {
      provider: "cce",
      state: "unknown",
      detail: code
        ? `Track this order on CCE.cash (order code ${code})`
        : "Track this order on CCE.cash",
    };
  }

  const rawStatus = data.status;
  const mapped =
    typeof rawStatus === "number" ? NUMERIC_STATE[rawStatus] : undefined;

  // A completed order should have finish_at set — corroborate so we never
  // falsely report "completed".
  const looksFinished = Number(data.finish_at) > 0;

  let state: SwapStatus["state"] = mapped ?? "unknown";
  if (state === "success" && !looksFinished) state = "processing";

  return {
    provider: "cce",
    state,
    detail:
      mapped !== undefined
        ? `status=${rawStatus}${looksFinished ? " (finished)" : ""}`
        : `Unmapped CCE status: ${JSON.stringify(rawStatus)}`,
  };
}
