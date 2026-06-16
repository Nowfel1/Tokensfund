import { CanonicalAsset, NormalizedQuote, QuoteRequest, SwapInstruction, SwapStatus } from "../types";

const API_KEY = process.env.CHANGENOW_API_KEY ?? "";
const BASE = "https://api.changenow.io/v2";

function ticker(asset: CanonicalAsset): string {
  return asset.providerIds.changenow?.ticker ?? asset.symbol.toLowerCase();
}

export async function getQuote(
  from: CanonicalAsset,
  to: CanonicalAsset,
  req: QuoteRequest
): Promise<NormalizedQuote> {
  const url = `${BASE}/exchange/estimated-amount?fromCurrency=${ticker(from)}&toCurrency=${ticker(to)}&fromAmount=${req.amount}&flow=standard&type=direct`;
  const res = await fetch(url, {
    headers: { "x-changenow-api-key": API_KEY },
  });
  const data = await res.json();
  if (!res.ok || data.error) throw new Error(`ChangeNOW quote failed: ${data.error ?? res.status}`);
  if (!data.toAmount || Number(data.toAmount) <= 0) throw new Error("ChangeNOW returned no amount");
  return {
    provider: "changenow",
    providerLabel: "ChangeNOW",
    expectedOut: Number(data.toAmount),
    estimatedSeconds: 5 * 60,
    raw: data,
  };
}

export async function buildSwap(
  _quote: NormalizedQuote,
  req: QuoteRequest,
  from: CanonicalAsset,
  to: CanonicalAsset
): Promise<SwapInstruction> {
  if (!req.destinationAddress) throw new Error("ChangeNOW needs a destination address.");
  const body = {
    fromCurrency: ticker(from),
    toCurrency: ticker(to),
    fromAmount: req.amount,
    address: req.destinationAddress,
    refundAddress: req.refundAddress || req.destinationAddress,
    flow: "standard",
    type: "direct",
  };
  const res = await fetch(`${BASE}/exchange`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-changenow-api-key": API_KEY,
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok || data.error) throw new Error(`ChangeNOW swap failed: ${data.error ?? res.status}`);
  return {
    provider: "changenow",
    depositAddress: data.payinAddress,
    depositAmount: String(data.fromAmount),
    memo: data.payinExtraId || undefined,
    trackingId: data.id,
    notes: "ChangeNOW swap. Track at changenow.io/track/" + data.id,
  };
}

export async function getStatus(trackingId: string): Promise<SwapStatus> {
  try {
    const res = await fetch(`${BASE}/exchange/by-id?id=${trackingId}`, {
      headers: { "x-changenow-api-key": API_KEY },
    });
    const data = await res.json();
    const map: Record<string, SwapStatus["state"]> = {
      waiting: "awaiting_deposit",
      confirming: "deposit_detected",
      exchanging: "processing",
      sending: "processing",
      finished: "success",
      failed: "failed",
      refunded: "refunded",
      verifying: "processing",
    };
    return {
      provider: "changenow",
      state: map[data.status] ?? "unknown",
      detail: data.status,
    };
  } catch (e: any) {
    return { provider: "changenow", state: "unknown", detail: e.message };
  }
}
