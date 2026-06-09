import { CanonicalAsset, NormalizedQuote, QuoteRequest, SwapInstruction, SwapStatus } from "../types";

// Chainflip integration via the official JS SDK (@chainflip/sdk).
// Docs: https://docs.chainflip.io/swapping/integrations/javascript-sdk/quick-start
// In "direct API mode" (no broker) you can quote and open deposit channels with
// no key. To collect a commission, run a broker and pass brokerUrl/commission.

import { SwapSDK } from "@chainflip/sdk/swap";

const NETWORK = (process.env.CHAINFLIP_NETWORK as "mainnet" | "perseverance") || "mainnet";
const BROKER_URL = process.env.CHAINFLIP_BROKER_URL; // optional, for commission
const BROKER_COMMISSION_BPS = process.env.CHAINFLIP_COMMISSION_BPS
  ? Number(process.env.CHAINFLIP_COMMISSION_BPS)
  : undefined;

let sdk: SwapSDK | null = null;
function getSdk(): SwapSDK {
  if (!sdk) {
    sdk = new SwapSDK({
      network: NETWORK,
      ...(BROKER_URL ? { broker: { url: BROKER_URL, commissionBps: BROKER_COMMISSION_BPS ?? 0 } } : {}),
    });
  }
  return sdk;
}

function toBase(humanAmount: string, decimals: number): string {
  const [whole, frac = ""] = humanAmount.split(".");
  const fracPadded = (frac + "0".repeat(decimals)).slice(0, decimals);
  return (BigInt(whole || "0") * 10n ** BigInt(decimals) + BigInt(fracPadded || "0")).toString();
}
function fromBase(base: string, decimals: number): number {
  return Number(base) / 10 ** decimals;
}

export async function getQuote(
  from: CanonicalAsset,
  to: CanonicalAsset,
  req: QuoteRequest
): Promise<NormalizedQuote> {
  const fromRef = from.providerIds.chainflip!;
  const toRef = to.providerIds.chainflip!;

  const { quotes } = await getSdk().getQuoteV2({
    srcChain: fromRef.chain!,
    srcAsset: fromRef.asset,
    destChain: toRef.chain!,
    destAsset: toRef.asset,
    amount: toBase(req.amount, from.decimals),
  } as any);

  // Prefer a plain REGULAR quote; fall back to whatever came back.
  const quote = (quotes as any[]).find((q) => q.type === "REGULAR") ?? (quotes as any[])[0];
  if (!quote) throw new Error("Chainflip returned no quotes for this pair.");

  const expectedOut = fromBase(String(quote.egressAmount), to.decimals);

  return {
    provider: "chainflip",
    providerLabel: "Chainflip",
    expectedOut,
    estimatedSeconds: quote.estimatedDurationSeconds ?? undefined,
    raw: quote,
  };
}

export async function buildSwap(
  quote: NormalizedQuote,
  req: QuoteRequest
): Promise<SwapInstruction> {
  if (!req.destinationAddress) throw new Error("Chainflip needs a destination address.");
  const raw = quote.raw as any;

  const channel = await getSdk().requestDepositAddressV2({
    quote: raw,
    destAddress: req.destinationAddress,
    fillOrKillParams: {
      slippageTolerancePercent:
        raw.recommendedSlippageTolerancePercent ?? (req.slippageBps ? req.slippageBps / 100 : 1),
      refundAddress: req.refundAddress || req.destinationAddress,
      retryDurationBlocks: 100, // ~10 minutes before refund
    },
  } as any);

  return {
    provider: "chainflip",
    depositAddress: channel.depositAddress,
    depositAmount: req.amount,
    expiresAt: channel.estimatedDepositChannelExpiryTime
      ? Math.floor(channel.estimatedDepositChannelExpiryTime / 1000)
      : undefined,
    trackingId: channel.depositChannelId,
    notes: "Chainflip opens a one-time deposit channel; funds sent there are swapped automatically.",
  };
}

export async function getStatus(trackingId: string): Promise<SwapStatus> {
  try {
    const status: any = await getSdk().getStatusV2({ id: trackingId } as any);
    const phase = String(status.state ?? status.status ?? "").toUpperCase();
    const map: Record<string, SwapStatus["state"]> = {
      AWAITING_DEPOSIT: "awaiting_deposit",
      DEPOSIT_RECEIVED: "deposit_detected",
      SWAPPING: "processing",
      SENDING: "processing",
      COMPLETED: "success",
      FAILED: "failed",
    };
    return { provider: "chainflip", state: map[phase] ?? "unknown", detail: phase };
  } catch (e: any) {
    return { provider: "chainflip", state: "unknown", detail: e.message };
  }
}
