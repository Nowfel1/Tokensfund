import Header from "@/components/Header";
import Link from "next/link";
import { POSTS } from "@/lib/posts";
import { PAIRS } from "@/lib/pairs";

export const metadata = {
  title: "Sitemap",
  description: "All sections and pages of tokensfund.xyz — swap, track, guides, and every blog post.",
  alternates: { canonical: "/sitemap" },
};

const SECTIONS = [
  { href: "/", label: "Swap — compare 4 protocols, best rate wins" },
  { href: "/order", label: "Order status — look up a swap by its order code" },
  { href: "/blog", label: "Blog — guides, market analysis and regulation coverage" },
  { href: "/faq", label: "FAQ — how TokensFund works, fees, and privacy" },
  { href: "/terms", label: "Terms of Service" },
  { href: "/privacy", label: "Privacy Policy" },
];

export default function SitemapPage() {
  return (
    <main className="wrap">
      <Header />

      <article className="blog-post">
        <h1>Sitemap</h1>
        <p>All sections and pages of tokensfund.xyz.</p>

        <h2>Main sections</h2>
        <ul className="sm-list">
          {SECTIONS.map((s) => (
            <li key={s.href}>
              <Link href={s.href}>{s.label}</Link>
            </li>
          ))}
        </ul>

        <h2>Swap pairs</h2>
        <ul className="sm-list">
          {PAIRS.map((p) => (
            <li key={p.slug}>
              <Link href={"/swap/" + p.slug}>
                {"Swap " + p.fromId + " to " + p.toId + " (" + p.fromLabel + " to " + p.toLabel + ")"}
              </Link>
            </li>
          ))}
        </ul>

        <h2>Blog posts</h2>
        <ul className="sm-list">
          {POSTS.map((p) => (
            <li key={p.slug}>
              <Link href={"/blog/" + p.slug}>{p.title}</Link>
            </li>
          ))}
        </ul>

        <p className="sm-foot">
          Looking for the machine-readable version? The XML sitemap for search engines lives at{" "}
          <a href="/sitemap.xml">/sitemap.xml</a>.
        </p>
      </article>
    </main>
  );
}
