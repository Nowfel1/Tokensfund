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
}
