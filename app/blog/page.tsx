import Link from "next/link";
import Logo from "@/components/Logo";

export const metadata = {
  title: "Blog — Crypto Swap Guides | TokensFund",
  description: "Guides and tutorials on how to swap crypto without KYC using THORChain, Chainflip, NEAR Intents and Exolix.",
};

const posts = [
  {
    slug: "swap-xmr-btc-no-kyc",
    title: "How to Swap XMR to BTC Without KYC in 2026",
    date: "June 12, 2026",
    description: "Compare THORChain, Chainflip and Exolix — get the best Monero to Bitcoin rate in seconds, no account required.",
    tag: "Guide",
  },
];

import Link from "next/link";
import Logo from "@/components/Logo";

export default function Blog() {
  return (
    <main className="wrap">
      <header className="masthead">
        <Link href="/" className="brand">
          <Logo size={34} />
          <span>tokensfund<span className="tld">.xyz</span></span>
        </Link>
      </header>
      ...
    </main>
  );
}
      <section className="blog-index">
        <h1 className="blog-index-title">Blog</h1>
        <p className="blog-index-sub">Crypto swap guides, tips and updates.</p>
        <div className="blog-list">
          {posts.map((p) => (
            <Link key={p.slug} href={`/blog/${p.slug}`} className="blog-card">
              <span className="blog-tag">{p.tag}</span>
              <h2>{p.title}</h2>
              <p>{p.description}</p>
              <span className="blog-date">{p.date}</span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
