import { sql, ensureOrdersTable } from "@/lib/db";
import { CopyText, StatusCell, TrackingCell } from "@/components/AdminCells";

export const dynamic = "force-dynamic";

const LIMIT = 200;

// Search by order code (with or without dashes), any address, the provider's
// tracking ID. Searches ALL orders, not just the
// newest 200.
async function getOrders(q: string) {
  await ensureOrdersTable();
  const term = q.trim();
  if (!term) {
    return sql`SELECT * FROM orders ORDER BY created_at DESC LIMIT ${LIMIT}`;
  }
  const like = `%${term}%`;
  const code = `%${term.replace(/[^a-zA-Z0-9]/g, "")}%`;
  return sql`
    SELECT * FROM orders
    WHERE order_code ILIKE ${code}
       OR destination_address ILIKE ${like}
       OR refund_address ILIKE ${like}
       OR deposit_address ILIKE ${like}
       OR tracking_id ILIKE ${like}
    ORDER BY created_at DESC
    LIMIT ${LIMIT}`;
}

/** DPE7HDFILNBU -> DPE7-HDFI-LNBU, matching what customers see. */
function formatCode(code?: string | null) {
  if (!code) return "";
  return code.match(/.{1,4}/g)?.join("-") ?? code;
}

export default async function AdminOrders({
  searchParams,
}: {
  searchParams: { key?: string; q?: string };
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

  const q = searchParams.q ?? "";
  const orders = await getOrders(q);

  return (
    <main style={{ maxWidth: "1400px", margin: "0 auto", padding: "40px 20px", fontFamily: "ui-monospace, monospace", color: "#e9edfa", background: "#0b1020", minHeight: "100vh" }}>
      <h1 style={{ fontSize: "24px", marginBottom: "14px" }}>
        Orders ({orders.length}
        {q ? ` matching “${q}”` : orders.length >= LIMIT ? `, newest ${LIMIT}` : ""})
      </h1>
      <form method="get" style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
        <input type="hidden" name="key" value={providedKey} />
        <input
          name="q"
          defaultValue={q}
          placeholder="Order code, address or provider ID"
          style={{ flex: 1, maxWidth: "520px", padding: "9px 12px", background: "#121a33", color: "#e9edfa", border: "1px solid #2a3358", borderRadius: "6px", fontFamily: "inherit", fontSize: "13px" }}
        />
        <button type="submit" style={{ padding: "9px 16px", background: "#f4c64e", color: "#000", border: 0, borderRadius: "6px", fontWeight: 700, cursor: "pointer" }}>
          Search
        </button>
        {q && (
          <a href={`?key=${encodeURIComponent(providedKey ?? "")}`} style={{ alignSelf: "center", color: "#8a95b8", fontSize: "12px" }}>
            Clear
          </a>
        )}
      </form>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12.5px", tableLayout: "fixed" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid #2a3358", textAlign: "left" }}>
            <th style={{ padding: "8px", width: "130px" }}>Date</th>
            <th style={{ padding: "8px", width: "130px" }}>Order code</th>
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
              <td style={{ padding: "8px" }}>
                {o.order_code ? (
                  <a href={`/order/${o.order_code}`} target="_blank" rel="noreferrer" style={{ color: "#f4c64e" }}>
                    {formatCode(o.order_code)}
                  </a>
                ) : (
                  <span style={{ color: "#565f80" }}>—</span>
                )}
              </td>
              <td style={{ padding: "8px" }}>{o.provider}</td>
              <td style={{ padding: "8px" }}>{o.from_asset}</td>
              <td style={{ padding: "8px" }}>{o.to_asset}</td>
              <td style={{ padding: "8px" }}>{o.amount}</td>
              <td style={{ padding: "8px" }}><CopyText text={o.destination_address} /></td>
              <td style={{ padding: "8px" }}><CopyText text={o.deposit_address} /></td>
              <td style={{ padding: "8px" }}><TrackingCell provider={o.provider} text={o.tracking_id} /></td>
              <td style={{ padding: "8px" }}><StatusCell provider={o.provider} trackingId={o.tracking_id} /></td>
            </tr>
          ))}
        </tbody>
      </table>
      <p style={{ color: "#565f80", fontSize: "11px", marginTop: "14px" }}>
        Search covers every order, not only the newest {LIMIT}. Click an order code to open its order page. Click any address/ID to copy. Click &quot;check&quot; to fetch live status for that order (one provider call per click); click the status again to refresh it.
      </p>
    </main>
  );
}
