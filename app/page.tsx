import type { Metadata } from "next";
import SwapTerminal from "@/components/SwapTerminal";
import Logo from "@/components/Logo";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <main className="wrap">
      <header className="masthead">
        <div className="brand">
          <Logo size={34} />
          <span>tokensfund<span className="tld">.xyz</span></span>
        </div>
        <p className="tagline">
          One intent, three liquidity networks. We quote THORChain, Chainflip and NEAR Intents
          at once and route your swap to the best price — without ever holding your funds.
        </p>
      </header>
      <SwapTerminal />
      <p className="foot">
        Non-custodial. You send to a one-time deposit address and receive at your own wallet,
        or get refunded. <strong>tokensfund never takes custody of your assets.</strong>
      </p>
    </main>
  );
}
