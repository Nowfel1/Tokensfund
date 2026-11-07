import Header from "@/components/Header";
import Link from "next/link";

export const metadata = {
  title: "Zcash NU7: Blocks Three Times Faster, Same Supply — and 12,000 ZEC Frozen",
  description:
    "Zcash's NU7 upgrade went live on 6 November 2026. Blocks now arrive every 25 seconds instead of 75, issuance is unchanged, and 60% of fees now go to a reserve. It also retired the original Sprout pool, leaving about 12,200 ZEC unable to move. What changed and what ZEC holders should check.",
  keywords: [
    "Zcash NU7",
    "Zcash 25 second blocks",
    "Zcash Sprout frozen",
    "Network Sustainability Mechanism",
    "Zcash upgrade November 2026",
  ],
  alternates: { canonical: "/blog/zcash-nu7-faster-blocks-sprout-freeze-2026" },
  openGraph: {
    type: "article",
    url: "/blog/zcash-nu7-faster-blocks-sprout-freeze-2026",
    title: "Zcash NU7: Blocks Three Times Faster, Same Supply — and 12,000 ZEC Frozen",
    description:
      "25-second blocks, unchanged issuance, a new fee reserve — and the original Sprout pool retired with about 12,200 ZEC still inside.",
    images: [{ url: "https://tokensfund.xyz/blog/banner_zcash_nu7.png", width: 1200, height: 400 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Zcash NU7: Blocks Three Times Faster, Same Supply — and 12,000 ZEC Frozen",
    description:
      "25-second blocks, unchanged issuance, a new fee reserve — and the original Sprout pool retired with about 12,200 ZEC still inside.",
    images: ["https://tokensfund.xyz/blog/banner_zcash_nu7.png"],
  },
};

export default function Post() {
  return (
    <main className="wrap">
      <Header />

      <article className="blog-post">
        <div className="blog-post-meta">
          <span className="blog-tag">Privacy</span>
          <span className="blog-date">November 7, 2026</span>
        </div>

        <h1>Zcash NU7: Blocks Three Times Faster, Same Supply — and 12,000 ZEC Frozen</h1>

        <img
          src="/blog/banner_zcash_nu7.png"
          alt="Zcash block time falling from 75 seconds to 25 seconds"
          className="blog-banner"
          style={{ width: "100%", height: "auto", borderRadius: "12px", marginBottom: "2rem" }}
        />

        <p>
          Zcash&apos;s latest network upgrade, <strong>NU7</strong>, went live at block 3,543,405 at
          02:34 UTC on 6 November 2026 — the evening of 5 November in the US. It is the biggest
          change to how the chain runs in years, and it arrives in the same year as the{" "}
          <Link href="/blog/zcash-ironwood-turnstile-supply-integrity-2026">Ironwood
          turnstile</Link> that sealed off a flawed privacy pool.
        </p>
        <p>
          Most of NU7 is good news for anyone who uses ZEC. One part is a real loss for a small
          number of long-time holders. Here is all of it.
        </p>

        <h2>1. Blocks every 25 seconds</h2>
        <p>
          Zcash&apos;s target block time drops from 75 seconds to <strong>25 seconds</strong> — three
          times as many blocks. Zcash launched at 150 seconds in 2016 and halved that to 75 in 2019,
          so this is the second big speed-up in its history.
        </p>
        <p>
          In practice that means a payment gets its first confirmation about three times sooner, and
          services that wait for a set number of confirmations can credit deposits faster. To keep
          difficulty steady with so many more blocks, NU7 also widens the difficulty averaging window
          from 17 blocks to 102, which smooths over the same length of time as before.
        </p>

        <h2>2. Same supply, smaller rewards</h2>
        <p>
          Three times as many blocks would mean three times as much new ZEC — so the reward per block
          was cut by the same factor, from 1.5625 to about 0.5208 ZEC. The result is the same amount
          of new ZEC per day as before, roughly 1,800, and the same 21 million cap. The number of
          blocks between halvings is tripled too, so halvings arrive on the same calendar schedule.
        </p>
        <p>
          In other words, nothing about Zcash&apos;s monetary policy changed. If you see claims that
          NU7 &quot;cut rewards by two thirds,&quot; that is true per block and meaningless per day.
        </p>

        <h2>3. A new fee reserve</h2>
        <p>
          NU7 also switches on the <strong>Network Sustainability Mechanism</strong>, built by
          Shielded Labs. It takes 60% of every block&apos;s transaction fees out of circulation and
          holds them in a public reserve, to be paid back out as block rewards in future years.
        </p>
        <p>
          The problem it addresses is one Bitcoin shares: as block rewards shrink with each halving,
          something has to keep paying miners to secure the network. Recycling fees into future
          rewards is Zcash&apos;s answer, and it does so without touching the 21 million cap. Whether
          it is enough will depend on fee volume years from now — but it is a deliberate plan rather
          than a hope.
        </p>

        <h2>4. The cost: Sprout is closed for good</h2>
        <p>
          NU7 disables an old transaction format — version 4 — and that format was the only way to
          spend from <strong>Sprout</strong>, the privacy pool Zcash launched with in 2016. Sprout was
          replaced by Sapling in 2018 and Orchard in 2022, and holders were encouraged to move out for
          years.
        </p>
        <p>
          Not everyone did. About <strong>12,200 ZEC</strong> — roughly $16 million at current prices
          — was still in Sprout when NU7 activated, and it can no longer move. A fix has been
          proposed, but developers have said the funds may stay locked indefinitely.
        </p>
        <p>
          It is the same lesson Ironwood taught from a different direction: privacy pools have a
          lifespan. Old cryptography gets retired, and funds left behind in a retired pool are the
          ones that pay for it. The people affected are almost all holders of very old wallets that
          haven&apos;t been opened in years.
        </p>

        <h2>What to check if you hold ZEC</h2>
        <ul>
          <li><strong>Update your wallet.</strong> Software that still builds version 4 transactions won&apos;t work after NU7. Any actively maintained Zcash wallet will already have updated; if yours hasn&apos;t, it&apos;s time to switch.</li>
          <li><strong>Look for very old addresses.</strong> Sprout addresses start with <code>zc</code>. If you have ZEC from 2016–2018 that you never moved, check whether any of it sits in one. Funds in Sapling (<code>zs</code>), Orchard or unified (<code>u1</code>) and transparent (<code>t1</code>) addresses are unaffected.</li>
          <li><strong>If you are affected, follow the fix proposal</strong> through the Zcash community&apos;s official channels — and ignore anyone who contacts you offering to &quot;recover&quot; frozen Sprout funds. Every lockout like this attracts scammers.</li>
          <li><strong>Expect faster deposits.</strong> With 25-second blocks, ZEC sent to an exchange or swap service should be credited sooner than before.</li>
        </ul>

        <h2>Swapping ZEC on TokensFund</h2>
        <p>
          ZEC is available on TokensFund, compared across every route that supports it, wallet to
          wallet — no account and no KYC for standard swaps, with our fee of at most 1% already
          inside the quote. On supported routes, ZEC is paid straight to your shielded address. Faster
          blocks mean less waiting on the Zcash side of every swap. Our{" "}
          <Link href="/blog/we-removed-zcash-and-it-4x-2026">story of removing and restoring
          Zcash</Link> explains how we got here.
        </p>

        <h2>A note on risk</h2>
        <p>
          Nothing here is financial advice. Details reflect announcements and reporting about NU7 as
          of 7 November 2026; the dollar value of the frozen Sprout funds moves with the ZEC price, and
          the outcome of the proposed fix is not yet known. Check your own wallet&apos;s guidance for
          anything affecting your funds, and never share your seed phrase with anyone.
        </p>

        <div className="blog-cta">
          <p>Swap into ZEC, paid shielded</p>
          <Link
            href="/swap/btc-to-zec"
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
            Compare BTC → ZEC →
          </Link>
        </div>
      </article>
    </main>
  );
}
