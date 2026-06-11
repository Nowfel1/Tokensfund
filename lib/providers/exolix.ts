import { CanonicalAsset, NormalizedQuote, QuoteRequest, SwapInstruction, SwapStatus } from "../types";

// Exolix integration — supports XMR and 500+ other pairs.
// Docs: https://exolix.com/developers
// Get your API key at exolix.com and set EXOLIX_API_KEY in your .env

const BASE = "https://exolix.com/api/v2";
const API_KEY = process.env.EXOLIX_API_KEY ?? "";

const headers: Record<string, string> = {
  "Content-Type": "application/json",
  ...(API_KEY ? { Authorization: API_KEY } : {}),
};

export async function getQuote(
  from: CanonicalAsset,
  to: CanonicalAsset,
  req: QuoteRequest
): Promise<NormalizedQuote> {
  const fromRef = from.providerIds.exolix!;
  const toRef = to.providerIds.exolix!;

  const params = new URLSearchParams({
    coinFrom: fromRef.coin!,
    coinTo: toRef.coin!,
    amount: req.amount,
    rateType: "float",
    affiliateId: process.env.EXOLIX_AFFILIATE_ID ?? "",
  });

  if (fromRef.network) params.set("networkFrom", fromRef.network);
  if (toRef.network) params.set("networkTo", toRef.network);

  const res = await fetch(`${BASE}/rate?${params.toString()}`, { headers });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Exolix quote failed (${res.status}): ${body.slice(0, 200)}`);
  }

  const data = await res.json();

  if (data.message) throw new Error(`Exolix: ${data.message}`);
  if (!data.toAmount || Number(data.toAmount) <= 0)
    throw new Error("Exolix quote returned no toAmount");

  return {
    provider: "exolix",
    providerLabel: "Exolix",
    expectedOut: Number(data.toAmount),
    feeOut: undefined,
    estimatedSeconds: 20 * 60, // ~20 min average
    raw: data,
  };
}

export async function buildSwap(
  quote: NormalizedQuote,
  req: QuoteRequest
): Promise<SwapInstruction> {
  const from = quote.raw as any;

  const body = {
    coinFrom: from.coinFrom,
    networkFrom: from.networkFrom ?? undefined,
    coinTo: from.coinTo,
    networkTo: from.networkTo ?? undefined,
    amount: req.amount,
    withdrawalAddress: req.destinationAddress,
    withdrawalExtraId: "",
    refundAddress: req.refundAddress ?? "",
    refundExtraId: "",
    rateType: "float",
    affiliateId: process.env.EXOLIX_AFFILIATE_ID ?? "",
  };

  const res = await fetch(`${BASE}/transactions`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Exolix swap failed (${res.status}): ${err.slice(0, 200)}`);
  }

  const data = await res.json();

  if (data.message) throw new Error(`Exolix: ${data.message}`);

  return {
    provider: "exolix",
    depositAddress: data.depositAddress,
    depositAmount: String(data.amount),
    memo: data.depositExtraId || undefined,
    trackingId: data.id,
    notes: undefined,
  };
}

export async function getStatus(trackingId: string): Promise<SwapStatus> {
  try {
    const res = await fetch(`${BASE}/transactions/${trackingId}`, { headers });
    if (!res.ok) return { provider: "exolix", state: "unknown" };

    const data = await res.json();

    const stateMap: Record<string, SwapStatus["state"]> = {
      wait: "pending",
      confirmation: "pending",
      exchanging: "pending",
      sending: "pending",
      success: "completed",
      overdue: "failed",
      refunded: "refunded",
    };

    return {
      provider: "exolix",
      state: stateMap[data.status] ?? "unknown",
      detail: data.status,
    };
  } catch {
    return { provider: "exolix", state: "unknown" };
  }
}
