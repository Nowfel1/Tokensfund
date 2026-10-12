import Header from "@/components/Header";

export const metadata = {
  title: "BitcoinTalk Campaign Management & Marketing — TokensFund",
  description:
    "Signature campaign management and marketing for crypto projects on BitcoinTalk, run by Murat (Hero Member) for over a decade. See the campaigns we've managed and get in touch.",
  alternates: { canonical: "/marketing" },
};

const THREAD = "https://bitcointalk.org/index.php?topic=5244401.0";
const PROFILE = "https://bitcointalk.org/index.php?action=profile;u=815246";

// Contact buttons, exactly as in the BitcoinTalk thread. Images live in public/campaign-images/.
const CONTACT = [
  {
    href: "https://bitcointalk.org/index.php?action=pm;sa=send;u=815246",
    img: "/campaign-images/contact-pm.png",
    alt: "Send a private message on BitcoinTalk",
  },
  {
    href: "https://t.me/tokensfund",
    img: "/campaign-images/contact-telegram.png",
    alt: "Contact on Telegram @tokensfund",
  },
];

// Campaign banners, in the same order as the thread.
const CAMPAIGNS: { href: string; img: string }[] = [
  { href: "https://bitcointalk.org/index.php?topic=5225563.0", img: "/campaign-images/campaign-01.png" },
  { href: "https://bitcointalk.org/index.php?topic=5213621.0", img: "/campaign-images/campaign-02.png" },
  { href: "https://bitcointalk.org/index.php?topic=5221791.0", img: "/campaign-images/campaign-03.png" },
  { href: "https://bitcointalk.org/index.php?topic=5418627.0", img: "/campaign-images/campaign-04.png" },
  { href: "https://bitcointalk.org/index.php?topic=5585273.0", img: "/campaign-images/campaign-05.png" },
  { href: "https://bitcointalk.org/index.php?topic=5582794.0", img: "/campaign-images/campaign-06.png" },
  { href: "https://bitcointalk.org/index.php?topic=5591331.0", img: "/campaign-images/campaign-07.png" },
  { href: "https://t.co/0X2mVnlFv5", img: "/campaign-images/campaign-08.png" },
  { href: "https://bitcointalk.org/index.php?topic=5414372.0", img: "/campaign-images/campaign-09.png" },
  { href: "https://bitcointalk.org/index.php?topic=5234635", img: "/campaign-images/campaign-10.png" },
  { href: "https://bitcointalk.org/index.php?topic=5106896.0", img: "/campaign-images/campaign-11.png" },
  { href: "https://bitcointalk.org/index.php?topic=1962297.0", img: "/campaign-images/campaign-12.png" },
  { href: "https://bitcointalk.org/index.php?topic=3201859.0", img: "/campaign-images/campaign-13.png" },
  { href: "https://bitcointalk.org/index.php?topic=1965156.0", img: "/campaign-images/campaign-14.png" },
  { href: "https://bitcointalk.org/index.php?topic=5272563.0", img: "/campaign-images/campaign-15.png" },
  { href: "https://bitcointalk.org/index.php?topic=5256739", img: "/campaign-images/campaign-16.png" },
  { href: "https://bitcointalk.org/index.php?topic=5260492.0", img: "/campaign-images/campaign-17.png" },
  { href: "https://bitcointalk.org/index.php?topic=5285392.0", img: "/campaign-images/campaign-18.png" },
  { href: "https://bit.ly/2YpzN2w", img: "/campaign-images/campaign-19.png" },
  { href: "https://bitcointalk.org/index.php?topic=5313677.0", img: "/campaign-images/campaign-20.png" },
  { href: "https://bitcointalk.org/index.php?topic=5313678.0", img: "/campaign-images/campaign-21.png" },
  { href: "https://bitcointalk.org/index.php?topic=5348731.0", img: "/campaign-images/campaign-22.png" },
];

const TESTIMONIALS = [
  { quote: "You are a well experienced manager.", who: "ZaraCB, BitcoinTalk" },
  { quote: "I noticed that you calculated the spreadsheet very quickly and carefully.", who: "ZaraCB, BitcoinTalk" },
  { quote: "The best bounty manager — I really like the way you work.", who: "Bajank, BitcoinTalk" },
];

const card: React.CSSProperties = {
  background: "var(--surface-2)",
  border: "1px solid var(--border-soft)",
  borderRadius: 14,
};
const p: React.CSSProperties = { fontSize: 14, lineHeight: 1.65, color: "var(--muted)", margin: 0 };

export default function MarketingPage() {
  return (
    <main className="wrap">
      <Header />

      <section style={{ maxWidth: 760, margin: "2.75rem auto 0", textAlign: "center" }}>
        <span style={{ fontFamily: "var(--mono)", fontSize: 12, letterSpacing: "0.12em", color: "var(--gold)" }}>
          MARKETING SERVICES
        </span>
        <h1 style={{ fontSize: "clamp(1.9rem, 5vw, 2.7rem)", lineHeight: 1.15, margin: "10px 0 14px", color: "var(--text)" }}>
          BitcoinTalk Signature Campaign Management &amp; Marketing
        </h1>
        <p style={{ ...p, fontSize: 16, maxWidth: 600, margin: "0 auto" }}>
          Signature campaigns and marketing for crypto projects on BitcoinTalk, run by{" "}
          <a href={PROFILE} target="_blank" rel="noopener noreferrer" style={{ color: "var(--gold)" }}>
            Murat
          </a>
          , a Hero Member on the forum who has been managing campaigns for over a decade.
        </p>

        {/* Contact buttons — same images as the thread */}
        <div style={{ display: "flex", gap: 14, justifyContent: "center", alignItems: "center", flexWrap: "wrap", marginTop: 24 }}>
          {CONTACT.map((c) => (
            <a key={c.href} href={c.href} target="_blank" rel="noopener noreferrer">
              <img
                src={c.img}
                alt={c.alt}
                loading="lazy"
                style={{ display: "block", maxHeight: 64, maxWidth: "100%", width: "auto" }}
              />
            </a>
          ))}
        </div>
      </section>

      {/* Campaign grid — three per row, like the thread */}
      <section style={{ maxWidth: 960, margin: "3rem auto 0" }}>
        <h2 style={{ fontSize: 20, color: "var(--text)", margin: "0 0 6px", textAlign: "center" }}>
          Campaigns we&apos;ve managed
        </h2>
        <p style={{ ...p, textAlign: "center", marginBottom: 18 }}>
          Each banner opens that campaign&apos;s thread, so you can check the record yourself.
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: 14,
          }}
        >
          {CAMPAIGNS.map((c, i) => (
            <a
              key={c.href + i}
              href={c.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                ...card,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: 120,
                padding: 10,
              }}
            >
              <img
                src={c.img}
                alt={`BitcoinTalk campaign ${i + 1} managed by Tokensfund`}
                loading="lazy"
                style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", display: "block" }}
              />
            </a>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: 18 }}>
          <a href={THREAD} target="_blank" rel="noopener noreferrer" style={{ color: "var(--gold)", fontSize: 14 }}>
            View the full services thread on BitcoinTalk →
          </a>
        </div>
      </section>

      <section style={{ maxWidth: 900, margin: "3rem auto 0" }}>
        <h2 style={{ fontSize: 20, color: "var(--text)", margin: "0 0 14px", textAlign: "center" }}>
          What participants say
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14 }}>
          {TESTIMONIALS.map((t) => (
            <figure key={t.quote} style={{ ...card, margin: 0, padding: "18px 18px 16px" }}>
              <blockquote style={{ ...p, color: "var(--text)", margin: "0 0 10px", fontSize: 15 }}>
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption style={{ fontSize: 12.5, color: "var(--muted-2)" }}>{t.who}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <p style={{ ...p, fontSize: 12.5, textAlign: "center", margin: "2.5rem auto 0", maxWidth: 620, color: "var(--muted-2)" }}>
        Marketing services are separate from the TokensFund swap service. Swaps remain
        non-custodial and account-free, and marketing clients receive no access to swap data.
      </p>
    </main>
  );
}
