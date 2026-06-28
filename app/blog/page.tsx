import Link from "next/link";
import Logo from "@/components/Logo";

export const metadata = {
  title: "Blog - Crypto Swap Guides",
  description: "Guides and tutorials on how to swap crypto without KYC using THORChain, Chainflip, NEAR Intents, Changee and CCE.Cash.",
  alternates: { canonical: "/blog" },
};

const posts = [
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

export default function Blog() {
  return (
    <main className="wrap">
      <header className="masthead">
        <div className="header-inner">
          <Link href="/" className="brand">
            <Logo size={34} />
            <span>tokensfund<span className="tld">.xyz</span></span>
          </Link>
          <nav className="main-nav">
            <Link href="/" className="nav-link">Swap</Link>
            <Link href="/track" className="nav-link">Track</Link>
            <Link href="/blog" className="nav-link">Blog</Link>
          </nav>
        </div>
      </header>
      <section className="blog-index">
        <h1 className="blog-index-title">Blog</h1>
        <p className="blog-index-sub">Crypto swap guides, tips and updates.</p>
        <div className="blog-list">
          {posts.map((p) => (
            <Link key={p.slug} href={"/blog/" + p.slug} className="blog-card">
              <span className="blog-tag">{p.tag}</span>
              <h2>{p.title}</h2>
              <p>{p.description}</p>
              <span className="blog-date">{p.date}</span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
