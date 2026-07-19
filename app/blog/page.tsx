import Link from "next/link";
import Logo from "@/components/Logo";
import { POSTS } from "@/lib/posts";

export const metadata = {
  title: "Blog - Crypto Swap Guides",
  description: "Guides and tutorials on how to swap crypto without KYC using THORChain, Chainflip, NEAR Intents, Changee and CCE.Cash.",
  alternates: { canonical: "/blog" },
};

export default function Blog() {
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
      <section className="blog-index">
        <h1 className="blog-index-title">Blog</h1>
        <p className="blog-index-sub">Crypto swap guides, tips and updates.</p>
        <div className="blog-list">
          {POSTS.map((p) => (
            <Link key={p.slug} href={"/blog/" + p.slug} className="blog-card">
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
