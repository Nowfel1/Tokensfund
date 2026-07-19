import Logo from "@/components/Logo";
import Link from "next/link";

export const metadata = {
  title: "Sitemap",
  description: "All sections and pages of tokensfund.xyz — swap, track, guides, and every blog post.",
  alternates: { canonical: "/sitemap" },
};

// NOTE: keep this list in sync with app/blog/page.tsx when publishing new
// posts (same title/slug/date — newest first). If the two drift, the sitemap
// silently under-links your newest content.
const POSTS: Array<{ slug: string; title: string; date: string }> = [
  { slug: "bear-market-builders-alpenglow-2026", title: "The Market Is in Extreme Fear. The Chains Are Having Their Best Shipping Year", date: "July 19, 2026" },
  { slug: "clarity-act-us-crypto-limbo-2026", title: "Europe Chose Walls. Japan Chose Doors. America Still Can't Choose", date: "July 17, 2026" },
  { slug: "japan-crypto-bill-regulations-two-blades-2026", title: "Japan Is Doing the Opposite of Europe. Regulation Has Two Blades", date: "July 15, 2026" },
  { slug: "privacy-coins-bull-market-xmr-zec-2026", title: "While Bitcoin Slept in Its Box, Privacy Coins Had a Bull Market", date: "July 14, 2026" },
  { slug: "bitcoin-307-day-range-2026", title: "Bitcoin Has Spent 307 Days in the Same $10K Box. Here's What Long Consolidations Actually Mean", date: "July 12, 2026" },
  { slug: "crypto-ipo-carnage-casino-vs-chips-2026", title: "Buying the Casino Has Been Worse Than Buying the Chips", date: "July 11, 2026" },
  { slug: "ascendex-collapse-mica-custody-lesson-2026", title: "AscendEX Died With Its Users' Money Inside. Binance Didn't. The Difference Is the Whole Lesson", date: "July 9, 2026" },
  { slug: "stablecoin-flippening-usdc-usdt-2026", title: "The Stablecoin Flippening Is Showing Up in the Data", date: "July 7, 2026" },
  { slug: "best-btc-to-xmr-rate-2026", title: "How to Get the Best BTC to XMR Rate in 2026", date: "July 6, 2026" },
  { slug: "ansem-trenches-revival-2026", title: "$ANSEM and the Trenches Revival: One Token Woke the Whole Casino Up", date: "July 5, 2026" },
  { slug: "bitcoin-etf-outflows-paper-btc-vs-real-btc-2026", title: "Bitcoin ETFs Just Had Their Worst Month Ever: Paper BTC vs. Real BTC", date: "July 2, 2026" },
  { slug: "binance-usdt-eu-mica-delisting-2026", title: "Binance and USDT Just Lost the EU: What the Delistings Actually Mean", date: "July 2, 2026" },
  { slug: "fear-greed-12-self-custody-bear-market-2026", title: "Fear & Greed at 12: The Case for Self-Custody in a Bear Market", date: "June 2026" },
  { slug: "mica-deadline-swap-without-exchange-2026", title: "The MiCA Deadline: How to Swap Without an Exchange", date: "June 2026" },
  { slug: "coinex-sanctions-exchange-surveillance-2026", title: "CoinEx, Sanctions, and the Exchange Surveillance Problem", date: "June 2026" },
  { slug: "move-crypto-off-exchange-without-kyc-2026", title: "How to Move Crypto Off an Exchange (Without KYC)", date: "June 2026" },
  { slug: "best-crypto-to-buy-june-2026-without-kyc", title: "Best Crypto to Buy in June 2026 Without KYC", date: "June 2026" },
  { slug: "buy-privacy-coins-without-kyc-2026", title: "How to Buy Privacy Coins Without KYC in 2026", date: "June 2026" },
  { slug: "buy-xrp-ltc-hype-tao-without-kyc-2026", title: "How to Buy XRP, LTC, HYPE and TAO Without KYC", date: "June 2026" },
  { slug: "swap-xmr-btc-no-kyc", title: "How to Swap XMR to BTC Without KYC", date: "June 2026" },
];

const SECTIONS = [
  { href: "/", label: "Swap — compare 5 protocols, best rate wins" },
  { href: "/track", label: "Track — check the status of any swap" },
  { href: "/blog", label: "Blog — guides, market analysis and regulation coverage" },
  { href: "/faq", label: "FAQ — how TokensFund works, fees, and privacy" },
  { href: "/terms", label: "Terms of Service" },
  { href: "/privacy", label: "Privacy Policy" },
];

export default function SitemapPage() {
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
            <Link href="/faq" className="nav-link">FAQ</Link>
          </nav>
        </div>
      </header>

      <article className="blog-post">
        <h1>Sitemap</h1>
        <p>All sections and pages of tokensfund.xyz.</p>

        <h2>Main sections</h2>
        <ul>
          {SECTIONS.map((s) => (
            <li key={s.href}>
              <Link href={s.href}>{s.label}</Link>
            </li>
          ))}
        </ul>

        <h2>Blog posts</h2>
        <ul>
          {POSTS.map((p) => (
            <li key={p.slug}>
              <Link href={"/blog/" + p.slug}>{p.title}</Link>
              {" "}<span style={{ color: "var(--muted-2)", fontSize: "0.85em" }}>({p.date})</span>
            </li>
          ))}
        </ul>

        <p style={{ marginTop: "2rem", color: "var(--muted-2)", fontSize: "0.9em" }}>
          Looking for the machine-readable version? The XML sitemap for search engines lives at{" "}
          <a href="/sitemap.xml">/sitemap.xml</a>.
        </p>
      </article>
    </main>
  );
}
