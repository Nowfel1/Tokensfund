import { neon } from "@neondatabase/serverless";

export const sql = neon(process.env.DATABASE_URL!);

export async function ensureOrdersTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS orders (
      id SERIAL PRIMARY KEY,
      provider TEXT NOT NULL,
      from_asset TEXT NOT NULL,
      to_asset TEXT NOT NULL,
      amount TEXT NOT NULL,
      destination_address TEXT NOT NULL,
      refund_address TEXT,
      deposit_address TEXT,
      tracking_id TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  // Short, shareable order code used in /order/<code> URLs. Added after the
  // table existed, so it goes in as a separate ADD COLUMN IF NOT EXISTS —
  // existing rows keep a NULL code (they have no order page).
  await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS order_code TEXT`;
  await sql`CREATE UNIQUE INDEX IF NOT EXISTS orders_order_code_idx ON orders (order_code)`;
  // Amount the user was quoted to receive when the order was created. Older
  // rows have NULL here and the order page simply shows the asset.
  await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS expected_out TEXT`;
}

// ---------------------------------------------------------------------------
// Order codes
//
// 12 characters from a 32-symbol alphabet = 60 bits of entropy — not
// enumerable in practice. The alphabet omits 0/O/1/I/L so a code can be read
// aloud or retyped without ambiguity.
// ---------------------------------------------------------------------------
const CODE_ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";
const CODE_LENGTH = 12;

export function generateOrderCode(): string {
  const bytes = new Uint8Array(CODE_LENGTH);
  crypto.getRandomValues(bytes);
  let out = "";
  for (let i = 0; i < CODE_LENGTH; i++) {
    out += CODE_ALPHABET[bytes[i] % CODE_ALPHABET.length];
  }
  return out;
}

export interface OrderRecord {
  order_code: string;
  provider: string;
  from_asset: string;
  to_asset: string;
  amount: string;
  expected_out: string | null;
  destination_address: string;
  deposit_address: string | null;
  tracking_id: string | null;
  created_at: string;
}

export async function getOrderByCode(code: string): Promise<OrderRecord | null> {
  // Accept the grouped form shown on the order page (K7M4-PQX9-RTVB) as well
  // as the plain one: drop dashes, spaces and anything else non-alphanumeric.
  const clean = String(code).replace(/[^A-Za-z0-9]/g, "").toUpperCase();
  if (!/^[A-Z0-9]{6,32}$/.test(clean)) return null;
  const rows = (await sql`
    SELECT order_code, provider, from_asset, to_asset, amount, expected_out,
           destination_address, deposit_address, tracking_id, created_at
    FROM orders
    WHERE order_code = ${clean}
    LIMIT 1
  `) as unknown as OrderRecord[];
  return rows.length ? rows[0] : null;
}
