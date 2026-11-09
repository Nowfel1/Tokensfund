import { NextResponse } from "next/server";
import { aggregateQuotes } from "@/lib/aggregator";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Live "what does each route cost right now" table for the homepage.
//
// For two reference swaps we ask every route for a quote and compare the
// output with the market price. The difference is the all-in cost: provider
// fee, our fee, network fee and spread together.
//
// The response is cached by Vercel's network for 5 minutes (s-maxage), so
// every visitor in that window shares one result and providers see only a
// couple of quote requests per 5 minutes, whatever the traffic.

const AMOUNT = "0.01"; // BTC — large enough to clear every route's minimum
const PAIRS = [
  { key: "btcXmr", from: "BTC", to: "XMR" },
  { key: "btcEth", from: "BTC", to: "ETH" },
] as const;

const CG_IDS: Record<string, string> = { BTC: "bitcoin", XMR: "monero", ETH: "ethereum" };
const CG_KEY = process.env.COINGECKO_API_KEY;

async function getPrices(): Promise<Record<string, number>> {
  const ids = Object.values(CG_IDS).join(",");
  const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`, {
    cache: "no-store",
    headers: { accept: "application/json", ...(CG_KEY ? { "x-cg-demo-api-key": CG_KEY } : {}) },
  });
  const raw = await res.json().catch(() => null);
  const out: Record<string, number> = {};
  for (const [asset, id] of Object.entries(CG_IDS)) {
    const usd = raw?.[id]?.usd;
    if (typeof usd === "number" && usd > 0) out[asset] = usd;
  }
  return out;
}

export async function GET(req: Request) {
  const debug = new URL(req.url).searchParams.get("debug") === "1";
  try {
    const prices = await getPrices();
    // costs[route][pairKey] = all-in cost in percent, or null if unavailable
    const costs: Record<string, Record<string, number | null>> = {};
    // Why a route has no number for a pair (only returned with ?debug=1).
    const errors: Record<string, Record<string, string>> = {};
    // Each route's own fee breakdown, where its quote includes one (?debug=1 only).
    const breakdown: Record<string, Record<string, unknown>> = {};

    await Promise.all(
      PAIRS.map(async (pair) => {
        const pFrom = prices[pair.from];
        const pTo = prices[pair.to];
        if (!pFrom || !pTo) return;
        const agg = await aggregateQuotes({
          fromAssetId: pair.from,
          toAssetId: pair.to,
          amount: AMOUNT,
          slippageBps: 100,
        });
        const valueIn = Number(AMOUNT) * pFrom;
        for (const q of agg.quotes) {
          costs[q.provider] ??= {};
          if (q.error || !q.expectedOut) {
            costs[q.provider][pair.key] = null;
            errors[q.provider] ??= {};
            errors[q.provider][pair.key] = q.error ?? "No amount returned";
            continue;
          }
          const raw: any = q.raw;
          const fees = raw?.fees ?? raw?.feeBreakdown;
          if (fees) {
            breakdown[q.provider] ??= {};
            breakdown[q.provider][pair.key] = fees;
          }
          const cost = (1 - (q.expectedOut * pTo) / valueIn) * 100;
          // A slightly negative cost just means the market price lagged the
          // quote; anything absurd is bad data and is hidden.
          costs[q.provider][pair.key] = cost > 50 ? null : Math.max(0, Math.round(cost * 10) / 10);
        }
      })
    );

    return NextResponse.json(
      { updatedAt: new Date().toISOString(), amount: AMOUNT, costs, ...(debug ? { prices, errors, breakdown } : {}) },
      { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" } }
    );
  } catch {
    return NextResponse.json(
      { error: "Route costs are unavailable right now." },
      { status: 503, headers: { "Cache-Control": "public, s-maxage=60" } }
    );
  }
}
