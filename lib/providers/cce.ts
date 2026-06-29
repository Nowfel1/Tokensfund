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
  // Reproduce the swap/track once, read the logs, then remove this line.
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
  return {
    provider: "cce",
    depositAddress: data.address,
    depositAmount: req.amount,
    trackingId: data.order_no,
    notes: `CCE.Cash Order #${data.order_no}`,
  };
}

// ==================== STATUS ====================
// CCE's order lifecycle (from their UI):
//   Waiting for deposit -> Deposited -> In Exchange -> Exchange completed
export async function getStatus(trackingId: string): Promise<SwapStatus> {
  try {
    const data = await post<any>("/openapi/order/query", {
      order_no: trackingId,
    });

    // The status field may be `status`, `state`, or `order_status` depending on
    // the endpoint — read whichever is present, normalized.
    const rawStatus = String(
      data.status ?? data.state ?? data.order_status ?? ""
    )
      .toLowerCase()
      .trim();

    const stateMap: Record<string, SwapStatus["state"]> = {
      // --- awaiting deposit ---
      waiting: "awaiting_deposit",
      waiting_deposit: "awaiting_deposit",
      pending: "awaiting_deposit",
      new: "awaiting_deposit",

      // --- deposit detected ---
      deposited: "deposit_detected",
      confirming: "deposit_detected",
      confirmed: "deposit_detected",
      received: "deposit_detected",

      // --- processing / in exchange ---
      in_exchange: "processing",
      exchanging: "processing",
      exchange: "processing",
      processing: "processing",
      sending: "processing",

      // --- completed ---
      exchange_completed: "success",
      completed: "success",
      complete: "success",
      finished: "success",
      success: "success",
      done: "success",

      // --- terminal: failed / refunded ---
      failed: "failed",
      fail: "failed",
      error: "failed",
      expired: "failed",
      refunded: "refunded",
      refund: "refunded",
    };

    const mapped = stateMap[rawStatus];

    return {
      provider: "cce",
      state: mapped ?? "unknown",
      // If we couldn't map it, surface the raw value so the next unmapped
      // status names itself instead of silently showing the wrong state.
      detail: mapped
        ? rawStatus
        : `Unmapped CCE status: "${rawStatus || JSON.stringify(data)}"`,
    };
  } catch (error: any) {
    return {
      provider: "cce",
      state: "unknown",
      detail: error?.message ?? "Status lookup failed",
    };
  }
}
