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

  const brokerUrl = process.env.CHAINFLIP_BROKER_URL;
  if (!brokerUrl) {
    throw new Error("CHAINFLIP_BROKER_URL is not set — cannot request a deposit address.");
  }
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

    // The broker should return JSON-RPC. If it's down, a reverse proxy returns
    // an HTML 502/504 page — detect that and fail with a readable message
    // instead of letting JSON.parse choke on "<html>".
    if (!res.ok) {
      const looksHtml = debugText.trimStart().startsWith("<");
      throw new Error(
        looksHtml
          ? `Chainflip broker unavailable (HTTP ${res.status}). The broker service appears to be down — try again shortly.`
          : `Chainflip broker error (HTTP ${res.status}): ${debugText.slice(0, 200)}`
      );
    }

    try {
      rpcRes = JSON.parse(debugText);
    } catch {
      throw new Error(
        `Chainflip broker returned a non-JSON response: ${debugText.slice(0, 200)}`
      );
    }
  } catch (e: any) {
    throw new Error(e?.message ?? "Chainflip broker request failed");
  }

  if (rpcRes.error) {
    throw new Error(`Broker RPC error: ${JSON.stringify(rpcRes.error)}`);
  }

  const result = rpcRes.result;

  // CRITICAL: getStatusV2 expects the FULL deposit channel id, formatted as
  // `${issuedBlock}-${chain}-${channelId}` — NOT the bare channel_id. Passing
  // the bare number makes getStatusV2 resolve an unrelated swap (often one that
  // is already COMPLETED), which is why tracking showed "complete" with no deposit.
  const issuedBlock = result.issued_block ?? result.issuedBlock;
  const channelId = result.channel_id ?? result.channelId;
  if (channelId == null) {
    throw new Error("Chainflip broker response missing channel_id — cannot build tracking id.");
  }
  const depositChannelId =
    issuedBlock != null
      ? `${issuedBlock}-${fromRef.chain}-${channelId}`
      : String(channelId);

  return {
    provider: "chainflip",
    depositAddress: result.address,
    depositAmount: req.amount,
    expiresAt: result.source_chain_expiry_block ?? undefined,
    trackingId: depositChannelId,
    notes: "Chainflip opens a one-time deposit channel; funds sent there are swapped automatically.",
  };
}

export async function getStatus(trackingId: string): Promise<SwapStatus> {
  try {
    const status: any = await getSdk().getStatusV2({ id: trackingId } as any);

    // TEMP DEBUG: confirm the real shape + state names Chainflip returns.
    // Remove once tracking is verified against a real swap.
    console.log("CHAINFLIP STATUS", trackingId, "→", JSON.stringify(status));

    const phase = String(status?.state ?? status?.status ?? "").toUpperCase();

    // Chainflip SDK v2 swap states (with a few legacy aliases for safety).
    const map: Record<string, SwapStatus["state"]> = {
      WAITING: "awaiting_deposit",
      AWAITING_DEPOSIT: "awaiting_deposit",
      RECEIVING: "deposit_detected",
      DEPOSIT_RECEIVED: "deposit_detected",
      SWAPPING: "processing",
      SENDING: "processing",
      SENT: "processing",
      COMPLETED: "success",
      FAILED: "failed",
    };

    let state: SwapStatus["state"] = map[phase] ?? "unknown";

    // SAFETY GUARD: never report "success" unless the response actually shows a
    // deposit/egress occurred. Protects against a malformed id resolving to an
    // unrelated completed swap, or an empty response being mis-read as done.
    if (state === "success") {
      const s = status ?? {};
      const hasEvidence =
        s.deposit != null ||
        s.depositAmount != null ||
        s.depositTransactionRef != null ||
        s.swapEgress != null ||
        s.egress != null ||
        s.swap != null ||
        (Array.isArray(s.swaps) && s.swaps.length > 0);
      if (!hasEvidence) state = "unknown";
    }

    return { provider: "chainflip", state, detail: phase || "no state" };
  } catch (e: any) {
    return { provider: "chainflip", state: "unknown", detail: e?.message ?? "status lookup failed" };
  }
}
