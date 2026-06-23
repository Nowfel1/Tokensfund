import { CanonicalAsset, NormalizedQuote, QuoteRequest, SwapInstruction, SwapStatus } from "../types";

const API_KEY = process.env.CHANGEE_API_KEY ?? "";
const BASE = "https://changee.com/v1/api";

// Changee identifies coins by a simple ticker (e.g. BTC, ETH, XMR).
function ticker(asset: CanonicalAsset): string {
  return asset.providerIds.changee?.ticker ?? asset.symbol;
}

export async function getQuote(
  from: CanonicalAsset,
  to: CanonicalAsset,
  req: QuoteRequest
): Promise<NormalizedQuote> {
  const params = new URLSearchParams({
    key: API_KEY,
    from: ticker(from),
    to: ticker(to),
    amount: req.amount,
    fix: "0",
  });

  const res = await fetch(`${BASE}/rate?${params.toString()}`);
  const data = await res.json();

  if (!res.ok || data.result !== true || typeof data.rate !== "number") {
    throw new Error("Changee quote unavailable for this pair");
  }

  // rate is the exchange rate excluding withdrawal fee. Output = rate * amount.
  const gross = data.rate * Number(req.amount);

  // withdrawalFee comes as a string like "0.00119 ETH" - parse the leading number if present.
  let feeOut: number | undefined;
  if (typeof data.withdrawalFee === "string") {
    const parsed = parseFloat(data.withdrawalFee);
    if (isFinite(parsed)) feeOut = parsed;
  }

  const expectedOut = feeOut ? Math.max(gross - feeOut, 0) : gross;

  return {
    provider: "changee",
    providerLabel: "Changee",
    expectedOut,
    feeOut,
    estimatedSeconds: 10 * 60,
    raw: data,
  };
}

export async function buildSwap(
  _quote: NormalizedQuote,
  req: QuoteRequest,
  from: CanonicalAsset,
  to: CanonicalAsset
): Promise<SwapInstruction> {
  if (!req.destinationAddress) throw new Error("Changee needs a destination address.");

  const params = new URLSearchParams({
    key: API_KEY,
    from: ticker(from),
    to: ticker(to),
    amount: req.amount,
    fix: "0",
    destinationAddress: req.destinationAddress,
  });
  if (req.refundAddress) params.set("refundAddress", req.refundAddress);

  const res = await fetch(`${BASE}/exchange-create?${params.toString()}`);
  const data = await res.json();

  if (!res.ok || data.result !== true || !data.depositAddress) {
    throw new Error("Changee could not create the exchange. " + (data.message ?? ""));
  }

  return {
    provider: "changee",
    depositAddress: data.depositAddress,
    memo: data.depositTag || undefined,
    depositAmount: req.amount,
    trackingId: data.id,
    notes: "Track your swap at changee.com",
  };
}

export async function getStatus(trackingId: string): Promise<SwapStatus> {
  try {
    const params = new URLSearchParams({ key: API_KEY, id: trackingId });
    const res = await fetch(`${BASE}/exchange-status?${params.toString()}`);
    const data = await res.json();

    const map: Record<string, SwapStatus["state"]> = {
      waiting_deposit: "awaiting_deposit",
      deposit_received: "deposit_detected",
      exchanging: "processing",
      sending: "processing",
      success: "success",
      time_expired: "failed",
      failed: "failed",
      sending_failed: "failed",
      reverted: "refunded",
      payment_halted: "processing",
    };

    return {
      provider: "changee",
      state: map[data.status] ?? "unknown",
      detail: data.status,
      outboundTxHash: data.txId || undefined,
    };
  } catch (e: any) {
    return { provider: "changee", state: "unknown", detail: e.message };
  }
}
