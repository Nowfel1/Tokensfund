import Logo from "@/components/Logo";
import Link from "next/link";

export const metadata = {
  title: "Bitget Froze Withdrawals. Its Self-Custodial Wallet Didn't Skip a Beat",
  description:
    "Roughly $351.6 million was drained from Bitget's hot wallets on 24 September and withdrawals were suspended. The same company's self-custodial wallet — the one we wrote about in July — was unaffected, because there was nothing there to take. One brand, two products, one lesson.",
  keywords: [
    "Bitget hack September 2026",
    "Bitget withdrawals suspended",
    "Bitget $351 million",
    "exchange hot wallet breach",
    "custodial vs non-custodial",
  ],
  alternates: { canonical: "/blog/bitget-hack-withdrawals-frozen-2026" },
  openGraph: {
    type: "article",
    url: "/blog/bitget-hack-withdrawals-frozen-2026",
    title: "Bitget Froze Withdrawals. Its Self-Custodial Wallet Didn't Skip a Beat",
    description:
      "$351.6M drained, withdrawals suspended. The same company's self-custodial wallet was untouched — because there was nothing there to take.",
    images: [{ url: "https://tokensfund.xyz/blog/banner_bitget_hack.png", width: 1200, height: 400 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bitget Froze Withdrawals. Its Self-Custodial Wallet Didn't Skip a Beat",
    description:
      "$351.6M drained, withdrawals suspended. The same company's self-custodial wallet was untouched — because there was nothing there to take.",
    images: ["https://tokensfund.xyz/blog/banner_bitget_hack.png"],
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
          <span className="blog-date">September 24, 2026</span>
        </div>

        <h1>Bitget Froze Withdrawals. Its Self-Custodial Wallet Didn&apos;t Skip a Beat</h1>

        <img
          src="/blog/banner_bitget_hack.png"
          alt="An exchange with withdrawals frozen beside a self-custodial wallet operating normally"
          className="blog-banner"
          style={{ width: "100%", height: "auto", borderRadius: "12px", marginBottom: "2rem" }}
        />

        <p className="warn" style={{ marginBottom: "1.75rem" }}>
          <strong>Developing story.</strong> Details below reflect Bitget&apos;s own statements and
          reporting as of the evening of 24 September 2026. Bitget&apos;s official channels are the
          authoritative source for anything affecting your account, and figures may be revised.
        </p>

        <p>
          At <strong>18:31 UTC today</strong>, Bitget&apos;s security systems detected unauthorised
          transfers from some of its hot wallets. By 21:30 UTC, chief executive Gracy Chen had
          confirmed it publicly. Roughly <strong>$351.6 million</strong> is gone, and{" "}
          <strong>customer withdrawals are suspended</strong> while the exchange investigates.
        </p>
        <p>
          It is among the largest exchange breaches since Bybit lost about $1.4 billion to the
          Lazarus Group in February 2025.
        </p>

        <h2>The detail almost everyone will miss</h2>
        <p>
          In July we wrote about{" "}
          <Link href="/blog/stablecoin-payments-overtake-trading-2026">Bitget Wallet crossing 100
          million users</Link>, and about daily payment users outnumbering traders for the first
          time. That product is <strong>self-custodial</strong> — keys held by the user, funds
          never on Bitget&apos;s balance sheet.
        </p>
        <p>
          Today&apos;s breach hit <strong>Bitget the exchange</strong> — the custodial business.
          Same brand. Same company. Two completely different products, and only one of them can
          freeze your withdrawals, because only one of them ever had your coins.
        </p>
        <p>
          You could not ask for a cleaner controlled experiment. Identical operator, identical
          security team, identical jurisdiction, identical incentives. The difference in outcome is
          entirely structural: an attacker who compromises wallet infrastructure can take what the
          company holds, and nothing else. Self-custodial users of the same brand woke up to a news
          story rather than a frozen balance.
        </p>

        <h2>If you have funds on Bitget</h2>
        <ul>
          <li><strong>You currently cannot withdraw.</strong> That is the situation, and no amount of urgency changes it. Watch Bitget&apos;s official channels for when withdrawals resume.</li>
          <li><strong>Do not trust anyone who contacts you.</strong> A breach with frozen withdrawals is the single highest-value moment in the year for phishing. There is no priority withdrawal service, no recovery agent, no support representative who needs your seed phrase or your login. Anyone offering help first is stealing.</li>
          <li><strong>Be sceptical of unofficial &quot;updates.&quot;</strong> Fake announcement accounts proliferate within hours of events like this. Go to the source directly rather than following links.</li>
          <li><strong>Don&apos;t deposit more.</strong> Obvious, but people do it — attempting to average down or move funds around inside a platform mid-incident.</li>
          <li><strong>Download your transaction history</strong> when access permits, for tax and record purposes.</li>
        </ul>

        <h2>What we don&apos;t know, and won&apos;t pretend to</h2>
        <p>
          Bitget has not said how the attackers got in. Forbes&apos; coverage noted, correctly,
          that breaches of this shape rarely involve breaking cryptography — they involve
          credentials, infrastructure, or people. Beyond that, speculation is worthless and
          attribution this early is usually wrong.
        </p>
        <p>
          We also don&apos;t know whether customer funds are ultimately at risk. A $351.6 million
          loss at an exchange of Bitget&apos;s size may well be absorbable from company reserves,
          as several large exchanges have done before. <strong>Nothing here should be read as
          suggesting Bitget is insolvent.</strong> The suspension of withdrawals is a standard
          protective measure during an active incident, not in itself evidence of a shortfall.
        </p>
        <p>
          Credit where it&apos;s due, too: detection to public confirmation took about three hours.
          That is fast, and it is better than the industry norm of learning about a breach from a
          blockchain analyst on social media.
        </p>

        <h2>The lesson, stated without triumph</h2>
        <p>
          We have written this argument all year —{" "}
          <Link href="/blog/ascendex-collapse-mica-custody-lesson-2026">AscendEX dying with user
          funds inside</Link>,{" "}
          <Link href="/blog/bitmart-bitmex-exchange-winddown-wave-2026">BitMEX and BitMart
          scheduling their own shutdowns</Link>,{" "}
          <Link href="/blog/pocket-bitcoin-breach-identity-not-coins-2026">a breach that exposed
          identities rather than coins</Link> — and there is no satisfaction in another example
          arriving. People with money on Bitget tonight are having a bad night, and &quot;you
          should have self-custodied&quot; is useless to them.
        </p>
        <p>
          What is worth saying is the narrow, structural version: <strong>custodial risk is not a
          claim about a company&apos;s competence.</strong> Bitget is a large, well-resourced
          exchange with a serious security team, and its own self-custodial product is untouched
          tonight. The exposure came from the arrangement, not the operator. Any platform that
          holds your coins can be compromised, can freeze withdrawals while it investigates, and
          can make you wait on a timeline you have no say in. Good ones make that rare. None make
          it impossible.
        </p>
        <p>
          The reason this site exists is the other arrangement. TokensFund never holds your funds:
          swaps route from your wallet, through THORChain, Chainflip, Changee or CCE.Cash, to an
          address you control — no account, no KYC for standard swaps, flat 1% inside the quote.
          There is no balance of yours for us to freeze, because there is never a balance of yours
          here at all. That design doesn&apos;t make you safe from everything. It makes you safe
          from tonight.
        </p>

        <h2>A note on risk</h2>
        <p>
          Nothing here is financial advice. This is a developing incident; figures, causes and
          consequences may change, and Bitget&apos;s own communications are authoritative. No
          allegation of wrongdoing, negligence or insolvency is made against Bitget. Self-custody
          transfers risk to you rather than removing it — back up your keys, verify addresses, and
          send test amounts.
        </p>

        <div className="blog-cta">
          <p>No balance to freeze</p>
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
