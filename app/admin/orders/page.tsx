import { sql, ensureOrdersTable } from "@/lib/db";

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
    <main style={{ maxWidth: "1100px", margin: "0 auto", padding: "40px 20px", fontFamily: "ui-monospace, monospace", color: "#e9edfa", background: "#0b1020", minHeight: "100vh" }}>
      <h1 style={{ fontSize: "24px", marginBottom: "20px" }}>Orders ({orders.length})</h1>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid #2a3358", textAlign: "left" }}>
            <th style={{ padding: "8px" }}>Date</th>
            <th style={{ padding: "8px" }}>Provider</th>
            <th style={{ padding: "8px" }}>From</th>
            <th style={{ padding: "8px" }}>To</th>
            <th style={{ padding: "8px" }}>Amount</th>
            <th style={{ padding: "8px" }}>Destination</th>
            <th style={{ padding: "8px" }}>Deposit Address</th>
            <th style={{ padding: "8px" }}>Tracking ID</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o: any) => (
            <tr key={o.id} style={{ borderBottom: "1px solid #1a2342" }}>
              <td style={{ padding: "8px" }}>{new Date(o.created_at).toLocaleString()}</td>
              <td style={{ padding: "8px" }}>{o.provider}</td>
              <td style={{ padding: "8px" }}>{o.from_asset}</td>
              <td style={{ padding: "8px" }}>{o.to_asset}</td>
              <td style={{ padding: "8px" }}>{o.amount}</td>
              <td style={{ padding: "8px", maxWidth: "180px", overflow: "hidden", textOverflow: "ellipsis" }}>{o.destination_address}</td>
              <td style={{ padding: "8px", maxWidth: "180px", overflow: "hidden", textOverflow: "ellipsis" }}>{o.deposit_address}</td>
              <td style={{ padding: "8px", maxWidth: "150px", overflow: "hidden", textOverflow: "ellipsis" }}>{o.tracking_id}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
