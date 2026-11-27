import { NextResponse } from "next/server";
import { buildSignedRequest, secretFingerprint } from "@/lib/providers/anonchange";

// LOCKED diagnostics for AnonChange support. Sends ONE price request exactly
// as the site does and shows every value support asked for. It never shows
// the API secret — only its SHA-256 fingerprint.
//
//   /api/anonchange-debug?key=YOUR_MEMOLESS_ADMIN_KEY
//
// Delete this folder once AnonChange quotes are working.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ADMIN_KEY = process.env.MEMOLESS_ADMIN_KEY ?? "";

export async function GET(req: Request) {
  const q = new URL(req.url).searchParams;
  if (!ADMIN_KEY || q.get("key") !== ADMIN_KEY) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }
  try {
    const signed = buildSignedRequest("price", {
      from: "BTC",
      to: "XMR",
      rateType: "float",
      amount: "0.01",
    });
    const sentAt = new Date().toISOString();
    const res = await fetch(signed.url, {
      method: "POST",
      cache: "no-store",
      headers: signed.headers,
      body: signed.body,
    });
    const responseText = await res.text();

    return NextResponse.json({
      forAnonChangeSupport: {
        url: signed.url,
        headers: {
          "X-API-KEY": signed.headers["X-API-KEY"],
          "X-API-TIMESTAMP": signed.headers["X-API-TIMESTAMP"],
          "X-API-NONCE": signed.headers["X-API-NONCE"],
          "X-API-SIGN": signed.headers["X-API-SIGN"],
          "Idempotency-Key": "not sent on price requests",
        },
        body: signed.body,
        signedString: signed.signedString,
        secretSha256: secretFingerprint(),
        timeUtc: sentAt,
        runtime: `Node.js ${process.version} on Vercel (Node runtime, not Edge); fetch + node:crypto`,
      },
      response: { status: res.status, body: responseText.slice(0, 500) },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? String(e) }, { status: 500 });
  }
}
