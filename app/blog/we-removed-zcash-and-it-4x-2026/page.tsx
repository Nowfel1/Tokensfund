import Logo from "@/components/Logo";
import Link from "next/link";

export const metadata = {
  title: "We Removed Zcash Six Weeks Ago. It's Up Roughly 4x Since",
  description:
    "In August we dropped ZEC rather than keep routing users through a provider with unresolved stuck funds. Zcash has since gone from about $400 to $1,609 and into the top ten. An honest accounting of what that decision cost, why it was still right, and what actually drove the run.",
  keywords: [
    "zcash price 2026",
    "ZEC all time high",
    "zcash ironwood orchard migration",
    "zec short squeeze",
    "buy zcash without KYC",
  ],
  alternates: { canonical: "/blog/we-removed-zcash-and-it-4x-2026" },
  openGraph: {
    type: "article",
    url: "/blog/we-removed-zcash-and-it-4x-2026",
    title: "We Removed Zcash Six Weeks Ago. It's Up Roughly 4x Since",
    description:
      "We dropped ZEC rather than route users through a provider we didn't trust. It went from ~$400 to $1,609. An honest accounting.",
    images: [{ url: "https://tokensfund.xyz/blog/banner_zec_4x.png", width: 1200, height: 400 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "We Removed Zcash Six Weeks Ago. It's Up Roughly 4x Since",
    description:
      "We dropped ZEC rather than route users through a provider we didn't trust. It went from ~$400 to $1,609. An honest accounting.",
    images: ["https://tokensfund.xyz/blog/banner_zec_4x.png"],
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
          <span className="blog-tag">Privacy</span>
          <span className="blog-date">September 22, 2026</span>
        </div>

        <h1>We Removed Zcash Six Weeks Ago. It&apos;s Up Roughly 4x Since</h1>

        <img
          src="/blog/banner_zec_4x.png"
          alt="Zcash's price rising steeply after the point where it was delisted from the site"
          className="blog-banner"
          style={{ width: "100%", height: "auto", borderRadius: "12px", marginBottom: "2rem" }}
        />

        <p>
          In August we{" "}
          <Link href="/blog/near-intents-stuck-swap-incident-2026">suspended NEAR Intents</Link>{" "}
          after a BitcoinTalk user&apos;s swap stalled past its deadline without settling or
          refunding, and independent reports described the same pattern. NEAR Intents was our only
          route for Zcash. So Zcash came off the site entirely.
        </p>
        <p>
          At the time we wrote that we would rather drop an asset than keep routing users somewhere
          funds get stuck. We meant it. It also turned out to be one of the more expensive
          sentences we have written.
        </p>
        <p>
          ZEC traded around <strong>$400 at the end of June</strong>. It is around{" "}
          <strong>$1,609 today</strong>, having set an all-time high near $1,595 last Friday before
          pushing higher. It is up roughly 148% year to date, around 80% in the last month, and is
          now a top-ten asset by market capitalisation at roughly $26 billion. Through the entire
          run, our users could not buy it here.
        </p>

        <h2>Why we are writing this</h2>
        <p>
          Because the alternative is saying nothing and quietly re-adding it, and we would notice
          if a competitor did that.
        </p>
        <p>
          There is a version of this post that frames the decision as vindicated principle. It
          isn&apos;t. A decision has a cost and this one&apos;s was real: anyone who came to
          TokensFund for Zcash in August or September found nothing and went elsewhere, during the
          single best stretch the asset has ever had. We do not get to keep the reputational
          benefit of the choice while pretending it was free.
        </p>
        <p>
          What we would say is that the decision was correct <em>on the information available</em>,
          and that is the only standard any decision can be judged by. We had a user&apos;s funds
          unresolved, a support channel that had gone silent, corroborating reports of the same
          failure, and no second route for the asset. Routing people into that while the price ran
          would have been worse, not better — a customer whose ZEC purchase stalls in a $400-to-$1,600
          market has lost far more than someone who simply had to buy elsewhere.
        </p>

        <h2>What actually drove the run</h2>
        <p>
          Three things, and only one of them is speculative.
        </p>
        <p>
          <strong>Trust was repaired, mechanically.</strong> In July, Zcash{" "}
          <Link href="/blog/zcash-ironwood-turnstile-supply-integrity-2026">sealed its Orchard pool
          and built a turnstile</Link> after discovering a proof-circuit flaw that could have
          allowed counterfeit ZEC with no on-chain trace. We called Ironwood the real test. It
          passed: the migration has been proceeding steadily, with roughly 427,000 ZEC — about
          11.8% of the starting balance — still sitting in the sealed pool as of 10 September, and
          falling. For a privacy coin, where trust is the product, fixing a supply-integrity
          question is not a cosmetic upgrade.
        </p>
        <p>
          <strong>Privacy demand kept building.</strong> 2026 has been a year of exchange
          wind-downs, delistings, and{" "}
          <Link href="/blog/pocket-bitcoin-breach-identity-not-coins-2026">breaches that linked
          real identities to blockchain addresses</Link>. The case for assets that don&apos;t
          publish your financial history got made repeatedly, by events rather than by advocates.
        </p>
        <p>
          <strong>And a squeeze did a lot of the work.</strong> This is the part to hold lightly.
          Reporting through the run described heavily short positioning, with a large majority of
          accounts on at least one major venue positioned short, and futures open interest more
          than doubling in a month. One trader reportedly closed a ZEC short this week at a $36
          million loss after holding it for three months. A move amplified by forced buying is a
          real move — but its size is borrowed from people who were positioned wrong, and that
          borrowing gets repaid in both directions.
        </p>

        <h2>Zcash is back on TokensFund</h2>
        <p>
          As of today, <Link href="/swap/btc-to-zec">BTC → ZEC</Link> is live again, routed through
          Changee. That is one route rather than a comparison, and we would rather tell you that
          plainly than dress up a single quote as a market survey.
        </p>
        <p>
          THORChain has announced Zcash pools but they are not live yet — we checked, rather than
          taking the announcement at face value, because we said we would add it &quot;the day those
          pools are live and quoting, not the day a press release says they are.&quot; When they
          activate, the comparison widens and we will say so.
        </p>
        <p>
          One thing worth repeating at these prices: <strong>swap routes generally deliver to
          transparent Zcash addresses</strong> (t1...), which behave like Bitcoin addresses —
          visible amounts, visible history. Zcash&apos;s privacy lives in shielded addresses
          (zs... or u1...). If privacy is why you hold ZEC, moving the funds into your own shielded
          address after they arrive is the step that actually delivers it. Our{" "}
          <Link href="/blog/swap-btc-to-xmr-zec-without-kyc-2026">walkthrough</Link> covers the
          mechanics.
        </p>

        <h2>The lesson we are actually taking</h2>
        <p>
          Not &quot;never remove a provider.&quot; The removal was right, and we would make the
          same call tomorrow with the same facts.
        </p>
        <p>
          The lesson is about <strong>route concentration</strong>. Zcash disappeared from our site
          for six weeks because it had exactly one route, and one route means one point of failure
          for an entire asset. That is the same structural argument we make about custody, applied
          to ourselves: a single dependency is a single decision away from an outage. XRP and GRAM
          currently sit in the same position, and that is a fragility worth fixing before it costs
          something rather than after.
        </p>
        <p>
          If there is a general point here, it is that being right and being unlucky are not
          mutually exclusive, and that saying so out loud is cheaper than being caught pretending
          otherwise.
        </p>

        <h2>A note on risk</h2>
        <p>
          Nothing here is financial advice and nothing here is a price prediction. Figures reflect
          market data as of 22 September 2026 and move quickly; ZEC has risen sharply and assets
          that rise sharply can fall sharply. Short-squeeze dynamics amplify moves in both
          directions. Privacy assets face regulatory treatment that varies by jurisdiction — follow
          the rules where you live. Size positions so that being wrong is survivable.
        </p>

        <div className="blog-cta">
          <p>Zcash is back — one honest route</p>
          <Link
            href="/swap/btc-to-zec"
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
            Swap BTC → ZEC →
          </Link>
        </div>
      </article>
    </main>
  );
}
