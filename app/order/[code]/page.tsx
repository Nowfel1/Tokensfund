import Link from "next/link";
import { notFound } from "next/navigation";
import Logo from "@/components/Logo";
import { getOrderByCode } from "@/lib/db";
import OrderStatus from "@/components/OrderStatus";

export const dynamic = "force-dynamic";

export function generateMetadata({ params }: { params: { code: string } }) {
  return {
    title: `Order ${params.code.toUpperCase()}`,
    description: "Live status for this TokensFund swap.",
    // Order pages are private to whoever holds the link — keep them out of
    // search results entirely.
    robots: { index: false, follow: false },
  };
}

function label(p: string) {
  if (p === "thorchain") return "THORChain";
  if (p === "chainflip") return "Chainflip";
  if (p === "cce") return "CCE.Cash";
  if (p === "changee") return "Changee";
  if (p === "near_intents") return "NEAR Intents";
  return p;
}

export default async function OrderPage({ params }: { params: { code: string } }) {
  const order = await getOrderByCode(params.code);
  if (!order) notFound();

  const created = new Date(order.created_at).toISOString().replace("T", " ").slice(0, 16) + " UTC";

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

      <section className="order-page">
        <div className="order-head">
          <span className="order-label">Order</span>
          <h1 className="order-code">{order.order_code}</h1>
          <p className="order-sub">
            {order.amount} {order.from_asset} → {order.to_asset} · via {label(order.provider)} ·
            created {created}
          </p>
        </div>

        {/* Live status, polled client-side against the provider */}
        <OrderStatus provider={order.provider} trackingId={order.tracking_id ?? ""} />

        <div className="order-kv">
          <div className="order-row">
            <span className="order-k">You send</span>
            <span className="order-v">{order.amount} {order.from_asset}</span>
          </div>
          <div className="order-row">
            <span className="order-k">You receive</span>
            <span className="order-v">{order.to_asset}</span>
          </div>
          <div className="order-row">
            <span className="order-k">Destination</span>
            <code className="order-v mono">{order.destination_address}</code>
          </div>
          {order.deposit_address && (
            <div className="order-row">
              <span className="order-k">Deposit address</span>
              <code className="order-v mono">{order.deposit_address}</code>
            </div>
          )}
          <div className="order-row">
            <span className="order-k">Route</span>
            <span className="order-v">{label(order.provider)}</span>
          </div>
        </div>

        <p className="order-note">
          Bookmark this page — it is the permanent record of this swap. Nobody from TokensFund will
          ever contact you about it or ask for your seed phrase.
        </p>

        <p className="order-note">
          Problem with this swap? Quote the order code above when getting in touch.
        </p>
      </section>
    </main>
  );
}
