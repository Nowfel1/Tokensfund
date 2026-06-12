import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://tokensfund.xyz"),
  title: {
    default: "TokensFund — Best Cross-Chain Crypto Swap Rates",
    template: "%s | TokensFund",
  },
  description:
    "Swap Bitcoin, Ethereum, Monero, USDC, USDT, SOL and more at the best rates. TokensFund compares THORChain, Chainflip, NEAR Intents and Exolix in one click. No account. No KYC. Non-custodial.",
  keywords: [
    "crypto swap",
    "cross-chain swap",
    "bitcoin swap",
    "monero swap",
    "XMR BTC swap",
    "best crypto exchange rates",
    "THORChain swap",
    "Chainflip swap",
    "non-custodial exchange",
    "no KYC crypto swap",
    "decentralized exchange",
    "tokensfund",
  ],
  authors: [{ name: "TokensFund", url: "https://tokensfund.xyz" }],
  creator: "TokensFund",
  publisher: "TokensFund",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://tokensfund.xyz",
    siteName: "TokensFund",
    title: "TokensFund — Best Cross-Chain Crypto Swap Rates",
    description:
      "Compare THORChain, Chainflip, NEAR Intents and Exolix in one click. Swap BTC, ETH, XMR, USDC and more at the best price. No account. No KYC.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "TokensFund — Best Cross-Chain Crypto Swap Rates",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@Tokensfund",
    creator: "@Tokensfund",
    title: "TokensFund — Best Cross-Chain Crypto Swap Rates",
    description:
      "Compare THORChain, Chainflip, NEAR Intents and Exolix in one click. Swap BTC, ETH, XMR, USDC and more at the best price. No account. No KYC.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "https://tokensfund.xyz",
  },
  verification: {
    google: "dkCQwdhLf8UawPA0TTEZgCZ3ia8BxBitcvXoTD5cVXo" />,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
