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
  TRX: "tron",
  USDT_TRC20: "tether",
};

// Optional CoinGecko Demo API key (free — raises the rate limit substantially).
// Set COINGECKO_API_KEY in Vercel; without it we use the anonymous endpoint.
const CG_KEY = process.env.COINGECKO_API_KEY;

let cache: { at: number; data: Record<string, number> } | null = null;
const TTL = 60 * 1000; // 60s

function corsJson(data: Record<string, number>) {
  return NextResponse.json(data, { headers: { "Access-Control-Allow-Origin": "*" } });
}

export async function GET() {
  if (cache && Date.now() - cache.at < TTL) {
    return corsJson(cache.data);
  }

  try {
    const ids = Array.from(new Set(Object.values(CG_IDS))).join(",");
    const res = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=" + ids + "&vs_currencies=usd",
      {
        headers: {
          accept: "application/json",
          ...(CG_KEY ? { "x-cg-demo-api-key": CG_KEY } : {}),
        },
      }
    );

    const raw = await res.json().catch(() => null);

    // Re-key from CoinGecko IDs back to our asset IDs
    const out: Record<string, number> = {};
    if (raw && typeof raw === "object") {
      for (const [assetId, cgId] of Object.entries(CG_IDS)) {
        const price = raw?.[cgId]?.usd;
        if (typeof price === "number") out[assetId] = price;
      }
    }

    // If the call failed OR returned no usable prices (rate limit, error body,
    // outage), DO NOT cache the empty result — serve the last good data and
    // let the next request retry. Caching {} here is what blanks the ticker
    // and fiat hints for a full TTL.
    if (!res.ok || Object.keys(out).length === 0) {
      console.warn(
        "MARKETS: no usable data (status " + res.status + "). Body:",
        JSON.stringify(raw)?.slice(0, 200)
      );
      if (cache) return corsJson(cache.data);
      return corsJson({});
    }

    cache = { at: Date.now(), data: out };
    return corsJson(out);
  } catch (e: any) {
    console.warn("MARKETS: fetch threw:", e?.message);
    // On failure, return last cache if we have it, else empty
    if (cache) return corsJson(cache.data);
    return corsJson({});
  }
}
