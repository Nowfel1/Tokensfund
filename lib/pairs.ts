// Transactional pair pages: /swap/<slug>
//
// These target the moment someone wants to swap ("swap btc to xmr") rather
// than the research phase the blog serves. Each page prefills the terminal
// with the pair, so the visitor lands one field away from a quote.
//
// Adding a pair: add an entry here. The route, metadata, FAQ schema and
// sitemap all derive from it. Keep `faqs` genuinely useful — they carry the
// FAQPage structured data.

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
}

export const PAIRS: PairPage[] = [
  {
    slug: "btc-to-xmr",
    fromId: "BTC",
    toId: "XMR",
    fromLabel: "Bitcoin",
    toLabel: "Monero",
    title: "Swap BTC to XMR — No Account, No KYC",
    description:
      "Compare live BTC to XMR rates across THORChain, NEAR Intents, Changee and CCE.Cash in one place. Non-custodial, no account, no KYC for standard swaps, flat 1% already in the quote.",
    intro:
      "Bitcoin in, Monero out, wallet to wallet. We quote every route that supports the pair and send your swap to the best one — no account, no KYC for standard swaps, and our 1% fee is already inside the number you see.",
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
        a: "A flat 1%, already included in every quote shown. The figure on screen is what you receive, aside from network fees charged by the blockchains themselves.",
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
      "Compare live XMR to BTC rates across every route that supports the pair. Non-custodial, no account, no KYC for standard swaps, flat 1% already in the quote.",
    intro:
      "Monero in, Bitcoin out, wallet to wallet. We quote every provider that serves the pair and route your swap to the best rate — no account, no KYC for standard swaps, 1% already included in the quote.",
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
        a: "A flat 1% is included in the displayed quote, plus the blockchains' own network fees. There are no additional charges revealed later.",
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
      "Compare live BTC to ETH rates across THORChain, Chainflip, NEAR Intents, Changee and CCE.Cash. Non-custodial, no account, no KYC for standard swaps, flat 1% already in the quote.",
    intro:
      "Bitcoin in, Ethereum out, wallet to wallet. This pair is supported by every route we integrate, so the comparison is at its widest — the best rate wins and our 1% is already in the number.",
    notes: [
      "All four providers typically quote this pair, so spreads between routes are usually tighter than on privacy pairs — comparing still routinely finds 1% or more.",
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
        a: "A flat 1%, already included in the quote you see, plus network fees charged by Bitcoin and Ethereum themselves.",
      },
      {
        q: "Do I need a refund address?",
        a: "It is required for some routes and recommended for all of them. If a swap cannot be completed, funds are returned there automatically.",
      },
    ],
  },
  // [NEAR DISABLED 2026-08-17] btc-to-zec removed: ZEC's only route was NEAR
  // Intents. Restore this block when ZEC has a working route again.
  // {
  //   slug: "btc-to-zec",
  //   fromId: "BTC",
  //   toId: "ZEC",
  //   fromLabel: "Bitcoin",
  //   toLabel: "Zcash",
  //   title: "Swap BTC to ZEC — No Account, No KYC",
  //   description:
  //     "Swap Bitcoin for Zcash without an account or KYC. Live quotes from every route that supports the pair, non-custodial, flat 1% already in the quote.",
  //   intro:
  //     "Bitcoin in, Zcash out, wallet to wallet. Zcash is delisted from many custodial venues, so the routes that serve it are fewer than for major pairs — we show you every one that does, and send your swap to the best rate.",
  //   notes: [
  //     "ZEC has fewer routes than most pairs because of exchange delistings — expect a shorter comparison list, not a worse rate.",
  //     "Zcash addresses come in transparent (t1...), shielded (zs...) and unified (u1...) forms. Swap routes usually deliver to transparent addresses.",
  //     "If privacy is your reason for buying ZEC, move the funds into your own shielded address after they arrive — that final hop is where the privacy actually begins.",
  //   ],
  //   faqs: [
  //     {
  //       q: "Can I buy Zcash without KYC?",
  //       a: "Yes. The swap runs from your Bitcoin wallet to a one-time deposit address and delivers ZEC to an address you control. No registration and no KYC for standard swaps.",
  //     },
  //     {
  //       q: "Will my ZEC be shielded?",
  //       a: "Not automatically. Most swap routes deliver to a transparent address, which behaves like a Bitcoin address — amounts and history are visible. To use Zcash's privacy, move the received funds to your own shielded address inside your wallet.",
  //     },
  //     {
  //       q: "Why are there fewer routes for ZEC than for other coins?",
  //       a: "Privacy assets have been delisted from many custodial platforms, which fragmented liquidity. We only show routes that genuinely support the pair rather than padding the list.",
  //     },
  //     {
  //       q: "What does it cost?",
  //       a: "A flat 1%, already included in the quote you see, plus the network fees charged by Bitcoin and Zcash themselves.",
  //     },
  //   ],
  // },
  {
    slug: "eth-to-btc",
    fromId: "ETH",
    toId: "BTC",
    fromLabel: "Ethereum",
    toLabel: "Bitcoin",
    title: "Swap ETH to BTC — No Account, No KYC",
    description:
      "Compare live ETH to BTC rates across every integrated route. Non-custodial, no account, no KYC for standard swaps, flat 1% already in the quote.",
    intro:
      "Ethereum in, Bitcoin out, wallet to wallet. This is one of the most widely supported pairs we route, so the comparison runs deep — the best rate wins and our 1% is already inside the number you see.",
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
        q: "Are there fees beyond the 1%?",
        a: "Only the blockchains' own network fees. Ethereum gas is paid by you when you send the deposit, and the Bitcoin payout carries a standard mining fee.",
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
      "Swap Tether for Bitcoin without an account or KYC. Live quotes across every supporting route, non-custodial, flat 1% already in the quote.",
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
      "Compare live BTC to LTC rates across every integrated route. Non-custodial, no account, no KYC for standard swaps, flat 1% already in the quote.",
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
        a: "A flat 1%, already included in the quote shown, plus each blockchain's own network fee.",
      },
      {
        q: "Do you support MWEB addresses?",
        a: "Support depends on the individual route. If a quote does not appear for an MWEB address, use a standard Litecoin address and move funds to MWEB inside your own wallet afterwards.",
      },
    ],
  },
];

export const PAIR_BY_SLUG = new Map(PAIRS.map((p) => [p.slug, p]));
