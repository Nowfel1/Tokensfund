import { NextRequest, NextResponse } from "next/server";
import { getOrderByCode, setOrderDepositTx } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Lets the holder of an order link tell us their deposit transaction ID.
// THORChain follows a swap by that transaction, so this is what turns on live
// tracking for THORChain orders whose deposit we couldn't spot automatically.
export async function POST(req: NextRequest) {
  let body: any = null;
  try {
    body = await req.json();
  } catch {
    // handled below
  }
  const order = await getOrderByCode(String(body?.code ?? ""));
  if (!order) return NextResponse.json({ error: "Order not found." }, { status: 404 });
  if (order.provider !== "thorchain") {
    return NextResponse.json({ error: "This order is tracked automatically." }, { status: 400 });
  }

  const tx = String(body?.tx ?? "").trim().replace(/^0x/i, "").toUpperCase();
  if (!/^[0-9A-F]{64}$/.test(tx)) {
    return NextResponse.json(
      { error: "That doesn't look like a transaction ID. It should be 64 letters and numbers (0-9, a-f)." },
      { status: 400 }
    );
  }

  await setOrderDepositTx(order.order_code, tx);
  return NextResponse.json({ ok: true });
}
