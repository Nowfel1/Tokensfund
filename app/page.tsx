import SwapTerminal from "@/components/SwapTerminal";
import Logo from "@/components/Logo";

export default function Home() {
  return (
    <main className="wrap">
      <header className="masthead">
        <div className="brand">
          <Logo size={34} />
          <span>tokensfund<span className="tld">.xyz</span></span>
        </div>
        <p className="tagline">
          One intent, three liquidity networks. We quote THORChain, Chainflip and NEAR Intents
          at once and route your swap to the best price — without ever holding your funds.
        </p>
      </header>

      <SwapTerminal />

      <p className="foot">
        Non-custodial. You send to a one-time deposit address and receive at your own wallet,
        or get refunded. <strong>tokensfund never takes custody of your assets.</strong>
      </p>

      {/* HOW IT WORKS */}
      <section className="hiw">
        <div className="hiw-head">
          <span className="hiw-label">PROCESS</span>
          <h2 className="hiw-title">How it works</h2>
          <p className="hiw-sub">Four steps. No account. No waiting.</p>
        </div>
        <div className="hiw-grid">
          <div className="hiw-card">
            <span className="hiw-num">01</span>
            <svg className="hiw-icon" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
            <h3>Get a quote</h3>
            <p>Select the crypto you send and want to receive. Enter the amount to see a live estimated output.</p>
          </div>
          <div className="hiw-card">
            <span className="hiw-num">02</span>
            <svg className="hiw-icon" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <h3>Confirm</h3>
            <p>Review the rate, estimated output, and duration. Confirm to generate your unique deposit address.</p>
          </div>
          <div className="hiw-card">
            <span className="hiw-num">03</span>
            <svg className="hiw-icon" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
            <h3>Send funds</h3>
            <p>Send the exact amount to the deposit address from your own wallet. A standard on-chain transfer.</p>
          </div>
          <div className="hiw-card">
            <span className="hiw-num">04</span>
            <svg className="hiw-icon" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" /><polyline points="19 12 12 19 5 12" />
            </svg>
            <h3>Receive crypto</h3>
            <p>Your swapped funds are sent automatically to your destination address. Track progress in real time.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
