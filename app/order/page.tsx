import Header from "@/components/Header";
import OrderLookup from "@/components/OrderLookup";

export const metadata = {
  title: "Order status",
  description: "Check the status of your TokensFund swap with your order code.",
  alternates: { canonical: "/order" },
};

export default function OrderStatusPage() {
  return (
    <main className="wrap">
      <Header />

      <section className="ov">
        <span className="ov-eyebrow">ORDER STATUS</span>
        <h1 className="ol-title">Check your swap</h1>
        <p className="ol-sub">
          Enter the 12-character order code shown when you created the swap. It&apos;s also in the
          link we put in your address bar.
        </p>
        <OrderLookup />
        <p className="ov-help">
          Lost your code? Your funds still arrive at your destination address automatically — the
          code is only for checking progress.
        </p>
      </section>
    </main>
  );
}
