import { CanonicalAsset, NormalizedQuote, QuoteRequest, SwapInstruction, SwapStatus } from "../types";

// Wagyu public API — https://docs.wagyu.xyz
// Liquidity comes from Hyperliquid's orderbook (XMR) and a bridge aggregator
// (cross-chain legs). Must be called from the server: Wagyu only allows
// browser requests from wagyu.xyz itself.
const BASE = "https://api-beta.wagyu.xyz";
const INTEGRATOR_KEY = process.env.WAGYU_INTEGRATOR_KEY ?? "";

// Your fee on each Wagyu order, in percent (max 5). Same 1% as other routes.
const FEE_PERCENT = Number(process.env.WAGYU_FEE_PERCENT ?? "1");

// Wagyu refuses requests without a sensible User-Agent.
const USER_AGENT = "TokensFund/1.0 (+https://tokensfund.xyz)";

// Sources where Wagyu needs a refund address at creation (native-coin
// sources such as XMR). ZEC is included to be safe: a refund address is
// always the right thing to have for a privacy coin.
const REFUND_REQUIRED_CHAINS = new Set([0, 133]);

type Ref = { chainId: number; token: string; decimals: number };

function ref(asset: CanonicalAsset): Ref {
  const r = asset.providerIds.wagyu;
  if (!r || r.chainId === undefined || !r.token) {
    throw new Error(`Wagyu does not support ${asset.symbol}`);
  }
  return { chainId: r.chainId, token: r.token, decimals: r.decimals ?? asset.decimals };
}

function headers(): Record<string, string> {
  const h: Record<string, string> = {
    "content-type": "application/json",
    "user-agent": USER_AGENT,
  };
  if (INTEGRATOR_KEY) h["X-Integrator-Key"] = INTEGRATOR_KEY;
  return h;
}

// Human amount ("0.05") -> atomic integer string, exactly, using BigInt.
function toAtomic(human: string, decimals: number): string {
  const [whole, frac = ""] = String(human).trim().split(".");
  const f = (frac + "0".repeat(decimals)).slice(0, decimals);
  const v = BigInt(whole || "0") * 10n ** BigInt(decimals) + BigInt(f || "0");
  return v.toString();
}

// Atomic integer string -> exact human string (no floating-point rounding).
function fromAtomic(atomic: string, decimals: number): string {
  const s = String(atomic).replace(/^0+(?=\d)/, "");
  if (decimals === 0) return s;
  const padded = s.padStart(decimals + 1, "0");
  const whole = padded.slice(0, -decimals);
  const frac = padded.slice(-decimals).replace(/0+$/, "");
  return frac ? `${whole}.${frac}` : whole;
}

async function readJson(res: Response, label: string): Promise<any> {
  const text = await res.text();
  let data: any;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(`Wagyu ${label}: HTTP ${res.status} ${text.slice(0, 80).replace(/\s+/g, " ")}`);
  }
  if (!res.ok) {
    const min = data?.minAmountUsd ? ` (minimum about $${data.minAmountUsd})` : "";
    throw new Error(`Wagyu: ${data?.error ?? `HTTP ${res.status}`}${min}`);
  }
  return data;
}

function swapBody(from: CanonicalAsset, to: CanonicalAsset, req: QuoteRequest) {
  const f = ref(from);
  const t = ref(to);
  const body: Record<string, unknown> = {
    fromChainId: f.chainId,
    toChainId: t.chainId,
    fromToken: f.token,
    toToken: t.token,
    fromAmount: toAtomic(req.amount, f.decimals),
  };
  if (req.destinationAddress) body.toAddress = req.destinationAddress;
  if (INTEGRATOR_KEY && FEE_PERCENT > 0) body.integratorFeePercent = FEE_PERCENT;
  return { body, f, t };
}

export async function getQuote(
  from: CanonicalAsset,
  to: CanonicalAsset,
  req: QuoteRequest
): Promise<NormalizedQuote> {
  if (!INTEGRATOR_KEY) {
    throw new Error("Wagyu is not configured (WAGYU_INTEGRATOR_KEY missing)");
  }
  const { body, t } = swapBody(from, to, req);
  const res = await fetch(`${BASE}/v2/swaps/quote`, {
    method: "POST",
    cache: "no-store",
    headers: headers(),
    body: JSON.stringify(body),
  });
  const data = await readJson(res, "quote");

  // Under the minimum, Wagyu answers 200 with toAmount "0" rather than an error.
  if (!data.toAmount || data.toAmount === "0") {
    const min = data.minDepositUsd ? ` Minimum is about $${data.minDepositUsd}.` : "";
    throw new Error(`Wagyu: amount below the minimum for this route.${min}`);
  }

  return {
    provider: "wagyu",
    providerLabel: "Wagyu",
    // toAmount is what the user receives, after Wagyu's fee and yours.
    expectedOut: Number(fromAtomic(data.toAmount, t.decimals)),
    estimatedSeconds: 20 * 60,
    raw: data,
  };
}

export async function buildSwap(
  _quote: NormalizedQuote,
  req: QuoteRequest,
  from: CanonicalAsset,
  to: CanonicalAsset
): Promise<SwapInstruction> {
  if (!INTEGRATOR_KEY) throw new Error("Wagyu is not configured.");
  if (!req.destinationAddress) throw new Error("Wagyu needs a destination address.");

  const { body, f } = swapBody(from, to, req);
  if (REFUND_REQUIRED_CHAINS.has(f.chainId) && !req.refundAddress) {
    throw new Error(`Wagyu needs a refund address for ${from.symbol} deposits.`);
  }
  if (req.refundAddress) body.refundAddress = req.refundAddress;

  // IMPORTANT: no automatic retries. This call has no idempotency key, so a
  // retry after a timeout could create a second real order.
  const res = await fetch(`${BASE}/v2/swaps`, {
    method: "POST",
    cache: "no-store",
    headers: headers(),
    body: JSON.stringify(body),
  });
  const data = await readJson(res, "create");

  if (!data.orderId || !data.sessionId || !data.depositAddress) {
    throw new Error("Wagyu did not return a complete order.");
  }

  // The deposit amount is exact: show it precisely, converted from atomic units.
  const depDecimals = Number(data.depositTokenDecimals ?? f.decimals);
  const depositAmount = data.depositAmount ? fromAtomic(String(data.depositAmount), depDecimals) : req.amount;

  let expiresAt: number | undefined;
  if (typeof data.expiresAt === "number") {
    expiresAt = data.expiresAt > 1e12 ? Math.floor(data.expiresAt / 1000) : data.expiresAt;
  } else if (typeof data.expiresAt === "string") {
    const t = Date.parse(data.expiresAt);
    if (Number.isFinite(t)) expiresAt = Math.floor(t / 1000);
  }

  return {
    provider: "wagyu",
    depositAddress: data.depositAddress,
    depositAmount,
    expiresAt,
    // orderId is public and grants no access. The sessionId is the owner
    // credential: it is stored on our server only and never sent to browsers.
    trackingId: String(data.orderId),
    privateTrackingId: `${data.orderId}~${data.sessionId}`,
    notes:
      "Send the exact amount shown. Wagyu screens deposits before swapping; a deposit that fails screening is refunded to your refund address.",
  };
}

export async function getStatus(trackingId: string): Promise<SwapStatus> {
  const [orderId, sessionId] = String(trackingId).split("~");
  if (!orderId || !sessionId) {
    return { provider: "wagyu", state: "unknown", detail: "Live status for this Wagyu order is only available from its order page." };
  }
  try {
    const res = await fetch(`${BASE}/v2/swaps/${encodeURIComponent(orderId)}`, {
      cache: "no-store",
      headers: { "user-agent": USER_AGENT, "x-session-id": sessionId },
    });
    const data = await readJson(res, "status");

    const status = String(data.status ?? "").toLowerCase();
    const cs = data.customerState;
    const csText =
      typeof cs === "string" ? cs : cs?.message ?? cs?.title ?? cs?.label ?? cs?.state ?? "";
    const detail = csText ? String(csText) : status || "unknown";

    let state: SwapStatus["state"];
    if (status === "completed") state = "success";
    else if (status === "refunded") state = "refunded";
    else if (status === "failed") state = "failed";
    else if (status === "expired") state = "failed";
    else if (/refund/.test(status)) state = "processing";
    else if (/confirm/.test(status)) state = "deposit_detected";
    else if (/(await|wait|pending|created|open)/.test(status) && /deposit|created|open|pending|await|wait/.test(status)) state = "awaiting_deposit";
    else if (/(trad|swap|rout|bridg|send|process|execut|fill)/.test(status)) state = "processing";
    else state = "unknown";

    return {
      provider: "wagyu",
      state,
      detail: status === "expired" ? "Expired — no deposit arrived before the deadline" : detail,
      outboundTxHash: data.payoutTxHash || data.outTxHash || undefined,
    };
  } catch (e: any) {
    return { provider: "wagyu", state: "unknown", detail: e?.message ?? "Status lookup failed" };
  }
}
