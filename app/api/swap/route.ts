import { NextRequest, NextResponse } from "next/server";
import { getAsset } from "@/lib/assets";
import { ProviderId, QuoteRequest } from "@/lib/types";
import * as thorchain from "@/lib/providers/thorchain";
import * as chainflip from "@/lib/providers/chainflip";
import * as nearIntents from "@/lib/providers/nearIntents";
import * as cce from "@/lib/providers/cce";
import * as changee from "@/lib/providers/changee";
import { sql, ensureOrdersTable } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function logOrder(result: any, body: any) {
  try {
    await ensureOrdersTable();
    await sql`
      INSERT INTO orders (provider, from_asset, to_asset, amount, destination_address, refund_address, deposit_address, tracking_id)
      VALUES (${result.provider}, ${body.fromAssetId}, ${body.toAssetId}, ${body.amount}, ${body.destinationAddress}, ${body.refundAddress ?? null}, ${result.depositAddress}, ${result.trackingId})
    `;
  } catch (e) {
    console.error("Failed to log order:", e);
  }
}

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

    let result;
    if (body.provider === "thorchain") {
      const quote = await thorchain.getQuote(from, to, body);
      result = await thorchain.buildSwap(quote, body);
    } else if (body.provider === "chainflip") {
      const quote = await chainflip.getQuote(from, to, body);
      result = await chainflip.buildSwap(quote, body, from, to);
    } else if (body.provider === "near_intents") {
      const quote = await nearIntents.getQuote(from, to, body);
      result = await nearIntents.buildSwap(quote, from, to, body);
    } else if (body.provider === "cce") {
      const quote = await cce.getQuote(from, to, body);
      result = await cce.buildSwap(quote, body, from, to);
    } else if (body.provider === "changee") {
      const quote = await changee.getQuote(from, to, body);
