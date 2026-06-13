import { CanonicalAsset, NormalizedQuote, QuoteRequest, SwapInstruction, SwapStatus } from "../types";
import { SwapSDK } from "@chainflip/sdk/swap";

const NETWORK = (process.env.CHAINFLIP_NETWORK as "mainnet" | "perseverance") || "mainnet";
const BROKER_URL = process.env.CHAINFLIP_BROKER_URL;
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
  req: QuoteRequest,
  from: CanonicalAsset,
  to: CanonicalAsset
): Promise<SwapInstruction> {
  const fromRef = from.providerIds.exolix!;
  const toRef = to.providerIds.exolix!;

  const body = {
    coinFrom: fromRef.coin,
    networkFrom: fromRef.network ?? undefined,
    coinTo: toRef.coin,
    networkTo: toRef.network ?? undefined,
    amount: req.amount,
    withdrawalAddress: req.destinationAddress,
    withdrawalExtraId: "",
    refundAddress: req.refundAddress ?? "",
    refundExtraId: "",
    rateType: "float",
    affiliateId: process.env.EXOLIX_AFFILIATE_ID ?? "",
  };

  const res = await fetch(`${BASE}/transactions`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Exolix swap failed (${res.status}): ${err.slice(0, 200)}`);
  }
  const data = await res.json();
  if (data.message) throw new Error(`Exolix: ${data.message}`);
  return {
    provider: "exolix",
    depositAddress: data.depositAddress,
    depositAmount: String(data.amount),
    memo: data.depositExtraId || undefined,
    trackingId: data.id,
    notes: undefined,
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
