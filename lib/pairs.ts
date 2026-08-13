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
      "Compare live BTC to XMR rates across THORChain, NEAR Intents, Changee and CCE.Cash in one place. Non-custodial, no account, no KYC for standard swaps, flat 2% already in the quote.",
    intro:
      "Bitcoin in, Monero out, wallet to wallet. We quote every route that supports the pair and send your swap to the best one — no account, no KYC for standard swaps, and our 2% fee is already inside the number you see.",
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
        a: "A flat 2%, already included in every quote shown. The figure on screen is what you receive, aside from network fees charged by the blockchains themselves.",
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
      "Compare live XMR to BTC rates across every route that supports the pair. Non-custodial, no account, no KYC for standard swaps, flat 2% already in the quote.",
    intro:
      "Monero in, Bitcoin out, wallet to wallet. We quote every provider that serves the pair and route your swap to the best rate — no account, no KYC for standard swaps, 2% already included in the quote.",
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
        a: "A flat 2% is included in the displayed quote, plus the blockchains' own network fees. There are no additional charges revealed later.",
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
      "Compare live BTC to ETH rates across THORChain, Chainflip, NEAR Intents, Changee and CCE.Cash. Non-custodial, no account, no KYC for standard swaps, flat 2% already in the quote.",
    intro:
      "Bitcoin in, Ethereum out, wallet to wallet. This pair is supported by every route we integrate, so the comparison is at its widest — the best rate wins and our 2% is already in the number.",
    notes: [
      "All five providers typically quote this pair, so spreads between routes are usually tighter than on privacy pairs — comparing still routinely finds 1% or more.",
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
        a: "A flat 2%, already included in the quote you see, plus network fees charged by Bitcoin and Ethereum themselves.",
      },
      {
        q: "Do I need a refund address?",
        a: "It is required for some routes and recommended for all of them. If a swap cannot be completed, funds are returned there automatically.",
      },
    ],
  },
];

export const PAIR_BY_SLUG = new Map(PAIRS.map((p) => [p.slug, p]));
