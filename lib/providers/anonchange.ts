import { createHash, createHmac, randomBytes } from "crypto";
import { CanonicalAsset, NormalizedQuote, QuoteRequest, SwapInstruction, SwapStatus } from "../types";

// AnonChange partner API — https://anonchange.com/docs
// Every call is a signed JSON POST. Keys come from your AnonChange partner
// dashboard and must only live in Vercel environment variables.
const ORIGIN = "https://anonchange.com";
const PREFIX = "/api/partner/v1";
// Trimmed, because a pasted value often carries a stray space or line break,
// which makes AnonChange reject the signature.
const API_KEY = (process.env.ANONCHANGE_API_KEY ?? "").trim();
const API_SECRET = (process.env.ANONCHANGE_API_SECRET ?? "").trim();

// TokensFund's markup on top of AnonChange's own fee, in percent. 0 while
// TokensFund charges no fee (see lib/fees.ts). Must stay within the cap shown
// in the AnonChange partner dashboard.
const MARKUP_RAW = Number((process.env.ANONCHANGE_MARKUP_PERCENT ?? "0").trim());
const MARKUP_PERCENT = Number.isFinite(MARKUP_RAW) && MARKUP_RAW > 0 ? MARKUP_RAW : 0;

// Floating rate, like the other exchanger routes. Fixed rates lock for only
// 10 minutes, which a Bitcoin deposit often outlasts.
const RATE_TYPE = "float";

function coin(asset: CanonicalAsset): string {
  const c = asset.providerIds.anonchange?.coin;
  if (!c) throw new Error(`AnonChange does not support ${asset.symbol}`);
  return c;
}

// AnonChange wants amounts as plain decimal strings. Trim to 8 decimals,
// which every coin it lists accepts.
function amountString(raw: string): string {
  const [whole, frac = ""] = String(raw).trim().split(".");
  const f = frac.slice(0, 8).replace(/0+$/, "");
  return f ? `${whole || "0"}.${f}` : whole || "0";
}

export interface SignedRequest {
  url: string;
  path: string;
  body: string;
  signedString: string;
  headers: Record<string, string>;
}

/** Builds one signed request exactly as it is sent. Exported so the locked
 *  diagnostics endpoint can show AnonChange support what we send. */
export function buildSignedRequest(
  endpoint: string,
  payload: Record<string, unknown>,
  extraHeaders: Record<string, string> = {},
  fixed?: { timestamp: string; nonce: string }
): SignedRequest {
  if (!API_KEY || !API_SECRET) {
    throw new Error("AnonChange is not configured (ANONCHANGE_API_KEY / ANONCHANGE_API_SECRET missing)");
  }
  const path = `${PREFIX}/${endpoint}`;
  // Serialize once and sign exactly these bytes.
  const body = JSON.stringify(payload);
  const timestamp = fixed?.timestamp ?? Math.floor(Date.now() / 1000).toString();
  const nonce = fixed?.nonce ?? randomBytes(16).toString("hex");
  const bodyHash = createHash("sha256").update(body, "utf8").digest("hex");
  // Six lines joined by \n, no trailing newline (confirmed by AnonChange
  // support, Nov 2026): timestamp, nonce, POST, path, Idempotency-Key value
  // (empty line when the header isn't sent), sha256(body).
  const idempotencyKey = extraHeaders["Idempotency-Key"] ?? "";
  const signedString = `${timestamp}\n${nonce}\nPOST\n${path}\n${idempotencyKey}\n${bodyHash}`;
  const sign = createHmac("sha256", API_SECRET).update(signedString, "utf8").digest("hex");
  return {
    url: ORIGIN + path,
    path,
    body,
    signedString,
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": API_KEY,
      "X-API-TIMESTAMP": timestamp,
      "X-API-NONCE": nonce,
      "X-API-SIGN": sign,
      ...extraHeaders,
    },
  };
}

/** SHA-256 of the secret in use — safe to share, lets support confirm which
 *  secret the server holds without revealing it. */
export function secretFingerprint(): string {
  return createHash("sha256").update(API_SECRET, "utf8").digest("hex");
}

async function call(
  endpoint: string,
  payload: Record<string, unknown>,
  extraHeaders: Record<string, string> = {}
): Promise<any> {
  const req = buildSignedRequest(endpoint, payload, extraHeaders);
  const res = await fetch(req.url, {
    method: "POST",
    cache: "no-store",
    headers: req.headers,
    body: req.body,
  });

  const text = await res.text();
  let data: any;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(`AnonChange ${endpoint}: HTTP ${res.status} ${text.slice(0, 80).replace(/\s+/g, " ")}`);
  }
  if (!res.ok) {
    let msg = `AnonChange: ${data?.error ?? `HTTP ${res.status}`}`;
    if (res.status === 401 || /api key|signature/i.test(String(data?.error))) {
      // Safe hints only: never the key or secret themselves.
      msg += ` [key starts with "${API_KEY.slice(0, 3)}", ${API_KEY.length} chars; secret ${API_SECRET.length} chars]`;
    }
    throw new Error(msg);
  }
  return data;
}

export async function getQuote(
  from: CanonicalAsset,
  to: CanonicalAsset,
  req: QuoteRequest
): Promise<NormalizedQuote> {
  const data = await call("price", {
    from: coin(from),
    to: coin(to),
    rateType: RATE_TYPE,
    amount: amountString(req.amount),
    markupPercent: MARKUP_PERCENT,
  });

  // AnonChange quotes amounts outside its limits, but deposits outside them
  // are refunded rather than swapped, so treat those as "no quote" here.
  const amt = Number(amountString(req.amount));
  const minDep = Number(data.minDeposit);
  const maxDep = Number(data.maxDeposit);
  if (minDep > 0 && amt < minDep) {
    throw new Error(`AnonChange minimum for this pair is ${data.minDeposit} ${coin(from)}.`);
  }
  if (maxDep > 0 && amt > maxDep) {
    throw new Error(`AnonChange maximum for this pair is ${data.maxDeposit} ${coin(from)} right now.`);
  }

  const out = Number(data.amountOut);
  if (!out) {
    const min = data.minDeposit ? ` Minimum deposit is ${data.minDeposit} ${coin(from)}.` : "";
    throw new Error(`AnonChange returned no quote for this amount.${min}`);
  }

  return {
    provider: "anonchange",
    providerLabel: "AnonChange",
    // amountOut is already after AnonChange's fee, your markup and the network fee.
    expectedOut: out,
    feeOut: data.networkFee ? Number(data.networkFee) : undefined,
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
  if (!req.destinationAddress) throw new Error("AnonChange needs a destination address.");

  const payload: Record<string, unknown> = {
    from: coin(from),
    to: coin(to),
    rateType: RATE_TYPE,
    amount: amountString(req.amount),
    markupPercent: MARKUP_PERCENT,
    payoutAddress: req.destinationAddress,
  };
  if (req.refundAddress) payload.refundAddress = req.refundAddress;

  // Idempotency-Key lets a timed-out create be retried safely without
  // opening a second order.
  const data = await call("create", payload, {
    "Idempotency-Key": "tf-" + randomBytes(12).toString("hex"),
  });

  if (!data.id || !data.depositAddress) {
    throw new Error("AnonChange did not return an order. " + (data.error ?? ""));
  }

  const expires = data.expiresAt ? Math.floor(Date.parse(data.expiresAt) / 1000) : undefined;

  return {
    provider: "anonchange",
    depositAddress: data.depositAddress,
    depositAmount: req.amount,
    expiresAt: Number.isFinite(expires) ? expires : undefined,
    trackingId: String(data.id),
    notes: data.url
      ? `If AnonChange ever needs your decision on this order (for example after a large price move), use its own page: ${data.url}`
      : undefined,
  };
}

export async function getStatus(trackingId: string): Promise<SwapStatus> {
  const id = String(trackingId).trim();
  try {
    const data = await call("status", { id });
    const s = String(data.status ?? "").toLowerCase();
    const note = data.note ? ` — ${data.note}` : "";

    const map: Record<string, { state: SwapStatus["state"]; detail: string }> = {
      awaiting_deposit: { state: "awaiting_deposit", detail: "Waiting for your deposit" },
      confirming: { state: "deposit_detected", detail: "Deposit received — confirming" },
      exchanging: { state: "processing", detail: "Exchanging" },
      sending: { state: "processing", detail: "Sending to your address" },
      completed: { state: "success", detail: "Completed" },
      // A late deposit is still exchanged, so keep watching an expired order.
      expired: { state: "awaiting_deposit", detail: "Order expired — a late deposit is still exchanged at the market rate" },
      review: { state: "processing", detail: "Under a manual check by AnonChange" + note },
      refund_required: {
        state: "processing",
        detail: "Action needed: the rate moved or the deposit can't be exchanged as it is. Use the AnonChange order link on this page to continue or refund" + note,
      },
      refunding: { state: "processing", detail: "Refund in progress" },
      refunded: { state: "refunded", detail: "Refunded to your refund address" },
      failed: { state: "failed", detail: "Needs a manual check by AnonChange support" + note },
    };

    const m = map[s];
    return {
      provider: "anonchange",
      state: m?.state ?? "unknown",
      detail: m?.detail ?? `Unrecognised AnonChange status: "${s || "(empty)"}"`,
      outboundTxHash: data.payout?.txid || data.refund?.txid || undefined,
    };
  } catch (e: any) {
    return { provider: "anonchange", state: "unknown", detail: e?.message ?? "Status lookup failed" };
  }
}
