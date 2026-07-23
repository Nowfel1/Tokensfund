// Single source of truth for blog post metadata.
// Imported by app/blog/page.tsx (the index) and app/sitemap/page.tsx (the
// human sitemap). Add new posts HERE — newest first — and both pages update.

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  description: string;
  tag: string;
}

export const POSTS: PostMeta[] = [
  {
    slug: "bitmex-shutdown-orderly-exit-custody-2026",
    title: "BitMEX Is Shutting Down. Even the Best-Case Exchange Ending Puts a Deadline on Your Money",
    date: "July 23, 2026",
    description: "The exchange that invented the perpetual swap closes 23 September — voluntary, orderly, proof-of-reserves intact. It's the opposite of AscendEX, and it still comes with force-closed positions, dormancy fees on unwithdrawn funds, and withdrawal queues. Both kinds of exchange death teach the same lesson.",
    tag: "Markets",
  },
  
  {
    slug: "bitcoin-exchange-outflows-custody-migration-2026",
    title: "$686 Million Left Exchanges in One Day. The Custody Migration Is Showing Up in the Data",
    date: "July 21, 2026",
    description: "July 20 saw nearly $686M in BTC withdrawn from Binance, Coinbase and Bybit — Binance's largest daily net outflow since April. After a year of delistings, collapses and paper-BTC lessons, the coins are walking. What the data shows, what it doesn't, and the question that comes after withdrawal.",
    tag: "Markets",
  },
  {
    slug: "stablecoin-payments-overtake-trading-2026",
    title: "While Washington Debates Stablecoins, 100 Million People Already Use Them as Bank Accounts",
    date: "July 20, 2026",
    description: "US regulators just missed the GENIUS Act's deadline for final stablecoin rules. Meanwhile a self-custodial wallet crossed 100M users and, for the first time, daily payment users outnumbered traders — driven by Nigeria, Argentina and Southeast Asia. What the numbers show, what they don't, and where the KYC comes back.",
    tag: "Markets",
  },
  {
    slug: "bear-market-builders-alpenglow-2026",
    title: "The Market Is in Extreme Fear. The Chains Are Having Their Best Shipping Year",
    date: "July 19, 2026",
    description: "Solana's Alpenglow could cut finality from 12.8s to 150ms as early as Q3 — announced with SOL down 74%. Monero shipped its biggest upgrade ever, Zcash's Ironwood lands this month. Why shipping and price run out of phase, and what that does and doesn't promise.",
    tag: "Markets",
  },
  {
    slug: "clarity-act-us-crypto-limbo-2026",
    title: "Europe Chose Walls. Japan Chose Doors. America Still Can't Choose",
    date: "July 17, 2026",
    description: "Today's CLARITY Act hearing is the last real shot at US market-structure law before summer recess — a year after the bill passed the House and stalled. Why indecision is also a policy, and the one position it can't touch.",
    tag: "Regulation",
  },
  {
    slug: "japan-crypto-bill-regulations-two-blades-2026",
    title: "Japan Is Doing the Opposite of Europe. Regulation Has Two Blades",
    date: "July 15, 2026",
    description: "The same month MiCA culled 93% of Europe's crypto firms, Japan advanced a bill reclassifying crypto as financial instruments, cutting taxes from up to 55% to a flat 20%, and clearing a path for spot ETFs by 2027. Neither blade changes what's in your own wallet.",
    tag: "Regulation",
  },
  {
    slug: "privacy-coins-bull-market-xmr-zec-2026",
    title: "While Bitcoin Slept in Its Box, Privacy Coins Had a Bull Market",
    date: "July 14, 2026",
    description: "XMR set new all-time highs this year. ZEC ran 110% in a month before a vulnerability scare cut it 40%. Privacy is 2026's strongest sector — and the hardest one to buy on a big exchange. The drivers, the risks, and the Ironwood test ahead.",
    tag: "Privacy",
  },
  {
    slug: "bitcoin-307-day-range-2026",
    title: "Bitcoin Has Spent 307 Days in the Same $10K Box. Here's What Long Consolidations Actually Mean",
    date: "July 12, 2026",
    description: "The $60K–$70K band just became the third most-traded range in Bitcoin's history. What happened inside those 307 days, what long consolidations mean, and what holders actually do in the boredom phase.",
    tag: "Markets",
  },
  {
    slug: "crypto-ipo-carnage-casino-vs-chips-2026",
    title: "Buying the Casino Has Been Worse Than Buying the Chips",
    date: "July 11, 2026",
    description: "Gemini −89% from debut, BitGo −77%, Bullish −71%, and the IPO pipeline frozen — while Bitcoin holds up far better than the companies built on top of it. What the crypto-equity carnage says about wrappers vs. the asset.",
    tag: "Markets",
  },
  {
    slug: "ascendex-collapse-mica-custody-lesson-2026",
    title: "AscendEX Died With Its Users' Money Inside. Binance Didn't. The Difference Is the Whole Lesson",
    date: "July 9, 2026",
    description: "The first MiCA casualty took user funds down with it — withdrawals under manual review, and the exchange itself warns users may not get everything back. Why the same deadline hit Binance and AscendEX so differently.",
    tag: "Regulation",
  },
  {
    slug: "stablecoin-flippening-usdc-usdt-2026",
    title: "The Stablecoin Flippening Is Showing Up in the Data",
    date: "July 7, 2026",
    description: "New Visa on-chain data: USDC now carries ~67% of real stablecoin volume vs ~25% for USDT — a complete reversal from 2020. What MiCA's squeeze did to the flows, and why USDT isn't dying anyway.",
    tag: "Markets",
  },
  {
    slug: "best-btc-to-xmr-rate-2026",
    title: "How to Get the Best BTC to XMR Rate in 2026",
    date: "July 6, 2026",
    description: "Rates differ more on BTC→XMR than almost any pair. What actually moves a quote, why sites show different numbers, float vs fixed, and how to compare routes properly — no account, no KYC.",
    tag: "Guide",
  },
  {
    slug: "ansem-trenches-revival-2026",
    title: "$ANSEM and the Trenches Revival: One Token Woke the Whole Casino Up",
    date: "July 5, 2026",
    description: "Pump.fun just hit an 80-day high in launches and one coin did it — $ANSEM, up ~20,000% in a week on a creator-fee airdrop. What happened, why the trenches came back mid-bear, and how to play it without losing your stack.",
    tag: "Trenches",
  },
  {
    slug: "binance-usdt-eu-mica-delisting-2026",
    title: "Binance and USDT Just Lost the EU: What the Delistings Actually Mean",
    date: "July 5, 2026",
    description: "From July 1, Binance suspended EU services after failing to secure a MiCA license, and USDT is off licensed European venues. What's actually banned — less than you think — and what it means for your funds.",
    tag: "Regulation",
  },
  {
    slug: "bitcoin-etf-outflows-paper-btc-vs-real-btc-2026",
    title: "Bitcoin ETFs Just Had Their Worst Month Ever: Paper BTC vs. Real BTC",
    date: "July 2, 2026",
    description: "Spot Bitcoin ETFs bled ~$4.5B in June — their worst month since launch — while BTC hit a 21-month low. What the exodus reveals about paper bitcoin vs. owning the real thing.",
    tag: "Markets",
  },
  {
    slug: "move-crypto-off-exchange-without-kyc-2026",
    title: "How to Move Your Crypto Off an Exchange (and Swap It Without KYC)",
    date: "June 29, 2026",
    description: "A step-by-step self-custody guide: choosing a wallet, backing up your seed phrase, withdrawing safely, and swapping between assets non-custodially with no account and no KYC.",
    tag: "Guide",
  },
  {
    slug: "coinex-sanctions-exchange-surveillance-2026",
    title: "Your Data Is the Honeypot: Why Custodial Exchanges Are a Privacy Liability",
    date: "June 28, 2026",
    description: "A single exchange was linked to $3.84B in flagged flows. The legitimate lesson for law-abiding users: custodial platforms concentrate your data into a target.",
    tag: "Privacy",
  },
  {
    slug: "fear-greed-12-self-custody-bear-market-2026",
    title: "Fear & Greed Hit 12: The Bear-Market Case for Self-Custody",
    date: "June 27, 2026",
    description: "The Crypto Fear & Greed Index fell to 12/100 as Bitcoin broke below $60K. Why self-custody and non-custodial swaps matter most when everyone's panicking.",
    tag: "Markets",
  },
  {
    slug: "mica-deadline-swap-without-exchange-2026",
    title: "The MiCA Deadline Is Here: How to Swap Crypto When Exchanges Get Delisted",
    date: "June 25, 2026",
    description: "On July 1, unlicensed exchanges lose access to 450M EU users. What the cull exposes about custodial risk, and how non-custodial swaps keep your access open.",
    tag: "Regulation",
  },
  {
    slug: "buy-privacy-coins-without-kyc-2026",
    title: "Privacy Coins Are 2026's Top Performers — Buy XMR and ZEC Without KYC",
    date: "June 24, 2026",
    description: "Zcash and Monero are among 2026's best-performing assets — and the hardest to buy on regulated exchanges. Why they're running, why they keep getting delisted, and how to swap into them with no account and no KYC.",
    tag: "Privacy",
  },
  {
    slug: "how-to-swap-crypto-anonymously-2026",
    title: "How to Swap Crypto Anonymously in 2026",
    date: "June 22, 2026",
    description: "What anonymity really means on-chain, why non-custodial swaps protect your privacy, and how to swap with no account and no KYC.",
    tag: "Privacy",
  },
  {
    slug: "why-non-custodial-swaps-protect-privacy-2026",
    title: "Why Non-Custodial Swaps Protect Your Privacy in 2026",
    date: "June 20, 2026",
    description: "Real data on exchange breaches, how non-custodial swaps remove the identity honeypot, and self-custody basics that actually matter.",
    tag: "Privacy",
  },
  {
    slug: "best-crypto-to-buy-june-2026-without-kyc",
    title: "Best Crypto to Buy in June 2026 Without KYC",
    date: "June 19, 2026",
    description: "BTC, ETH, SOL, XRP, HYPE, TON and more - the top cryptocurrencies for June 2026, all swappable without KYC or account creation.",
    tag: "Markets",
  },
  {
    slug: "spacex-ipo-hyperliquid-perpetuals",
    title: "SpaceX's $2 Trillion Debut and the Crypto Bets That Called It Early",
    date: "June 18, 2026",
    description: "SpaceX listed on Nasdaq as SPCX in the biggest IPO in history. Crypto traders on Hyperliquid were pricing in the outcome through perpetual futures weeks before the debut.",
    tag: "Markets",
  },
  {
    slug: "buy-xrp-ltc-hype-tao-without-kyc-2026",
    title: "How to Buy XRP LTC HYPE TAO Without KYC in 2026",
    date: "June 17, 2026",
    description: "Swap XRP, Litecoin, Hyperliquid and Bittensor without KYC. No account required - best rates across NEAR Intents, THORChain, Chainflip and Changee.",
    tag: "Guide",
  },
  {
    slug: "btc-to-eth-without-kyc-2026",
    title: "How to Swap BTC to ETH Without KYC in 2026",
    date: "June 14, 2026",
    description: "Compare THORChain, Chainflip, NEAR Intents and Changee in one click. Swap Bitcoin to Ethereum at the best rate - no account, no KYC.",
    tag: "Guide",
  },
  {
    slug: "cross-chain-swap-without-kyc-2026",
    title: "Cross Chain Swap Without KYC in 2026",
    date: "June 13, 2026",
    description: "Learn how to swap between any chains (BTC, ETH, SOL, etc.) without KYC using THORChain, Chainflip, and NEAR Intents.",
    tag: "Guide",
  },
  {
    slug: "swap-xmr-btc-no-kyc",
    title: "How to Swap XMR to BTC Without KYC in 2026",
    date: "June 12, 2026",
    description: "Compare THORChain, Chainflip and Changee - get the best Monero to Bitcoin rate in seconds, no account required.",
    tag: "Guide",
  },
];
