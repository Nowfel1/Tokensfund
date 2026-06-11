import { CanonicalAsset } from "./types";

// SEED registry. This is the piece you expand as you add pairs. Each canonical
// asset carries the identifier every protocol expects:
// - THORChain uses "CHAIN.TICKER" (or "CHAIN.TICKER-ADDR" for ERC20s).
// - Chainflip uses separate chain + asset enums ("Ethereum" / "ETH").
// - NEAR Intents (1Click) uses assetId strings from GET /v0/tokens.
//
// The NEAR assetIds below are examples and MUST be verified/refreshed against
// https://1click.chaindefuser.com/v0/tokens before going live — they change.

export const ASSETS: CanonicalAsset[] = [
  {
    id: "BTC",
    symbol: "BTC",
    name: "Bitcoin",
    chain: "Bitcoin",
    decimals: 8,
    providerIds: {
      thorchain: { asset: "BTC.BTC", decimals: 8 },
      chainflip: { asset: "BTC", chain: "Bitcoin" },
      near_intents: { asset: "nep141:btc.omft.near", decimals: 8 },
    },
  },
  {
    id: "ETH",
    symbol: "ETH",
    name: "Ethereum",
    chain: "Ethereum",
    decimals: 18,
    providerIds: {
      thorchain: { asset: "ETH.ETH", decimals: 8 },
      chainflip: { asset: "ETH", chain: "Ethereum" },
      near_intents: { asset: "nep141:eth.omft.near", decimals: 18 },
    },
  },
  {
    id: "USDC",
    symbol: "USDC",
    name: "USD Coin (Ethereum)",
    chain: "Ethereum",
    decimals: 6,
    providerIds: {
      thorchain: {
        asset: "ETH.USDC-0XA0B86991C6218B36C1D19D4A2E9EB0CE3606EB48",
        decimals: 8,
      },
      chainflip: { asset: "USDC", chain: "Ethereum" },
      near_intents: {
        asset: "nep141:eth-0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.omft.near",
        decimals: 6,
      },
    },
  },
  {
    id: "USDT",
    symbol: "USDT",
    name: "Tether (Ethereum)",
    chain: "Ethereum",
    decimals: 6,
    providerIds: {
      thorchain: {
        asset: "ETH.USDT-0XDAC17F958D2EE523A2206206994597C13D831EC7",
        decimals: 8,
      },
      near_intents: {
        asset: "nep141:eth-0xdac17f958d2ee523a2206206994597c13d831ec7.omft.near",
        decimals: 6,
      },
      // Chainflip USDT on Ethereum — confirm support before enabling:
      // chainflip: { asset: "USDT", chain: "Ethereum" },
    },
  },
  {
    id: "SOL",
    symbol: "SOL",
    name: "Solana",
    chain: "Solana",
    decimals: 9,
    providerIds: {
      chainflip: { asset: "SOL", chain: "Solana" },
      near_intents: { asset: "nep141:sol.omft.near", decimals: 9 },
    },
  },
  {
    id: "NEAR",
    symbol: "NEAR",
    name: "NEAR",
    chain: "NEAR",
    decimals: 24,
    providerIds: {
      near_intents: { asset: "nep141:wrap.near", decimals: 24 },
    },
  },
  {
    id: "XMR",
    symbol: "XMR",
    name: "Monero",
    chain: "Monero",
    decimals: 12,
    providerIds: {
      thorchain: { asset: "XMR.XMR", decimals: 8 },
    },
  },
];

export const ASSET_BY_ID = new Map(ASSETS.map((a) => [a.id, a]));

export function getAsset(id: string): CanonicalAsset | undefined {
  return ASSET_BY_ID.get(id);
}

/** Providers that can route a given from/to pair (both sides supported). */
export function providersForPair(fromId: string, toId: string) {
  const from = getAsset(fromId);
  const to = getAsset(toId);
  if (!from || !to) return [];
  const ids: ("thorchain" | "chainflip" | "near_intents")[] = [
    "thorchain",
    "chainflip",
    "near_intents",
  ];
  return ids.filter((p) => from.providerIds[p] && to.providerIds[p]);
}
