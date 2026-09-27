import Header from "@/components/Header";
import Link from "next/link";

export const metadata = {
  title: "Bitcoin Just Proved a Quantum Escape Hatch Works. Now Read the Limits",
  description:
    "On 26 August a transaction was mined in block 964,199 whose security rests on hash preimage resistance rather than elliptic curves — the first quantum-safe Bitcoin spend, with no soft fork and no consensus change. It cost hours of GPU time, had to be handed directly to a miner, and protects almost nothing you own today. Why it still matters.",
  keywords: [
    "quantum safe bitcoin transaction",
    "QSB StarkWare Avihu Levy",
    "bitcoin quantum threat Shor",
    "bitcoin address reuse public key",
    "post quantum crypto bitcoin",
  ],
  alternates: { canonical: "/blog/bitcoin-quantum-safe-transaction-qsb-2026" },
  openGraph: {
    type: "article",
    url: "/blog/bitcoin-quantum-safe-transaction-qsb-2026",
    title: "Bitcoin Just Proved a Quantum Escape Hatch Works. Now Read the Limits",
    description:
      "The first quantum-safe Bitcoin spend was mined on 26 August — no soft fork required. It also cost hours of GPU time and protects almost nothing you own today.",
    images: [{ url: "https://tokensfund.xyz/blog/banner_quantum_bitcoin.png", width: 1200, height: 400 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bitcoin Just Proved a Quantum Escape Hatch Works. Now Read the Limits",
    description:
      "The first quantum-safe Bitcoin spend was mined on 26 August — no soft fork required. It also cost hours of GPU time and protects almost nothing you own today.",
    images: ["https://tokensfund.xyz/blog/banner_quantum_bitcoin.png"],
  },
};

export default function Post() {
  return (
    <main className="wrap">
      <Header />

      <article className="blog-post">
        <div className="blog-post-meta">
          <span className="blog-tag">Privacy</span>
          <span className="blog-date">August 29, 2026</span>
        </div>

        <h1>Bitcoin Just Proved a Quantum Escape Hatch Works</h1>

        <img
          src="/blog/banner_quantum_bitcoin.png"
          alt="A Bitcoin output secured by a hash lock rather than an elliptic curve key"
          className="blog-banner"
          style={{ width: "100%", height: "auto", borderRadius: "12px", marginBottom: "2rem" }}
        />

        <p>
          On 26 August, a transaction was mined into Bitcoin block <strong>964,199</strong> — a
          10,000-satoshi output, a rounding error in value, and the most interesting thing that
          happened in crypto this month. Its security does not rest on elliptic-curve
          cryptography. It rests on the difficulty of inverting a hash. It is the first
          quantum-safe Bitcoin spend, and it required <em>no soft fork and no change to
          Bitcoin&apos;s consensus rules whatsoever</em>.
        </p>
        <p>
          The construction is called Quantum-Safe Bitcoin, designed by StarkWare researcher Avihu
          Levy, who published the underlying research in April and, by several accounts, built it
          on his own time. Engineer Tomer Giladi turned it into a working mainnet transaction.
        </p>

        <h2>What the quantum threat to Bitcoin actually is</h2>
        <p>
          It is narrower than the headlines suggest, and the shape of it matters for what follows.
        </p>
        <p>
          Bitcoin signatures use elliptic-curve cryptography. A sufficiently large quantum computer
          running Shor&apos;s algorithm could derive a private key from a public key. But for a
          standard unspent address, the public key isn&apos;t published — the address is a{" "}
          <em>hash</em> of it. The key only becomes visible at the moment you spend: your
          transaction reveals it, and it sits in the mempool unconfirmed for some minutes before a
          block includes it.
        </p>
        <p>
          That window is the attack surface. A quantum adversary would need to see your public key,
          derive the private key, and broadcast a competing transaction before yours confirms. Which
          also explains the one thing most people get wrong: <strong>the coins genuinely at risk are
          the ones whose public keys are already exposed</strong> — reused addresses, old
          pay-to-public-key outputs, anything that has already been spent from. Those keys are
          public forever. No future upgrade retroactively hides them.
        </p>

        <h2>How QSB gets around it without changing Bitcoin</h2>
        <p>
          This is the clever part. Rather than adding a new signature type — which would require a
          soft fork and years of governance — Levy&apos;s construction abuses Bitcoin&apos;s
          existing rules.
        </p>
        <p>
          It uses a technique called <strong>signature grinding</strong>. The sender searches
          offchain, over sequence and locktime values, until they find a transaction whose
          RIPEMD-160 hash happens to look like a validly formatted DER-encoded ECDSA signature. The
          published design estimates this at roughly one in 2<sup>46</sup> attempts. Bitcoin&apos;s
          existing verification machinery accepts the result — but the security no longer comes
          from keeping an elliptic-curve secret. It comes from hash preimage resistance, which
          Shor&apos;s algorithm doesn&apos;t break. The implementation estimates around 118-bit
          second-preimage resistance against a quantum attacker.
        </p>
        <p>
          Notably, it doesn&apos;t use STARKs — StarkWare&apos;s own technology, which is
          post-quantum secure. It runs entirely inside Bitcoin, built from tools Bitcoin already
          has.
        </p>

        <h2>Now the limits, which are severe</h2>
        <p>
          StarkWare has been unusually straight about this, and their CEO Eli Ben-Sasson put it
          plainly: this should not be read as saying Bitcoin is prepared for the quantum threat.
          Far from it.
        </p>
        <ul>
          <li><strong>It is expensive and slow.</strong> Producing one QSB spend takes hours of computation across high-end GPUs. Published estimates of the cost range from roughly $75 to a few hundred dollars per transaction — orders of magnitude above a normal Bitcoin fee.</li>
          <li><strong>It can&apos;t travel normally.</strong> The script format is nonstandard, so ordinary nodes won&apos;t relay it through the public mempool. This transaction had to be handed directly to a miner through MARA&apos;s Slipstream service. A defence that depends on knowing a miner is not a defence available to everyone.</li>
          <li><strong>It protects a narrow slice.</strong> It works for legacy outputs. It does not secure Taproot outputs, Lightning channels, or — crucially — any address whose public key has already been exposed. The coins in most danger are precisely the ones it cannot help.</li>
          <li><strong>Bitcoin itself is unchanged.</strong> QSB protects specific coins moved into a hash-based output. The network&apos;s signature scheme is exactly as quantum-vulnerable as it was last week.</li>
        </ul>

        <h2>So why does it matter?</h2>
        <p>
          Because it moves a question from &quot;someday, if governance agrees&quot; to
          &quot;demonstrably possible now.&quot;
        </p>
        <p>
          The assumption for years has been that protecting Bitcoin from quantum attack requires a
          protocol change — which means a soft fork, which means the kind of multi-year
          coordination fight Bitcoin is famously bad at. This transaction shows there is an
          emergency path that does not need anyone&apos;s permission. It is expensive, awkward and
          limited, but it exists, and it exists <em>before</em> the emergency rather than during
          it. StarkWare still argues a soft fork is the right long-term answer. They are right. But
          the fallback is no longer theoretical.
        </p>
        <p>
          It also fits a pattern we have written about repeatedly this year. Zcash quarantined a
          proof-circuit flaw with{" "}
          <Link href="/blog/zcash-ironwood-turnstile-supply-integrity-2026">a turnstile built from
          its own arithmetic</Link>. THORChain shipped{" "}
          <Link href="/blog/thorchain-320-native-xmr-zec-2026">TSS hardening after a signature
          exploit</Link>. The Coldcard entropy failure{" "}
          <Link href="/blog/coldcard-exploit-update-still-ongoing-2026">showed what happens when
          randomness is quietly wrong</Link>. Cryptographic systems fail slowly and then suddenly,
          and the interesting work is always the preparation done before anyone is forced to do it.
        </p>

        <h2>What you can actually do about it</h2>
        <p>
          Nothing in this requires you to act today — a quantum computer capable of this
          doesn&apos;t exist yet, and anyone selling you urgency is selling you something. But the
          threat model does point at one habit worth having anyway:
        </p>
        <p>
          <strong>Don&apos;t reuse addresses.</strong> An address you have spent from has published
          its public key permanently. That is the exposure quantum attacks target, and it is also
          the thing that lets anyone trivially link your transactions today. The same discipline
          protects you from a hypothetical future adversary and from a very real present one, which
          is a rare thing in security. Use a wallet that generates a fresh receive address each
          time — most modern ones do this by default.
        </p>
        <p>
          Beyond that: keys in your own custody, backed up offline. A protocol-level quantum
          upgrade, when it comes, will be something your wallet software adopts — which only helps
          if the coins are somewhere you control rather than{" "}
          <Link href="/blog/bitmart-bitmex-exchange-winddown-wave-2026">on a platform that may not
          be around</Link> for it.
        </p>
        <p>
          TokensFund compares THORChain, Chainflip, Changee and CCE.Cash on every swap and routes
          wallet to wallet — no account, no KYC for standard swaps, flat 1% inside the quote. Every
          swap lands at an address you generated, which is the version of this that stays true
          regardless of what breaks next.
        </p>

        <h2>A note on risk</h2>
        <p>
          Nothing here is financial or security advice. Details reflect StarkWare&apos;s
          announcement and contemporaneous reporting as of 29 August 2026; cost estimates for a QSB
          transaction vary meaningfully between sources. No quantum computer capable of breaking
          elliptic-curve cryptography is known to exist, and timelines for one are speculative.
          QSB is an experimental construction, not a product — do not attempt to use it with real
          funds without understanding it thoroughly.
        </p>

        <div className="blog-cta">
          <p>Swap to addresses you control</p>
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
