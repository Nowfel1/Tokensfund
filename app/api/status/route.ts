import { NextRequest, NextResponse } from "next/server";
import { ProviderId } from "@/lib/types";
import * as thorchain from "@/lib/providers/thorchain";
import * as chainflip from "@/lib/providers/chainflip";
import * as nearIntents from "@/lib/providers/nearIntents";
import * as cce from "@/lib/providers/cce";
import * as changee from "@/lib/providers/changee";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PROVIDERS: Record<string, any> = {
  thorchain,
  chainflip,
  near_intents: nearIntents,
  cce,
  changee,
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const provider = searchParams.get("provider") as ProviderId | null;
  const trackingId = searchParams.get("id");

  if (!provider || !trackingId) {
    return NextResponse.json({ error: "Missing provider or id." }, { status: 400 });
  }

  const mod = PROVIDERS[provider];
  if (!mod) {
    return NextResponse.json({ error: "Unknown provider." }, { status: 400 });
  }

  if (typeof mod.getStatus !== "function") {
    return NextResponse.json(
      {
        provider,
        state: "unknown",
        detail: "Live tracking is not available for this provider yet. Check your wallet or the provider's explorer.",
      },
      { status: 200 }
    );
  }

  try {
    const status = await mod.getStatus(trackingId);
    return NextResponse.json(status, { status: 200 });
  } catch (e: any) {
    return NextResponse.json(
      { provider, state: "unknown", detail: e.message ?? "Status lookup failed" },
      { status: 200 }
    );
  }
}
