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

// CoinGecko Demo API key (free). Set COINGECKO_API_KEY in Vercel
// (Production scope) and redeploy after adding it.
const CG_KEY = process.env.COINGECKO_API_KEY;

let cache: { at: number; data: Record<string, number> } | null = null;
const TTL = 5 * 60 * 1000; // 5 min — plenty fresh for ticker + fiat hints
const MAX_STALE = 15 * 60 * 1000; // during outages, serve last-good up to this age

function staleOk() {
  return cache !== null && Date.now() - cache.at < MAX_STALE;
}

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
        // CRITICAL: Next.js caches fetch() bodies in Vercel's Data Cache by
        // default — that platform-level cache (visible as "Using cache" in
        // request traces) served stale prices for days despite our in-memory
        // TTL. no-store bypasses it. Do not remove.
        cache: "no-store",
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

    // Failed call or no usable prices (rate limit, error body, outage):
    // never cache the empty result — serve last-good while acceptably
    // fresh, then hide. Components render nothing on {} by design.
    if (!res.ok || Object.keys(out).length === 0) {
      console.warn(
        "MARKETS: no usable data (status " + res.status + ", key " + (CG_KEY ? "present" : "MISSING") + "). Body:",
        JSON.stringify(raw)?.slice(0, 200)
      );
      if (staleOk()) return corsJson(cache!.data);
      return corsJson({});
    }

    cache = { at: Date.now(), data: out };
    return corsJson(out);
  } catch (e: any) {
    console.warn("MARKETS: fetch threw:", e?.message);
    if (staleOk()) return corsJson(cache!.data);
    return corsJson({});
  }
}
