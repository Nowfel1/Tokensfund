import Logo from "@/components/Logo";
import Link from "next/link";

export const metadata = {
  title: "Privacy Policy",
  description:
    "How TokensFund handles data. No account, no KYC, minimal collection — but on-chain transactions are public and swap details are shared with the protocol that executes your swap.",
  alternates: { canonical: "/privacy" },
  openGraph: {
    type: "website",
    url: "/privacy",
    title: "Privacy Policy — TokensFund",
    description: "No account, no KYC, minimal data collection. Here's exactly what we process and why.",
    images: [{ url: "https://tokensfund.xyz/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy — TokensFund",
    description: "No account, no KYC, minimal data collection. Here's exactly what we process and why.",
    images: ["https://tokensfund.xyz/og-image.png"],
  },
};

export default function Privacy() {
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
        <h1>Privacy Policy</h1>
        <p style={{ color: "#8a93a8", fontSize: "14px" }}>Last updated: June 25, 2026</p>

        <p>
          TokensFund is built to need as little of your data as possible. There&apos;s no account,
          no email, and no KYC for standard swaps. This policy explains the limited information we do
          process, why, and who it&apos;s shared with. By using tokensfund.xyz (the
          &quot;Service&quot;), you agree to this policy.
        </p>

        <h2>What we do not collect</h2>
        <p>
          We do not ask for or store your name, email address, phone number, government ID, or any
          KYC documentation. There is no account to create and no login. We do not knowingly build a
          profile that identifies you personally.
        </p>

        <h2>What we process</h2>
        <p>
          To provide a swap, the Service processes the details you enter — the assets you&apos;re
          swapping, the amount, your destination address, and your refund address. This information
          is necessary to generate a quote and route your swap, and it is passed to the third-party
          protocol that executes the transaction (see below).
        </p>
        <p>
          Like most websites, our hosting and infrastructure may automatically log standard technical
          data such as IP address, browser type, device information, and timestamps, for security,
          abuse prevention, and reliability. We do use analytics; if we do, it is configured to not 
          collect personal data. 
        </p>

        <h2>On-chain transactions are public</h2>
        <p>
          Cryptocurrency transactions are recorded on public blockchains. Any swap you make — the
          addresses and amounts involved — is publicly visible on-chain and is outside our control.
          This is inherent to how blockchains work, not something TokensFund publishes. If on-chain
          privacy matters to you, understand the privacy properties of the specific assets you use.
        </p>

        <h2>How we use information</h2>
        <p>
          We use the information above only to: generate quotes and route swaps; let you track a
          swap&apos;s status; provide support when you contact us; maintain security and prevent
          abuse; and comply with legal obligations where they apply. We do not sell your data.
        </p>

        <h2>Who we share with</h2>
        <p>
          We share swap details with the third-party protocol that executes your swap — THORChain,
          Chainflip, NEAR Intents, Changee or CCE.Cash — because they need your destination and
          refund addresses to complete the transaction. Each operates independently and under its own
          privacy practices, which we do not control. We also rely on infrastructure providers such
          as our hosting platform [e.g. Vercel] and [any analytics or error-monitoring provider] to
          run the Service. [Keep this list accurate.] We may disclose information if required by law
          or valid legal process.
        </p>

        <h2>Cookies</h2>
        <p>
          The Service uses only the cookies or local storage strictly necessary for it to function.
          [If you add analytics, advertising, or other non-essential cookies, disclose them here and
          provide a consent mechanism where required by law.]
        </p>

        <h2>Data retention</h2>
        <p>
          We keep technical logs only as long as needed for the purposes above, then delete or
          anonymize them. [State your actual retention period, e.g. &quot;server logs are retained
          for X days.&quot;]
        </p>

        <h2>Your rights</h2>
        <p>
          Depending on where you live, you may have rights to access, correct, or delete personal
          data we hold about you, or to object to certain processing. Because we don&apos;t maintain
          accounts and hold very little personal data, there is often little for us to act on — but
          you can contact us with any request. [Adjust this section to reflect GDPR, UK GDPR, CCPA or
          other regimes that apply to your users, and your jurisdiction.]
        </p>

        <h2>Security</h2>
        <p>
          We take reasonable measures to protect the Service, but no method of transmission or storage
          is completely secure. Because the Service is non-custodial, the security of your own wallet
          and private keys is your responsibility — we never have access to them.
        </p>

        <h2>Children</h2>
        <p>
          The Service is not intended for anyone under 18, and we do not knowingly process data from
          children.
        </p>

        <h2>Changes to this policy</h2>
        <p>
          We may update this policy from time to time. Changes take effect when posted here, and the
          &quot;Last updated&quot; date will reflect the revision.
        </p>

        <h2>Contact</h2>
        <p>
          Questions or requests? Reach us on Telegram at{" "}
          <a href="https://t.me/Tokensfund" target="_blank" rel="noopener noreferrer">t.me/Tokensfund</a>{" "}
          or at hello@tokensfund.xyz.
        </p>
      </article>
    </main>
  );
}
