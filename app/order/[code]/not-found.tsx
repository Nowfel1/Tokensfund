import Link from "next/link";

export default function OrderNotFound() {
  return (
    <main className="wrap">
      <section className="ov" style={{ textAlign: "center" }}>
        <span className="ov-eyebrow">ORDER STATUS</span>
        <h1 className="ol-title">We couldn&apos;t find that order</h1>
        <p className="ol-sub">
          Check the code for typos — it&apos;s 12 letters and numbers. Codes are only created when a
          deposit address is generated.
        </p>
        <Link href="/order" className="ol-btn ol-btn-link">
          Try another code
        </Link>
      </section>
    </main>
  );
}
