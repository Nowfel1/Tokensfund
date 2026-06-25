import Logo from "@/components/Logo";
import Link from "next/link";

export const metadata = {
  title: "Terms of Service",
  description:
    "The terms governing use of TokensFund, a non-custodial cryptocurrency swap aggregator. Swaps are final, executed by third-party protocols, and you are responsible for compliance in your jurisdiction.",
  alternates: { canonical: "/terms" },
  openGraph: {
    type: "website",
    url: "/terms",
    title: "Terms of Service — TokensFund",
    description: "The terms governing use of TokensFund's non-custodial swap aggregator.",
    images: [{ url: "https://tokensfund.xyz/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms of Service — TokensFund",
    description: "The terms governing use of TokensFund's non-custodial swap aggregator.",
    images: ["https://tokensfund.xyz/og-image.png"],
  },
};

export default function Terms() {
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
        <h1>Terms of Service</h1>
        <p style={{ color: "#8a93a8", fontSize: "14px" }}>Last updated: June 25, 2026</p>

        <p>
          These Terms of Service (&quot;Terms&quot;) govern your access to and use of tokensfund.xyz
          and the TokensFund interface (the &quot;Service&quot;). By using the Service, you agree to
          these Terms. If you do not agree, do not use the Service.
        </p>

        <h2>1. What TokensFund is (and isn&apos;t)</h2>
        <p>
          TokensFund is a non-custodial swap aggregator. It compares rates across third-party
          liquidity protocols and routes your swap to one of them. TokensFund is not an exchange,
          a broker, a wallet, or a custodian. It does not hold, control, or have access to your
          funds at any point. It does not match orders or operate its own liquidity. Every swap is
          executed by an independent third-party protocol, and your funds move directly between
          your wallet, that protocol, and your destination address.
        </p>

        <h2>2. Eligibility and your responsibilities</h2>
        <p>
          You must be at least 18 years old (or the age of majority where you live) and legally
          permitted to use cryptocurrency services in your jurisdiction. You are solely responsible
          for determining whether your use of the Service is lawful where you are, and for complying
          with all applicable laws, including tax and reporting obligations. The Service is not
          offered to, and may not be used by, persons in jurisdictions where it would be unlawful,
          or by persons subject to applicable sanctions.
        </p>

        <h2>3. Non-custodial swaps are final</h2>
        <p>
          Cryptocurrency transactions are irreversible. Once you send funds to a deposit address,
          the swap cannot be cancelled, reversed, or refunded by TokensFund. You are responsible for
          providing the correct destination address, on the correct network, and for verifying all
          details before sending. TokensFund cannot recover funds sent to a wrong address, on the
          wrong network, below or above a protocol&apos;s supported range, or otherwise lost due to
          user error. Where a swap cannot be completed by the underlying protocol, funds are
          returned to the refund address you provide, subject to that protocol&apos;s rules.
        </p>

        <h2>4. Third-party protocols</h2>
        <p>
          Swaps are executed by independent protocols including THORChain, Chainflip, NEAR Intents,
          Changee and CCE.Cash. These protocols are operated by third parties and are not controlled
          by TokensFund. Their availability, pricing, execution, slippage, and outcomes are outside
          our control, and their own terms and risks apply to your transaction. TokensFund is not
          responsible for any loss, delay, downtime, failed swap, or price difference arising from a
          third-party protocol.
        </p>

        <h2>5. Fees and quotes</h2>
        <p>
          TokensFund charges a flat 2% fee, which is already reflected in the quote shown to you.
          Network (gas) fees and any spread charged by the underlying protocol are separate and
          outside our control. All quotes are estimates based on live conditions and are not
          guaranteed until a swap is executed; the amount you ultimately receive may differ due to
          market movement, network conditions, or protocol behavior.
        </p>

        <h2>6. No financial or legal advice</h2>
        <p>
          Nothing on the Service — including quotes, blog content, or other materials — is financial,
          investment, legal, or tax advice. Cryptocurrency is volatile and risky. You are solely
          responsible for your decisions, and you should consult qualified professionals where
          appropriate.
        </p>

        <h2>7. Risks</h2>
        <p>
          Using the Service involves significant risk, including price volatility, regulatory
          change, technical and smart-contract failures, network congestion, and the possibility
          that a swap does not complete as expected. You accept these risks. Privacy coins and
          certain assets may be restricted in your jurisdiction; it is your responsibility to know
          and follow the law that applies to you.
        </p>

        <h2>8. Prohibited use</h2>
        <p>
          You agree not to use the Service for any unlawful purpose, including money laundering,
          terrorist financing, fraud, sanctions evasion, or transacting proceeds of crime. You
          represent that the funds you use are lawfully yours and that your use of the Service does
          not violate any law or regulation applicable to you. We may decline to provide, or
          discontinue, access where we reasonably believe these Terms are being violated.
        </p>

        <h2>9. No warranty</h2>
        <p>
          The Service is provided &quot;as is&quot; and &quot;as available,&quot; without warranties
          of any kind, whether express or implied. We do not warrant that the Service will be
          uninterrupted, error-free, secure, or that quotes will be accurate or available at any
          given time.
        </p>

        <h2>10. Limitation of liability</h2>
        <p>
          To the maximum extent permitted by law, TokensFund and its contributors will not be liable
          for any indirect, incidental, special, consequential, or exemplary damages, or for any
          loss of funds, profits, or data, arising from or related to your use of the Service or any
          third-party protocol — even if advised of the possibility. To the extent liability cannot
          be excluded, it is limited to the amount of fees you paid to TokensFund for the transaction
          giving rise to the claim.
        </p>

        <h2>11. Indemnification</h2>
        <p>
          You agree to indemnify and hold harmless TokensFund and its contributors from any claim,
          loss, or expense (including reasonable legal fees) arising from your use of the Service,
          your violation of these Terms, or your violation of any law or third-party right.
        </p>

        <h2>12. Changes to these Terms</h2>
        <p>
          We may update these Terms from time to time. Changes take effect when posted on this page,
          and the &quot;Last updated&quot; date will reflect the revision. Your continued use of the
          Service after changes are posted constitutes acceptance of the updated Terms.
        </p>

        <h2>13. Governing law</h2>
        <p>
          These Terms are governed by the laws of UAE, without regard to
          conflict-of-laws principles. Any dispute will be subject to the exclusive jurisdiction of
          the courts of UAE.
        </p>

        <h2>14. Contact</h2>
        <p>
          Questions about these Terms? Reach us on Telegram at{" "}
          <a href="https://t.me/Tokensfund" target="_blank" rel="noopener noreferrer">t.me/Tokensfund</a>{" "}
          or at [Hello@tokensfund.xyz].
        </p>
      </article>
    </main>
  );
}
