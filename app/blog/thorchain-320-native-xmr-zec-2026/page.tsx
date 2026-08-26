import Logo from "@/components/Logo";
import Link from "next/link";

export const metadata = {
  title: "THORChain v3.20: Native XMR and ZEC, and What Actually Shipped",
  description:
    "THORChain's v3.20 upgrade went live on 25 August, bringing Monero and Zcash support, restoring BNB, Base and Solana trading after a May exploit, and shipping Protocol-Owned Liquidity and a Stable Reserve. What's live now, what's still staged, and why native privacy-coin swaps on a protocol matter after two years of delistings.",
  keywords: [
    "THORChain 3.20",
    "THORChain Monero Zcash native swap",
    "THORChain upgrade August 2026",
    "native XMR swap no custodian",
    "THORChain TSS exploit recovery",
  ],
  alternates: { canonical: "/blog/thorchain-320-native-xmr-zec-2026" },
  openGraph: {
    type: "article",
    url: "/blog/thorchain-320-native-xmr-zec-2026",
    title: "THORChain v3.20: Native XMR and ZEC, and What Actually Shipped",
    description:
      "Monero and Zcash on a protocol instead of an exchange — plus the recovery from May's TSS exploit. What's live, what's staged.",
    images: [{ url: "https://tokensfund.xyz/blog/banner_thorchain_320.png", width: 1200, height: 400 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "THORChain v3.20: Native XMR and ZEC, and What Actually Shipped",
    description:
      "Monero and Zcash on a protocol instead of an exchange — plus the recovery from May's TSS exploit. What's live, what's staged.",
    images: ["https://tokensfund.xyz/blog/banner_thorchain_320.png"],
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
          <span className="blog-date">August 26, 2026</span>
        </div>

        <h1>THORChain v3.20: Native XMR and ZEC, and What Actually Shipped</h1>

        <img
          src="/blog/banner_thorchain_320.png"
          alt="Monero and Zcash connecting directly to a decentralised liquidity protocol"
          className="blog-banner"
          style={{ width: "100%", height: "auto", borderRadius: "12px", marginBottom: "2rem" }}
        />

        <p className="warn" style={{ marginBottom: "1.75rem" }}>
          <strong>Disclosure:</strong> TokensFund integrates THORChain as one of four swap routes
          and earns an affiliate fee on swaps routed through it. Read this with that in mind — and
          note that we spend most of the piece on what hasn&apos;t shipped yet.
        </p>

        <p>
          THORChain deployed <strong>v3.20</strong> on Tuesday 25 August at around 14:00 UTC. It is
          the most consequential release the protocol has shipped this year, and for anyone who
          cares about privacy coins it is the one worth understanding — because it addresses a
          problem that two years of exchange delistings created and nothing else has properly
          solved.
        </p>

        <h2>The headline: native Monero and Zcash</h2>
        <p>
          The upgrade brings XMR and ZEC support to THORChain — swappable against BTC, ETH and
          stablecoins <em>without wrapped assets and without a custodian</em>. That distinction is
          the whole point. Existing routes into Monero mostly run through instant exchangers: a
          company takes your Bitcoin, sends you Monero, and for the duration of that swap your
          funds are theirs. A protocol swap has no company in the middle at all.
        </p>
        <p>
          <strong>One precision note, because the coverage is inconsistent.</strong> A sponsored
          press release describes v3.20 as &quot;unlocking&quot; native XMR and ZEC swaps, present
          tense. THORChain&apos;s own announcement and the independent write-ups say Monero and
          Zcash &quot;move closer to activation.&quot; Those are different claims. Our reading is
          that the release ships the infrastructure and activation is staged, the way BNB, Base and
          Solana trading is resuming progressively rather than all at once. If you are planning a
          privacy-coin swap on the strength of this, check that the pools are actually live before
          you send anything.
        </p>

        <h2>The rest of the release</h2>
        <ul>
          <li><strong>BNB, Base and Solana trading resumes.</strong> These chains had been halted since May. The release includes the chain-specific, solvency and security fixes that were blocking them, with trading expected to come back progressively.</li>
          <li><strong>Network churn resumes</strong> — validator rotation restarting is a meaningful signal that the protocol considers itself back to normal operation.</li>
          <li><strong>Protocol-Owned Liquidity mimirs go operational, and a Stable Reserve ships</strong>, adding stablecoin-to-stablecoin swaps and changing how the protocol holds its own liquidity.</li>
          <li><strong>Memoless swaps expand to ERC-20s.</strong> This one is quietly important for anyone building on THORChain — more below.</li>
          <li><strong>Node and TSS hardening:</strong> encryption of TSS keyshare files at rest, changes to seed-phrase handling, extended signer-cache expiry, and removal of a temporary subsystem introduced during the incident response.</li>
        </ul>

        <h2>The context nobody should skip</h2>
        <p>
          That list of security fixes is not routine housekeeping. On <strong>15 May 2026</strong>,
          a newly joined node operator exploited a vulnerability in the GG20 threshold signature
          scheme, leaking key material during signing ceremonies and draining roughly{" "}
          <strong>$10.8 million</strong> from one of six Asgard vaults, with losses spread across
          Bitcoin, Ethereum, BNB Chain and Base. Automatic solvency detection and node coordinators
          halted trading, signing and churning to protect the remaining vaults. Protocol-owned
          liquidity absorbed the losses.
        </p>
        <p>
          So v3.20 is two things at once: a feature release, and the end of a months-long recovery.
          Both facts matter. A protocol that was exploited in May and is shipping privacy-coin
          integration in August has demonstrated it can respond and rebuild — and has also
          demonstrated that its threshold-signature layer had a real vulnerability in production.
          Neither observation cancels the other. It is the same shape as{" "}
          <Link href="/blog/coldcard-exploit-update-still-ongoing-2026">the Coldcard entropy
          failure</Link> and{" "}
          <Link href="/blog/zcash-ironwood-turnstile-supply-integrity-2026">Zcash&apos;s Orchard
          bug</Link>: cryptographic systems fail quietly, and the response is what you actually get
          to judge.
        </p>

        <h2>Why native privacy swaps matter more than they sound</h2>
        <p>
          Since the delisting waves, buying Monero has meant choosing between custodial venues that
          increasingly won&apos;t list it, and instant exchangers that will — but which hold your
          funds mid-swap and can freeze, stall or fail while doing so. We have written about{" "}
          <Link href="/blog/bitmart-bitmex-exchange-winddown-wave-2026">what happens when those
          intermediaries wind down</Link>, and we removed a provider this month after a user&apos;s
          funds sat unresolved for days.
        </p>
        <p>
          A protocol route removes that category of risk. Not all risk — pools can be shallow,
          slippage on thin liquidity is real, and as May demonstrated a protocol can be exploited.
          But there is no company that can decide your withdrawal needs a compliance review.
        </p>
        <p>
          For Zcash specifically this is personal for us. ZEC&apos;s only route on TokensFund was a
          provider we suspended, so{" "}
          <Link href="/blog/near-intents-stuck-swap-incident-2026">we removed Zcash entirely</Link>{" "}
          rather than keep routing users somewhere we no longer trusted. THORChain activating ZEC
          pools is what brings it back. We will re-add Zcash the day those pools are live and
          quoting — not the day a press release says they are.
        </p>

        <h2>A note for other integrators</h2>
        <p>
          The memoless-swap expansion deserves a paragraph, because the memo problem is the single
          biggest UX asymmetry in building on THORChain. On Bitcoin, the routing memo goes in an
          OP_RETURN output and any wallet can produce it. On Ethereum there is no memo field, so
          deposits must go through <code>depositWithExpiry</code> on the router contract — which
          means the deposit-address-and-memo pattern that works everywhere else is unfollowable
          from a standard wallet&apos;s send screen. We hit this directly, and fixed it on our side
          by detecting EVM source assets and showing the contract-call parameters instead. Every
          step toward memoless deposits removes that trap for someone.
        </p>

        <h2>A note on risk</h2>
        <p>
          Nothing here is financial advice. Details reflect THORChain&apos;s v3.20 announcement and
          contemporaneous reporting as of 26 August 2026; sources disagree on whether XMR and ZEC
          pools are fully live or staged for activation, and THORChain&apos;s own channels are
          authoritative. Do not assume a pool is active because an article says so — check, and
          send a test amount first. Cross-chain protocols carry smart-contract, liquidity and
          validator risk, as May&apos;s exploit demonstrated. We earn an affiliate fee on THORChain
          swaps routed through TokensFund.
        </p>

        <div className="blog-cta">
          <p>Four routes compared, wallet to wallet</p>
          <Link
            href="/swap/btc-to-xmr"
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
            Compare XMR routes →
          </Link>
        </div>
      </article>
    </main>
  );
}
