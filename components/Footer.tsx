import Link from "next/link";

const head: React.CSSProperties = {
  fontSize: "12px",
  fontWeight: 700,
  letterSpacing: "0.8px",
  textTransform: "uppercase",
  color: "#6b7689",
  marginBottom: "12px",
};

const link: React.CSSProperties = {
  display: "block",
  fontSize: "14px",
  color: "#aab3c5",
  textDecoration: "none",
  marginBottom: "9px",
};

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer style={{ borderTop: "1px solid rgba(255,255,255,0.08)", marginTop: "4rem" }}>
      <div
        style={{
          maxWidth: "1080px",
          margin: "0 auto",
          padding: "2.5rem 1.25rem 2rem",
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "2.5rem",
            justifyContent: "space-between",
          }}
        >
          <div style={{ maxWidth: "320px" }}>
            <div style={{ fontWeight: 700, fontSize: "1.05rem", marginBottom: "0.6rem" }}>
              tokensfund<span style={{ color: "var(--gold)" }}>.xyz</span>
            </div>
            <p style={{ fontSize: "13px", lineHeight: 1.6, color: "#8a93a8", margin: 0 }}>
              Non-custodial crypto swap aggregator. Funds move directly between your wallet and the
              protocol — TokensFund never takes custody of your assets.
            </p>
          </div>

          <div style={{ display: "flex", gap: "3rem", flexWrap: "wrap" }}>
            <div>
              <div style={head}>Product</div>
              <Link href="/" style={link}>Swap</Link>
              <Link href="/track" style={link}>Track</Link>
              <Link href="/blog" style={link}>Blog</Link>
              <Link href="/faq" style={link}>FAQ</Link>
            </div>
            <div>
              <div style={head}>Legal</div>
              <Link href="/terms" style={link}>Terms of Service</Link>
              <Link href="/privacy" style={link}>Privacy Policy</Link>
              <Link href="/sitemap">Sitemap</Link>
            </div>
            <div>
              <div style={head}>Community</div>
              <a href="https://x.com/Tokensfund" target="_blank" rel="noopener noreferrer" style={link}>X / Twitter</a>
              <a href="https://t.me/Tokensfund" target="_blank" rel="noopener noreferrer" style={link}>Telegram</a>
            </div>
          </div>
        </div>

        <div style={{ fontSize: "12px", color: "#5f6b80", marginTop: "2.25rem", lineHeight: 1.6 }}>
          © {year} TokensFund. Crypto swaps are irreversible and carry risk. Nothing on this site is
          financial advice.
        </div>
      </div>
    </footer>
  );
}
