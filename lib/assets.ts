import { CanonicalAsset } from "./types";
import type { ProviderId } from "./types";

// ---------------------------------------------------------------------------
// NEAR INTENTS DISABLED — 2026-08-17
//
// Every near_intents provider ref is commented out with the marker
// [NEAR DISABLED]. Reason: multiple independent reports — including our own
// ~5 BTC case (see /blog/near-intents-stuck-swap-incident-2026) — of deposits
// confirming on-chain but never crediting, no refund issued, support
// escalation going silent, and users restricted from asking in Telegram.
//
// Consequences while this is off:
//   - ZEC has no route and is commented out below. THORChain's ZEC pool is
//     announced but NOT live yet; when it ships, uncomment the thorchain ref
//     inside the ZEC block and restore Zcash without needing NEAR.
//   - NEAR (the token) has no route and is commented out below.
//   - Everything else keeps its remaining routes.
//
// To re-enable NEAR: search "[NEAR DISABLED]" and uncomment.
// ---------------------------------------------------------------------------

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
      // [NEAR DISABLED] near_intents: { asset: "nep141:btc.omft.near", decimals: 8 },
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
      // [NEAR DISABLED] near_intents: { asset: "nep141:eth.omft.near", decimals: 18 },
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
      thorchain: {
        asset: "ETH.USDT-0XDAC17F958D2EE523A2206206994597C13D831EC7",
        decimals: 8,
      },
      // [NEAR DISABLED] near_intents: { asset: "nep141:eth-0xdac17f958d2ee523a2206206994597c13d831ec7.omft.near", decimals: 6 },
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
  // [NEAR DISABLED] ZEC's only route was NEAR Intents. THORChain's ZEC pool is
  // announced but not yet live — when it ships, uncomment this whole block AND
  // its thorchain ref, and Zcash returns without needing NEAR.
  // {
  //   id: "ZEC",
  //   symbol: "ZEC",
  //   name: "Zcash",
  //   chain: "Zcash",
  //   decimals: 8,
  //   providerIds: {
  //     // near_intents: { asset: "nep141:zec.omft.near", decimals: 8 },
  //     // thorchain: { asset: "ZEC.ZEC", decimals: 8 },
  //   },
  // },
  {
    id: "DAI",
    symbol: "DAI",
    name: "Dai (Ethereum)",
    chain: "Ethereum",
    decimals: 18,
    providerIds: {
      thorchain: {
        asset: "ETH.DAI-0X6B175474E89094C44DA98B954EEDEAC495271D0F",
        decimals: 8,
      },
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
      // [NEAR DISABLED] near_intents: { asset: "nep141:sol.omft.near", decimals: 9 },
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
      // [NEAR DISABLED] near_intents: { asset: "nep141:xrp.omft.near", decimals: 6 },
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
      // [NEAR DISABLED] near_intents: { asset: "nep141:doge.omft.near", decimals: 8 },
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
    // BNB — native coin of BNB Smart Chain.
    // Verify cce values via /api/cce-currencies?q=bnb before trusting.
    id: "BNB",
    symbol: "BNB",
    name: "BNB (BNB Smart Chain)",
    chain: "BNB Smart Chain",
    decimals: 18,
    providerIds: {
      cce: { abbr: "BNB", chain: "BNB Smart Chain" },
      // changee: { ticker: "BNB" },  // verify against Changee's currency list
    },
  },
  {
    // USDT on BNB Smart Chain (BEP20), routed via CCE.Cash only.
    // chain/decimals verified against CCE /openapi/abbr/lists:
    //   { abbr: "USDT", chain: "BNB Smart Chain", type: "BEP20",
    //     decimal: 18, recv: true, send: true }
    // The chain string must match CCE's value EXACTLY — do not shorten.
    // WARNING: BSC uses the same 0x... address format as Ethereum, so the
    // address checker cannot distinguish them. Labelling must stay explicit.
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
      thorchain: {
        asset: "ETH.USDC-0XA0B86991C6218B36C1D19D4A2E9EB0CE3606EB48",
        decimals: 8,
      },
      chainflip: { asset: "USDC", chain: "Ethereum" },
      // [NEAR DISABLED] near_intents: { asset: "nep141:eth-0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.omft.near", decimals: 6 },
      cce: { abbr: "USDC", chain: "Ethereum" },
      changee: { ticker: "USDC" },
    },
  },
  {
    // USDC on Solana (SPL).
    // VERIFY the cce chain string via /api/cce-currencies?q=usdc.
    id: "USDC_SOL",
    symbol: "USDC",
    name: "USD Coin (Solana)",
    chain: "Solana",
    decimals: 6,
    providerIds: {
      chainflip: { asset: "USDC", chain: "Solana" },
      cce: { abbr: "USDC", chain: "Solana" },
      // changee: { ticker: "USDCSOL" },  // need real ticker
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
      // [NEAR DISABLED] near_intents: { asset: "nep141:ltc.omft.near", decimals: 8 },
      cce: { abbr: "LTC", chain: "Litecoin" },
      changee: { ticker: "LTC" },
    },
  },
  {
    // Toncoin rebranded to Gram (GRAM) on 15 June 2026 — same coin, 1:1, no
    // migration. The BLOCKCHAIN is still called TON, which is why `chain` and
    // the internal `id` stay "TON": the id keys the price map, coin icon and
    // address pattern. Provider identifiers are pinned explicitly so this
    // display rename cannot leak into an API call.
    id: "TON",
    symbol: "GRAM",
    name: "Gram (TON network)",
    chain: "TON",
    decimals: 9,
    providerIds: {
      // [NEAR DISABLED] near_intents: { asset: "nep245:v2_1.omni.hot.tg:1117_", decimals: 9 },
      changee: { ticker: "TON" },
    },
  },
  // [NEAR DISABLED] NEAR's only route was NEAR Intents.
  // {
  //   id: "NEAR",
  //   symbol: "NEAR",
  //   name: "NEAR",
  //   chain: "NEAR",
  //   decimals: 24,
  //   providerIds: {
  //     near_intents: { asset: "nep141:wrap.near", decimals: 24 },
  //   },
  // },
];

export const ASSET_BY_ID = new Map(ASSETS.map((a) => [a.id, a]));

export function getAsset(id: string): CanonicalAsset | undefined {
  return ASSET_BY_ID.get(id);
}

export function providersForPair(fromId: string, toId: string) {
  const from = getAsset(fromId);
  const to = getAsset(toId);
  if (!from || !to) return [];
  const ids: ProviderId[] = [
    "thorchain",
    "chainflip",
    "near_intents",
    "cce",
    "changee",
  ];
  return ids.filter((p) => from.providerIds[p] && to.providerIds[p]);
}
