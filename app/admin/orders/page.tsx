import { sql, ensureOrdersTable } from "@/lib/db";
import { CopyText, StatusCell } from "@/components/AdminCells";

export const dynamic = "force-dynamic";

async function getOrders() {
  await ensureOrdersTable();
  const rows = await sql`SELECT * FROM orders ORDER BY created_at DESC LIMIT 200`;
  return rows;
}

export default async function AdminOrders({
  searchParams,
}: {
  searchParams: { key?: string };
}) {
  const correctPassword = process.env.ADMIN_PASSWORD;
  const providedKey = searchParams.key;
  if (!correctPassword || providedKey !== correctPassword) {
    return (
      <main style={{ maxWidth: "500px", margin: "100px auto", padding: "20px", fontFamily: "ui-monospace, monospace", color: "#e9edfa", background: "#0b1020", minHeight: "50vh", textAlign: "center" }}>
        <h1 style={{ fontSize: "20px" }}>Access denied</h1>
        <p style={{ color: "#8a95b8", fontSize: "13px" }}>Add ?key=YOUR_PASSWORD to the URL.</p>
      </main>
    );
  }

  const orders = await getOrders();

  return (
    <main style={{ maxWidth: "1400px", margin: "0 auto", padding: "40px 20px", fontFamily: "ui-monospace, monospace", color: "#e9edfa", background: "#0b1020", minHeight: "100vh" }}>
      <h1 style={{ fontSize: "24px", marginBottom: "20px" }}>Orders ({orders.length})</h1>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12.5px", tableLayout: "fixed" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid #2a3358", textAlign: "left" }}>
            <th style={{ padding: "8px", width: "130px" }}>Date</th>
            <th style={{ padding: "8px", width: "90px" }}>Provider</th>
            <th style={{ padding: "8px", width: "55px" }}>From</th>
            <th style={{ padding: "8px", width: "55px" }}>To</th>
            <th style={{ padding: "8px", width: "80px" }}>Amount</th>
            <th style={{ padding: "8px" }}>Destination</th>
            <th style={{ padding: "8px" }}>Deposit Address</th>
            <th style={{ padding: "8px", width: "140px" }}>Tracking ID</th>
            <th style={{ padding: "8px", width: "110px" }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o: any) => (
            <tr key={o.id} style={{ borderBottom: "1px solid #1a2342", verticalAlign: "top" }}>
              <td style={{ padding: "8px", color: "#8a95b8" }}>{new Date(o.created_at).toLocaleString()}</td>
              <td style={{ padding: "8px" }}>{o.provider}</td>
              <td style={{ padding: "8px" }}>{o.from_asset}</td>
              <td style={{ padding: "8px" }}>{o.to_asset}</td>
              <td style={{ padding: "8px" }}>{o.amount}</td>
              <td style={{ padding: "8px" }}><CopyText text={o.destination_address} /></td>
              <td style={{ padding: "8px" }}><CopyText text={o.deposit_address} /></td>
              <td style={{ padding: "8px" }}><CopyText text={o.tracking_id} /></td>
              <td style={{ padding: "8px" }}><StatusCell provider={o.provider} trackingId={o.tracking_id} /></td>
            </tr>
          ))}
        </tbody>
      </table>
      <p style={{ color: "#565f80", fontSize: "11px", marginTop: "14px" }}>
        Click any address/ID to copy. Click &quot;check&quot; to fetch live status for that order (one provider call per click); click the status again to refresh it.
      </p>
    </main>
  );
}
