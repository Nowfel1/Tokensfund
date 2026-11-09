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
      wagyu: { chainId: 20000000000001, token: "bitcoin", decimals: 8 },
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
      wagyu: { chainId: 1, token: "0x0000000000000000000000000000000000000000", decimals: 18 },
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
      wagyu: { chainId: 1, token: "0xdAC17F958D2ee523a2206206994597C13D831ec7", decimals: 6 },
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
      wagyu: { chainId: 0, token: "XMR", decimals: 12 },
      // thorchain: { asset: "XMR.XMR", decimals: 8 },
      // ^ THORChain answered "pool does not exist" for XMR (Nov 2026). Re-enable
      //   once its Monero pool is open, checked with a live BTC -> XMR quote.
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
      wagyu: { chainId: 133, token: "ZEC", decimals: 8 },
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
      wagyu: { chainId: 1151111081099710, token: "11111111111111111111111111111111", decimals: 9 },
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
      // THORChain added Nov 2026 as a second XRP route. Its deposits need the
      // memo in the XRP payment's Memo field (a destination tag won't work).
      thorchain: { asset: "XRP.XRP", decimals: 8 },
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
      wagyu: { chainId: 728126428, token: "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t", decimals: 6 },
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
      wagyu: { chainId: 56, token: "0x0000000000000000000000000000000000000000", decimals: 18 },
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
      wagyu: { chainId: 56, token: "0x55d398326f99059fF775485246999027B3197955", decimals: 18 },
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
      wagyu: { chainId: 1, token: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", decimals: 6 },
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
      wagyu: { chainId: 1151111081099710, token: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", decimals: 6 },
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
    // price map, icon and address check. Providers name it differently:
    // CCE lists it as GRAM (verified against CCE's list), Changee as TON.
    id: "TON",
    symbol: "GRAM",
    name: "Gram (TON network)",
    chain: "TON",
    decimals: 9,
    providerIds: {
      cce: { abbr: "GRAM", chain: "TON" },
      changee: { ticker: "TON" },
    },
  },
];

export const ASSET_BY_ID = new Map(ASSETS.map((a) => [a.id, a]));

export function getAsset(id: string): CanonicalAsset | undefined {
  return ASSET_BY_ID.get(id);
}

// Shared by the server and the swap screen, so both always agree on which
// routes to ask for a pair.
export function providersForPair(fromId: string, toId: string) {
  const from = getAsset(fromId);
  const to = getAsset(toId);
  if (!from || !to) return [];
  const ids: ProviderId[] = ["thorchain", "chainflip", "cce", "changee", "wagyu"];
  return ids.filter((p) => Boolean(from.providerIds[p] && to.providerIds[p]));
}
