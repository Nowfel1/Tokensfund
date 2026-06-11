// Shared, provider-agnostic types. Every provider normalizes into these so the
// aggregator and UI never have to know which protocol produced a quote.

export type ProviderId = "thorchain" | "chainflip" | "near_intents" | "exolix";

export interface CanonicalAsset {
  /** Internal id used by the UI, e.g. "BTC", "ETH", "USDC". */
  id: string;
  symbol: string;
  name: string;
  chain: string;
  decimals: number;
  /** Per-provider identifiers. A missing entry means the provider can't route it. */
  providerIds: Partial<Record<ProviderId, ProviderAssetRef>>;
}

export interface ProviderAssetRef {
  /** The string/enum the provider expects (THORChain/Chainflip/NEAR). */
  asset?: string;
  /** Optional chain hint (Chainflip). */
  chain?: string;
  /** Decimals the provider quotes in, if different from canonical. */
  decimals?: number;
  /** Exolix coin ticker, e.g. "BTC", "XMR". */
  coin?: string;
  /** Exolix network, e.g. "BTC", "ETH", "XMR". */
  network?: string;
}

export interface QuoteRequest {
  fromAssetId: string;
  toAssetId: string;
  /** Human-readable amount of the source asset, e.g. "0.1". */
  amount: string;
  /** Where the user wants to receive the destination asset. */
  destinationAddress?: string;
  /** Where to refund the source asset if the swap fails. */
  refundAddress?: string;
  /** Max acceptable slippage in basis points (100 = 1%). */
  slippageBps?: number;
}

export interface NormalizedQuote {
  provider: ProviderId;
  providerLabel: string;
  /** Expected output in human units of the destination asset. */
  expectedOut: number;
  /** Worst-case output after slippage, human units. */
  minOut?: number;
  /** Total fees expressed in destination-asset human units, if known. */
  feeOut?: number;
  /** Estimated total duration in seconds. */
  estimatedSeconds?: number;
  /** Opaque payload the provider needs to later open a deposit channel. */
  raw: unknown;
  /** Set when a provider failed; the UI shows it greyed out. */
  error?: string;
}

export interface AggregatedQuotes {
  request: QuoteRequest;
  fromAsset: CanonicalAsset;
  toAsset: CanonicalAsset;
  quotes: NormalizedQuote[];
  /** Index of the best quote in `quotes`, or -1 if none succeeded. */
  bestIndex: number;
}

export interface SwapInstruction {
  provider: ProviderId;
  /** The address the user must send the source asset to. */
  depositAddress: string;
  /** Memo / OP_RETURN payload, if the chain requires one (THORChain does). */
  memo?: string;
  /** Token/amount to send, in human units. */
  depositAmount: string;
  /** Quote/channel expiry as a unix timestamp (seconds) if provided. */
  expiresAt?: number;
  /** Id used to poll status. */
  trackingId: string;
  notes?: string;
}

export interface SwapStatus {
  provider: ProviderId;
  state:
    | "awaiting_deposit"
    | "deposit_detected"
    | "processing"
    | "completed"
    | "success"
    | "refunded"
    | "pending"
    | "failed"
    | "unknown";
  detail?: string;
  outboundTxHash?: string;
}
