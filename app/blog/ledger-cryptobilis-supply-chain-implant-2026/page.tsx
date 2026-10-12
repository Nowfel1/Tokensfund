import Header from "@/components/Header";
import Link from "next/link";

export const metadata = {
  title: "Ledger Wasn't Hacked. The Box Was: The CryptoBilis Implant",
  description:
    "Ledger confirmed a hidden hardware implant in a device sold by Southeast Asian reseller CryptoBilis, after drains estimated at up to $93 million. Ledger's own systems weren't breached — the devices were tampered with before buyers opened them. What's confirmed, what isn't, and how to buy and set up a hardware wallet safely.",
  keywords: [
    "Ledger CryptoBilis implant",
    "Ledger hack October 2026",
    "hardware wallet supply chain attack",
    "buy hardware wallet safely",
    "CryptoBilis reseller",
  ],
  alternates: { canonical: "/blog/ledger-cryptobilis-supply-chain-implant-2026" },
  openGraph: {
    type: "article",
    url: "/blog/ledger-cryptobilis-supply-chain-implant-2026",
    title: "Ledger Wasn't Hacked. The Box Was: The CryptoBilis Implant",
    description:
      "A hidden implant in reseller-sold devices, up to $93M drained. Ledger's systems weren't breached — the box was. What to do now.",
    images: [{ url: "https://tokensfund.xyz/blog/banner_ledger_implant.png", width: 1200, height: 400 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ledger Wasn't Hacked. The Box Was: The CryptoBilis Implant",
    description:
      "A hidden implant in reseller-sold devices, up to $93M drained. Ledger's systems weren't breached — the box was. What to do now.",
    images: ["https://tokensfund.xyz/blog/banner_ledger_implant.png"],
  },
};

export default function Post() {
  return (
    <main className="wrap">
      <Header />

      <article className="blog-post">
        <div className="blog-post-meta">
          <span className="blog-tag">Privacy</span>
          <span className="blog-date">October 12, 2026</span>
        </div>

        <h1>Ledger Wasn&apos;t Hacked. The Box Was</h1>

        <img
          src="/blog/banner_ledger_implant.png"
          alt="A sealed hardware wallet box with a hidden implant inside"
          className="blog-banner"
          style={{ width: "100%", height: "auto", borderRadius: "12px", marginBottom: "2rem" }}
        />

        <p className="warn" style={{ marginBottom: "1.75rem" }}>
          <strong>If you bought a Ledger from CryptoBilis in the last 90 days:</strong> if you
          haven&apos;t set it up, don&apos;t. If you already have, treat it as compromised and move
          your funds to a new wallet with a <em>new</em> recovery phrase, created on a device you
          bought directly from the manufacturer. That is Ledger&apos;s own advice, and it applies
          until the investigation concludes.
        </p>

        <p>
          On 9 October, Ledger said it was investigating reports of stolen funds from users in
          Southeast Asia who had bought devices from <strong>CryptoBilis</strong>, an authorised
          Ledger reseller in Indonesia, Malaysia and the Philippines. It told the reseller to stop
          all sales and shipments. A day later it confirmed the worst-case explanation: one affected
          customer&apos;s device contained an <strong>unauthorised hardware implant</strong>.
        </p>
        <p>
          Estimates of the losses range from about <strong>$72 million to $93 million</strong>.
          One on-chain analysis counted roughly $92.9 million taken from 311 wallets across several
          blockchains, with around $10 million frozen by Tether. CryptoBilis has suspended sales of
          its entire hardware-wallet inventory while the investigation runs.
        </p>

        <h2>The distinction that matters</h2>
        <p>
          Most headlines say &quot;Ledger hack.&quot; Ledger says its own infrastructure, systems
          and services show no sign of compromise, and there have been no reports involving devices
          bought directly from Ledger. Nobody broke Ledger&apos;s cryptography or its servers.
        </p>
        <p>
          What was broken was the <strong>supply chain</strong>: the journey a device takes between
          the factory and your hands. Somewhere along that path, according to Ledger&apos;s
          confirmation, at least one device was opened and fitted with extra hardware before a
          customer ever unsealed it. It is reported to be the first confirmed case of a physical
          implant in a Ledger device linked to a reseller.
        </p>

        <h2>Why this attack works so well</h2>
        <p>
          A hardware wallet&apos;s security rests on one assumption you rarely think about: that the
          device in your hand is the device the manufacturer built. Its secure chip can keep a
          secret from your laptop, from malware, from a compromised website. It cannot protect you
          from the device itself.
        </p>
        <p>
          The weakest moment is setup. When you create a new wallet, the device shows you your
          recovery words so you can write them down. If something on the board can read that screen
          — or the signals feeding it — it doesn&apos;t need to break any encryption. It just
          copies the words. From then on, the attacker can rebuild your wallet on their own
          hardware and wait.
        </p>
        <p>
          <strong>What isn&apos;t confirmed yet:</strong> Ledger has not published its own technical
          findings or confirmed how the implant worked. The widely shared description — a component
          that captures the recovery phrase during setup and sends it out over a cellular
          connection — comes from outside researchers, including former Mt. Gox chief Mark
          Karpelès. It is plausible and consistent with the timing of the drains, but treat it as
          a leading theory rather than an established fact until Ledger publishes.
        </p>

        <h2>The third layer this year</h2>
        <p>
          We have now covered three different ways self-custody can fail without the user doing
          anything wrong:
        </p>
        <ul>
          <li><strong>Software.</strong> <Link href="/blog/fake-wallet-apps-self-custody-software-risk-2026">A counterfeit wallet app</Link> on an official app store.</li>
          <li><strong>Firmware.</strong> <Link href="/blog/coldcard-entropy-flaw-cold-storage-randomness-2026">Coldcard seeds generated with too little randomness</Link>, drained by the thousands of bitcoin.</li>
          <li><strong>Hardware.</strong> A genuine-brand device, sold by an authorised reseller, altered before it was opened.</li>
        </ul>
        <p>
          The lesson isn&apos;t that hardware wallets are unsafe — for most people they are still
          the best option available. It&apos;s that &quot;I use a hardware wallet&quot; is not a
          complete answer to &quot;are my keys safe?&quot;. Every link between the factory and your
          seed phrase is part of your security.
        </p>

        <h2>How to buy and set up a hardware wallet safely</h2>
        <ul>
          <li><strong>Buy directly from the manufacturer.</strong> Even authorised resellers add a link to the chain; in this case, that link failed. If you must use a reseller, choose one the manufacturer lists, and understand the risk you&apos;re accepting.</li>
          <li><strong>Never use a device that comes with a recovery phrase already written down,</strong> or asks you to enter one you didn&apos;t create. A genuine device always generates a new phrase in front of you.</li>
          <li><strong>Inspect the packaging, but don&apos;t rely on it.</strong> Tamper seals can be copied. An intact seal is a minimum, not proof.</li>
          <li><strong>Be careful about which defences actually help here.</strong> After the Coldcard flaw, a BIP-39 passphrase protected people. Against a compromised device it may not, because you would type the passphrase into the same hardware. What does hold up is <strong>multisig across different brands</strong>: if one device is compromised, it still can&apos;t move funds on its own.</li>
          <li><strong>Send a small test amount first,</strong> and watch it for a while before moving savings onto a new device.</li>
          <li><strong>Ignore anyone who contacts you about this.</strong> Ledger has repeated that it will never ask for your 24 words, and a separate phishing campaign is circulating that is not connected to this investigation. Every hack headline produces a wave of fake &quot;recovery&quot; messages.</li>
        </ul>

        <h2>Why the response matters</h2>
        <p>
          Credit where it&apos;s due: Ledger announced the investigation as soon as reports came in,
          stopped the reseller&apos;s sales the same day, told affected buyers exactly what to do,
          and confirmed the implant publicly the next day rather than waiting for certainty.
          That&apos;s the kind of disclosure we argued for when{" "}
          <Link href="/blog/pocket-bitcoin-breach-identity-not-coins-2026">Pocket Bitcoin was
          breached</Link> — fast, specific, and honest about what isn&apos;t yet known.
        </p>
        <p>
          It doesn&apos;t undo anyone&apos;s loss. But it&apos;s the difference between a problem
          you can act on and one you find out about from your empty balance.
        </p>

        <h2>Where TokensFund fits</h2>
        <p>
          Nothing here is solved by a swap service, and we won&apos;t pretend otherwise.
          TokensFund never holds your funds — swaps go from your wallet through THORChain,
          Chainflip, Changee or CCE.Cash to an address you control — but we can&apos;t verify that
          the device holding that address is genuine. If you&apos;re moving funds off a device you
          no longer trust, move them first to a fresh wallet on hardware you bought directly, and
          swap later.
        </p>

        <h2>A note on risk</h2>
        <p>
          Nothing here is financial or security advice. This is a developing investigation; details
          reflect Ledger&apos;s statements and reporting as of 12 October 2026, loss estimates vary
          between sources, and the implant&apos;s exact mechanism has not been confirmed by Ledger.
          Ledger&apos;s own channels are the authoritative source for what affected users should do.
          Never share your recovery phrase with anyone, for any reason.
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
            Compare routes →
          </Link>
        </div>
      </article>
    </main>
  );
}
