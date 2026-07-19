import Logo from "@/components/Logo";
import Link from "next/link";
import { POSTS } from "@/lib/posts";

export const metadata = {
  title: "Sitemap",
  description: "All sections and pages of tokensfund.xyz — swap, track, guides, and every blog post.",
  alternates: { canonical: "/sitemap" },
};



const SECTIONS = [
  { href: "/", label: "Swap — compare 5 protocols, best rate wins" },
  { href: "/track", label: "Track — check the status of any swap" },
  { href: "/blog", label: "Blog — guides, market analysis and regulation coverage" },
  { href: "/faq", label: "FAQ — how TokensFund works, fees, and privacy" },
  { href: "/terms", label: "Terms of Service" },
  { href: "/privacy", label: "Privacy Policy" },
];

export default function SitemapPage() {
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
            <Link href="/faq" className="nav-link">FAQ</Link>
          </nav>
        </div>
      </header>

      <article className="blog-post">
        <h1>Sitemap</h1>
        <p>All sections and pages of tokensfund.xyz.</p>

        <h2>Main sections</h2>
        <ul>
          {SECTIONS.map((s) => (
            <li key={s.href}>
              <Link href={s.href}>{s.label}</Link>
            </li>
          ))}
        </ul>

        <h2>Blog posts</h2>
        <ul>
          {POSTS.map((p) => (
            <li key={p.slug}>
              <Link href={"/blog/" + p.slug}>{p.title}</Link>
              {" "}<span style={{ color: "var(--muted-2)", fontSize: "0.85em" }}>({p.date})</span>
            </li>
          ))}
        </ul>

        <p style={{ marginTop: "2rem", color: "var(--muted-2)", fontSize: "0.9em" }}>
          Looking for the machine-readable version? The XML sitemap for search engines lives at{" "}
          <a href="/sitemap.xml">/sitemap.xml</a>.
        </p>
      </article>
    </main>
  );
}
