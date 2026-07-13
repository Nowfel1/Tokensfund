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
  // IMPORTANT: Changee's /rate returns the TOTAL estimated output for the
  // requested amount (e.g. 1.85 ETH for 0.1 BTC), NOT a per-unit rate.
  // Multiplying by amount again double-applies it (the 10x-off bug).
  // Verify after any API change: quoting 0.1 then 0.2 BTC should double the
  // output while the displayed unit rate stays ~constant.
  const gross = data.rate;
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

  // TEMPORARY DEBUG: log the raw create response so the actual id field (if
  // any) names itself. Remove once the tracking id is confirmed.
  console.log("CHANGEE create →", res.status, JSON.stringify(data));

  if (!res.ok || data.result !== true || !data.depositAddress) {
    throw new Error("Changee could not create the exchange. " + (data.message ?? ""));
  }

  // Changee's create response may name its exchange id differently (or omit
  // it). Try the likely candidates; fall back to the deposit address so
  // trackingId is never undefined — with a note that Changee itself is the
  // place to track in that case (their status endpoint can't query by address).
  const exchangeId =
    data.id ?? data.exchangeId ?? data.exchange_id ?? data.orderId ?? data.order_id;

  return {
    provider: "changee",
    depositAddress: data.depositAddress,
    memo: data.depositTag || undefined,
    depositAmount: req.amount,
    trackingId: String(exchangeId ?? data.depositAddress),
    notes: exchangeId
      ? "Track your swap at changee.com with exchange ID " + exchangeId
      : "Changee did not return an exchange ID — track this swap on changee.com using your deposit details.",
  };
}

export async function getStatus(trackingId: string): Promise<SwapStatus> {
  // Users paste ids with stray "#"/whitespace — sanitize before querying.
  const id = String(trackingId).trim().replace(/^#+/, "");

  try {
    const params = new URLSearchParams({ key: API_KEY, id });
    const res = await fetch(`${BASE}/exchange-status?${params.toString()}`);
    const data = await res.json();

    // TEMPORARY DEBUG: log the raw response so failures name themselves.
    // Remove once tracking is confirmed working.
    console.log("CHANGEE status", id, "→", res.status, JSON.stringify(data));

    // Changee signals errors as { result: false, message: "..." } — the same
    // check getQuote/buildSwap already make. Without it, a failed lookup reads
    // data.status (undefined) and silently shows "unavailable" with no reason.
    if (!res.ok || data.result === false) {
      return {
        provider: "changee",
        state: "unknown",
        detail: data.message
          ? `Changee: ${data.message}`
          : `Changee lookup failed (HTTP ${res.status})`,
      };
    }

    const rawStatus = String(data.status ?? "").trim().toLowerCase();

    const map: Record<string, SwapStatus["state"]> = {
      // --- awaiting deposit ---
      new: "awaiting_deposit",
      waiting: "awaiting_deposit",
      waiting_deposit: "awaiting_deposit",
      // --- deposit detected ---
      deposit_received: "deposit_detected",
      confirming: "deposit_detected",
      confirmed: "deposit_detected",
      // --- processing ---
      exchanging: "processing",
      sending: "processing",
      verifying: "processing",
      payment_halted: "processing",
      // --- completed ---
      success: "success",
      finished: "success",
      // --- terminal: failed / refunded ---
      time_expired: "failed",
      expired: "failed",
      failed: "failed",
      sending_failed: "failed",
      reverted: "refunded",
      refunded: "refunded",
    };

    const mapped = map[rawStatus];

    return {
      provider: "changee",
      state: mapped ?? "unknown",
      // Surface unmapped statuses by name so the hint is never blank.
      detail: mapped ? rawStatus : `Unmapped Changee status: "${rawStatus || "(empty)"}"`,
      outboundTxHash: data.txId || undefined,
    };
  } catch (e: any) {
    return { provider: "changee", state: "unknown", detail: e?.message ?? "Status lookup failed" };
  }
}
