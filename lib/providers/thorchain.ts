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
    from_asset: fromRef.asset,
    to_asset: toRef.asset,
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

export async function getStatus(trackingId: string): Promise<SwapStatus> {
  return {
    provider: "thorchain",
    state: "unknown",
    detail:
      "Provide the user's deposit tx hash and query THORNode /thorchain/tx/status/{hash} for live state.",
  };
}
