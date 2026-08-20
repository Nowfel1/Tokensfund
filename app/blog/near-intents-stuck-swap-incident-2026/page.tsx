import Logo from "@/components/Logo";
import Link from "next/link";

export const metadata = {
  title: "Why We Removed NEAR Intents: 5 BTC Stuck With No Settlement and No Refund",
  description:
    "A user reported roughly 5 BTC stuck in a NEAR Intents 1Click swap — past deadline, no destination transfer, no refund. We helped document it, published what we could verify, and have now suspended the provider entirely after independent reports described the same pattern.",
  keywords: [
    "NEAR Intents stuck swap",
    "1Click PROCESSING no refund",
    "NEAR Intents removed",
    "cross-chain swap incident report",
    "1Click swap failure",
  ],
  alternates: { canonical: "/blog/near-intents-stuck-swap-incident-2026" },
  openGraph: {
    type: "article",
    url: "/blog/near-intents-stuck-swap-incident-2026",
    title: "Why We Removed NEAR Intents: 5 BTC Stuck With No Settlement and No Refund",
    description:
      "Past deadline, no settlement, no refund — and independent reports describing the same pattern. Why we suspended the provider.",
    images: [{ url: "https://tokensfund.xyz/blog/banner_stuck_swap.png", width: 1200, height: 400 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Why We Removed NEAR Intents: 5 BTC Stuck With No Settlement and No Refund",
    description:
      "Past deadline, no settlement, no refund — and independent reports describing the same pattern. Why we suspended the provider.",
    images: ["https://tokensfund.xyz/blog/banner_stuck_swap.png"],
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
          <span className="blog-tag">Incident</span>
          <span className="blog-date">August 14, 2026 · updated August 20</span>
        </div>

        <h1>Why We Removed NEAR Intents</h1>

        <img
          src="/blog/banner_stuck_swap.png"
          alt="A swap held at the processing stage, with neither settlement nor refund"
          className="blog-banner"
          style={{ width: "100%", height: "auto", borderRadius: "12px", marginBottom: "2rem" }}
        />

        <div className="warn" style={{ marginBottom: "1.75rem" }}>
          <strong>Update, 20 August 2026:</strong> NEAR Intents has been removed from TokensFund
          entirely — from routing, from the site, and from our materials. We now compare four
          providers: THORChain, Chainflip, Changee and CCE.Cash. The cost of that decision is
          Zcash, which NEAR Intents was our only route for; ZEC swaps are unavailable until
          THORChain&apos;s ZEC pool goes live. The original report follows.
        </div>

        <p>
          This started with a BitcoinTalk user, not with us. He reported that roughly 5 BTC — about
          $320,000 at the time — had been sitting in a NEAR Intents (1Click) cross-chain swap since
          10 August with no resolution. We looked at what he could show publicly, helped him
          document it, and published this because private channels weren&apos;t producing anything.
        </p>
        <p>
          We are not the affected party and we hold none of the funds. We publish it because we
          integrated the provider and our users deserve to know when a route we offer behaves this
          way.
        </p>

        <h2>The facts, as far as they can be verified publicly</h2>
        <ul>
          <li><strong>What:</strong> a NEAR Intents (1Click) swap of approximately 5 BTC.</li>
          <li><strong>When:</strong> the order entered <code>PROCESSING</code> on 10 August 2026.</li>
          <li><strong>Deposit address:</strong> <code>bc1qh24lnnls8fpp90vttch8zwdkeetvvkdfnt3rry</code></li>
          <li><strong>State:</strong> the public 1Click status endpoint reported <code>PROCESSING</code> with an empty <code>intentHashes</code> field. Per 1Click&apos;s documentation that status means the deposit was detected and passed to solvers — so this was not a deposit-detection problem.</li>
          <li><strong>Outcome:</strong> no destination-chain transaction, no refund, and the execution deadline long expired.</li>
          <li><strong>Context:</strong> the same user completed two earlier swaps through the same service without issue, so this was not a first-time configuration mistake.</li>
          <li><strong>Support:</strong> a ticket was opened and acknowledged, the case was escalated to a technical team, and then multiple follow-ups produced no substantive answer, no timeline and no refund date. A public message asking for one was deleted, and the account was subsequently restricted from posting in the official Telegram group.</li>
        </ul>

        <h2>What the documentation says should happen</h2>
        <p>
          1Click&apos;s documentation describes two possible endings: the swap succeeds and tokens
          are delivered, or it fails and funds are refunded automatically to the refund address
          supplied at quote time. Automatic retries and refund handling are listed as built-in
          features. A swap that sits in <code>PROCESSING</code> for days past its deadline,
          delivering neither outcome, is not a state the documented design accounts for.
        </p>

        <h2>What we do not know</h2>
        <ul>
          <li><strong>We do not allege theft or misappropriation.</strong> Nothing publicly visible supports that and we are not claiming it. A solver failure, an internal error, a stuck settlement leg or a manual compliance review are all consistent with what can be seen from outside.</li>
          <li><strong>We cannot see the internal state.</strong> A status string is not a diagnosis. Only NEAR Intents can say what actually happened to this intent.</li>
          <li><strong>Delays are not always failures.</strong> Cross-chain settlement can legitimately take time. Days past deadline with no refund and no answer is what moves this from slow to unresolved.</li>
        </ul>

        <h2>Why we removed the provider</h2>
        <p>
          After publishing, we found independent reports describing a strikingly similar pattern:
          deposits confirming on-chain but never crediting, funds visible at the generated deposit
          address, support escalating and then going quiet, and users restricted from asking about
          it publicly. One described a compliance review with no timeline and a request to send
          source-of-funds documentation. We cannot verify other people&apos;s accounts, and we
          note that reviews are unverified by nature — but the pattern matched closely enough that
          we were no longer comfortable routing anyone to it.
        </p>
        <p>
          So we stopped. Not as a judgement on the protocol&apos;s technology, and not as an
          accusation — as a decision about where we are willing to send other people&apos;s money
          while a case like this is open. If it is resolved and the underlying failure is
          explained, we will reconsider, and we will say so here.
        </p>

        <h2>What this means for TokensFund users</h2>
        <ul>
          <li><strong>Nothing routes to NEAR Intents any more.</strong> Quotes, deposits and tracking for that provider are all removed.</li>
          <li><strong>ZEC is unavailable for now.</strong> NEAR Intents was our only Zcash route. THORChain has announced a ZEC pool but it is not live yet; we will restore Zcash when it is. We would rather drop an asset than keep a route open that we do not trust.</li>
          <li><strong>Everything else is unaffected.</strong> THORChain, Chainflip, Changee and CCE.Cash continue to quote and settle normally.</li>
          <li><strong>Always set a refund address</strong>, on any service. It is the only mechanism that returns funds without anyone&apos;s intervention.</li>
          <li><strong>Test with a small amount</strong> before moving size through any route, on any aggregator including ours. It is the cheapest insurance in crypto.</li>
          <li><strong>Non-custodial does not mean nothing can go wrong.</strong> We never hold your funds — but the protocols we route to are independent systems that can fail. When they do, we would rather say so plainly than quietly hope you don&apos;t notice.</li>
        </ul>

        <h2>Why we published at all</h2>
        <p>
          We have spent this year writing about{" "}
          <Link href="/blog/bitmart-bitmex-exchange-winddown-wave-2026">exchanges that wind
          down</Link>,{" "}
          <Link href="/blog/ascendex-collapse-mica-custody-lesson-2026">platforms that fail with
          user funds inside</Link>, and{" "}
          <Link href="/blog/coldcard-exploit-update-still-ongoing-2026">hardware that ships
          flawed</Link>. It would be inconsistent to hold others to a standard of public disclosure
          and stay quiet when a route we integrated left someone&apos;s funds unresolved. This post
          will be updated if the situation changes in either direction.
        </p>

        <h2>A note on risk</h2>
        <p>
          Nothing here is financial or legal advice. This report reflects publicly verifiable
          information and the affected user&apos;s account as of August 2026. No allegation of
          wrongdoing is made against NEAR Intents, NEAR Protocol or any other party. Status
          descriptions are drawn from 1Click&apos;s public documentation and API responses. We will
          update or correct this post as facts develop.
        </p>

        <div className="blog-cta">
          <p>Four routes, compared — so you can choose</p>
          <Link
            href="/"
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
            Open the swap terminal →
          </Link>
        </div>
      </article>
    </main>
  );
}
