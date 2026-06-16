export type ProviderId =
  | "thorchain"
  | "chainflip"
  | "near_intents"
  | "cce"
  | "changenow"; // ← Added

export interface ProviderAssetRef {
  asset?: string;
  chain?: string;
  decimals?: number;
  coin?: string;
  network?: string;
  abbr?: string;     // Used by CCE.Cash
  ticker?: string;   // Used by ChangeNOW (and future providers)
}

export interface CanonicalAsset {
  id: string;
  symbol: string;
  name: string;
  chain: string;
  decimals: number;
  providerIds: Partial<Record<ProviderId, ProviderAssetRef>>;
}

export interface QuoteRequest {
  fromAssetId: string;
  toAssetId: string;
  amount: string;
  destinationAddress?: string;
  refundAddress?: string;
  slippageBps?: number;
}

export interface NormalizedQuote {
  provider: ProviderId;
  providerLabel: string;
  expectedOut: number;
  minOut?: number;
  feeOut?: number;
  estimatedSeconds?: number;
  raw: unknown;
  error?: string;
}

export interface AggregatedQuotes {
  request: QuoteRequest;
  fromAsset: CanonicalAsset;
  toAsset: CanonicalAsset;
  quotes: NormalizedQuote[];
  bestIndex: number;
}

export interface SwapInstruction {
  provider: ProviderId;
  depositAddress: string;
  memo?: string;
  depositAmount: string;
  expiresAt?: number;
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
