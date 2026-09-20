import Logo from "@/components/Logo";
import Link from "next/link";

export const metadata = {
  title: "BitMEX Closes in Three Days: The Withdrawal Checklist",
  description:
    "BitMEX ceases operations on 23 September 2026 at 04:00 UTC. Positions still open will be force-closed, and KYC-verified users who leave a balance face a fee of 1% a year or $50 — whichever is greater. What to do now, and the trap that catches small balances.",
  keywords: [
    "BitMEX closure September 23",
    "BitMEX withdraw funds deadline",
    "BitMEX shutdown checklist",
    "BitMEX account fee",
    "BitMEX force close positions",
  ],
  alternates: { canonical: "/blog/bitmex-closes-in-three-days-checklist-2026" },
  openGraph: {
    type: "article",
    url: "/blog/bitmex-closes-in-three-days-checklist-2026",
    title: "BitMEX Closes in Three Days: The Withdrawal Checklist",
    description:
      "23 September, 04:00 UTC. Positions force-closed, and a $50-minimum annual fee on anything left behind. What to do now.",
    images: [{ url: "https://tokensfund.xyz/blog/banner_bitmex_deadline.png", width: 1200, height: 400 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "BitMEX Closes in Three Days: The Withdrawal Checklist",
    description:
      "23 September, 04:00 UTC. Positions force-closed, and a $50-minimum annual fee on anything left behind. What to do now.",
    images: ["https://tokensfund.xyz/blog/banner_bitmex_deadline.png"],
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
          <span className="blog-date">September 20, 2026</span>
        </div>

        <h1>BitMEX Closes in Three Days</h1>

        <img
          src="/blog/banner_bitmex_deadline.png"
          alt="A countdown to the BitMEX closure deadline"
          className="blog-banner"
          style={{ width: "100%", height: "auto", borderRadius: "12px", marginBottom: "2rem" }}
        />

        <p className="warn" style={{ marginBottom: "1.75rem" }}>
          <strong>Deadline: Wednesday 23 September 2026, 04:00 UTC.</strong> If you still hold a
          balance or an open position on BitMEX, act today rather than Tuesday night. Everything
          below is drawn from BitMEX&apos;s own notices — their site is the authoritative source.
        </p>

        <p>
          In July we wrote that{" "}
          <Link href="/blog/bitmex-shutdown-orderly-exit-custody-2026">even the best-case exchange
          ending puts a deadline on your money</Link>. That deadline is now three days out. BitMEX
          — the venue that invented the perpetual swap, ran for eleven years, and never lost a coin
          to a hack — stops being an exchange on Wednesday morning.
        </p>

        <h2>The checklist</h2>
        <ul>
          <li><strong>Close any open position yourself, now.</strong> Reduce-only has been in force since 26 August, so you can only close or reduce. Anything still open at 04:00 UTC on Wednesday is <em>force-closed</em> at whatever price the wind-down produces. Closing it yourself is the difference between choosing your exit and accepting one.</li>
          <li><strong>Withdraw everything.</strong> Don&apos;t leave a residual balance because it feels small — see the fee trap below.</li>
          <li><strong>Verify the destination address character by character.</strong> Wind-downs are peak season for clipboard malware and fake &quot;recovery&quot; services, and an irreversible transfer at a deadline is the worst possible time to be casual.</li>
          <li><strong>Send a test amount first</strong> if the balance is meaningful. The minutes it costs are cheap against the alternative.</li>
          <li><strong>Download your trade and transaction history</strong> while the interface still exists. You may need it for tax filings long after the site is gone.</li>
          <li><strong>Ignore anyone who contacts you.</strong> No legitimate service offers expedited withdrawals, priority processing, or recovery assistance. BitMEX warned about this explicitly in its own notice.</li>
        </ul>

        <h2>The trap that catches small balances</h2>
        <p>
          This is the detail most coverage skips, and it matters most to the people least likely to
          act.
        </p>
        <p>
          After the closure, KYC-verified users who leave assets behind are charged an account fee
          of <strong>1% per year or USD 50 equivalent — whichever is greater</strong>, billed
          monthly. Read that again with a small balance in mind. If you have $40 sitting there, the
          <em> minimum</em> fee already exceeds the entire balance. A dust balance doesn&apos;t
          slowly erode; it is wiped out and then some.
        </p>
        <p>
          Worse, reporting on the withdrawal schedule suggests that for a number of the supported
          assets, the withdrawal fee sits at or above the minimum withdrawal amount — meaning some
          small balances may not be economically withdrawable at all. If you are in that position,
          the honest answer is that the money is effectively gone either way, and the only decision
          left is whether you spend an hour discovering that.
        </p>
        <p>
          Check your balance today. If it is small, withdraw it anyway if the fee schedule allows,
          because the alternative is a charge that outgrows it.
        </p>

        <h2>What happens after Wednesday</h2>
        <p>
          The exchange stops trading, but the site does not vanish. BitMEX has said accounts remain
          accessible in withdrawal-only mode: you can log in, see your balance and history, and
          withdraw. So missing the deadline is not the same as losing access — it is the difference
          between leaving cleanly and paying rent on the way out.
        </p>
        <p>
          The other open question is the insurance fund, reported at around $270 million, which
          historically backstopped socialised losses on the platform. What becomes of it in a
          wind-down is not something we can tell you, and we would treat confident claims about it
          with suspicion.
        </p>

        <h2>The part worth remembering afterwards</h2>
        <p>
          BitMEX is closing about as well as an exchange can close. Two months&apos; notice, a
          published schedule, proof of reserves, explicit scam warnings, withdrawals open past the
          deadline, and eleven years without losing customer funds to an attacker. Compare that to{" "}
          <Link href="/blog/ascendex-collapse-mica-custody-lesson-2026">AscendEX, which died with
          user funds inside</Link>, and the difference is enormous.
        </p>
        <p>
          And still — force-closed positions at a price you didn&apos;t choose, a fee that consumes
          small balances, a calendar you didn&apos;t set. That was the point of the original piece
          and it holds now that the date has arrived: <em>an exchange balance is an account on
          someone else&apos;s timeline.</em> In the bad ending the timeline belongs to a
          bankruptcy court. In the good ending it belongs to a wind-down schedule. There is no
          version where it is yours, except the one where the coins are already in your wallet.
        </p>
        <p>
          BitMart&apos;s own wind-down{" "}
          <Link href="/blog/bitmart-bitmex-exchange-winddown-wave-2026">runs to January</Link>, so
          if you hold balances there too, the same checklist applies with more time on the clock.
        </p>
        <p>
          Once your coins are out, moving between assets doesn&apos;t require going back to a
          venue with a closure date. TokensFund compares THORChain, Chainflip, Changee and CCE.Cash
          and routes wallet to wallet — no account, no KYC for standard swaps, flat 1% inside the
          quote, refunds to your own address if a route can&apos;t fill.
        </p>

        <h2>A note on risk</h2>
        <p>
          Nothing here is financial advice. Details reflect BitMEX&apos;s published notices and
          contemporaneous reporting as of 20 September 2026; timings and fee terms may be updated
          by BitMEX, and <strong>their own announcements are the authoritative source</strong> for
          anything affecting your account. Crypto withdrawals are irreversible — verify addresses,
          send test amounts, and assume anyone contacting you first about your funds is lying.
        </p>

        <div className="blog-cta">
          <p>Withdrawn? Don&apos;t deposit to the next one</p>
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
            Compare routes →
          </Link>
        </div>
      </article>
    </main>
  );
}
