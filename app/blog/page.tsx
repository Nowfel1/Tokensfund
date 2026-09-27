import Link from "next/link";
import Header from "@/components/Header";
import { POSTS } from "@/lib/posts";

export const metadata = {
  title: "Blog - Crypto Swap Guides",
  description: "Guides and tutorials on how to swap crypto without KYC using THORChain, Chainflip, Changee and CCE.Cash.",
  alternates: { canonical: "/blog" },
};

export default function Blog() {
  return (
    <main className="wrap">
      <Header />
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
