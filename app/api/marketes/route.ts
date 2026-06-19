import { NextResponse } from "next/server";
import { ASSETS } from "@/lib/assets";
import { aggregateQuotes } from "@/lib/aggregator";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Reference amount per asset to get a meaningful quote (roughly $100-1000 worth)
const REFERENCE_AMOUNT: Record<string, string> = {
  BTC: "0.01",
  ETH: "0.1",
  SOL: "1",
  XRP: "100",
  DOGE: "1000",
  USDT: "100",
  USDC: "100",
  LTC: "1",
  TON: "20",
  XMR: "1",
  ZEC: "5",
  NEAR: "20",
  TAO: "1",
  HYPE: "5",
};

// Main pairs to expose - keeps this fast instead of querying every possible combination
const PAIRS: [string, string][] = [
  ["BTC", "ETH"], ["BTC", "USDT"], ["BTC", "USDC"], ["BTC", "SOL"],
  ["BTC", "XRP"], ["BTC", "LTC"], ["BTC", "XMR"], ["BTC", "DOGE"],
  ["ETH", "USDT"], ["ETH", "USDC"], ["ETH", "SOL"], ["ETH", "XRP"],
  ["SOL", "USDT"], ["XRP", "USDT"], ["LTC", "USDT"], ["DOGE", "USDT"],
];

export async function GET() {
  const results = await Promise.allSettled(
    PAIRS.map(async ([fromId, toId]) => {
      const amount = REFERENCE_AMOUNT[fromId] ?? "1";
      const quotes = await aggregateQuotes({
        fromAssetId: fromId,
        toAssetId: toId,
        amount,
        slippageBps: 100,
      });
      const best = quotes.quotes[quotes.bestIndex];
      if (!best || best.error) return null;

      const rate = best.expectedOut / Number(amount);
      return {
        pair: `${fromId}_${toId}`,
        last_price: rate.toString(),
        base_volume: "0",
        quote_volume: "0",
        isFrozen: 0,
      };
    })
  );

  const markets = results
    .filter((r) => r.status === "fulfilled" && r.value !== null)
    .map((r: any) => r.value);

  return NextResponse.json(markets, {
    headers: {
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
