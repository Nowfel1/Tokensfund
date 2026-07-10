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
