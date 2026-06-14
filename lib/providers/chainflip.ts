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
  _quote: NormalizedQuote,
  req: QuoteRequest,
  from: CanonicalAsset,
  to: CanonicalAsset
): Promise<SwapInstruction> {
  if (!req.destinationAddress) throw new Error("Chainflip needs a destination address.");

  const fromRef = from.providerIds.chainflip!;
  const toRef = to.providerIds.chainflip!;

  const brokerUrl = process.env.CHAINFLIP_BROKER_URL!;
  const commissionBps = process.env.CHAINFLIP_COMMISSION_BPS
    ? Number(process.env.CHAINFLIP_COMMISSION_BPS)
    : 0;

  const rpcBody = {
    jsonrpc: "2.0",
    id: 1,
    method: "broker_request_swap_deposit_address",
    params: {
      source_asset: { chain: fromRef.chain, asset: fromRef.asset },
      destination_asset: { chain: toRef.chain, asset: toRef.asset },
      destination_address: req.destinationAddress,
      broker_commission: commissionBps,
      refund_parameters: {
        retry_duration: 100,
        refund_address: req.refundAddress || req.destinationAddress,
        min_price: "0x0",
      },
    },
  };

  let rpcRes: any;
  let debugText = "no response";
  try {
    const res = await fetch(brokerUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(rpcBody),
    });
    debugText = await res.text();
    rpcRes = JSON.parse(debugText);
  } catch (e: any) {
    throw new Error(`Broker fetch failed: ${e.message} | response was: ${debugText}`);
  }

  if (rpcRes.error) {
    throw new Error(`Broker RPC error: ${JSON.stringify(rpcRes.error)}`);
  }

  const result = rpcRes.result;

  return {
    provider: "chainflip",
    depositAddress: result.address,
    depositAmount: req.amount,
    expiresAt: result.source_chain_expiry_block ?? undefined,
    trackingId: result.channel_id?.toString(),
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
