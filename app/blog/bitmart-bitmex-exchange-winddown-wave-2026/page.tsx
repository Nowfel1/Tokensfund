import Logo from "@/components/Logo";
import Link from "next/link";

export const metadata = {
  title: "Two Exchanges Announced Their Deaths in One Week. Read the Exit Terms Side by Side",
  description:
    "BitMEX on July 23. BitMart on July 26. Both orderly, both 'strategic' — and the exit doors read very differently. BitMart's withdrawal terms include KYC verification, source-of-funds review, and proof you own your own wallet address. What the wind-down wave says about the venue layer, and the one account that never publishes a closure notice.",
  keywords: [
    "BitMart shutting down 2026",
    "BitMart wind down withdrawal",
    "BitMEX BitMart closure week",
    "exchange shutdowns 2026",
    "withdraw from BitMart KYC",
  ],
  alternates: { canonical: "/blog/bitmart-bitmex-exchange-winddown-wave-2026" },
  openGraph: {
    type: "article",
    url: "/blog/bitmart-bitmex-exchange-winddown-wave-2026",
    title: "Two Exchanges Announced Their Deaths in One Week. Read the Exit Terms Side by Side",
    description:
      "BitMEX July 23, BitMart July 26. Both orderly — and BitMart's exit door checks your papers. What the wind-down wave means.",
    images: [{ url: "https://tokensfund.xyz/blog/banner_two_winddowns.png", width: 1200, height: 400 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Two Exchanges Announced Their Deaths in One Week. Read the Exit Terms Side by Side",
    description:
      "BitMEX July 23, BitMart July 26. Both orderly — and BitMart's exit door checks your papers. What the wind-down wave means.",
    images: ["https://tokensfund.xyz/blog/banner_two_winddowns.png"],
  },
};

export default function Post() {
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

      <article className="blog-post">
        <div className="blog-post-meta">
          <span className="blog-tag">Markets</span>
          <span className="blog-date">July 26, 2026</span>
        </div>

        <h1>Two Exchanges Announced Their Deaths in One Week. Read the Exit Terms Side by Side</h1>

        <img
          src="/blog/banner_two_winddowns.png"
          alt="Two exchanges winding down in the same week with very different exit doors"
          className="blog-banner"
          style={{ width: "100%", height: "auto", borderRadius: "12px", marginBottom: "2rem" }}
        />

        <p>
          On July 23, <Link href="/blog/bitmex-shutdown-orderly-exit-custody-2026">BitMEX — the
          inventor of the perpetual swap — announced its closure</Link>. Three days later, this
          morning, BitMart followed: an &quot;orderly wind-down&quot; after &quot;careful
          evaluation of the Company&apos;s operating conditions, market environment, and future
          strategic direction.&quot; Registrations, <em>deposits</em>, and new orders begin
          suspending today; all trading ends August 26; the platform ceases entirely on January
          31, 2027.
        </p>
        <p>
          One closure is a story about a company. Two in seventy-two hours is a story about the
          layer. And reading the two wind-down notices side by side teaches more about custody
          than any thousand-word warning we could write — because these are the <em>orderly</em>
          endings, the good ones, and they still differ in a way every exchange user should see.
        </p>

        <h2>The week&apos;s tally, and the year&apos;s</h2>
        <p>
          Zoom out before zooming in. In 2026 so far: MiCA&apos;s licensing wall{" "}
          <Link href="/blog/binance-usdt-eu-mica-delisting-2026">cleared roughly 7% of
          Europe&apos;s crypto firms</Link>.{" "}
          <Link href="/blog/ascendex-collapse-mica-custody-lesson-2026">AscendEX collapsed with
          user funds inside</Link>. The listed crypto companies{" "}
          <Link href="/blog/crypto-ipo-carnage-casino-vs-chips-2026">trade 70–90% below their
          debuts</Link>. And now, in one July week, two long-running exchanges — the derivatives
          pioneer and a retail altcoin venue that once reported nine million users — have
          scheduled their own endings, both citing strategy and market conditions rather than any
          crisis. Days ago we wrote that{" "}
          <Link href="/blog/bitcoin-exchange-outflows-custody-migration-2026">the coins are
          walking</Link>. This week, the venues started holding the door.
        </p>

        <h2>Two orderly exits, two very different doors</h2>
        <p>
          Credit first, as always: both notices are responsible documents. Both give timelines.
          Both warn loudly about phishing — no &quot;expedited withdrawal&quot; services exist,
          nobody legitimate will ever ask for your keys or codes. Both are the opposite of the
          AscendEX trapdoor. If every exchange died this politely, custodial risk would be a
          smaller topic.
        </p>
        <p>
          Now the difference. BitMEX&apos;s exit terms are about <em>throughput</em>: withdraw
          any time, expect queues from its fixed address pool, assets exceed liabilities per its
          proof-of-reserves page. BitMart&apos;s Section II is about <em>clearance</em>. Before
          your withdrawal is processed, the notice says requests &quot;may be subject to further
          review&quot; including: verification of KYC information; login devices and IP
          addresses; the withdrawal address itself; <strong>the source of your funds and trading
          history</strong>; Travel Rule and sanctions screening; and &quot;where necessary,&quot;
          documentation up to and including <strong>proof of ownership of the withdrawal
          address</strong>. Users are told to &quot;complete or update identity verification&quot;
          as step two of leaving. Submitting a withdrawal request, the notice clarifies,
          &quot;does not mean the review has been completed.&quot;
        </p>
        <p>
          To be scrupulously fair: most of that list is standard AML machinery that large
          custodial exchanges apply to flagged withdrawals every ordinary day, and BitMart
          presenting it transparently is better than springing it silently. But that&apos;s
          precisely the lesson. <Link href="/blog/coinex-sanctions-exchange-surveillance-2026">We
          called custodial platforms data honeypots</Link> for what they accumulate. A wind-down
          shows you the other face of the same machine: when everyone heads for the exit at once,
          the compliance layer stands between every single user and their own coins — identity,
          device history, source of funds, papers for the wallet you&apos;re withdrawing to. Your
          assets, released upon presentation of documents, on a timeline the reviewer controls.
        </p>

        <h2>What we don&apos;t know, said plainly</h2>
        <p>
          Neither company has given a fuller &quot;why&quot; than strategy and market conditions,
          and we won&apos;t invent one. BitMart&apos;s notice makes no insolvency admission and
          says withdrawals remain available — take that at face value. What can be said factually:
          its recent announcement history shows a platform trimming for months (margin trading
          discontinued, market-making bots suspended, a U.S.-services notice, custody fees for
          inactive accounts), and unlike BitMEX, today&apos;s notice references no proof-of-reserves
          page. Draw conclusions carefully; better yet, don&apos;t draw them — <em>act</em> on the
          part that isn&apos;t uncertain, which is the calendar.
        </p>

        <h2>If you have funds on BitMart</h2>
        <p>
          The notice&apos;s own advice is correct and urgent: <strong>deposits suspend starting
          today</strong> — send nothing to BitMart addresses from here on, as late deposits
          &quot;may not be automatically credited.&quot; Close positions and submit withdrawals
          well before August 26; the recommended window is now, not the deadline, because review
          queues grow with the crowd. Verify networks and destination addresses twice — a
          wind-down is the worst possible time for a wrong-chain deposit. Download your trade and
          transaction history while the interface exists; you may want it for taxes long after
          January 31. And treat every DM, Telegram message, or &quot;priority processing&quot;
          offer as the scam BitMart explicitly warns it is.
        </p>
        <p>
          Then the standing question, sharper after this week than ever:{" "}
          <em>withdrawn to your own wallet — how do you keep managing a portfolio without
          depositing onto the next venue that will someday publish one of these notices?</em>{" "}
          That&apos;s the gap TokensFund closes: swaps compared across THORChain, Chainflip, NEAR
          Intents, Changee and CCE.Cash, executed wallet to wallet — no account, no KYC for
          standard swaps, flat 2% in the quote, automatic refund to your own address if a swap
          can&apos;t fill. No balance sitting anywhere that can schedule a closure, gate your
          exit, or ask for papers to release what&apos;s yours. Start with the{" "}
          <Link href="/blog/move-crypto-off-exchange-without-kyc-2026">self-custody guide</Link>{" "}
          if you&apos;re making the move for the first time.
        </p>

        <h2>A note on risk</h2>
        <p>
          Nothing here is financial advice. Details are from BitMart&apos;s and BitMEX&apos;s
          official notices as of July 26, 2026; wind-down terms can be updated and the
          companies&apos; own channels are authoritative. No insolvency is alleged of either
          platform. Self-custody transfers risk to you rather than removing it: back up keys,
          verify addresses, send test amounts — and during wind-down season, assume anyone who
          contacts you first about your funds is lying.
        </p>

        <div className="blog-cta">
          <p>No closure dates. No exit reviews. Your keys.</p>
          <Link
            href="/swap/btc-to-eth"
            style={{
              display: "inline-block",
              textDecoration: "none",
              background: "var(--gold)",
              color: "#000",
              fontWeight: "700",
              padding: "12px 28px",
              borderRadius: "8px",
              fontSize: "1rem",
            }}
          >
            Swap wallet-to-wallet →
          </Link>
        </div>
      </article>
    </main>
  );
}
