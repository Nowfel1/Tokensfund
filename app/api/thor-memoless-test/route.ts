import { NextResponse } from "next/server";
import {
  memolessConfigured,
  walletInfo,
  registerReference,
  lookupReference,
  checkAmount,
  encodeReference,
} from "@/lib/thorMemoless";

// TEMPORARY, LOCKED test endpoint for THORChain memoless swaps.
// Delete this folder once memoless deposits are confirmed working.
//
//   /api/thor-memoless-test?key=YOUR_KEY
//       -> shows the registration wallet's address and RUNE balance
//
//   /api/thor-memoless-test?key=YOUR_KEY&register=1&dest=0xYourEthAddress
//       -> registers ONE real test reference (a BTC -> ETH swap to `dest`),
//          costing one network fee, and shows what THORChain returns for it
//
// It never moves user funds. Nothing is swapped unless someone later sends
// BTC with the encoded amount.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const ADMIN_KEY = process.env.MEMOLESS_ADMIN_KEY ?? "";

export async function GET(req: Request) {
  const q = new URL(req.url).searchParams;
  // Hidden unless an admin key is configured AND supplied.
  if (!ADMIN_KEY || q.get("key") !== ADMIN_KEY) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }
  if (!memolessConfigured()) {
    return NextResponse.json({ error: "THOR_MEMOLESS_MNEMONIC is not set." }, { status: 500 });
  }

  try {
    const wallet = await walletInfo();
    if (q.get("register") !== "1") {
      return NextResponse.json({
        wallet,
        next: "Add &register=1&dest=<your ETH address> to register one test reference.",
      });
    }

    const dest = q.get("dest") ?? "";
    if (!/^0x[a-fA-F0-9]{40}$/.test(dest)) {
      return NextResponse.json({ error: "dest must be an Ethereum address (0x…)." }, { status: 400 });
    }

    const asset = "BTC.BTC";
    const memo = `=:ETH.ETH:${dest}`;
    const { hash, reference, registered } = await registerReference(asset, memo);

    // Documented Bitcoin example: 0.05 BTC with the reference in the last 5 digits.
    const encoded = encodeReference(5_000_000n, reference).toString();
    const [lookup, check] = await Promise.all([lookupReference(asset, reference), checkAmount(asset, encoded)]);

    return NextResponse.json({
      wallet,
      registration: { hash, memo: `REFERENCE:${asset}:${memo}`, reference, registered },
      encodedAmountSats: encoded,
      lookup,
      check,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? String(e) }, { status: 500 });
  }
}
