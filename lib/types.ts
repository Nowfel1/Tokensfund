export type ProviderId =
  | "thorchain"
  | "chainflip"
  | "near_intents"
  | "cce"
  | "changee";

export interface ProviderAssetRef {
  asset?: string;
  chain?: string;
  decimals?: number;
  coin?: string;
  network?: string;
  abbr?: string;     // Used by CCE.Cash
  ticker?: string;   // Used by Changee (and future providers)
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

// Some routes cannot be completed with a plain wallet transfer. THORChain on
// EVM chains requires calling the Router's depositWithExpiry() — sending a
// normal transfer to the vault address (as MetaMask's Send screen would do)
// strands the funds. When present, the UI MUST show these instructions
// instead of a simple "send to this address" panel.
export interface EvmContractExecution {
  type: "evm_contract_call";
  chain: string;              // e.g. "Ethereum"
  router: string;             // router contract to call
  functionName: string;       // e.g. "depositWithExpiry"
  vault: string;              // param: inbound vault address
  tokenAddress: string;       // param: 0x0 for native ETH, else ERC20 contract
  amountBaseUnits: string;    // param: amount in the token's base units
  memo: string;               // param: THORChain memo string
  expiry: number;             // param: unix seconds
  nativeValue?: string;       // ETH value to send with the call (native swaps)
  helperUrl?: string;         // interface that builds this call for the user
}

export interface SwapInstruction {
  provider: ProviderId;
  depositAddress: string;
  memo?: string;
  execution?: EvmContractExecution;
  depositAmount: string;
  // NOTE: providers put different things here — THORChain a block height,
  // NEAR Intents a unix timestamp (seconds). UI countdowns assume unix
  // seconds, so only timestamp-based providers get a meaningful countdown.
  expiresAt?: number;
  trackingId: string;
  notes?: string;
}

export interface SwapStatus {
  provider: ProviderId;
  // NOTE: "completed"/"success" and "pending"/"awaiting_deposit" are treated
  // identically by the UI (see STATE_META). Kept for backward compatibility
  // with existing provider mappings — prefer "success" and "awaiting_deposit"
  // in new code.
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
