import { NextRequest, NextResponse } from "next/server";
import { getOrderByCode, setOrderDepositTx, OrderRecord } from "@/lib/db";
import { lookupReference } from "@/lib/thorMemoless";
import * as thorchain from "@/lib/providers/thorchain";
import * as chainflip from "@/lib/providers/chainflip";
import * as cce from "@/lib/providers/cce";
import * as changee from "@/lib/providers/changee";
import * as anonchange from "@/lib/providers/anonchange";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Status by TokensFund order code. The provider's tracking details (which,
// for Wagyu, include a private session credential) are looked up on the
// server and never sent to the browser or placed in a URL.
// Wagyu was removed (Nov 2026); old Wagyu orders show their last saved state.
const PROVIDERS: Record<string, { getStatus: (id: string) => Promise<any> }> = {
  chainflip,
  cce,
  changee,
  anonchange,
};

const TX_HASH = /^[0-9A-F]{64}$/;

function cleanHash(v: unknown): string | null {
  const h = String(v ?? "").trim().replace(/^0x/i, "").toUpperCase();
  return TX_HASH.test(h) ? h : null;
}

// Memoless references are recycled by THORChain after about 6 hours, so a
// lookup is only trusted while the order is young AND the memo it returns is
// the one we registered for this order.
const REFERENCE_TRUST_MS = 7 * 60 * 60 * 1000;

/** For a memoless order, ask THORChain whether its reference has been used. */
async function memolessDeposit(order: OrderRecord): Promise<{ hash: string | null; used: boolean }> {
  const none = { hash: null, used: false };
  const parts = String(order.tracking_id ?? "").split("~");
  if (parts[0] !== "memoless" || parts.length < 4) return none;
  if (Date.now() - new Date(order.created_at).getTime() > REFERENCE_TRUST_MS) return none;
  const [, asset, reference] = parts;
  const memo = parts.slice(3).join("~");
  try {
    const r = await lookupReference(asset, reference);
    const d: any = r.data ?? {};
    if (!r.ok || d.memo !== memo) return none;
    const used = Number(d.usage_count ?? 0) > 0;
    const txs: unknown[] = Array.isArray(d.used_by_txs) ? d.used_by_txs : [];
    for (const t of txs) {
      const h = cleanHash(t);
      if (h) return { hash: h, used: true };
    }
    return { hash: null, used };
  } catch {
    return none;
  }
}

// THORChain has no order id: a swap is followed by the user's own deposit
// transaction. We get that either from the memoless reference (automatic) or
// from the user pasting it on the order page.
async function thorchainStatus(order: OrderRecord) {
  let hash = cleanHash(order.deposit_tx);
  let seen = false;
  if (!hash) {
    const found = await memolessDeposit(order);
    seen = found.used;
    if (found.hash) {
      hash = found.hash;
      try {
        await setOrderDepositTx(order.order_code, hash);
      } catch {
        // not fatal: it is looked up again next time
      }
    }
  }
  if (!hash) {
    return {
      provider: "thorchain",
      state: seen ? "deposit_detected" : "awaiting_deposit",
      // Tells the page to offer the "paste your transaction ID" box.
      needsTx: true,
    };
  }
  const s = await thorchain.getStatus(hash);
  return { ...s, hasTx: true };
}

export async function GET(req: NextRequest) {
  const code = new URL(req.url).searchParams.get("code") ?? "";
  const order = await getOrderByCode(code);
  if (!order) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }

  try {
    if (order.provider === "thorchain") {
      return NextResponse.json(await thorchainStatus(order));
    }
    const mod = PROVIDERS[order.provider];
    if (!mod || !order.tracking_id) {
      return NextResponse.json({
        provider: order.provider,
        state: "unknown",
        detail: "Live status isn't available for this route. Check your destination wallet.",
      });
    }
    const status = await mod.getStatus(order.tracking_id);
    return NextResponse.json(status);
  } catch (e: any) {
    return NextResponse.json({
      provider: order.provider,
      state: "unknown",
      detail: e?.message ?? "Status lookup failed",
    });
  }
}
