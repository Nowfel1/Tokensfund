import { NextRequest, NextResponse } from "next/server";
import { getOrderByCode } from "@/lib/db";
import * as thorchain from "@/lib/providers/thorchain";
import * as chainflip from "@/lib/providers/chainflip";
import * as cce from "@/lib/providers/cce";
import * as changee from "@/lib/providers/changee";
import * as wagyu from "@/lib/providers/wagyu";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Status by TokensFund order code. The provider's tracking details (which,
// for Wagyu, include a private session credential) are looked up on the
// server and never sent to the browser or placed in a URL.
const PROVIDERS: Record<string, { getStatus: (id: string) => Promise<any> }> = {
  thorchain,
  chainflip,
  cce,
  changee,
  wagyu,
};

export async function GET(req: NextRequest) {
  const code = new URL(req.url).searchParams.get("code") ?? "";
  const order = await getOrderByCode(code);
  if (!order) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }

  const mod = PROVIDERS[order.provider];
  if (!mod || !order.tracking_id) {
    return NextResponse.json({
      provider: order.provider,
      state: "unknown",
      detail: "Live status isn't available for this route. Check your destination wallet.",
    });
  }

  try {
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
