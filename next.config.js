/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // 1. Powered-by Header Removal (Prevents tech-stack fingerprinting for security)
  poweredByHeader: false,
  // 2. Trailing Slash Configuration (Ensures strict URL consistency to prevent duplicate content issues)
  trailingSlash: false,
  images: {
    unoptimized: true, // Keep this true if hosting on platforms like GitHub Pages
  },
  async headers() {
    return [
      // NOTE: /sitemap.xml intentionally has NO headers block here. The route
      // handler at app/sitemap.xml/route.ts sets Content-Type and
      // Cache-Control itself — declaring them here as well produced
      // duplicate/conflicting Content-Type headers on the response, which
      // strict sitemap parsers (Google's) can reject as unreadable.
      {
        source: "/robots.txt",
        headers: [
          {
            key: "Content-Type",
            value: "text/plain",
          },
          {
            key: "Cache-Control",
            value: "public, max-age=86400",
          },
        ],
      },
      // 3. Security Headers (Improves Core Web Vitals Trust Scores with Google)
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY", // Prevents clickjacking
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff", // Stops MIME type sniffing
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin", // Protects user privacy while maintaining referral tracking
          }
        ],
      },
    ];
  },
};
module.exports = nextConfig;
