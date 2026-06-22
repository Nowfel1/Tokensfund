import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Map our asset IDs to CoinGecko IDs
const CG_IDS: Record<string, string> = {
  BTC: "bitcoin",
  ETH: "ethereum",
  SOL: "solana",
  XRP: "ripple",
  DOGE: "dogecoin",
  USDT: "tether",
  USDC: "usd-coin",
  LTC: "litecoin",
  TON: "the-open-network",
  XMR: "monero",
  ZEC: "zcash",
  NEAR: "near",
  TAO: "bittensor",
  HYPE: "hyperliquid",
  ZANO: "zano",
  TRX: "tron",
  USDT_TRC20: "tether",
};

let cache: { at: number; data: Record<string, number> } | null = null;
const TTL = 60 * 1000; // 60s

export async function GET() {
  if (cache && Date.now() - cache.at < TTL) {
    return NextResponse.json(cache.data, {
      headers: { "Access-Control-Allow-Origin": "*" },
    });
  }

  try {
    const ids = Array.from(new Set(Object.values(CG_IDS))).join(",");
    const res = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=" + ids + "&vs_currencies=usd",
      { headers: { accept: "application/json" } }
    );
    const raw = await res.json();

    // Re-key from CoinGecko IDs back to our asset IDs
    const out: Record<string, number> = {};
    for (const [assetId, cgId] of Object.entries(CG_IDS)) {
      const price = raw?.[cgId]?.usd;
      if (typeof price === "number") out[assetId] = price;
    }

    cache = { at: Date.now(), data: out };
    return NextResponse.json(out, {
      headers: { "Access-Control-Allow-Origin": "*" },
    });
  } catch (e: any) {
    // On failure, return last cache if we have it, else empty
    if (cache) return NextResponse.json(cache.data);
    return NextResponse.json({});
  }
}
