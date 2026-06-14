import { CanonicalAsset, NormalizedQuote, QuoteRequest, SwapInstruction, SwapStatus } from "../types";
import { createHmac, randomBytes } from "crypto";

const BASE = "https://cce.cash/api/v1";
const API_KEY = process.env.CCE_API_KEY ?? "";
const API_SECRET = process.env.CCE_API_SECRET ?? "";

function sign(nonce: string, timestamp: string, bodyString: string): string {
  const payload = API_KEY + nonce + timestamp + bodyString;
  return createHmac("sha256", API_SECRET).update(payload).digest("hex");
}

function authHeaders(body: object): Record<string, string> {
  const nonce = randomBytes(16).toString("hex"); // 32 chars
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

async function post(path: string, body: object): Promise<any> {
  const headers = authHeaders(body);
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (data.code !== 0) throw new Error(`CCE error: ${data.msg}`);
  return data.data;
}

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

  const data = await post("/openapi/order/calculate", body);
  const toData = data.to?.[0];
  if (!toData) throw new Error("CCE returned no quote data.");

  return {
    provider: "cce",
    providerLabel: "CCE.Cash",
    expectedOut: Number(toData.to_quantity),
    estimatedSeconds: 10 * 60, // ~10 min average
    raw: { ...data, fromRef, toRef, amount: req.amount },
  };
}

export async function buildSwap(
  _quote: NormalizedQuote,
  req: QuoteRequest,
  from: CanonicalAsset,
  to: CanonicalAsset
): Promise<SwapInstruction> {
  if (!req.destinationAddress) throw new Error("CCE needs a destination address.");

  const fromRef = from.providerIds.cce!;
  const toRef = to.providerIds.cce!;

  // Re-quote fresh to get a valid calc_id
  const calcBody = {
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

  const calcData = await post("/openapi/order/calculate", calcBody);

  const orderBody = {
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

  const orderData = await post("/openapi/order/place", orderBody);

  return {
    provider: "cce",
    depositAddress: orderData.address,
    depositAmount: req.amount,
    trackingId: orderData.order_no,
    notes: `CCE.Cash order ${orderData.order_no}. Query code: ${orderData.query_code}`,
  };
}

export async function getStatus(trackingId: string): Promise<SwapStatus> {
  try {
    const body = { order_no: trackingId };
    const data = await post("/openapi/order/query", body);
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
    };
  } catch (e: any) {
    return { provider: "cce", state: "unknown", detail: e.message };
  }
}
