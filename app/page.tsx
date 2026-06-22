import SwapTerminal from "@/components/SwapTerminal";
import Logo from "@/components/Logo";

export default function Home() {
  return (
    <main className="wrap">
      <header className="masthead">
        <div className="header-inner">
          <div className="brand">
            <Logo size={34} />
            <span>tokensfund<span className="tld">.xyz</span></span>
          </div>
          <nav className="main-nav">
            <a href="/" className="nav-link">Swap</a>
            <a href="/blog" className="nav-link">Blog</a>
          </nav>
        </div>
      </header>

      <section className="hero">
        <div className="hero-badge">
          <span className="dot" />
          <span className="txt">NON-CUSTODIAL SWAP AGGREGATOR</span>
        </div>

        <h1>
          Stop guessing which<br />
          protocol gives the<br />
          <span className="accent">best rate.</span>
        </h1>

        <p className="sub">
          TokensFund compares THORChain, Chainflip and NEAR Intents live, every time you swap.
          No account. No KYC. Funds never touch our hands.
        </p>

        <div className="hero-stats">
          <div className="hero-stat">
            <span className="num">5</span>
            <span className="lbl">protocols compared</span>
          </div>
          <div className="hero-stat">
            <span className="num">15+</span>
            <span className="lbl">assets supported</span>
          </div>
          <div className="hero-stat">
            <span className="num ok">0</span>
            <span className="lbl">accounts required</span>
          </div>
        </div>
      </section>

      <SwapTerminal />

      <p className="foot">
        Non-custodial. You send to a one-time deposit address and receive at your own wallet,
        or get refunded. <strong>tokensfund never takes custody of your assets.</strong>
      </p>

      <section className="hiw">
        <div className="hiw-head">
          <span className="hiw-label">HOW IT WORKS</span>
          <h2 className="hiw-title">Four steps. Zero accounts.</h2>
          <p className="hiw-sub">From quote to wallet, with no sign-up at any point.</p>
        </div>
        <div className="hiw-list">
          <div className="hiw-row">
            <div className="hiw-icon-badge c-gold">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f4c64e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" />
              </svg>
            </div>
            <div>
              <div className="hiw-step">STEP 01</div>
              <h3>Get a quote</h3>
              <p>Pick what you're sending and receiving. See a live estimate instantly.</p>
            </div>
          </div>
          <div className="hiw-row">
            <div className="hiw-icon-badge c-violet">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9b9cf5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <div>
              <div className="hiw-step">STEP 02</div>
              <h3>Confirm the rate</h3>
              <p>Review the best route. Confirm to generate your deposit address.</p>
            </div>
          </div>
          <div className="hiw-row">
            <div className="hiw-icon-badge c-green">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5fd6a6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </div>
            <div>
              <div className="hiw-step">STEP 03</div>
              <h3>Send funds</h3>
              <p>Send from your own wallet. A standard on-chain transfer, nothing custom.</p>
            </div>
          </div>
          <div className="hiw-row">
            <div className="hiw-icon-badge c-gold">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f4c64e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" /><polyline points="19 12 12 19 5 12" />
              </svg>
            </div>
            <div>
              <div className="hiw-step">STEP 04</div>
              <h3>Receive crypto</h3>
              <p>Funds land in your destination wallet automatically. Track it live.</p>
            </div>
          </div>
        </div>
      </section>

      <div className="social-row">
        <a className="social-btn" href="https://x.com/Tokensfund" target="_blank" rel="noopener noreferrer">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.261 5.638 5.903-5.638zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          Follow on X
        </a>
        <a className="social-btn" href="https://t.me/Tokensfund" target="_blank" rel="noopener noreferrer">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248-1.97 9.289c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L8.048 14.6l-2.948-.924c-.64-.203-.654-.64.136-.95l11.527-4.448c.535-.194 1.003.131.8.97z"/></svg>
          Join Telegram
        </a>
      </div>

    </main>
  );
}
