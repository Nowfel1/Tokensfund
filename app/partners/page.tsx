import Header from "@/components/Header";

export const metadata = {
  title: "Powered By",
  description:
    "TokensFund is a non-custodial aggregator. Every swap is executed by established providers — THORChain, Chainflip, Changee and CCE.Cash — and routed to the best rate.",
  keywords: [
    "tokensfund powered by",
    "THORChain aggregator",
    "Chainflip swap",
    "non custodial swap infrastructure",
  ],
  alternates: { canonical: "/partners" },
  openGraph: {
    type: "website",
    url: "/partners",
    title: "Powered By — The Protocols Behind TokensFund",
    description:
      "Every TokensFund swap runs on established, non-custodial routes: THORChain, Chainflip, Changee and CCE.Cash.",
    images: [
      {
        url: "https://tokensfund.xyz/og-image.png",
        width: 1200,
        height: 630,
        alt: "TokensFund — Powered By",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Powered By — The Protocols Behind TokensFund",
    description:
      "Every TokensFund swap runs on established, non-custodial routes: THORChain, Chainflip, Changee and CCE.Cash.",
    images: ["https://tokensfund.xyz/og-image.png"],
  },
};

const protocols = [
  {
    mark: "TC",
    name: "THORChain",
    url: "https://thorchain.org",
    bg: "linear-gradient(135deg,#13e8a8,#0fb37e)",
    blurb:
      "A decentralized, non-custodial liquidity protocol for swapping native assets like BTC and ETH across chains — no wrapped tokens, no custodian.",
  },
  {
    mark: "CF",
    name: "Chainflip",
    url: "https://chainflip.io",
    bg: "linear-gradient(135deg,#2775ca,#46a3ff)",
    blurb:
      "A decentralized cross-chain protocol that swaps native assets directly using its own on-chain just-in-time liquidity.",
  },
];

const brandStyle = { textDecoration: "none", color: "inherit" };

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: "16px",
  margin: "1.5rem 0 2rem",
};

const cardStyle = {
  display: "block",
  textDecoration: "none",
  color: "inherit",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "14px",
  padding: "22px",
  background: "rgba(255,255,255,0.02)",
};

const markStyle = (bg: string) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "46px",
  height: "46px",
  borderRadius: "50%",
  background: bg,
  color: "#04121f",
  fontWeight: 800,
  fontSize: "0.95rem",
  letterSpacing: "0.5px",
  marginBottom: "14px",
});

const ctaStyle = {
  display: "inline-block",
  textDecoration: "none",
  background: "var(--gold)",
  color: "#000",
  fontWeight: "700",
  padding: "12px 28px",
  borderRadius: "8px",
  fontSize: "1rem",
};

export default function Partners() {
  return (
    <main className="wrap">
      <Header />

      <article className="blog-post">
        <h1>Powered By</h1>
        <p>
          TokensFund is an aggregator, not an exchange. It doesn&apos;t hold your funds or run its
          own order book — every swap is executed by established, non-custodial protocols, and
          TokensFund&apos;s job is simply to compare them live and route you to the best rate.
          These are the protocols that power your swaps:
        </p>

        <div style={gridStyle}>
          {protocols.map((p) => (
            <a
              key={p.name}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              style={cardStyle}
            >
              <span style={markStyle(p.bg)}>{p.mark}</span>
              <h2 style={{ margin: "0 0 8px" }}>{p.name}</h2>
              <p style={{ margin: 0, opacity: 0.85 }}>{p.blurb}</p>
            </a>
          ))}
        </div>

        <p>
          Because these protocols are non-custodial, your funds move directly between your own
          wallet and the protocol&apos;s one-time deposit address. TokensFund never takes custody
          at any point — it routes, it doesn&apos;t hold.
        </p>

        <div className="blog-cta">
          <p>See the rates for yourself</p>
          <a href="/" style={ctaStyle}>
            Compare a Swap
          </a>
        </div>
      </article>
    </main>
  );
}
