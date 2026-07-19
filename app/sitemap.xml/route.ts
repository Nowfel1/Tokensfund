import { NextResponse } from "next/server";
import { POSTS } from "@/lib/posts";

// XML sitemap, generated from the same lib/posts.ts that drives the blog
// index and the human /sitemap page. Add a post there and this updates on
// the next deploy — no separate XML edit needed.

const SITE = "https://tokensfund.xyz";

// Static pages with their own cadence/priority.
const STATIC_PAGES: Array<{ path: string; lastmod: string; changefreq: string; priority: string }> = [
  { path: "/", lastmod: "2026-06-25", changefreq: "daily", priority: "1.0" },
  { path: "/blog", lastmod: "2026-06-25", changefreq: "weekly", priority: "0.8" },
  { path: "/track", lastmod: "2026-06-22", changefreq: "monthly", priority: "0.6" },
  { path: "/faq", lastmod: "2026-06-24", changefreq: "monthly", priority: "0.6" },
  { path: "/sitemap", lastmod: "2026-07-19", changefreq: "weekly", priority: "0.4" },
  { path: "/terms", lastmod: "2026-06-25", changefreq: "yearly", priority: "0.3" },
  { path: "/privacy", lastmod: "2026-06-25", changefreq: "yearly", priority: "0.3" },
];

// Parse "July 19, 2026" → "2026-07-19" without Date() to avoid any
// timezone off-by-one at build time.
const MONTHS: Record<string, string> = {
  january: "01", february: "02", march: "03", april: "04", may: "05", june: "06",
  july: "07", august: "08", september: "09", october: "10", november: "11", december: "12",
};

function toIso(human: string): string {
  const m = human.trim().match(/^([A-Za-z]+)\s+(\d{1,2}),\s*(\d{4})$/);
  if (!m) return "2026-01-01"; // defensive fallback; every PostMeta.date matches the pattern
  const month = MONTHS[m[1].toLowerCase()] ?? "01";
  const day = m[2].padStart(2, "0");
  return `${m[3]}-${month}-${day}`;
}

function urlEntry(loc: string, lastmod: string, changefreq: string, priority: string): string {
  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

export async function GET() {
  const staticXml = STATIC_PAGES.map((p) =>
    urlEntry(SITE + p.path, p.lastmod, p.changefreq, p.priority)
  );
  const postXml = POSTS.map((p) =>
    urlEntry(`${SITE}/blog/${p.slug}`, toIso(p.date), "monthly", "0.7")
  );

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...staticXml, ...postXml].join("\n")}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=86400, stale-while-revalidate",
    },
  });
}
