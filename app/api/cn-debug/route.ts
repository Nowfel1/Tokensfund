import { NextResponse } from "next/server";

export async function GET() {
  const API_KEY = process.env.CHANGENOW_API_KEY ?? "";
  const res = await fetch("https://api.changenow.io/v2/exchange/currencies?active=true&flow=fixed-rate&buy=true&sell=true", {
    headers: { "x-changenow-api-key": API_KEY },
  });
  const data = await res.json();
  const filtered = data.filter((c: any) =>
    ["tao", "hype"].includes(c.ticker?.toLowerCase()) ||
    c.name?.toLowerCase().includes("bittensor") ||
    c.name?.toLowerCase().includes("hyperliquid")
  );
  return NextResponse.json(filtered);
}
