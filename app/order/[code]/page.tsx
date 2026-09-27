import Link from "next/link";
import { notFound } from "next/navigation";
import Logo from "@/components/Logo";
import { getOrderByCode } from "@/lib/db";
import { getAsset } from "@/lib/assets";
import OrderView from "@/components/OrderView";

export const dynamic = "force-dynamic";

export function generateMetadata({ params }: { params: { code: string } }) {
  return {
    title: `Order ${params.code.toUpperCase()}`,
    description: "Private status link for a TokensFund swap.",
    // Order pages are private to whoever holds the link — never index them.
    robots: { index: false, follow: false },
  };
}

export default async function OrderPage({ params }: { params: { code: string } }) {
  const order = await getOrderByCode(params.code);
  if (!order) notFound();

  const from = getAsset(order.from_asset);
  const to = getAsset(order.to_asset);
  const d = new Date(order.created_at);
  const created =
    d.toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" }) +
    " · " +
    d.toISOString().slice(11, 16) +
    " UTC";

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

      <OrderView
        code={order.order_code}
        provider={order.provider}
        trackingId={order.tracking_id ?? ""}
        amount={order.amount}
        fromSymbol={from?.symbol ?? order.from_asset}
        toSymbol={to?.symbol ?? order.to_asset}
        toName={to?.name ?? order.to_asset}
        destination={order.destination_address}
        deposit={order.deposit_address ?? ""}
        created={created}
      />
    </main>
  );
}
