import Header from "@/components/Header";
import Link from "next/link";

export const metadata = {
  title: "Your Coins Were Safe. Your Identity Wasn't: The Pocket Bitcoin Breach",
  description:
    "A Swiss non-custodial Bitcoin service was breached in August. No private keys were taken and no funds were at risk — yet 291 customers had their identity documents linked to the Bitcoin addresses they used, and 5,120 had names, addresses and bank transfer details exposed. Why non-custodial protects your coins but not your identity, and what to do about it.",
  keywords: [
    "Pocket Bitcoin data breach",
    "KYC data breach crypto",
    "bitcoin address deanonymization",
    "non-custodial privacy risk",
    "crypto exchange data leak 2026",
  ],
  alternates: { canonical: "/blog/pocket-bitcoin-breach-identity-not-coins-2026" },
  openGraph: {
    type: "article",
    url: "/blog/pocket-bitcoin-breach-identity-not-coins-2026",
    title: "Your Coins Were Safe. Your Identity Wasn't: The Pocket Bitcoin Breach",
    description:
      "No keys taken, no funds at risk — and 291 customers permanently linked to their Bitcoin addresses. Non-custodial protects coins, not identity.",
    images: [{ url: "https://tokensfund.xyz/blog/banner_pocket_breach.png", width: 1200, height: 400 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Your Coins Were Safe. Your Identity Wasn't: The Pocket Bitcoin Breach",
    description:
      "No keys taken, no funds at risk — and 291 customers permanently linked to their Bitcoin addresses. Non-custodial protects coins, not identity.",
    images: ["https://tokensfund.xyz/blog/banner_pocket_breach.png"],
  },
};

export default function Post() {
  return (
    <main className="wrap">
      <Header />

      <article className="blog-post">
        <div className="blog-post-meta">
          <span className="blog-tag">Privacy</span>
          <span className="blog-date">September 4, 2026</span>
        </div>

        <h1>Your Coins Were Safe. Your Identity Wasn&apos;t</h1>

        <img
          src="/blog/banner_pocket_breach.png"
          alt="A secure vault of coins beside an open filing cabinet of identity documents"
          className="blog-banner"
          style={{ width: "100%", height: "auto", borderRadius: "12px", marginBottom: "2rem" }}
        />

        <p>
          Pocket Bitcoin is a regulated Swiss service that sells bitcoin to customers. It is{" "}
          <strong>non-custodial</strong> — it never holds your coins, never holds your keys, and
          delivers purchases directly to an address you control. By the standard we argue for on
          this site constantly, it is built the right way.
        </p>
        <p>
          In August it was breached. No private keys were taken. No customer bitcoin was at risk.
          And <strong>5,411 customers were harmed anyway</strong>, some of them permanently.
        </p>
        <p>
          That combination is the whole lesson, and it is one we should state plainly because it
          complicates our own argument: non-custodial architecture protects your <em>coins</em>. It
          does nothing whatsoever to protect your <em>identity</em>.
        </p>

        <h2>What happened</h2>
        <p>
          An attacker had access to Pocket Bitcoin&apos;s customer support system for roughly a
          week in mid-August. The company detected the intrusion while it was in progress, cut off
          access on 16 August, confirmed on 19 August that an internal database had been copied,
          disclosed publicly on 21 August, and published a detailed breakdown on 31 August after
          completing its investigation. It notified authorities in Switzerland and Liechtenstein
          and filed a police report.
        </p>
        <p>Two groups were affected, and the distinction matters enormously:</p>
        <ul>
          <li><strong>5,120 customers</strong> appeared in transaction lists that partner banks had sent during compliance checks. Exposed: names, residential addresses, transfer amounts, transaction dates, and in some cases the IBAN used.</li>
          <li><strong>291 customers</strong> had it far worse. Their correspondence with partner banks was stored in the affected system, and depending on the case that included names, postal addresses, <strong>the Bitcoin addresses used in their transactions</strong>, copies of identity documents, and source-of-funds documentation.</li>
        </ul>
        <p>
          A wider group had email addresses and support conversations exposed — including
          attachments sent through email, Telegram and WhatsApp.
        </p>
        <p>
          Crucially, Pocket Bitcoin&apos;s core customer and transaction databases were{" "}
          <em>not</em> breached. The sensitive material leaked because copies of bank
          correspondence had been retained inside the support system. The data escaped through the
          side door, not the front.
        </p>

        <h2>Why the 291 is the number that matters</h2>
        <p>
          Bitcoin&apos;s ledger is public. That is the design. Anyone can see every transaction
          any address has ever made, and every transaction it makes in future. The only thing
          standing between that public record and your name is the absence of a link between them.
        </p>
        <p>
          For those 291 people, that link now exists in a copied database somewhere. Their real
          name, their home address, their government ID, and the Bitcoin addresses they used — in
          one file. Anyone holding it can look up those addresses on a block explorer and read the
          entire history: what they bought, when, how much, and where it went afterwards. Going
          forward, too.
        </p>
        <p>
          <strong>You cannot undo this.</strong> A leaked password gets changed in thirty seconds.
          A leaked credit card gets reissued. A leaked link between your identity and a public
          blockchain address is permanent, because the blockchain is permanent. The company did not
          lose money that can be repaid; it lost information that cannot be un-lost.
        </p>
        <p>
          And there is a harder edge to it. Names, home addresses and transaction amounts, in one
          list, is a targeting document. The crypto industry has spent two years watching a rise in
          physical robberies of known holders. This is exactly the raw material those attacks are
          built from — which is why the affected group&apos;s risk is not merely theoretical
          embarrassment.
        </p>

        <h2>To be fair to Pocket Bitcoin</h2>
        <p>
          It would be easy and cheap to make this a story about a careless company. It isn&apos;t
          one, and pretending otherwise would let the real lesson escape.
        </p>
        <p>
          They detected an intrusion in progress rather than learning about it months later from a
          researcher. They cut access within days, disclosed within five days of confirming, filed
          with two regulators and the police, published a specific breakdown rather than a vague
          statement, and contacted every affected customer individually about their particular
          exposure. Compare that to{" "}
          <Link href="/blog/coldcard-exploit-update-still-ongoing-2026">disclosure practices we
          have covered this year</Link> and it is close to a model response.
        </p>
        <p>
          More importantly: <strong>they were required by law to collect most of this data.</strong>{" "}
          A regulated service must verify identity and, for many transactions, the source of funds.
          The correspondence with partner banks that leaked exists because compliance requires it
          to exist. Pocket Bitcoin did not hoard this information out of carelessness — it was the
          cost of operating legally.
        </p>
        <p>
          Which is the uncomfortable conclusion. The vulnerability was not a bug in their systems.
          It was the data itself. Every regulated on-ramp on earth holds a version of this file,
          and{" "}
          <Link href="/blog/coinex-sanctions-exchange-surveillance-2026">as we wrote in June</Link>,
          data that exists can be breached, subpoenaed, sold in a bankruptcy, or copied by an
          employee. Good security reduces the probability. It never reaches zero, and the damage
          when it fails is permanent.
        </p>

        <h2>If you were affected — or want to reduce your exposure</h2>
        <ul>
          <li><strong>Treat the identity-to-address link as permanent.</strong> It cannot be revoked. Plan around it rather than hoping.</li>
          <li><strong>Move funds to addresses that were never in the leak.</strong> This does not erase the history of the old addresses, but it stops your <em>future</em> activity from being trivially attributable. Use a fresh wallet, not just a fresh address in the same one, if the exposure was significant.</li>
          <li><strong>Expect targeted phishing.</strong> Attackers now have names, addresses, email histories and support conversations. Messages will be convincing and will reference real details. No legitimate service will ever ask for your seed phrase, and any &quot;urgent security migration&quot; contact should be assumed hostile.</li>
          <li><strong>Take the physical-security element seriously</strong> if your exposure included amounts. Consider what is publicly linkable to your home address.</li>
          <li><strong>Stop reusing addresses, permanently.</strong> A fresh receive address per transaction is the single highest-value habit in Bitcoin privacy — it is what limits how much any future leak can reveal. Most modern wallets do this automatically; check that yours does.</li>
        </ul>

        <h2>What this means for how you buy</h2>
        <p>
          We are not going to tell you to avoid regulated on-ramps. Most people need a fiat entry
          point, those are the legal route, and following the law where you live is not optional.
        </p>
        <p>
          But there is a distinction worth understanding. Converting fiat to crypto generally
          requires identity verification. Converting one crypto asset you <em>already own</em> into
          another does not have to — and every time you route that through a KYC&apos;d platform,
          you add another copy of your identity to another company&apos;s database, for a
          transaction that never required it.
        </p>
        <p>
          That is the gap TokensFund fills. Swaps run wallet to wallet across THORChain, Chainflip,
          Changee and CCE.Cash, routed to the best rate, with no account and no KYC for standard
          swaps and a flat 1% inside the quote. We collect no identity documents, so there is no
          file to lose. It is not a substitute for a fiat on-ramp; it is a reason not to use one
          more often than you need to.
        </p>

        <h2>A note on risk</h2>
        <p>
          Nothing here is financial, legal or security advice. Details reflect Pocket Bitcoin&apos;s
          published disclosures of 21 and 31 August 2026 and contemporaneous reporting; the company
          states no misuse of the exposed data has been detected. Nothing in this article alleges
          negligence. You remain responsible for complying with the laws and tax obligations that
          apply where you live — reducing unnecessary data exposure is not the same as avoiding
          obligations.
        </p>

        <div className="blog-cta">
          <p>No account. No documents. Nothing to leak.</p>
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
            Compare routes →
          </Link>
        </div>
      </article>
    </main>
  );
}
