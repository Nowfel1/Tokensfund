import { CanonicalAsset, NormalizedQuote, QuoteRequest, SwapInstruction, SwapStatus } from "../types";

const API_KEY = process.env.CHANGENOW_API_KEY ?? "";
const BASE = "https://api.changenow.io/v2";

/**
 * Normalizes asset tickers into the lowercase format required by ChangeNOW.
 */
function getTicker(asset: CanonicalAsset): string {
  return (asset.providerIds.changenow?.ticker ?? asset.symbol).toLowerCase();
}

/**
 * Safely extracts and normalizes network parameters into strict lowercase.
 */
function getNetwork(asset: CanonicalAsset): string | undefined {
  return asset.providerIds.changenow?.network?.toLowerCase();
}

/**
 * Formats multi-chain or non-native tokens properly for v2 estimation paths.
 * Returns 'hype-hyperevm' for HYPE, but just 'tao', 'btc', or 'eth' for native layers.
 */
function getMarketAssetString(asset: CanonicalAsset): string {
  const ticker = getTicker(asset);
  const network = getNetwork(asset);
  
  if (network && network !== ticker) {
    return `${ticker}-${network}`;
  }
  return ticker;
}

export async function getQuote(
  from: CanonicalAsset,
  to: CanonicalAsset,
  req: QuoteRequest
): Promise<NormalizedQuote> {
  const params = new URLSearchParams({
    fromCurrency: getMarketAssetString(from),
    toCurrency: getMarketAssetString(to),
    fromAmount: req.amount,
    flow: "standard",
    type: "direct",
  });

  const fromNetwork = getNetwork(from);
  const toNetwork = getNetwork(to);
  const fromTicker = getTicker(from);
  const toTicker = getTicker(to);

  // Only append standalone network params if the asset is a sub-token/wrapped variant.
  // Appending fromNetwork/toNetwork for native layer-1 assets (e.g. btc, eth, tao) causes pair_is_inactive.
  if (fromNetwork && fromNetwork !== fromTicker) {
    params.set("fromNetwork", fromNetwork);
  }
  if (toNetwork && toNetwork !== toTicker) {
    params.set("toNetwork", toNetwork);
  }

  const res = await fetch(`${BASE}/exchange/estimated-amount?${params.toString()}`, {
    headers: { "x-changenow-api-key": API_KEY },
  });
  
  const data = await res.json();
  if (!res.ok || data.error) {
    throw new Error("ChangeNOW quote failed: " + (data.error ?? res.status));
  }

  // Fallback selector supporting flexible variations in v2 estimate key fields
  const estimatedOut = data.estimatedAmount ?? data.toAmount;
  if (!estimatedOut || Number(estimatedOut) <= 0) {
    throw new Error("ChangeNOW debug: " + JSON.stringify(data).slice(0, 300));
  }

  return {
    provider: "changenow",
    providerLabel: "ChangeNOW",
    expectedOut: Number(estimatedOut),
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

  const fromNetwork = getNetwork(from);
  const toNetwork = getNetwork(to);

  // POST /exchange routes expect standalone fromCurrency and fromNetwork properties
  const body: Record<string, string> = {
    fromCurrency: getTicker(from),
    toCurrency: getTicker(to),
    fromAmount: req.amount,
    address: req.destinationAddress,
    refundAddress: req.refundAddress || req.destinationAddress,
    flow: "standard",
    type: "direct",
  };
  if (fromNetwork) body.fromNetwork = fromNetwork;
  if (toNetwork) body.toNetwork = toNetwork;

  const res = await fetch(`${BASE}/exchange`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-changenow-api-key": API_KEY,
    },
    body: JSON.stringify(body),
  });
  
  const data = await res.json();
  if (!res.ok || data.error) {
    throw new Error("ChangeNOW swap failed: " + (data.error ?? res.status));
  }
  
  return {
    provider: "changenow",
    depositAddress: data.payinAddress,
    depositAmount: String(data.fromAmount),
    memo: data.payinExtraId || undefined,
    trackingId: data.id,
    notes: "Track your swap at changenow.io/track/" + data.id,
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
