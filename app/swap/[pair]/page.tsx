import Link from "next/link";
import { notFound } from "next/navigation";
import Logo from "@/components/Logo";
import SwapTerminal from "@/components/SwapTerminal";
import { PAIRS, PAIR_BY_SLUG } from "@/lib/pairs";

// Static params so every pair page is prerendered at build time.
export function generateStaticParams() {
  return PAIRS.map((p) => ({ pair: p.slug }));
}

export function generateMetadata({ params }: { params: { pair: string } }) {
  const pair = PAIR_BY_SLUG.get(params.pair);
  if (!pair) return {};
  const url = "/swap/" + pair.slug;
  return {
    title: pair.title,
    description: pair.description,
    keywords: [
      `swap ${pair.fromId} to ${pair.toId}`,
      `${pair.fromId} to ${pair.toId} no kyc`,
      `exchange ${pair.fromLabel} to ${pair.toLabel}`,
      `${pair.fromId} ${pair.toId} best rate`,
      "non custodial swap",
    ],
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      title: pair.title,
      description: pair.description,
      // Nested metadata objects REPLACE the parent's rather than merging, so
      // the layout's default image must be repeated here or shares render
      // with no picture.
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: pair.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: pair.title,
      description: pair.description,
      images: ["/og-image.png"],
    },
  };
}

export default function PairPage({ params }: { params: { pair: string } }) {
  const pair = PAIR_BY_SLUG.get(params.pair);
  if (!pair) notFound();

  // FAQPage structured data — eligible for FAQ rich results and, more
  // usefully, tells search engines exactly what this page answers.
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: pair.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const others = PAIRS.filter((p) => p.slug !== pair.slug);

  return (
    <main className="wrap">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

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
            <Link href="/faq" className="nav-link">FAQ</Link>
          </nav>
        </div>
      </header>

      <section className="pair-hero">
        <h1 className="pair-title">
          Swap {pair.fromId} <span className="pair-arrow">→</span> {pair.toId}
        </h1>
        <p className="pair-sub">{pair.intro}</p>
        <div className="trust-line pair-trust">
          <span>Non-custodial</span>
          <span>No account</span>
          <span>No KYC</span>
          <span>Flat 1% in the quote</span>
        </div>
      </section>

      <div className="pair-terminal">
        <SwapTerminal initialFrom={pair.fromId} initialTo={pair.toId} />
      </div>

      <section className="pair-body">
        <h2>What to know about this route</h2>
        <ul>
          {pair.notes.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>

        <h2>How it works</h2>
        <ol>
          <li>Enter the amount and the {pair.toLabel} address where you want to receive funds.</li>
          <li>Compare the live quotes from every route that supports {pair.fromId} → {pair.toId}.</li>
          <li>Send one deposit of {pair.fromLabel} from your own wallet to the one-time address shown.</li>
          <li>Track the swap on-site until the {pair.toLabel} arrives at your address.</li>
        </ol>

        <h2>Questions</h2>
        <dl className="pair-faq">
          {pair.faqs.map((f) => (
            <div key={f.q}>
              <dt>{f.q}</dt>
              <dd>{f.a}</dd>
            </div>
          ))}
        </dl>

        <h2>Other pairs</h2>
        <ul className="pair-links">
          {others.map((p) => (
            <li key={p.slug}>
              <Link href={"/swap/" + p.slug}>
                Swap {p.fromId} → {p.toId}
              </Link>
            </li>
          ))}
          <li>
            <Link href="/">All assets and routes</Link>
          </li>
        </ul>
      </section>
    </main>
  );
}
