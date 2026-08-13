import Logo from "@/components/Logo";
import Link from "next/link";

export const metadata = {
  title: "Cold Storage Didn't Fail. Randomness Did: Inside the $38M Coldcard Sweep",
  description:
    "594 BTC drained from ~500 wallets in 25 minutes. Coinkite has warned that seeds generated on Coldcard Mk3 firmware 4.0.1 through 5.0.3 may be at risk. What actually broke — entropy at seed generation, not the air gap — who is affected, and exactly what to do if you hold one.",
  keywords: [
    "Coldcard vulnerability 2026",
    "Coldcard Mk3 seed risk",
    "Coinkite security advisory",
    "hardware wallet entropy flaw",
    "BIP-39 passphrase protection",
  ],
  alternates: { canonical: "/blog/coldcard-entropy-flaw-cold-storage-randomness-2026" },
  openGraph: {
    type: "article",
    url: "/blog/coldcard-entropy-flaw-cold-storage-randomness-2026",
    title: "Cold Storage Didn't Fail. Randomness Did: Inside the $38M Coldcard Sweep",
    description:
      "594 BTC gone in 25 minutes. The flaw was entropy at seed generation, not the air gap. Who's affected and what to do.",
    images: [{ url: "https://tokensfund.xyz/blog/banner_coldcard_entropy.png", width: 1200, height: 400 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cold Storage Didn't Fail. Randomness Did: Inside the $38M Coldcard Sweep",
    description:
      "594 BTC gone in 25 minutes. The flaw was entropy at seed generation, not the air gap. Who's affected and what to do.",
    images: ["https://tokensfund.xyz/blog/banner_coldcard_entropy.png"],
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
          <span className="blog-date">July 31, 2026</span>
        </div>

        <h1>Cold Storage Didn&apos;t Fail. Randomness Did</h1>

        <img
          src="/blog/banner_coldcard_entropy.png"
          alt="A hardware wallet whose keys were predictable from the moment they were created"
          className="blog-banner"
          style={{ width: "100%", height: "auto", borderRadius: "12px", marginBottom: "2rem" }}
        />

        <p>
          Between 01:31 and 01:56 UTC today, across three Bitcoin blocks, roughly{" "}
          <strong>594.48 BTC — about $38 million — was swept out of around 500 single-signature
          wallets</strong>. On-chain analysts counted some 1,324 UTXOs moved in about 500
          transactions; roughly 562 BTC was then consolidated into a single address that has not
          moved since. Hours later, Coinkite published a security advisory warning that seeds
          generated on its <strong>Coldcard Mk3</strong> hardware wallets running firmware{" "}
          <strong>4.0.1 (March 2021) through 5.0.3</strong> may put funds at risk.
        </p>
        <p>
          If you own a Coldcard, skip straight to the checklist below — the analysis can wait.
        </p>

        <h2>If you hold a Coldcard, do this now</h2>
        <ul>
          <li><strong>Affected window:</strong> a seed <em>generated</em> on a <strong>Mk3</strong> running firmware 4.0.1 through 5.0.3. Researchers at Block describe seeds created on Mk2 or Mk3 under firmware 4.0.0–4.1.9 as a confirmed vulnerable path. Devices that never ran version 4 — and Coinkite&apos;s Tapsigner, Opendime and Satscard, which use separate codebases — are not affected.</li>
          <li><strong>If you used a BIP-39 passphrase</strong> on top of the seed, Coinkite&apos;s early analysis puts you at minimal risk. Note the distinction the advisory draws explicitly: a BIP-39 passphrase is <em>not</em> the device PIN. And a passphrase you have ever typed into a website, phone or untrusted computer is no longer protection.</li>
          <li><strong>If you did not use a passphrase or substantial independent dice rolls, treat the seed as compromised.</strong> Coinkite&apos;s recommended path: generate an entirely new seed on an unaffected device, verify the backup, verify the receive address, send a small test transaction, and only then move the balance. As an interim measure if you cannot migrate immediately, create a strong unique BIP-39 passphrase on the Mk3 and move funds to that new passphrase-protected wallet.</li>
          <li><strong>Importing the old seed elsewhere does not fix it.</strong> This is the point people miss. The weakness is in the seed itself, not the device holding it — a vulnerable seed restored into a different wallet is still a vulnerable seed. You need a <em>new</em> seed, not a new interface.</li>
          <li><strong>Do not rush.</strong> Coinkite&apos;s own guidance stresses deliberate migration over panic. Verify addresses, keep old backups until the migration is confirmed complete, and remember that a hurried self-custody move is exactly the condition{" "}<Link href="/blog/fake-wallet-apps-self-custody-software-risk-2026">fake wallets and &quot;support&quot; scammers</Link> are waiting for. Nobody legitimate will DM you about this.</li>
          <li><strong>Newer models: watch this space.</strong> Coinkite says Mk4, Q and Mk5 are unaffected based on early analysis. Block&apos;s researchers report those models draw entropy from a secure element but retain only a few bytes of it — a weaker version of the same class of problem, per their reading. Coinkite has said a formal technical review is coming. Treat &quot;unaffected&quot; as provisional until it lands.</li>
        </ul>

        <h2>What actually broke</h2>
        <p>
          A 12-word BIP-39 seed is supposed to carry 128 bits of entropy — a number so large that
          guessing it is not a thing that happens. The reported flaw is that affected devices did
          not reseed their randomness securely: instead of using the hardware random number
          generator, the firmware fell back to software-based generation drawn from
          <em> non-secret chip data</em> — a predictable counter incorporating things like the
          device serial number and internal clock, according to Block&apos;s analysis.
        </p>
        <p>
          Collapse the search space far enough and the attack stops being cryptography and becomes
          enumeration. Someone generates candidate seeds, derives the addresses, checks which ones
          hold coins, and then — at a moment of their choosing — signs 500 transactions at once.
          That&apos;s why the sweep took 25 minutes rather than months: the hard work happened
          offline, in advance, and the on-chain part was just harvesting.
        </p>
        <p>
          Which is exactly why the popular framing on X today — &quot;even cold wallets
          aren&apos;t safe&quot; — gets the lesson backwards. <strong>Nothing about the air gap
          failed.</strong> No malware touched these devices; no seed was exfiltrated; the offline
          model did its job. The keys were guessable <em>from the moment they were born</em>, and
          an air gap cannot protect a secret that was never secret enough. Cold storage defends
          against key <em>exfiltration</em>. It has never defended against key <em>predictability</em>.
          Those are different threats and this one hit the second.
        </p>

        <h2>The defences that worked</h2>
        <p>
          Notice what protected people, because it&apos;s an unusually clean natural experiment.
          A BIP-39 passphrase worked, because it adds a secret the device never generated. Dice
          rolls worked, because they inject entropy from a source that has nothing to do with the
          firmware. Multisig with keys from <em>different manufacturers</em> worked, because a flaw
          in one vendor&apos;s RNG doesn&apos;t compromise a quorum. Every effective defence here
          has the same shape: <strong>don&apos;t let one implementation be the sole source of your
          randomness or your authority.</strong> That&apos;s the durable takeaway, and it applies
          to whatever hardware you own — this was Coinkite&apos;s bug, but weak-entropy bugs have
          hit many products over the years, and they will again.
        </p>
        <p>
          Credit where it&apos;s due, too: Coinkite disclosed publicly and prominently, on its own
          firmware download page, within hours — not in a buried changelog. Compare that to the
          alternative, which is a vendor quietly patching and hoping. It doesn&apos;t undo
          anyone&apos;s loss, and the flaw sat in shipping firmware for years, which is its own
          serious failure. But the disclosure behaviour is the part other vendors should copy.
        </p>

        <h2>Three days, three layers</h2>
        <p>
          On Tuesday we wrote that{" "}
          <Link href="/blog/fake-wallet-apps-self-custody-software-risk-2026">self-custody&apos;s
          failure mode is software</Link> — the counterfeit-wallet lawsuit. This week two
          exchanges, <Link href="/blog/bitmart-bitmex-exchange-winddown-wave-2026">BitMEX and
          BitMart, scheduled their own shutdowns</Link>. Today the hardware itself. It would be
          easy to read that sequence as &quot;nothing is safe.&quot; The more useful reading is
          that every layer has a failure mode, and they differ in one crucial property:{" "}
          <em>whether you can do anything about it</em>.
        </p>
        <p>
          When an exchange fails, you are a creditor. No amount of diligence on your part changes
          the outcome — you found out when the withdrawal button went grey. Today&apos;s flaw is
          brutal, and it cost people real money, but it is <em>detectable and recoverable</em>:
          there is a published affected range, a checklist, and a migration path, and the great
          majority of Coldcard holders will read the advisory and rotate without losing anything.
          One category of risk yields to attention. The other doesn&apos;t yield to anything.
          That asymmetry is still the whole argument for holding your own keys — stated honestly,
          including on the days when holding your own keys is what hurt.
        </p>
        <p>
          For what it&apos;s worth on our side of it: TokensFund never holds your funds or touches
          your keys — swaps route from your wallet through THORChain, Chainflip, NEAR Intents,
          Changee or CCE.Cash to an address you control, no account, no KYC for standard swaps.
          That architecture removes a custodian from the picture. It cannot generate entropy for
          you, verify your firmware, or undo a predictable seed. Nothing can. Rotate first, swap
          later.
        </p>

        <h2>A note on risk</h2>
        <p>
          Nothing here is financial or security advice, and this is a developing story: figures and
          technical details reflect reporting and Coinkite&apos;s advisory as of July 31, 2026, and
          the company has said a formal technical review is still to come. Coinkite has not
          confirmed a definitive link between the sweep and the seed-generation flaw; researchers
          consider weak entropy the likely cause. Block researchers have also flagged an earlier
          set of transactions totalling roughly 488 BTC that may share the same fingerprint, which
          would raise the total materially — treat that as preliminary. <strong>Follow
          Coinkite&apos;s own advisory as the authoritative source for what to do with your
          device</strong>, verify everything twice, and be extremely suspicious of anyone who
          contacts you first about your funds.
        </p>

        <div className="blog-cta">
          <p>Rotate first. Swap later.</p>
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
