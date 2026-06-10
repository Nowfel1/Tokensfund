import { CanonicalAsset, NormalizedQuote, QuoteRequest, SwapInstruction, SwapStatus } from "../types";

// NEAR Intents integration via the 1Click REST API.
// Docs: https://docs.near-intents.org/integration/distribution-channels/1click-api/quickstart
// No testnet exists — test with tiny real amounts.
// Set NEAR_1CLICK_JWT to skip the 0.2% no-key fee (register at partners.near-intents.org).

const BASE = process.env.NEAR_1CLICK_URL || "https://1click.chaindefuser.com";
const JWT = process.env.NEAR_1CLICK_JWT;

// Platform fee. NOTE: 1Click splits appFees 50/50 with the protocol by default,
// so this `fee` is the TOTAL charged to the user. To net 2% yourself, set 400.
const FEE_BPS = process.env.NEAR_APP_FEE_BPS ? Number(process.env.NEAR_APP_FEE_BPS) : undefined;
const FEE_RECIPIENT = process.env.NEAR_FEE_RECIPIENT; // a NEAR-supported address you control

function headers() {
  const h: Record<string, string> = { "Content-Type": "application/json" };
  if (JWT) h["Authorization"] = `Bearer ${JWT}`;
  return h;
}

function toBase(humanAmount: string, decimals: number): string {
  // Avoid float drift for high-decimal assets (NEAR = 24).
  const [whole, frac = ""] = humanAmount.split(".");
  const fracPadded = (frac + "0".repeat(decimals)).slice(0, decimals);
  return (BigInt(whole || "0") * 10n ** BigInt(decimals) + BigInt(fracPadded || "0")).toString();
}
function fromBase(base: string, decimals: number): number {
  return Number(base) / 10 ** decimals;
}

async function requestQuote(
  from: CanonicalAsset,
  to: CanonicalAsset,
  req: QuoteRequest,
  dry: boolean
) {
  const fromRef = from.providerIds.near_intents!;
  const toRef = to.providerIds.near_intents!;
  const fromDecimals = fromRef.decimals ?? from.decimals;

  const body = {
    dry,
    swapType: "EXACT_INPUT",
    slippageTolerance: req.slippageBps ?? 100,
    originAsset: fromRef.asset,
    depositType: "ORIGIN_CHAIN",
    destinationAsset: toRef.asset,
    amount: toBase(req.amount, fromDecimals),
    recipient: req.destinationAddress || "",
    recipientType: "DESTINATION_CHAIN",
    refundTo: req.refundAddress || req.destinationAddress || "",
    refundType: req.refundAddress ? "ORIGIN_CHAIN" : "DESTINATION_CHAIN",
    deadline: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
    ...(FEE_BPS && FEE_RECIPIENT
      ? { appFees: [{ recipient: FEE_RECIPIENT, fee: FEE_BPS }] }
      : {}),
  };

  const res = await fetch(`${BASE}/v0/quote`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`NEAR 1Click quote failed (${res.status}): ${txt.slice(0, 200)}`);
  }
  return res.json();
}

export async function getQuote(
  from: CanonicalAsset,
  to: CanonicalAsset,
  req: QuoteRequest
): Promise<NormalizedQuote> {
  const data = await requestQuote(from, to, req, /* dry */ true);
  const q = data.quote ?? data;
  const toDecimals = to.providerIds.near_intents!.decimals ?? to.decimals;

  const expectedOut = q.amountOut ? fromBase(String(q.amountOut), toDecimals) : 0;
  const minOut = q.minAmountOut ? fromBase(String(q.minAmountOut), toDecimals) : undefined;

  return {
    provider: "near_intents",
    providerLabel: "NEAR Intents",
    expectedOut,
    minOut,
    estimatedSeconds: q.timeEstimate ?? q.estimatedTime ?? undefined,
    raw: data,
  };
}

export async function buildSwap(
  _quote: NormalizedQuote,
  from: CanonicalAsset,
  to: CanonicalAsset,
  req: QuoteRequest
): Promise<SwapInstruction> {
  // Re-request with dry:false to obtain an executable deposit address.
  const data = await requestQuote(from, to, req, /* dry */ false);
  const q = data.quote ?? data;
  const depositAddress = q.depositAddress ?? data.depositAddress;
  if (!depositAddress) {
    throw new Error("NEAR 1Click did not return a depositAddress.");
  }
  return {
    provider: "near_intents",
    depositAddress,
    depositAmount: req.amount,
    expiresAt: q.deadline ? Math.floor(new Date(q.deadline).getTime() / 1000) : undefined,
    trackingId: depositAddress,
    notes: "After the user sends funds, optionally POST /v0/deposit/submit with the txHash to speed up processing.",
  };
}

export async function getStatus(depositAddress: string): Promise<SwapStatus> {
  const res = await fetch(`${BASE}/v0/status?depositAddress=${encodeURIComponent(depositAddress)}`, {
    headers: headers(),
  });
  if (!res.ok) return { provider: "near_intents", state: "unknown", detail: `status ${res.status}` };
  const data = await res.json();
  const map: Record<string, SwapStatus["state"]> = {
    PENDING_DEPOSIT: "awaiting_deposit",
    KNOWN_DEPOSIT_TX: "deposit_detected",
    PROCESSING: "processing",
    SUCCESS: "success",
    REFUNDED: "refunded",
    INCOMPLETE_DEPOSIT: "failed",
    FAILED: "failed",
  };
  return {
    provider: "near_intents",
    state: map[data.status] ?? "unknown",
    detail: data.status,
  };
}
