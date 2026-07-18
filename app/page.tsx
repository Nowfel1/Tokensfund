import Link from "next/link";
import Logo from "@/components/Logo";
import SwapTerminal from "@/components/SwapTerminal";
import RateTicker from "@/components/RateTicker";

export const metadata = {
  alternates: { canonical: "/" },
};

const PROTOCOLS = [
  { mark: "TC", name: "THORChain" },
  { mark: "CF", name: "Chainflip" },
  { mark: "NI", name: "NEAR Intents" },
  { mark: "CG", name: "Changee" },
  { mark: "CC", name: "CCE.Cash" },
];

const LATEST_POSTS = [
  {
    tag: "Regulation",
    title: "AscendEX: the custody lesson",
    href: "/blog/ascendex-collapse-mica-custody-lesson-2026",
  },
  {
    tag: "Guide",
    title: "Best BTC → XMR rate in 2026",
    href: "/blog/best-btc-to-xmr-rate-2026",
  },
];

export default function Home() {
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
            <span className="routes-pill"><span className="routes-pill-dot" />5 routes live</span>
          </nav>
        </div>
      </header>

      <RateTicker />

      <section className="hero-2col">
        <div className="hero-2col-text">
          <span className="hero-badge">
            <span className="dot" />
            <span className="txt">NON-CUSTODIAL AGGREGATOR</span>
          </span>
          <h1>
            One swap.<br />
            Every protocol.<br />
            <span className="accent">Best rate.</span>
          </h1>
          <p className="sub">
            TokensFund compares THORChain, Chainflip and NEAR Intents live, then routes your
            swap to the best price. No account. No KYC. Funds never touch our hands.
          </p>
          <div className="hero-ctas">
            <a href="#swap" className="btn-gold">Start swapping</a>
            <a href="#how" className="btn-ghost">How it works</a>
          </div>
          <div className="hero-2col-stats">
            <div className="h2c-stat"><span className="num">5</span><span className="lbl">protocols</span></div>
            <div className="h2c-div" />
            <div className="h2c-stat"><span className="num">15+</span><span className="lbl">assets</span></div>
            <div className="h2c-div" />
            <div className="h2c-stat"><span className="num ok">0</span><span className="lbl">accounts</span></div>
          </div>
        </div>

        <div className="hero-2col-card" id="swap">
          <SwapTerminal />
        </div>
      </section>

      <div className="powered-strip" aria-label="Routing protocols">
        <span className="powered-strip-label">POWERED BY</span>
        {PROTOCOLS.map((p) => (
          <span key={p.mark} className="powered-strip-item">
            <span className="powered-strip-mark">{p.mark}</span>
            {p.name}
          </span>
        ))}
      </div>

      <section className="hiw2" id="how">
        <p className="hiw2-label">HOW IT WORKS</p>
        <h2 className="hiw2-title">Three steps. Zero accounts.</h2>
        <div className="hiw2-grid">
          <div className="hiw2-card">
            <span className="hiw2-step">STEP 01</span>
            <h3>Pick your pair</h3>
            <p>Choose what you send and what you receive — 15+ assets across major chains, privacy coins included.</p>
          </div>
          <div className="hiw2-card">
            <span className="hiw2-step">STEP 02</span>
            <h3>Compare routes</h3>
            <p>Five protocols quoted at once. The best rate wins, with our fee already included in the number you see.</p>
          </div>
          <div className="hiw2-card">
            <span className="hiw2-step">STEP 03</span>
            <h3>Receive in your wallet</h3>
            <p>Send one deposit; funds arrive at your own address automatically. If a swap can&apos;t fill, it refunds to you.</p>
          </div>
        </div>
      </section>

      <div className="blog-chips">
        {LATEST_POSTS.map((p) => (
          <Link key={p.href} href={p.href} className="blog-chip">
            <span className="blog-chip-tag">{p.tag}</span> {p.title}
          </Link>
        ))}
        <Link href="/blog" className="blog-chip more">All posts →</Link>
      </div>

      {/* Independent reviews — links out to third-party listings so visitors
          can verify on neutral ground. No scores hardcoded on purpose:
          ratings live (and change) on the review sites, not here. */}
      <section className="reviews-strip">
        <p className="reviews-strip-label">INDEPENDENTLY LISTED &amp; REVIEWED</p>
        <div className="reviews-strip-row">
          {/* Official Monerica badge (their sanctioned embed, converted to JSX).
              rel is "noopener" WITHOUT noreferrer on purpose — their snippet
              keeps the referrer so Monerica can see the traffic source. */}
          <a
            href="https://monerica.com/site/tokensfund"
            target="_blank"
            rel="noopener"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              padding: "8px 14px",
              fontFamily: "Arial,Helvetica,sans-serif",
              fontSize: "14px",
              fontWeight: "bold",
              lineHeight: 1.2,
              color: "#ffffff",
              backgroundColor: "#1d1d1d",
              border: "1px solid #ff6600",
              borderRadius: "8px",
              textDecoration: "none",
            }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                background: "#ffffff",
                borderRadius: "4px",
                padding: "3px 5px",
                lineHeight: 0,
              }}
            >
              <img
                src="https://cdn.monerica.com/directorycontent/images/monerica-logo.png"
                alt="Monerica"
                height={18}
                style={{ height: "18px", width: "auto", display: "block", border: 0 }}
              />
            </span>
            Review Tokensfund on Monerica
          </a>
        </div>
      </section>
    </main>
  );
}
