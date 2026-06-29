import { CanonicalAsset, NormalizedQuote, QuoteRequest, SwapInstruction, SwapStatus } from "../types";

// THORChain integration via the public THORNode REST API.
// Docs: https://dev.thorchain.org/swap-guide/quickstart-guide.html
// Everything on THORChain is quoted in 1e8 base units regardless of the asset's
// real decimals, so we scale to/from 1e8 here.
const THORNODE = process.env.THORNODE_URL || "https://gateway.liquify.com/chain/thorchain_api";

// Optional: earn revenue by setting an affiliate THORName + bps in env.
const AFFILIATE = process.env.THOR_AFFILIATE; // e.g. "TKF"
const AFFILIATE_BPS = process.env.THOR_AFFILIATE_BPS; // e.g. "200" (2%)

function toThorBase(humanAmount: string): string {
  const [whole, frac = ""] = humanAmount.split(".");
  const fracPadded = (frac + "0".repeat(8)).slice(0, 8);
  return (BigInt(whole || "0") * 100_000_000n + BigInt(fracPadded || "0")).toString();
}

function fromThorBase(base: string | number): number {
  return Number(base) / 100_000_000;
}

export async function getQuote(
  from: CanonicalAsset,
  to: CanonicalAsset,
  req: QuoteRequest
): Promise<NormalizedQuote> {
  const fromRef = from.providerIds.thorchain!;
  const toRef = to.providerIds.thorchain!;
  const params = new URLSearchParams({
    from_asset: fromRef.asset!,
    to_asset: toRef.asset!,
    amount: toThorBase(req.amount),
  });
  if (req.destinationAddress) params.set("destination", req.destinationAddress);
  if (req.slippageBps) params.set("tolerance_bps", String(req.slippageBps));
  if (AFFILIATE && AFFILIATE_BPS) {
    params.set("affiliate", AFFILIATE);
    params.set("affiliate_bps", AFFILIATE_BPS);
  }
  const url = `${THORNODE}/thorchain/quote/swap?${params.toString()}`;
  const res = await fetch(url, { headers: { accept: "application/json" } });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`THORChain quote failed (${res.status}): ${body.slice(0, 200)}`);
  }
  const data = await res.json();
  if (data.error) throw new Error(`THORChain: ${data.error}`);
  const expectedOut = fromThorBase(data.expected_amount_out ?? data.expected_amount_out_streaming ?? 0);
  if (!expectedOut) throw new Error("THORChain quote returned no expected_amount_out");
  const feeOut = data.fees?.total ? fromThorBase(data.fees.total) : undefined;
  return {
    provider: "thorchain",
    providerLabel: "THORChain",
    expectedOut,
    feeOut,
    estimatedSeconds:
      (data.total_swap_seconds as number) ||
      (data.inbound_confirmation_seconds ?? 0) + (data.outbound_delay_seconds ?? 0) ||
      undefined,
    raw: data,
  };
}

export async function buildSwap(
  quote: NormalizedQuote,
  req: QuoteRequest
): Promise<SwapInstruction> {
  const data = quote.raw as any;
  if (!data.inbound_address) {
    throw new Error("THORChain quote did not include an inbound_address. Re-quote with a destination address.");
  }
  // NOTE: THORChain has no order id. A swap is tracked by the user's INBOUND
  // DEPOSIT TX HASH, which doesn't exist until they broadcast the deposit. The
  // `trackingId` below is the vault (inbound) address purely as a placeholder —
  // it CANNOT be used to query status. Live tracking requires the user's deposit
  // tx hash (entered on /track, or captured from the wallet send if you add that).
  return {
    provider: "thorchain",
    depositAddress: data.inbound_address,
    memo: data.memo,
    depositAmount: req.amount,
    expiresAt: data.expiry,
    trackingId: data.inbound_address,
    notes: data.router
      ? `EVM router contract: ${data.router}. Send via the router's depositWithExpiry for ERC20s.`
      : undefined,
  };
}

// THORChain tracks a swap by the user's INBOUND DEPOSIT TX HASH — the hash of
// the transaction they broadcast when sending the deposit. Pass that hash here
// (not the vault address, and not an order id — THORChain has neither).
export async function getStatus(trackingId: string): Promise<SwapStatus> {
  // Normalize: strip "0x"/whitespace. THORNode stores observed hashes upper-cased.
  const hash = String(trackingId).trim().replace(/^0x/i, "").toUpperCase();

  if (!hash || hash.length < 32) {
    return {
      provider: "thorchain",
      state: "unknown",
      detail: "Enter your deposit transaction hash to track a THORChain swap.",
    };
  }

  let res: Response;
  try {
    res = await fetch(`${THORNODE}/thorchain/tx/status/${hash}`, {
      headers: { accept: "application/json" },
    });
  } catch (e: any) {
    return { provider: "thorchain", state: "unknown", detail: e?.message ?? "Network error" };
  }

  if (!res.ok) {
    // 404 / not-found usually means THORChain hasn't observed the deposit yet
    // (still in mempool or awaiting confirmations) — or the hash is wrong.
    return {
      provider: "thorchain",
      state: "awaiting_deposit",
      detail: "Deposit not yet observed by THORChain (awaiting confirmations).",
    };
  }

  const data: any = await res.json();
  const stages = data.stages ?? {};

  const outTxs: any[] = Array.isArray(data.out_txs) ? data.out_txs : [];
  const firstOut = outTxs[0];
  const isRefund =
    typeof firstOut?.memo === "string" && /^REFUND/i.test(firstOut.memo);

  const outboundSigned = stages.outbound_signed?.completed === true;
  const swapFinalised = stages.swap_finalised?.completed === true;
  const inboundFinalised = stages.inbound_finalised?.completed === true;
  const inboundObserved =
    stages.inbound_observed?.completed === true ||
    stages.inbound_observed?.started === true;

  let state: SwapStatus["state"];
  let detail: string;

  if (outboundSigned || outTxs.length > 0) {
    state = isRefund ? "refunded" : "success";
    detail = isRefund ? "Refunded to your address" : "Outbound sent";
  } else if (swapFinalised) {
    state = "processing";
    detail = "Swap complete — sending outbound";
  } else if (inboundFinalised) {
    state = "processing";
    detail = "Swapping";
  } else if (inboundObserved) {
    state = "deposit_detected";
    detail = "Deposit observed — confirming";
  } else {
    state = "awaiting_deposit";
    detail = "Awaiting deposit confirmation";
  }

  const outboundTxHash = firstOut?.id || firstOut?.hash || undefined;

  return { provider: "thorchain", state, detail, outboundTxHash };
}
