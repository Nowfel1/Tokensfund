import { CanonicalAsset, NormalizedQuote, QuoteRequest, SwapInstruction, SwapStatus } from "../types";

// THORChain integration via the public THORNode REST API.
// Docs: https://dev.thorchain.org/swap-guide/quickstart-guide.html
// Everything on THORChain is quoted in 1e8 base units regardless of the asset's
// real decimals, so we scale to/from 1e8 here.

const THORNODE = process.env.THORNODE_URL || "https://gateway.liquify.com/chain/thorchain_api";
const THOR_BASE = 1e8;

// Optional: earn revenue by setting an affiliate THORName + bps in env.
const AFFILIATE = process.env.THOR_AFFILIATE;          // e.g. "tokensfund"
const AFFILIATE_BPS = process.env.THOR_AFFILIATE_BPS;  // e.g. "30" (0.30%)

function toThorBase(humanAmount: string): string {
  return Math.round(parseFloat(humanAmount) * THOR_BASE).toString();
}
function fromThorBase(base: string | number): number {
  return Number(base) / THOR_BASE;
}

export async function getQuote(
  from: CanonicalAsset,
  to: CanonicalAsset,
  req: QuoteRequest
): Promise<NormalizedQuote> {
  const fromRef = from.providerIds.thorchain!;
  const toRef = to.providerIds.thorchain!;

  const params = new URLSearchParams({
    from_asset: fromRef.asset,
    to_asset: toRef.asset,
    amount: toThorBase(req.amount),
    // streaming swaps get better prices on larger trades; let the node optimize
    streaming_interval: "1",
    streaming_quantity: "0",
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
  return {
    provider: "thorchain",
    depositAddress: data.inbound_address,
    // The memo encodes the swap intent; without it THORChain refunds the deposit.
    // For BTC this goes in an OP_RETURN output. THORNode returns it in `memo`.
    memo: data.memo,
    depositAmount: req.amount,
    expiresAt: data.expiry,
    trackingId: data.inbound_address, // track by deposit/inbound address
    notes: data.router
      ? `EVM router contract: ${data.router}. Send via the router's depositWithExpiry for ERC20s.`
      : undefined,
  };
}

export async function getStatus(trackingId: string): Promise<SwapStatus> {
  // Track via the tx tracker. For a production build, store the user's inbound
  // tx hash at submit time and query /thorchain/tx/status/{hash}.
  return {
    provider: "thorchain",
    state: "unknown",
    detail:
      "Provide the user's deposit tx hash and query THORNode /thorchain/tx/status/{hash} for live state.",
  };
}
