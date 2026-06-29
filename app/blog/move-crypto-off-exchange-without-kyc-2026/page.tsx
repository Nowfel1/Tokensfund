import Logo from "@/components/Logo";
import Link from "next/link";

export const metadata = {
  title: "How to Move Your Crypto Off an Exchange (and Swap It Without KYC)",
  description:
    "A step-by-step guide to taking self-custody of your crypto: choosing a wallet, backing up your seed phrase, withdrawing safely from an exchange, and swapping between assets non-custodially with no account and no KYC.",
  keywords: [
    "move crypto off exchange",
    "how to self custody crypto",
    "withdraw crypto to wallet",
    "non custodial swap no KYC",
    "self custody guide 2026",
  ],
  alternates: { canonical: "/blog/move-crypto-off-exchange-without-kyc-2026" },
  openGraph: {
    type: "article",
    url: "/blog/move-crypto-off-exchange-without-kyc-2026",
    title: "How to Move Your Crypto Off an Exchange (and Swap It Without KYC)",
    description:
      "Take self-custody step by step — wallet, seed phrase, safe withdrawal — then swap between assets non-custodially with no account.",
    images: [{ url: "https://tokensfund.xyz/blog/banner_self_custody.png", width: 1200, height: 400 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "How to Move Your Crypto Off an Exchange (and Swap It Without KYC)",
    description:
      "Take self-custody step by step — wallet, seed phrase, safe withdrawal — then swap between assets non-custodially with no account.",
    images: ["https://tokensfund.xyz/blog/banner_self_custody.png"],
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
          <span className="blog-tag">Guide</span>
          <span className="blog-date">June 29, 2026</span>
        </div>

        <h1>How to Move Your Crypto Off an Exchange (and Swap It Without KYC)</h1>

        <img
          src="/blog/banner_self_custody.png"
          alt="How to move your crypto off an exchange into self-custody"
          className="blog-banner"
          style={{ width: "100%", height: "auto", borderRadius: "12px", marginBottom: "2rem" }}
        />

        <p>
          If your crypto is sitting on an exchange, you don&apos;t actually hold it — the exchange
          does, and you hold an IOU. That distinction stays abstract right up until it isn&apos;t:
          an exchange freezes withdrawals, gets delisted in your region, suffers a breach, or fails
          outright. Moving your coins into a wallet you control removes that dependency. Here&apos;s
          how to do it properly, step by step, and how to keep swapping between assets afterward
          without handing them back to a custodian.
        </p>

        <h2>Why move off an exchange?</h2>
        <p>
          The old phrase &quot;not your keys, not your coins&quot; is just describing custody. When
          an exchange holds your private keys, your access depends on that company staying solvent,
          online, and willing to let you withdraw — exactly the things that come under pressure
          during market stress, regulatory shifts, or a hack. Recent examples are everywhere: spot
          ETF outflows, exchanges restricting users under new EU rules, and the steady drumbeat of
          custodial platform breaches. Self-custody sidesteps all of it.
        </p>
        <p>
          The trade-off is honest and worth stating up front: <strong>self-custody means you are
          your own bank.</strong> No one can freeze your funds — but no one can recover them for you
          either if you lose your keys. Done carefully, that&apos;s a feature. Done carelessly,
          it&apos;s a risk. The steps below are about doing it carefully.
        </p>

        <h2>Step 1: Get a wallet you control</h2>
        <p>
          A self-custodial (or &quot;non-custodial&quot;) wallet is one where <em>you</em> hold the
          private keys, not a company. There are two broad types:
        </p>
        <ul>
          <li><strong>Hardware wallets (cold storage)</strong> keep your keys on a dedicated offline device that signs transactions without exposing the keys to the internet. Best for any amount you care about holding long-term.</li>
          <li><strong>Software wallets (hot wallets)</strong> are apps on your phone or browser. More convenient for smaller, active balances, but the keys live on an internet-connected device, so the security bar is lower.</li>
        </ul>
        <p>
          Use a reputable, widely-reviewed wallet, and buy hardware devices only directly from the
          manufacturer — never second-hand or from a marketplace reseller, since a tampered device
          can be pre-loaded to steal funds. A common, sensible setup is a hardware wallet for the
          bulk of your holdings and a software wallet for smaller amounts you move often.
        </p>

        <h2>Step 2: Back up your seed phrase — safely</h2>
        <p>
          When you set up the wallet, it generates a <strong>seed phrase</strong> (usually 12 or 24
          words). That phrase <em>is</em> your wallet — anyone who has it can take your funds, and if
          you lose it with no other copy, your funds are gone forever. So:
        </p>
        <ul>
          <li>Write it down on paper (or stamp it into metal for fire/water resistance). Store it offline.</li>
          <li><strong>Never</strong> type it into a website, photograph it, store it in a notes app, email it to yourself, or paste it into a chat. Digital copies are how most people get drained.</li>
          <li><strong>No legitimate support team, wallet, or exchange will ever ask for your seed phrase.</strong> Anyone who does is scamming you — full stop.</li>
          <li>Consider a second copy in a separate secure location so a single fire or flood can&apos;t wipe out access.</li>
        </ul>

        <h2>Step 3: Withdraw from the exchange to your wallet</h2>
        <p>
          Now move the coins. The mechanics are simple, but a few checks prevent the mistakes that
          actually lose people money:
        </p>
        <ol>
          <li>In your wallet, find the <strong>receive address</strong> for the specific asset you&apos;re withdrawing (a Bitcoin address for BTC, an Ethereum address for ETH, and so on).</li>
          <li>On the exchange, start a withdrawal and paste that address. <strong>Confirm the network matches</strong> — sending an asset on the wrong chain (e.g. the wrong network for a stablecoin) is one of the most common ways funds vanish permanently.</li>
          <li>Verify the address carefully. Clipboard-hijacking malware can swap a copied address for an attacker&apos;s — check the first and last several characters match what your wallet shows.</li>
          <li><strong>Send a small test amount first.</strong> Confirm it arrives in your wallet before sending the rest. The network fee on a test is a tiny price for peace of mind.</li>
          <li>Once the test lands, withdraw the remainder.</li>
        </ol>

        <h2>Step 4: Swap between assets without going back to a custodian</h2>
        <p>
          Here&apos;s the part most guides miss. Once your crypto is in self-custody, what happens
          when you want to swap one asset for another — say BTC into ETH, or into a stablecoin? The
          default answer is &quot;send it back to an exchange,&quot; which undoes everything you just
          did and re-exposes you to custodial risk and KYC.
        </p>
        <p>
          You don&apos;t have to. A non-custodial swap lets you trade directly from your own wallet.
          TokensFund is an aggregator that compares rates across established protocols and routes
          your swap to the best one — without ever holding your funds. There&apos;s no account, no
          email, and no KYC for standard swaps, and the fee (a flat 2%) is already shown in the quote.
        </p>
        <ol>
          <li>Go to <Link href="/">tokensfund.xyz</Link></li>
          <li>Choose what you&apos;re sending and what you want to receive</li>
          <li>Enter the amount — a live estimate updates instantly</li>
          <li>Enter your own receiving address (your self-custodial wallet), then a refund address</li>
          <li>Click <strong>&quot;Compare routes&quot;</strong> and pick the best rate</li>
          <li>Send from your wallet to the one-time deposit address — the swapped funds arrive back in your wallet automatically</li>
        </ol>
        <p>
          Your coins go wallet-to-wallet the whole way; nothing sits in a custodial account in
          between. More on why that matters:{" "}
          <Link href="/blog/why-non-custodial-swaps-protect-privacy-2026">why non-custodial swaps
          protect your privacy and your funds</Link>.
        </p>

        <h2>Common mistakes to avoid</h2>
        <ul>
          <li><strong>Wrong network.</strong> Always match the chain on both ends. A test transaction catches this before it costs you.</li>
          <li><strong>Seed phrase exposure.</strong> No screenshots, no cloud, no &quot;support&quot; ever needs it. This is the single biggest cause of lost funds.</li>
          <li><strong>Skipping the test send.</strong> A small first transfer is cheap insurance on a large withdrawal.</li>
          <li><strong>Trusting a pasted address blindly.</strong> Verify the characters against your wallet to defeat clipboard malware.</li>
          <li><strong>Keeping everything hot.</strong> Large, long-term holdings belong in cold storage, not a browser extension.</li>
        </ul>

        <h2>A note on responsibility</h2>
        <p>
          Self-custody puts you in full control, which means the security is now yours to maintain —
          protect your seed phrase, keep your devices clean, and stay alert to phishing. None of this
          is financial advice; it&apos;s a practical walkthrough of taking custody of assets you
          already own. Move deliberately, test as you go, and you remove a whole category of risk
          from your crypto.
        </p>

        <div className="blog-cta">
          <p>Already self-custodial?</p>
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
            Swap from your own wallet →
          </Link>
        </div>
      </article>
    </main>
  );
}
