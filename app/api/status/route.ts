import { NextRequest, NextResponse } from "next/server";
import { ProviderId } from "@/lib/types";
import * as thorchain from "@/lib/providers/thorchain";
import * as chainflip from "@/lib/providers/chainflip";
import * as nearIntents from "@/lib/providers/nearIntents";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const provider = req.nextUrl.searchParams.get("provider") as ProviderId | null;
  const id = req.nextUrl.searchParams.get("id");
  if (!provider || !id) {
    return NextResponse.json({ error: "provider and id are required." }, { status: 400 });
  }
  try {
    if (provider === "thorchain") return NextResponse.json(await thorchain.getStatus(id));
    if (provider === "chainflip") return NextResponse.json(await chainflip.getStatus(id));
    if (provider === "near_intents") return NextResponse.json(await nearIntents.getStatus(id));
    return NextResponse.json({ error: "Unknown provider." }, { status: 400 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Status check failed" }, { status: 500 });
  }
}
