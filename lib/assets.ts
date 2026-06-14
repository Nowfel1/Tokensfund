import { CanonicalAsset } from "./types";

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
      exolix: { coin: "BTC", network: "BTC" },
      cce: { abbr: "BTC", chain: "Bitcoin" },
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
      exolix: { coin: "ETH", network: "ETH" },
      cce: { abbr: "ETH", chain: "Ethereum" },
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
      exolix: { coin: "SOL", network: "SOL" },
      cce: { abbr: "SOL", chain: "Solana" },
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
      exolix: { coin: "USDC", network: "ETH" },
      cce: { abbr: "USDC", chain: "Ethereum" },
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
      exolix: { coin: "USDT", network: "ETH" },
      cce: { abbr: "USDT", chain: "Ethereum" },
    },
  },
  {
    id: "LTC",
    symbol: "LTC",
    name: "Litecoin",
    chain: "Litecoin",
    decimals: 8,
    providerIds: {
      thorchain: { asset: "LTC.LTC", decimals: 8 },
      chainflip: { asset: "LTC", chain: "Litecoin" },
      near_intents: { asset: "nep141:ltc.omft.near", decimals: 8 },
      exolix: { coin: "LTC", network: "LTC" },
      cce: { abbr: "LTC", chain: "Litecoin" },
    },
  },
  {
    id: "DOGE",
    symbol: "DOGE",
    name: "Dogecoin",
    chain: "Dogecoin",
    decimals: 8,
    providerIds: {
      thorchain: { asset: "DOGE.DOGE", decimals: 8 },
      near_intents: { asset: "nep141:doge.omft.near", decimals: 8 },
      exolix: { coin: "DOGE", network: "DOGE" },
      cce: { abbr: "DOGE", chain: "Dogecoin" },
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
      exolix: { coin: "XMR", network: "XMR" },
      cce: { abbr: "XMR", chain: "Monero" },
    },
  },
  {
    id: "ZEC",
    symbol: "ZEC",
    name: "Zcash",
    chain: "Zcash",
    decimals: 8,
    providerIds: {
      near_intents: { asset: "nep141:zec.omft.near", decimals: 8 },
      exolix: { coin: "ZEC", network: "ZEC" },
      cce: { abbr: "ZEC", chain: "Zcash" },
    },
  },
  {
    id: "TAO",
    symbol: "TAO",
    name: "Bittensor",
    chain: "Bittensor",
    decimals: 9,
    providerIds: {
      exolix: { coin: "TAO", network: "TAO" },
    },
  },
  {
    id: "TON",
    symbol: "TON",
    name: "Toncoin",
    chain: "TON",
    decimals: 9,
    providerIds: {
      near_intents: { asset: "nep141:ton.omft.near", decimals: 9 },
      exolix: { coin: "TON", network: "TON" },
      cce: { abbr: "TON", chain: "TON" },
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
      exolix: { coin: "NEAR", network: "NEAR" },
    },
  },
];

export const ASSET_BY_ID = new Map(ASSETS.map((a) => [a.id, a]));

export function getAsset(id: string): CanonicalAsset | undefined {
  return ASSET_BY_ID.get(id);
}

export function providersForPair(fromId: string, toId: string) {
  const from = getAsset(fromId);
  const to = getAsset(toId);
  if (!from || !to) return [];
  const ids: ("thorchain" | "chainflip" | "near_intents" | "exolix" | "cce")[] = [
    "thorchain",
    "chainflip",
    "near_intents",
    "exolix",
    "cce",
  ];
  return ids.filter((p) => from.providerIds[p] && to.providerIds[p]);
}
