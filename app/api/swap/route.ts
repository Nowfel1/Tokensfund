import { NextRequest, NextResponse } from "next/server";
import { getAsset } from "@/lib/assets";
import { ProviderId, QuoteRequest } from "@/lib/types";
import * as thorchain from "@/lib/providers/thorchain";
import * as chainflip from "@/lib/providers/chainflip";
import * as nearIntents from "@/lib/providers/nearIntents";
import * as exolix from "@/lib/providers/exolix";
import * as cce from "@/lib/providers/cce";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as QuoteRequest & { provider: ProviderId };
    const from = getAsset(body.fromAssetId);
    const to = getAsset(body.toAssetId);
    if (!from || !to) return NextResponse.json({ error: "Unknown asset." }, { status: 400 });
    if (!body.destinationAddress) {
      return NextResponse.json(
        { error: "A destination address is required to open a deposit address." },
        { status: 400 }
      );
    }
    if (body.provider === "thorchain") {
      const quote = await thorchain.getQuote(from, to, body);
      return NextResponse.json(await thorchain.buildSwap(quote, body));
    }
    if (body.provider === "chainflip") {
      const quote = await chainflip.getQuote(from, to, body);
      return NextResponse.json(await chainflip.buildSwap(quote, body, from, to));
    }
    if (body.provider === "near_intents") {
      const quote = await nearIntents.getQuote(from, to, body);
      return NextResponse.json(await nearIntents.buildSwap(quote, from, to, body));
    }
    if (body.provider === "exolix") {
      const quote = await exolix.getQuote(from, to, body);
      return NextResponse.json(await exolix.buildSwap(quote, body, from, to));
    }
    if (body.provider === "cce") {
      const quote = await cce.getQuote(from, to, body);
      return NextResponse.json(await cce.buildSwap(quote, body, from, to));
    }
    return NextResponse.json({ error: "Unknown provider." }, { status: 400 });
  } catch (e: any) {
    console.error("SWAP ERROR:", JSON.stringify(e, null, 2), e.message);
    return NextResponse.json(
      { error: e.message ?? "Could not open deposit address" },
      { status: 500 }
    );
  }
}
