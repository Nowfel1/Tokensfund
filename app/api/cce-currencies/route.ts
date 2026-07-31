import { NextResponse } from "next/server";
import { createHmac, randomBytes } from "crypto";

// ============================================================================
// TEMPORARY DIAGNOSTIC ROUTE — DELETE AFTER USE.
// CCE's /openapi/abbr/lists needs HMAC-signed headers, so it can't be opened
// in a browser directly. This route signs the request with the same
// credentials cce.ts uses and returns a trimmed view of the currency list.
//
// Usage:
//   /api/cce-currencies            → every currency (trimmed fields)
//   /api/cce-currencies?q=usdt     → only rows whose abbr/chain/type matches
//   /api/cce-currencies?raw=1      → untouched CCE response
// ============================================================================

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
    return NextResponse.json(
      { error: "CCE_API_KEY / CCE_API_SECRET not set in this environment" },
      { status: 500 }
    );
  }

  const url = new URL(req.url);
  const q = (url.searchParams.get("q") ?? "").toLowerCase();
  const raw = url.searchParams.get("raw") === "1";

  // Mirror cce.ts: signature target for GETs is unspecified in their docs, so
  // try an empty string first, then the query string.
  const qs = "with_unavailable=false";
  let data: any = null;
  let lastStatus = 0;

  for (const signOver of ["", qs]) {
    try {
      const res = await fetch(`${BASE}${PATH}?${qs}`, {
        cache: "no-store",
        headers: headersFor(signOver),
      });
      lastStatus = res.status;
      const body = await res.json().catch(() => null);
      if (body && body.code === 0) {
        data = body;
        break;
      }
      data = body; // keep the last error body for reporting
    } catch (e: any) {
      data = { error: e?.message };
    }
  }

  if (!data || data.code !== 0) {
    return NextResponse.json(
      { ok: false, httpStatus: lastStatus, cceResponse: data },
      { status: 502 }
    );
  }

  if (raw) return NextResponse.json(data);

  const rows: any[] = Array.isArray(data.data) ? data.data : [];
  const trimmed = rows
    .map((r) => ({
      abbr: r.abbr,
      chain: r.chain,
      type: r.type,
      decimal: r.decimal,
      recv: r.recv,
      send: r.send,
      name: r.name,
    }))
    .filter((r) => {
      if (!q) return true;
      return [r.abbr, r.chain, r.type, r.name]
        .filter(Boolean)
        .some((v: string) => String(v).toLowerCase().includes(q));
    })
    .sort((a, b) => String(a.abbr).localeCompare(String(b.abbr)));

  return NextResponse.json({ ok: true, count: trimmed.length, currencies: trimmed });
}
