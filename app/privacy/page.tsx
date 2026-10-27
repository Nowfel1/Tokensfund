import Header from "@/components/Header";

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
      <Header />

      <article className="blog-post">
        <h1>Privacy Policy</h1>
        <p style={{ color: "#8a93a8", fontSize: "14px" }}>Last updated: October 22, 2026</p>

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
          When you create a swap, we store an order record: the provider, the assets and amount, the
          amount you were quoted to receive, your destination and refund addresses, the deposit
          address, the provider&apos;s tracking reference, and a random order code. We keep it so you
          can check your swap through your private order link and so we can help if something goes
          wrong. Order records do not contain your name, email address, IP address, or any account
          details.
        </p>
        <p>
          Our hosting provider, Vercel, receives standard technical data with every request — such as
          IP address, browser type, and timestamps — to deliver and protect the site, and keeps it in
          short-lived logs under its own retention settings. We use Vercel Web Analytics to count page
          views. It sets no cookies and stores only anonymized data: visitors are identified by a hash
          created from the request, which resets every day, so they can&apos;t be tracked across days
          or across websites.
        </p>
        <p>
          TokensFund is also available as a Tor onion service at{" "}
          <code>tokenstmefedtvgjqxvfxf22f4oxudsp3ord6yep5nzra4pgihi4cwid.onion</code>. Requests to the onion address are passed to our site through our own
          server, which keeps no access logs for them, so our hosting provider sees our server rather
          than you.
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
          We share swap details with the third-party protocol that executes your swap — THORChain, Chainflip, Changee or CCE.Cash — because they need your destination and
          refund addresses to complete the transaction. Each operates independently and under its own
          privacy practices, which we do not control. We also rely on Vercel (hosting and
          analytics) and Neon (database hosting) to run the Service. Prices come from CoinGecko,
          which receives no information about you. We may disclose information if required by law
          or valid legal process.
        </p>

        <h2>Cookies</h2>
        <p>
          TokensFund sets no cookies and stores nothing in your browser, and Vercel Web Analytics is
          cookieless. Our homepage shows a review widget from Trustpilot and a badge image from
          Monerica, which load from their own servers — your browser contacts those services when you
          view the homepage, and Trustpilot&apos;s widget operates under Trustpilot&apos;s own privacy
          and cookie practices.
        </p>

        <h2>Data retention</h2>
        <p>
          Order records are kept until you ask us to delete them — send us your order code and
          we&apos;ll remove the record. Vercel keeps request logs only for a short period under its
          own retention settings. The analytics visitor hash resets every day; only aggregate page
          counts remain.
        </p>

        <h2>Your rights</h2>
        <p>
          Depending on where you live, you may have rights to access, correct, or delete personal
          data we hold about you, or to object to certain processing. Because we don&apos;t maintain
          accounts and hold very little personal data, there is often little for us to act on — but
          you can ask us at any time for a copy of an order record we hold, or ask us to delete it.
          Because records aren&apos;t linked to your identity, we&apos;ll need the order code or the
          deposit address to find yours.
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
          <a href="https://t.me/Tokensfund" target="_blank" rel="noopener noreferrer">t.me/Tokensfund</a>.
        </p>
      </article>
    </main>
  );
}
