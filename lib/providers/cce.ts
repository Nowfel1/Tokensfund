import { CanonicalAsset, NormalizedQuote, QuoteRequest, SwapInstruction, SwapStatus } from "../types";
import { createHmac, randomBytes } from "crypto";

const BASE = "https://cce.cash/api/v1";
const API_KEY = process.env.CCE_API_KEY ?? "";
const API_SECRET = process.env.CCE_API_SECRET ?? "";

// ==================== AUTH HELPERS ====================
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
    estimatedSeconds: 600, // ~10 minutes average
    // Add these only if your NormalizedQuote interface supports them:
    // minOut: data.min_amount ? Number(data.min_amount) : undefined,
    // maxOut: data.max_amount ? Number(data.max_amount) : undefined,
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
    extra: {
      queryCode: data.query_code,
    },
  };
}

// ==================== STATUS ====================
export async function getStatus(trackingId: string): Promise<SwapStatus> {
  try {
    const data = await post<any>("/openapi/order/query", {
      order_no: trackingId,
    });

    const stateMap: Record<string, SwapStatus["state"]> = {
      pending: "awaiting_deposit",
      processing: "processing",
      completed: "success",
      failed: "failed",
      refunded: "refunded",
    };

    return {
      provider: "cce",
      state: stateMap[data.status] ?? "unknown",
      detail: data.status,
      txHash: data.tx_hash || undefined,
    };
  } catch (error: any) {
    return {
      provider: "cce",
      state: "unknown",
      detail: error.message,
    };
  }
}
