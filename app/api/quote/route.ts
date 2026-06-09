import { NextRequest, NextResponse } from "next/server";
import { aggregateQuotes } from "@/lib/aggregator";
import { QuoteRequest } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as QuoteRequest;
    if (!body.fromAssetId || !body.toAssetId || !body.amount) {
      return NextResponse.json({ error: "fromAssetId, toAssetId and amount are required." }, { status: 400 });
    }
    if (Number(body.amount) <= 0) {
      return NextResponse.json({ error: "Amount must be greater than zero." }, { status: 400 });
    }
    const result = await aggregateQuotes(body);
    return NextResponse.json(result);
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Quote failed" }, { status: 500 });
  }
}
