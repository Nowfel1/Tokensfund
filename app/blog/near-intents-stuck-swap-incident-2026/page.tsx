import Logo from "@/components/Logo";
import Link from "next/link";

export const metadata = {
  title: "Incident Report: 5 BTC Stuck in a NEAR Intents Swap for Three Days",
  description:
    "A swap deposited on August 11 has remained in PROCESSING since, past its quote deadline, with no destination transfer and no refund. What the documentation says should happen, what we have observed, what we are asking for, and what we do not yet know.",
  keywords: [
    "NEAR Intents stuck swap",
    "1Click PROCESSING no refund",
    "cross-chain swap incident report",
    "NEAR Intents refund address",
    "1Click swap failure",
  ],
  alternates: { canonical: "/blog/near-intents-stuck-swap-incident-2026" },
  openGraph: {
    type: "article",
    url: "/blog/near-intents-stuck-swap-incident-2026",
    title: "Incident Report: 5 BTC Stuck in a NEAR Intents Swap for Three Days",
    description:
      "Deposited August 11, still PROCESSING, past deadline, no refund. The facts, the open questions, and what we are asking for.",
    images: [{ url: "https://tokensfund.xyz/blog/banner_stuck_swap.png", width: 1200, height: 400 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Incident Report: 5 BTC Stuck in a NEAR Intents Swap for Three Days",
    description:
      "Deposited August 11, still PROCESSING, past deadline, no refund. The facts, the open questions, and what we are asking for.",
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
          <span className="blog-date">August 14, 2026</span>
        </div>

        <h1>Incident Report: 5 BTC Stuck in a NEAR Intents Swap for Three Days</h1>

        <img
          src="/blog/banner_stuck_swap.png"
          alt="A swap held at the processing stage, with neither settlement nor refund"
          className="blog-banner"
          style={{ width: "100%", height: "auto", borderRadius: "12px", marginBottom: "2rem" }}
        />

        <p>
          We are publishing this because we think users deserve to know when a route we integrate
          fails, and because private channels have not produced a resolution. It is written as an
          incident report rather than an accusation: we are stating what we observed, what the
          documentation says should have happened, and what we still do not know.
        </p>

        <h2>The facts</h2>
        <ul>
          <li><strong>What:</strong> a NEAR Intents (1Click) cross-chain swap of approximately 5 BTC — roughly $320,000 at the time of deposit.</li>
          <li><strong>When:</strong> deposited August 11, 2026.</li>
          <li><strong>Deposit address:</strong> <code>bc1qh24lnnls8fpp90vttch8zwdkeetvvkdfnt3rry</code></li>
          <li><strong>Current state:</strong> the 1Click status endpoint reports <code>PROCESSING</code>. Per 1Click&apos;s own documentation, that status means the deposit was detected and passed to solvers for execution — so this is not a deposit-detection problem.</li>
          <li><strong>Outcome so far:</strong> no destination-chain transfer recorded, no refund issued, and the original quote deadline has passed.</li>
          <li><strong>Support:</strong> requests for status through official channels have not produced a substantive response at the time of writing.</li>
        </ul>

        <h2>What the documentation says should happen</h2>
        <p>
          1Click&apos;s documentation is unambiguous about the two possible endings: a swap either
          succeeds, with tokens delivered to the specified address, or it fails, with funds
          automatically refunded to the refund address provided at quote time. The product
          description lists automatic retries and refund handling as built-in features. A swap that
          sits in <code>PROCESSING</code> for three days past its deadline — delivering neither
          outcome — is not a state the documented design accounts for.
        </p>

        <h2>What we do not know</h2>
        <p>
          We think it matters to say this plainly rather than assume the worst.
        </p>
        <ul>
          <li><strong>We do not allege theft or misappropriation.</strong> Nothing we have observed supports that, and we are not claiming it. A solver failure, an internal error, a stuck settlement leg, or a manual review are all consistent with what we can see.</li>
          <li><strong>We cannot see the internal state.</strong> A status string is not a diagnosis. Only NEAR Intents can say what actually happened to this intent.</li>
          <li><strong>Delays are not always failures.</strong> Cross-chain settlement can legitimately take time under unusual conditions. Three days past deadline with no refund is what moves this from &quot;slow&quot; to &quot;unresolved.&quot;</li>
        </ul>

        <h2>What we are asking for</h2>
        <ul>
          <li><strong>Resolution:</strong> either completion of the swap or the refund the documentation describes, to the refund address supplied with the original quote, less any documented network fees.</li>
          <li><strong>An explanation:</strong> a technical account of why this intent neither settled nor refunded. Not for its own sake — anyone integrating 1Click needs to know whether this is a one-off or a class of failure.</li>
          <li><strong>A support path for stuck swaps.</strong> Whatever the cause here, an integration handling user funds needs a channel where a stalled intent gets a human answer within days, not silence.</li>
        </ul>

        <h2>What this means for TokensFund users</h2>
        <p>
          Practical notes, since some of you are mid-swap right now:
        </p>
        <ul>
          <li><strong>Other routes are unaffected.</strong> THORChain, Chainflip, Changee and CCE.Cash are quoting and settling normally. If you are swapping today and want to avoid this route entirely, pick another provider from the comparison — that choice is the reason we show every route rather than a single one.</li>
          <li><strong>Always set a refund address</strong>, even where a route treats it as optional. It is the only mechanism that returns funds without anyone&apos;s intervention.</li>
          <li><strong>Test with a small amount</strong> before moving size through any route, on any aggregator, including ours. It is the cheapest insurance in crypto and it would have made this a $30 problem instead of a $320,000 one.</li>
          <li><strong>Being non-custodial does not mean nothing can go wrong.</strong> We never hold your funds — but the protocols we route to are independent systems that can fail, and when they do, the failure is visible to you rather than hidden inside a balance sheet. We would rather say that clearly than pretend otherwise.</li>
        </ul>

        <h2>Why we are publishing this</h2>
        <p>
          We have spent this year writing about{" "}
          <Link href="/blog/bitmart-bitmex-exchange-winddown-wave-2026">exchanges that wind
          down</Link>, <Link href="/blog/ascendex-collapse-mica-custody-lesson-2026">platforms that
          fail with user funds inside</Link>, and{" "}
          <Link href="/blog/coldcard-exploit-update-still-ongoing-2026">hardware that ships
          flawed</Link>. It would be inconsistent to hold others to a standard of public disclosure
          and stay quiet when a route we integrate leaves funds unresolved. This post will be
          updated when the situation changes, in either direction — including if the fault turns out
          to be ours.
        </p>

        <h2>A note on risk</h2>
        <p>
          Nothing here is financial or legal advice. This report reflects our observations as of
          August 14, 2026. No allegation of wrongdoing is made against NEAR Intents, NEAR Protocol,
          or any other party. Status descriptions are drawn from 1Click&apos;s public documentation
          and API responses. We will update or correct this post as facts develop.
        </p>

        <div className="blog-cta">
          <p>Every route, compared — so you can choose</p>
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
