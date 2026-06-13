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
      // Optimize caching for crawlable search engine assets
      {
        source: "/sitemap.xml",
        headers: [
          {
            key: "Content-Type",
            value: "application/xml",
          },
          {
            key: "Cache-Control",
            value: "public, max-age=0, s-maxage=86400, stale-while-revalidate", // Keeps sitemap updated without heavy re-fetches
          },
        ],
      },
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
