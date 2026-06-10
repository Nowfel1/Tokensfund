import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "tokensfund — cross-chain swaps",
  description: "Non-custodial cross-chain swaps routed across THORChain, Chainflip and NEAR Intents. Best price, every time.",
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "tokensfund",
    description: "Non-custodial cross-chain swaps, best route every time.",
    url: "https://tokensfund.xyz",
  },
  twitter: {
    card: "summary",
    title: "tokensfund",
    description: "Non-custodial cross-chain swaps, best route every time.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
