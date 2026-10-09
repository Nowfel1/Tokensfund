import { CanonicalAsset } from "./types";
import type { ProviderId } from "./types";

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
      cce: { abbr: "BTC", chain: "Bitcoin" },
      changee: { ticker: "BTC" },
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
      cce: { abbr: "ETH", chain: "Ethereum" },
      changee: { ticker: "ETH" },
    },
  },
  {
    id: "USDT",
    symbol: "USDT",
    name: "Tether (Ethereum)",
    chain: "Ethereum",
    decimals: 6,
    providerIds: {
      thorchain: { asset: "ETH.USDT-0XDAC17F958D2EE523A2206206994597C13D831EC7", decimals: 8 },
      cce: { abbr: "USDT", chain: "Ethereum" },
      changee: { ticker: "USDT" },
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
      cce: { abbr: "XMR", chain: "Monero" },
      changee: { ticker: "XMR" },
    },
  },
  {
    id: "ZEC",
    symbol: "ZEC",
    name: "Zcash",
    chain: "Zcash",
    decimals: 8,
    providerIds: {
      thorchain: { asset: "ZEC.ZEC", decimals: 8 },
      changee: { ticker: "ZEC" },
    },
  },
  {
    id: "DAI",
    symbol: "DAI",
    name: "Dai (Ethereum)",
    chain: "Ethereum",
    decimals: 18,
    providerIds: {
      thorchain: { asset: "ETH.DAI-0X6B175474E89094C44DA98B954EEDEAC495271D0F", decimals: 8 },
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
      cce: { abbr: "SOL", chain: "Solana" },
      changee: { ticker: "SOL" },
    },
  },
  {
    id: "XRP",
    symbol: "XRP",
    name: "XRP",
    chain: "XRP Ledger",
    decimals: 6,
    providerIds: {
      changee: { ticker: "XRP" },
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
      cce: { abbr: "DOGE", chain: "Dogecoin" },
      changee: { ticker: "DOGE" },
    },
  },
  {
    id: "USDT_TRC20",
    symbol: "USDT",
    name: "Tether (Tron)",
    chain: "Tron",
    decimals: 6,
    providerIds: {
      cce: { abbr: "USDT", chain: "TRON" },
    },
  },
  {
    id: "BNB",
    symbol: "BNB",
    name: "BNB (BNB Smart Chain)",
    chain: "BNB Smart Chain",
    decimals: 18,
    providerIds: {
      cce: { abbr: "BNB", chain: "BNB Smart Chain" },
    },
  },
  {
    // CCE's chain name must be exactly "BNB Smart Chain".
    id: "USDT_BSC",
    symbol: "USDT",
    name: "Tether (BNB Smart Chain)",
    chain: "BNB Smart Chain",
    decimals: 18,
    providerIds: {
      cce: { abbr: "USDT", chain: "BNB Smart Chain" },
    },
  },
  {
    id: "USDC",
    symbol: "USDC",
    name: "USD Coin (Ethereum)",
    chain: "Ethereum",
    decimals: 6,
    providerIds: {
      thorchain: { asset: "ETH.USDC-0XA0B86991C6218B36C1D19D4A2E9EB0CE3606EB48", decimals: 8 },
      chainflip: { asset: "USDC", chain: "Ethereum" },
      cce: { abbr: "USDC", chain: "Ethereum" },
      changee: { ticker: "USDC" },
    },
  },
  {
    id: "USDC_SOL",
    symbol: "USDC",
    name: "USD Coin (Solana)",
    chain: "Solana",
    decimals: 6,
    providerIds: {
      chainflip: { asset: "USDC", chain: "Solana" },
      cce: { abbr: "USDC", chain: "Solana" },
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
      cce: { abbr: "LTC", chain: "Litecoin" },
      changee: { ticker: "LTC" },
    },
  },
  {
    // Toncoin was renamed Gram (GRAM). The id stays "TON" because it keys the
    // price map, icon and address check; provider tickers stay "TON" too.
    id: "TON",
    symbol: "GRAM",
    name: "Gram (TON network)",
    chain: "TON",
    decimals: 9,
    providerIds: {
      cce: { abbr: "TON", chain: "TON" },
      changee: { ticker: "TON" },
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
  const ids: ProviderId[] = ["thorchain", "chainflip", "cce", "changee"];
  return ids.filter((p) => from.providerIds[p] && to.providerIds[p]);
}
