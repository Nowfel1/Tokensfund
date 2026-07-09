import { CanonicalAsset, NormalizedQuote, QuoteRequest, SwapInstruction, SwapStatus } from "../types";

const BASE = process.env.NEAR_1CLICK_URL || "https://1click.chaindefuser.com";
const JWT = process.env.NEAR_1CLICK_JWT;

const FEE_BPS = process.env.NEAR_APP_FEE_BPS ? Number(process.env.NEAR_APP_FEE_BPS) : undefined;
const FEE_RECIPIENT = process.env.NEAR_FEE_RECIPIENT;

// How long the user has to send their deposit before the quote expires.
// This must be generous enough for slow chains (BTC confirmations, wallet
// fumbling). 5 minutes was far too short and strands late deposits in
// expired intents — 60 minutes is a sane floor.
const DEPOSIT_WINDOW_MS = 60 * 60 * 1000;

function headers() {
  const h: Record<string, string> = { "Content-Type": "application/json" };
  if (JWT) h["Authorization"] = `Bearer ${JWT}`;
  return h;
}

function toBase(humanAmount: string, decimals: number): string {
  const [whole, frac = ""] = humanAmount.split(".");
  const fracPadded = (frac + "0".repeat(decimals)).slice(0, decimals);
  return (BigInt(whole || "0") * 10n ** BigInt(decimals) + BigInt(fracPadded || "0")).toString();
}

function fromBase(base: string, decimals: number): number {
  return Number(base) / 10 ** decimals;
}

function dummyAddress(asset: CanonicalAsset): string {
  const chain = asset.chain.toLowerCase();
  if (chain === "bitcoin") return "bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq";
  if (chain === "solana") return "11111111111111111111111111111111";
  if (chain === "near") return "dummy.near";
  if (chain === "litecoin") return "LX2LMYXtuv5JcznS617SKUwpEBK2rUkdND";
  if (chain === "dogecoin") return "D7Y55Jr7bPaxSHpFZFDEoCJaQF6FwxMXbs";
  if (chain === "zcash") return "t1KzZ5n2TPEGYXTZ3WYGL1AYEumEQaRoHaL";
  if (chain === "ton") return "0:0000000000000000000000000000000000000000000000000000000000000000";
  if (chain === "xrp ledger") return "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn";
  return "0x0000000000000000000000000000000000000001";
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

  const recipient = req.destinationAddress || dummyAddress(to);
  const refundTo = req.refundAddress || dummyAddress(from);

  const body = {
    dry,
    swapType: "EXACT_INPUT",
    slippageTolerance: req.slippageBps ?? 100,
    originAsset: fromRef.asset,
    depositType: "ORIGIN_CHAIN",
    destinationAsset: toRef.asset,
    amount: toBase(req.amount, fromDecimals),
    recipient,
    recipientType: "DESTINATION_CHAIN",
    refundTo,
    refundType: "ORIGIN_CHAIN",
    deadline: new Date(Date.now() + DEPOSIT_WINDOW_MS).toISOString(),
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
  const data = await requestQuote(from, to, req, true);
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
  const data = await requestQuote(from, to, req, false);
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
  const addr = String(depositAddress).trim();

  let res: Response;
  try {
    res = await fetch(`${BASE}/v0/status?depositAddress=${encodeURIComponent(addr)}`, {
      headers: headers(),
    });
  } catch (e: any) {
    return { provider: "near_intents", state: "unknown", detail: e?.message ?? "network error" };
  }

  if (!res.ok) {
    return { provider: "near_intents", state: "unknown", detail: `status ${res.status}` };
  }

  const data = await res.json();

  // TEMPORARY DEBUG: log the raw status payload so we can see exactly what
  // 1Click reports for this deposit address. Remove once tracking is verified.
  console.log("NEAR_INTENTS status", addr, "→", JSON.stringify(data));

  // Status may live at the top level or (in some responses) nested — read both,
  // normalized to uppercase so casing can never break the mapping.
  const rawStatus = String(data.status ?? data.swapDetails?.status ?? "")
    .trim()
    .toUpperCase();

  const map: Record<string, SwapStatus["state"]> = {
    PENDING_DEPOSIT: "awaiting_deposit",
    KNOWN_DEPOSIT_TX: "deposit_detected",
    PROCESSING: "processing",
    SUCCESS: "success",
    REFUNDED: "refunded",
    INCOMPLETE_DEPOSIT: "failed",
    FAILED: "failed",
  };

  const mapped = map[rawStatus];

  return {
    provider: "near_intents",
    state: mapped ?? "unknown",
    // Surface the raw status so an unmapped value names itself in the UI hint
    // instead of silently showing the wrong state.
    detail: mapped ? rawStatus : `Unmapped 1Click status: "${rawStatus || "(empty)"}"`,
  };
}
