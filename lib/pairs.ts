// Transactional pair pages: /swap/<slug>
//
// These target the moment someone wants to swap ("swap btc to xmr") rather
// than the research phase the blog serves. Each page prefills the terminal
// with the pair, so the visitor lands one field away from a quote.
//
// Adding a pair: add an entry here. The route, metadata, FAQ schema and
// sitemap all derive from it. Keep `faqs` genuinely useful — they carry the
// FAQPage structured data.

import { FEE_PHRASE, FEE_ANSWER } from "./fees";
import { providersForPair } from "./assets";

export interface PairFaq {
  q: string;
  a: string;
}

export interface PairPage {
  slug: string;
  fromId: string;
  toId: string;
  fromLabel: string;
  toLabel: string;
  title: string;
  description: string;
  /** Short lede shown under the H1. */
  intro: string;
  /** 2-4 bullets on what's specific about this route. */
  notes: string[];
  faqs: PairFaq[];
  /** Shown in the footer's "Popular pairs". */
  featured?: boolean;
}

const HAND_PAIRS: PairPage[] = [
  {
    slug: "btc-to-xmr",
    fromId: "BTC",
    toId: "XMR",
    fromLabel: "Bitcoin",
    toLabel: "Monero",
    title: "Swap BTC to XMR — No Account, No KYC",
    description:
      `Compare live BTC to XMR rates from every route that supports the pair. Non-custodial, no account, no KYC for standard swaps, ${FEE_PHRASE}.`,
    intro:
      "Bitcoin in, Monero out, wallet to wallet. We quote every route that supports the pair and send your swap to the best one — no account, no KYC for standard swaps, and the number you see is what you receive.",
    notes: [
      "BTC→XMR rates vary more between services than almost any other pair, which is exactly why comparing routes matters here.",
      "Your XMR address is ~95 characters starting with 4 (or 8 for a subaddress) — check the first and last five characters before sending.",
      "Bitcoin deposits need on-chain confirmations; allow up to an hour on a busy day before the swap progresses.",
    ],
    faqs: [
      {
        q: "Do I need an account to swap BTC to XMR?",
        a: "No. TokensFund is non-custodial and account-free. You provide a destination address, send one deposit from your own wallet, and the Monero arrives at your address automatically.",
      },
      {
        q: "Is KYC required?",
        a: "No KYC is required for standard swaps. You are responsible for complying with the laws that apply where you live.",
      },
      {
        q: "What fee do you charge on BTC to XMR?",
        a: FEE_ANSWER,
      },
      {
        q: "How long does a BTC to XMR swap take?",
        a: "Most of the wait is Bitcoin confirmation time — typically 10 to 60 minutes depending on fees and network conditions. Once the deposit confirms, the Monero side usually settles within minutes.",
      },
      {
        q: "What happens if the swap cannot be completed?",
        a: "Funds are returned automatically to the refund address you provide, which is why we recommend entering one even when it is optional for the route.",
      },
    ],
  },
  {
    slug: "xmr-to-btc",
    fromId: "XMR",
    toId: "BTC",
    fromLabel: "Monero",
    toLabel: "Bitcoin",
    title: "Swap XMR to BTC — No Account, No KYC",
    description:
      `Compare live XMR to BTC rates across every route that supports the pair. Non-custodial, no account, no KYC for standard swaps, ${FEE_PHRASE}.`,
    intro:
      "Monero in, Bitcoin out, wallet to wallet. We quote every provider that serves the pair and route your swap to the best rate — no account, no KYC for standard swaps, every fee already included in the quote.",
    notes: [
      "Monero transactions are irreversible and private by default — verify your destination Bitcoin address carefully before sending.",
      "XMR deposits usually confirm faster than Bitcoin ones, so the Bitcoin payout leg is often the longer wait.",
      "A refund address is recommended: if a route cannot fill, funds return to an address you control rather than needing support.",
    ],
    faqs: [
      {
        q: "Can I swap Monero to Bitcoin without an account?",
        a: "Yes. The swap runs from your wallet to a one-time deposit address and delivers Bitcoin to the address you specify. No registration, and no KYC for standard swaps.",
      },
      {
        q: "Which providers support XMR to BTC?",
        a: "The terminal queries every integrated route that supports Monero and shows the quotes side by side, so you can see which is best at the moment you swap rather than guessing.",
      },
      {
        q: "What does the swap cost?",
        a: FEE_ANSWER,
      },
      {
        q: "Is swapping Monero legal?",
        a: "Swapping is legal in most jurisdictions, but rules differ and some countries restrict privacy assets. You are responsible for following the laws where you live.",
      },
    ],
  },
  {
    slug: "btc-to-eth",
    fromId: "BTC",
    toId: "ETH",
    fromLabel: "Bitcoin",
    toLabel: "Ethereum",
    title: "Swap BTC to ETH — No Account, No KYC",
    description:
      `Compare live BTC to ETH rates from every route that supports the pair. Non-custodial, no account, no KYC for standard swaps, ${FEE_PHRASE}.`,
    intro:
      "Bitcoin in, Ethereum out, wallet to wallet. This is one of the most widely supported pairs, so the comparison is at its widest — the best rate wins and every fee is already in the number.",
    notes: [
      "Every provider typically quotes this pair, so spreads between routes are usually tighter than on privacy pairs — comparing still routinely finds 1% or more.",
      "Your ETH address is the standard 0x format. Double-check it: the same format is used by several other EVM chains, and funds sent to the wrong network are unrecoverable.",
      "Bitcoin confirmation time dominates the wait; the Ethereum payout is usually fast once the deposit clears.",
    ],
    faqs: [
      {
        q: "How do I swap Bitcoin for Ethereum without registering?",
        a: "Enter the amount and your Ethereum address, compare the routes, then send one Bitcoin deposit to the address shown. The Ethereum arrives at your address automatically — no account is created at any point.",
      },
      {
        q: "Which route gives the best BTC to ETH rate?",
        a: "It changes constantly with liquidity and size. That is the reason for the comparison: the terminal quotes every eligible provider at the moment you ask and highlights the best output.",
      },
      {
        q: "What is the fee?",
        a: FEE_ANSWER,
      },
      {
        q: "Do I need a refund address?",
        a: "It is required for some routes and recommended for all of them. If a swap cannot be completed, funds are returned there automatically.",
      },
    ],
  },
  {
    slug: "btc-to-zec",
    fromId: "BTC",
    toId: "ZEC",
    fromLabel: "Bitcoin",
    toLabel: "Zcash",
    title: "Swap BTC to ZEC — No Account, No KYC",
    description:
      `Swap Bitcoin for Zcash without an account or KYC. Non-custodial, wallet to wallet, ${FEE_PHRASE}. Live quotes from every route that supports the pair.`,
    intro:
      "Bitcoin in, Zcash out, wallet to wallet. Zcash is delisted from many custodial venues, so the routes that serve it are fewer than for major pairs — we show every one that genuinely does, and send your swap to the best rate.",
    notes: [
      "Fewer routes serve Zcash than major coins. Where one of them is a decentralised protocol, no company holds your funds mid-swap on that route.",
      "Zcash addresses come in transparent (t1...), shielded (zs...) and unified (u1...) forms. Swap routes usually deliver to transparent addresses.",
      "If privacy is your reason for holding ZEC, move the funds into your own shielded address after they arrive — that final hop is where the privacy actually begins.",
    ],
    faqs: [
      {
        q: "Can I buy Zcash without KYC?",
        a: "Yes, for standard swaps. Send Bitcoin from your own wallet to the one-time deposit address and the ZEC arrives at an address you control. No registration required.",
      },
      {
        q: "Will my ZEC be shielded?",
        a: "Not automatically. Most swap routes deliver to a transparent address, which behaves like a Bitcoin address — amounts and history are visible. To use Zcash's privacy, move the received funds to your own shielded address inside your wallet.",
      },
      {
        q: "Which routes support ZEC?",
        a: "The terminal asks every route that currently supports Zcash and shows the quotes side by side, highlighting whichever gives you more ZEC. You receive native ZEC, not a wrapped token.",
      },
      {
        q: "What does it cost?",
        a: FEE_ANSWER,
      },
    ],
  },
  {
    slug: "eth-to-btc",
    fromId: "ETH",
    toId: "BTC",
    fromLabel: "Ethereum",
    toLabel: "Bitcoin",
    title: "Swap ETH to BTC — No Account, No KYC",
    description:
      `Compare live ETH to BTC rates across every integrated route. Non-custodial, no account, no KYC for standard swaps, ${FEE_PHRASE}.`,
    intro:
      "Ethereum in, Bitcoin out, wallet to wallet. This is one of the most widely supported pairs we route, so the comparison runs deep — the best rate wins and every fee is already inside the number you see.",
    notes: [
      "Ethereum network fees vary a lot by congestion; check gas before sending, since it is charged on top of the quote.",
      "The Bitcoin payout leg confirms on Bitcoin's schedule, so allow time even after your Ethereum deposit lands.",
      "Some routes require a refund address on the Ethereum side — entering one is recommended regardless.",
    ],
    faqs: [
      {
        q: "How do I swap ETH for BTC without an exchange account?",
        a: "Enter the amount and your Bitcoin address, compare the routes, then send one Ethereum deposit to the address shown. The Bitcoin arrives at your address automatically — no account is created.",
      },
      {
        q: "Which route is cheapest for ETH to BTC?",
        a: "It varies with liquidity and trade size, which is the reason for the comparison — the terminal quotes every eligible route at the moment you ask.",
      },
      {
        q: "Are there any other fees?",
        a: "Each provider's own fee is already reflected in the quote. Beyond that, only the blockchains' network fees: Ethereum gas is paid by you when you send the deposit, and the Bitcoin payout carries a standard mining fee.",
      },
      {
        q: "What if the route cannot fill my swap?",
        a: "Funds are refunded automatically to the refund address you provide, which is why we recommend entering one even when it is optional.",
      },
    ],
  },
  {
    slug: "usdt-to-btc",
    fromId: "USDT",
    toId: "BTC",
    fromLabel: "Tether",
    toLabel: "Bitcoin",
    title: "Swap USDT to BTC — No Account, No KYC",
    description:
      `Swap Tether for Bitcoin without an account or KYC. Live quotes across every supporting route, non-custodial, ${FEE_PHRASE}.`,
    intro:
      "Stablecoins in, Bitcoin out, wallet to wallet. A useful route if you hold dollar-denominated tokens and want an asset with no issuer, no freeze function and no closure date attached.",
    notes: [
      "Check which USDT network you hold. The terminal lists Tether on Ethereum, Tron and BNB Smart Chain separately — sending the wrong one is the most common way funds are lost.",
      "Ethereum-based USDT costs more to send at busy times; Tron and BSC transfers are usually cheaper.",
      "Stablecoins carry issuer risk that Bitcoin does not: the tokens are a liability of a company that can freeze addresses.",
    ],
    faqs: [
      {
        q: "Can I swap USDT to Bitcoin without KYC?",
        a: "Yes, for standard swaps. Send USDT from your own wallet to the one-time deposit address and the Bitcoin arrives at the address you specify. No account required.",
      },
      {
        q: "Which USDT network should I choose?",
        a: "Whichever network your tokens are actually on. Select the matching entry in the pay field — Tether (Ethereum), Tether (Tron) or Tether (BNB Smart Chain) — because sending across the wrong network cannot be reversed.",
      },
      {
        q: "Is there a minimum amount?",
        a: "Minimums vary by route and pair. If your amount is below the threshold for every route, no quotes will appear — increase the amount and the quotes will populate.",
      },
      {
        q: "How long does it take?",
        a: "The USDT deposit usually confirms within minutes, then the Bitcoin payout confirms on Bitcoin's schedule — typically 10 to 60 minutes in total.",
      },
    ],
  },
  {
    slug: "btc-to-ltc",
    fromId: "BTC",
    toId: "LTC",
    fromLabel: "Bitcoin",
    toLabel: "Litecoin",
    title: "Swap BTC to LTC — No Account, No KYC",
    description:
      `Compare live BTC to LTC rates across every integrated route. Non-custodial, no account, no KYC for standard swaps, ${FEE_PHRASE}.`,
    intro:
      "Bitcoin in, Litecoin out, wallet to wallet. Both chains settle predictably and the pair is widely supported, so this is one of the more straightforward swaps we route.",
    notes: [
      "Litecoin blocks are faster than Bitcoin's, so the payout leg is usually quick once your deposit confirms.",
      "LTC addresses start with ltc1 (native segwit) or L / M for older formats — all are supported, but verify the format matches your wallet.",
      "Litecoin's MWEB extension offers optional confidential transactions inside supporting wallets, separate from the swap itself.",
    ],
    faqs: [
      {
        q: "How do I swap Bitcoin for Litecoin without an account?",
        a: "Enter the amount and your Litecoin address, compare the routes, then send one Bitcoin deposit to the one-time address shown. The Litecoin arrives automatically.",
      },
      {
        q: "How long does a BTC to LTC swap take?",
        a: "Most of the wait is Bitcoin confirmation time. Once the deposit confirms, Litecoin's faster blocks usually deliver the payout within minutes.",
      },
      {
        q: "What is the fee?",
        a: FEE_ANSWER,
      },
      {
        q: "Do you support MWEB addresses?",
        a: "Support depends on the individual route. If a quote does not appear for an MWEB address, use a standard Litecoin address and move funds to MWEB inside your own wallet afterwards.",
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Generated pair pages
//
// Each page is assembled from facts about the two coins (how deposits confirm,
// what a receiving address looks like, what goes wrong most often) plus one
// hand-written line about why people make that particular swap. That keeps
// every page specific rather than 30 copies of the same text.
//
// Pages never name providers, because routes change. A pair only gets a page
// while at least one live route supports it (see the filter at the bottom), so
// removing a provider can never leave a page that shows no quotes.
// ---------------------------------------------------------------------------

interface CoinFacts {
  /** Ticker shown on the page (USDT on Tron is still "USDT" to users). */
  sym: string;
  /** Plain name used in sentences. */
  label: string;
  /** Slug fragment: usdt-trc20, ton, ... */
  slug: string;
  /** Typical time for a deposit of this coin to be accepted. */
  confirm: string;
  /** Advice for SENDING this coin to a deposit address. */
  sendTip: string;
  /** What the receiving address looks like, and what to check. */
  addressTip: string;
  /** Short phrase for the FAQ about the receiving address. */
  addressShort: string;
}

const COINS: Record<string, CoinFacts> = {
  BTC: {
    sym: "BTC", label: "Bitcoin", slug: "btc",
    confirm: "10 to 60 minutes, depending on the fee you pay and how busy the network is",
    sendTip: "Bitcoin deposits need on-chain confirmations. Pay a normal network fee so the deposit isn't stuck waiting for a block.",
    addressTip: "Bitcoin addresses start with bc1, 1 or 3. All three work; copy and paste rather than typing, and check the first and last few characters.",
    addressShort: "a Bitcoin address starting with bc1, 1 or 3",
  },
  ETH: {
    sym: "ETH", label: "Ethereum", slug: "eth",
    confirm: "a minute or two",
    sendTip: "Ethereum gas is paid on top of the quote and changes with network demand, so check it in your wallet before sending.",
    addressTip: "Your ETH address is the 0x format (42 characters). Other EVM networks use the same format, so make sure it's an address you control on Ethereum mainnet.",
    addressShort: "an Ethereum address starting with 0x",
  },
  USDT: {
    sym: "USDT", label: "Tether (ERC-20)", slug: "usdt",
    confirm: "a minute or two once the Ethereum transaction is mined",
    sendTip: "This page is for USDT on Ethereum (ERC-20). You need a little ETH in the same wallet to pay gas. USDT on Tron or BNB Smart Chain is listed separately — sending the wrong network can't be undone.",
    addressTip: "ERC-20 USDT is received at a normal 0x Ethereum address. Don't use a Tron (T…) address.",
    addressShort: "an Ethereum (0x) address — ERC-20 network",
  },
  USDT_TRC20: {
    sym: "USDT", label: "Tether (TRC-20)", slug: "usdt-trc20",
    confirm: "about a minute",
    sendTip: "This page is for USDT on Tron (TRC-20). Sending from a Tron wallet needs some TRX for network resources. Ethereum USDT is a different token and must not be sent here.",
    addressTip: "TRC-20 USDT is received at a Tron address starting with T.",
    addressShort: "a Tron address starting with T",
  },
  USDC: {
    sym: "USDC", label: "USD Coin (ERC-20)", slug: "usdc",
    confirm: "a minute or two once the Ethereum transaction is mined",
    sendTip: "This page is for USDC on Ethereum. You need a little ETH in the same wallet to pay gas, and USDC on Solana is listed separately.",
    addressTip: "ERC-20 USDC is received at a normal 0x Ethereum address.",
    addressShort: "an Ethereum (0x) address",
  },
  XMR: {
    sym: "XMR", label: "Monero", slug: "xmr",
    confirm: "around 20 minutes (Monero deposits are usually accepted after 10 confirmations)",
    sendTip: "Monero transactions can't be reversed or traced back by anyone else, including support, so check the deposit address and amount before you send.",
    addressTip: "Monero addresses are about 95 characters and start with 4 (main address) or 8 (subaddress). A fresh subaddress for each swap keeps your payouts unlinked.",
    addressShort: "a Monero address starting with 4 or 8 (a subaddress is fine)",
  },
  ZEC: {
    sym: "ZEC", label: "Zcash", slug: "zec",
    confirm: "a few minutes to around 20, depending on how many confirmations the route asks for",
    sendTip: "The deposit address is transparent. Shielded wallets can still send to it — the wallet handles that for you.",
    addressTip: "Swap routes usually pay to a transparent Zcash address (t1…). If you want privacy, move the ZEC into your own shielded address after it arrives.",
    addressShort: "a transparent Zcash address starting with t1",
  },
  SOL: {
    sym: "SOL", label: "Solana", slug: "sol",
    confirm: "under a minute",
    sendTip: "Solana transfers are fast and cheap. Keep a small amount of SOL in your wallet for the transaction fee.",
    addressTip: "Solana addresses are 32–44 characters of letters and numbers (no 0x prefix).",
    addressShort: "a Solana address",
  },
  XRP: {
    sym: "XRP", label: "XRP", slug: "xrp",
    confirm: "a few seconds once sent",
    sendTip: "If the deposit screen shows a destination tag or memo, include it. Exchange withdrawals often can't, so send from a wallet you control.",
    addressTip: "XRP addresses start with r. A brand-new address needs the ledger's minimum reserve before it activates, so very small payouts to a new address can fail.",
    addressShort: "an XRP address starting with r",
  },
  DOGE: {
    sym: "DOGE", label: "Dogecoin", slug: "doge",
    confirm: "a few minutes",
    sendTip: "Dogecoin blocks come roughly every minute, so deposits are usually accepted quickly.",
    addressTip: "Dogecoin addresses start with D.",
    addressShort: "a Dogecoin address starting with D",
  },
  LTC: {
    sym: "LTC", label: "Litecoin", slug: "ltc",
    confirm: "around 10 to 15 minutes",
    sendTip: "Send from a standard Litecoin address. MWEB (confidential) balances should be moved back to a normal address in your wallet first.",
    addressTip: "Litecoin addresses start with ltc1, L or M. Use a standard address; MWEB addresses may not be accepted.",
    addressShort: "a Litecoin address starting with ltc1, L or M",
  },
  TON: {
    sym: "TON", label: "Gram (TON)", slug: "ton",
    confirm: "under a minute",
    sendTip: "TON transfers are fast. If you send from an exchange, make sure it sends to the exact deposit address shown, with nothing added.",
    addressTip: "TON addresses start with UQ or EQ. If you're receiving to an exchange account, it will need a comment/memo — sending to your own wallet avoids that problem.",
    addressShort: "a TON address starting with UQ or EQ",
  },
  BNB: {
    sym: "BNB", label: "BNB (BNB Smart Chain)", slug: "bnb",
    confirm: "under a minute",
    sendTip: "This page is for BNB on BNB Smart Chain. Make sure your wallet is sending on BSC, not another network.",
    addressTip: "BNB Smart Chain uses 0x addresses, the same format as Ethereum.",
    addressShort: "a BNB Smart Chain (0x) address",
  },
};

/** Ticker for display — USDT_TRC20 shows as "USDT". */
export function displaySym(id: string): string {
  return COINS[id]?.sym ?? id;
}

// One hand-written line per pair: why people make this swap.
const GENERATED: Array<[from: string, to: string, why: string]> = [
  ["ETH", "XMR", "A common way to move Ethereum holdings into Monero without passing through an exchange that may have delisted it."],
  ["XMR", "ETH", "Useful when you need Ethereum for a payment, a fee or DeFi and your savings sit in Monero."],
  ["USDT", "XMR", "Turns dollar tokens that an issuer can freeze into Monero, which nobody can freeze or trace."],
  ["XMR", "USDT", "Gives you a stable dollar balance on Ethereum without opening an exchange account."],
  ["USDT_TRC20", "XMR", "Tron USDT is how many people get paid. This route turns it into Monero in one step."],
  ["USDC", "XMR", "Moves a USDC balance into Monero, wallet to wallet."],
  ["LTC", "XMR", "Litecoin's fast blocks make this one of the quicker ways into Monero."],
  ["XMR", "LTC", "Litecoin is cheap to send and widely accepted, which makes it a practical way to spend from Monero."],
  ["SOL", "XMR", "Moves Solana holdings into Monero without bridging or an exchange account."],
  ["XMR", "SOL", "Gets you SOL for the Solana ecosystem straight from a Monero wallet."],
  ["DOGE", "XMR", "Turns Dogecoin into Monero in a single swap."],
  ["TON", "XMR", "Moves TON into Monero, wallet to wallet."],
  ["ZEC", "XMR", "Swaps between the two main privacy coins. Fewer routes serve this pair than most, so check the quote before sending."],
  ["XMR", "ZEC", "Swaps between the two main privacy coins. Fewer routes serve this pair than most, so check the quote before sending."],
  ["ZEC", "BTC", "Zcash is delisted from many exchanges; this is how holders move back into Bitcoin without one."],
  ["ETH", "ZEC", "Buys native Zcash with Ethereum, no exchange account and no wrapped token."],
  ["USDT", "ZEC", "Buys Zcash with dollar tokens, wallet to wallet."],
  ["LTC", "ZEC", "Moves Litecoin into Zcash in one step."],
  ["BTC", "USDT", "Locks in a dollar value without selling on an exchange: Bitcoin in, ERC-20 USDT out."],
  ["BTC", "USDC", "Moves Bitcoin into USDC on Ethereum without an exchange account."],
  ["BTC", "SOL", "Gets you SOL straight from a Bitcoin wallet, with no bridge to manage."],
  ["SOL", "BTC", "Takes Solana profits back into Bitcoin, wallet to wallet."],
  ["LTC", "BTC", "Litecoin is often used to receive payments; this moves it into Bitcoin for saving."],
  ["BTC", "DOGE", "Gets you Dogecoin for tipping or payments straight from a Bitcoin wallet."],
  ["DOGE", "BTC", "Moves Dogecoin into Bitcoin without an exchange."],
  ["XRP", "BTC", "Moves XRP into Bitcoin, wallet to wallet."],
  ["BTC", "XRP", "Gets you XRP for fast, cheap transfers straight from a Bitcoin wallet."],
  ["USDT_TRC20", "BTC", "Tron USDT is how many people get paid. This route turns it into Bitcoin in one step."],
  ["BTC", "TON", "Gets you TON for the Telegram ecosystem straight from a Bitcoin wallet."],
  ["TON", "BTC", "Moves TON into Bitcoin without an exchange."],
  ["BNB", "BTC", "Moves BNB off BNB Smart Chain and into Bitcoin."],
  ["ETH", "SOL", "Moves between Ethereum and Solana without using a bridge."],
  ["SOL", "ETH", "Moves between Solana and Ethereum without using a bridge."],
];

function makePair(fromId: string, toId: string, why: string): PairPage | null {
  const f = COINS[fromId];
  const t = COINS[toId];
  if (!f || !t) return null;
  const ticker = (c: CoinFacts) => (c.sym === "USDT" && c.slug === "usdt-trc20" ? "USDT (TRC-20)" : c.sym);
  return {
    slug: `${f.slug}-to-${t.slug}`,
    fromId,
    toId,
    fromLabel: f.label,
    toLabel: t.label,
    title: `Swap ${ticker(f)} to ${ticker(t)} — No Account, No KYC`,
    description:
      `Swap ${f.label} to ${t.label} with live rates from every route that supports the pair. Non-custodial, no account, no KYC for standard swaps, ${FEE_PHRASE}.`,
    intro: `${f.label} in, ${t.label} out, wallet to wallet. ${why}`,
    notes: [f.sendTip, t.addressTip],
    faqs: [
      {
        q: `Can I swap ${f.sym} to ${t.sym} without an account?`,
        a: `Yes. Enter the amount and your ${t.label} address, compare the quotes, then send one ${f.label} deposit from your own wallet. The ${t.label} arrives at your address — no registration, and no KYC for standard swaps.`,
      },
      {
        q: `How long does a ${f.sym} to ${t.sym} swap take?`,
        a: `The ${f.label} deposit usually takes ${f.confirm}. After that, the ${t.label} payout is normally sent within minutes.`,
      },
      {
        q: `What address do I need to receive ${t.sym}?`,
        a: `${t.addressShort[0].toUpperCase()}${t.addressShort.slice(1)}. Use an address in a wallet you control, and check it before you confirm.`,
      },
      { q: `What does the ${f.sym} to ${t.sym} swap cost?`, a: FEE_ANSWER },
      {
        q: "What happens if the swap can't be completed?",
        a: "The funds are returned automatically to your refund address, which is why we recommend entering one even when a route doesn't require it.",
      },
    ],
  };
}

const ALL_PAIRS: PairPage[] = [
  ...HAND_PAIRS.map((p) => ({ ...p, featured: true })),
  ...GENERATED.map(([f, t, why]) => makePair(f, t, why)).filter((p): p is PairPage => p !== null),
];

/** Every pair page that currently has at least one live route. */
export const PAIRS: PairPage[] = ALL_PAIRS.filter(
  (p) => providersForPair(p.fromId, p.toId).length > 0
);

export const PAIR_BY_SLUG = new Map(PAIRS.map((p) => [p.slug, p]));

/** Related pairs for internal links: same coin in or out, featured ones first. */
export function relatedPairs(pair: PairPage, limit = 10): PairPage[] {
  const coins = [pair.fromId, pair.toId];
  return PAIRS.filter((p) => p.slug !== pair.slug)
    .map((p) => ({
      p,
      score: (coins.includes(p.fromId) ? 2 : 0) + (coins.includes(p.toId) ? 2 : 0) + (p.featured ? 1 : 0),
    }))
    .filter((x) => x.score > 1)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.p);
}
