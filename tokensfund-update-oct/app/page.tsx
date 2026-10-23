import Link from "next/link";
import Script from "next/script";
import Header from "@/components/Header";
import { POSTS } from "@/lib/posts";
import SwapTerminal from "@/components/SwapTerminal";
import RateTicker from "@/components/RateTicker";

export const metadata = {
  alternates: { canonical: "/" },
};

const PROTOCOLS = [
  { mark: "TC", name: "THORChain" },
  { mark: "CF", name: "Chainflip" },
  { mark: "CG", name: "Changee" },
  { mark: "CC", name: "CCE.Cash" },
];

// Auto-derived from lib/posts.ts — the homepage always links the two newest
// posts. This matters beyond looks: the homepage is the most-crawled page, so
// a link here is how new posts get discovered and indexed fastest. Chip titles
// are truncated to keep the strip compact.
function chipTitle(title: string, max = 48): string {
  if (title.length <= max) return title;
  const cut = title.slice(0, max);
  return cut.slice(0, cut.lastIndexOf(" ")) + "\u2026";
}

const LATEST_POSTS = POSTS.slice(0, 2).map((p) => ({
  tag: p.tag,
  title: chipTitle(p.title),
  href: "/blog/" + p.slug,
}));

export default function Home() {
  return (
    <main className="wrap">
      <Header showRoutes />

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
            TokensFund compares THORChain, Chainflip, Changee and CCE.Cash live, then routes your
            swap to the best price. No account. No KYC. Funds never touch our hands.
          </p>
          <div className="hero-ctas">
            <a href="#swap" className="btn-gold">Start swapping</a>
            <a href="#how" className="btn-ghost">How it works</a>
          </div>
          <div className="hero-2col-stats">
            <div className="h2c-stat"><span className="num">4</span><span className="lbl">routes</span></div>
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
            <p>Four routes quoted at once. The best rate wins, with our fee already included in the number you see.</p>
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

      {/* Monerica's official badge, exactly as their listing provides it. */}
      <div className="reviews-strip">
        <div className="reviews-strip-row">
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
          {/* Trustpilot's official Review Collector. The free plan only has the
              light theme, so it sits on its own row under the Monerica badge. */}
          <div
            className="trustpilot-widget"
            data-locale="en-US"
            data-template-id="56278e9abfbbba0bdcd568bc"
            data-businessunit-id="6a3d464b9af2e359f1a069ec"
            data-style-height="52px"
            data-style-width="100%"
            data-token="31a2e6b0-8262-46b2-88ee-ddddf3c5cee4"
            style={{ width: "240px", flex: "0 0 auto" }}
          >
            <a href="https://www.trustpilot.com/review/tokensfund.xyz" target="_blank" rel="noopener">
              Trustpilot
            </a>
          </div>
        </div>
      </div>
      <Script
        src="https://widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js"
        strategy="afterInteractive"
      />

    </main>
  );
}
