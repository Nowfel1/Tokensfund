import Link from "next/link";
import Header from "@/components/Header";
import { notFound } from "next/navigation";
import SwapTerminal from "@/components/SwapTerminal";
import { PAIRS, PAIR_BY_SLUG, displaySym, relatedPairs } from "@/lib/pairs";
import { FEE_SHORT } from "@/lib/fees";

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
      `swap ${displaySym(pair.fromId)} to ${displaySym(pair.toId)}`,
      `${displaySym(pair.fromId)} to ${displaySym(pair.toId)} no kyc`,
      `exchange ${pair.fromLabel} to ${pair.toLabel}`,
      `${displaySym(pair.fromId)} ${displaySym(pair.toId)} best rate`,
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

  const others = relatedPairs(pair);
  const fromSym = displaySym(pair.fromId);
  const toSym = displaySym(pair.toId);

  return (
    <main className="wrap">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <Header />

      <section className="pair-hero">
        <h1 className="pair-title">
          Swap {fromSym} <span className="pair-arrow">→</span> {toSym}
        </h1>
        <p className="pair-sub">{pair.intro}</p>
        <div className="trust-line pair-trust">
          <span>Non-custodial</span>
          <span>No account</span>
          <span>No KYC</span>
          <span>{FEE_SHORT}</span>
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
          <li>Compare the live quotes from every route that supports {fromSym} → {toSym}.</li>
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

        <h2>Related pairs</h2>
        <ul className="pair-links">
          {others.map((p) => (
            <li key={p.slug}>
              <Link href={"/swap/" + p.slug}>
                Swap {displaySym(p.fromId)} → {displaySym(p.toId)}
              </Link>
            </li>
          ))}
          <li>
            <Link href="/sitemap">All swap pairs</Link>
          </li>
        </ul>
      </section>
    </main>
  );
}
