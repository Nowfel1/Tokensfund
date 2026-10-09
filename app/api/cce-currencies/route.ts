import { NextResponse } from "next/server";
import { createHmac, randomBytes } from "crypto";

// TEMPORARY — reads CCE's list of supported coins. Delete this folder once
// you've checked the values you need.
//   /api/cce-currencies?q=ton   -> only rows matching "ton"
//   /api/cce-currencies         -> everything

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BASE = "https://cce.cash/api/v1";
const PATH = "/openapi/abbr/lists";
const API_KEY = process.env.CCE_API_KEY ?? "";
const API_SECRET = process.env.CCE_API_SECRET ?? "";

function headersFor(signOver: string): Record<string, string> {
  const nonce = randomBytes(16).toString("hex");
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const signature = createHmac("sha256", API_SECRET)
    .update(API_KEY + nonce + timestamp + signOver)
    .digest("hex");
  return {
    "Content-Type": "application/json",
    "X-Api-Key": API_KEY,
    "X-Api-Nonce": nonce,
    "X-Api-Timestamp": timestamp,
    "X-Api-Signature": signature,
  };
}

export async function GET(req: Request) {
  if (!API_KEY || !API_SECRET) {
    return NextResponse.json({ error: "CCE_API_KEY / CCE_API_SECRET not set" }, { status: 500 });
  }
  const q = (new URL(req.url).searchParams.get("q") ?? "").toLowerCase();
  const qs = "with_unavailable=false";
  let data: any = null;

  for (const signOver of ["", qs]) {
    try {
      const res = await fetch(`${BASE}${PATH}?${qs}`, { cache: "no-store", headers: headersFor(signOver) });
      const body = await res.json().catch(() => null);
      data = body;
      if (body && body.code === 0) break;
    } catch (e: any) {
      data = { error: e?.message };
    }
  }

  if (!data || data.code !== 0) {
    return NextResponse.json({ ok: false, cceResponse: data }, { status: 502 });
  }

  const rows = (Array.isArray(data.data) ? data.data : [])
    .map((r: any) => ({
      abbr: r.abbr, chain: r.chain, type: r.type, decimal: r.decimal,
      recv: r.recv, send: r.send, name: r.name,
    }))
    .filter((r: any) =>
      !q || [r.abbr, r.chain, r.type, r.name].some((v) => String(v ?? "").toLowerCase().includes(q))
    );

  return NextResponse.json({ ok: true, count: rows.length, currencies: rows });
}
