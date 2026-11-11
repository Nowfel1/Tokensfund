import { Client, AssetRuneNative } from "@xchainjs/xchain-thorchain";
import { Network } from "@xchainjs/xchain-client";
import { baseAmount } from "@xchainjs/xchain-util";

// THORChain "memoless" swaps (https://dev.thorchain.org/swap-guide/memoless-swaps.html)
//
// Instead of the user attaching a memo, we register the swap memo on THORChain
// first and receive a 5-digit reference. The user then sends an exact amount
// whose last digits encode that reference — a plain send from any wallet.
//
// Registration is a THORChain transaction, so it must be signed by a wallet we
// control. Its recovery phrase lives ONLY in the THOR_MEMOLESS_MNEMONIC
// environment variable. Keep just a few RUNE in it: it only pays network fees.
//
// SERVER-ONLY: never import this file from a client component.

const THORNODE = process.env.THORNODE_URL || "https://gateway.liquify.com/chain/thorchain_api";
const PHRASE = process.env.THOR_MEMOLESS_MNEMONIC ?? "";

// RUNE attached to the registration itself, in 1e8 units. The protocol's
// registration cost is currently 0, so only the normal network fee is paid.
const REGISTRATION_RUNE = process.env.THOR_MEMOLESS_RUNE_AMOUNT ?? "0";

export const REFERENCE_DIGITS = 5;
const REFERENCE_MOD = 100_000n;

export function memolessConfigured(): boolean {
  return PHRASE.trim().split(/\s+/).length >= 12;
}

let cached: Client | null = null;
function client(): Client {
  if (!memolessConfigured()) throw new Error("THOR_MEMOLESS_MNEMONIC is not set");
  if (!cached) cached = new Client({ network: Network.Mainnet, phrase: PHRASE.trim() });
  return cached;
}

async function thornode(path: string): Promise<{ ok: boolean; status: number; data: any }> {
  const res = await fetch(`${THORNODE}${path}`, { cache: "no-store", headers: { accept: "application/json" } });
  const text = await res.text();
  let data: any = null;
  try {
    data = JSON.parse(text);
  } catch {
    data = { raw: text.slice(0, 200) };
  }
  return { ok: res.ok, status: res.status, data };
}

/** The registration wallet's address and RUNE balance (for checking it is funded). */
export async function walletInfo(): Promise<{ address: string; rune: string }> {
  const c = client();
  const address = await c.getAddressAsync(0);
  const balances = await c.getBalance(address);
  const rune = balances.find((b) => b.asset.symbol === "RUNE");
  const amount = rune ? rune.amount.amount().toString() : "0";
  // 1e8 units -> human string
  const padded = amount.padStart(9, "0");
  return { address, rune: `${padded.slice(0, -8)}.${padded.slice(-8)}`.replace(/\.?0+$/, "") || "0" };
}

/**
 * Register `memo` for deposits of `asset` (THORChain notation, e.g. "BTC.BTC").
 * Returns the registration tx hash and the assigned reference number.
 */
export async function registerReference(
  asset: string,
  memo: string
): Promise<{ hash: string; reference: string; registered: any }> {
  const fullMemo = `REFERENCE:${asset}:${memo}`;
  if (new TextEncoder().encode(fullMemo).length > 250) {
    throw new Error("Swap memo is too long to register for a memoless deposit.");
  }

  const hash = await client().deposit({
    asset: AssetRuneNative,
    amount: baseAmount(REGISTRATION_RUNE, 8),
    memo: fullMemo,
  });

  // The reference is available once the registration block is final.
  const deadline = Date.now() + 25_000;
  let last: any = null;
  while (Date.now() < deadline) {
    await new Promise((r) => setTimeout(r, 2500));
    const res = await thornode(`/thorchain/memo/${hash}`);
    last = res.data;
    const ref = res.ok ? String(res.data?.reference ?? "") : "";
    if (/^\d{1,5}$/.test(ref) && Number(ref) > 0) {
      return { hash, reference: ref.padStart(REFERENCE_DIGITS, "0"), registered: res.data };
    }
  }
  throw new Error(
    `Registration ${hash} did not return a reference in time: ${JSON.stringify(last).slice(0, 200)}`
  );
}

/** What THORChain has stored for this asset + reference. */
export function lookupReference(asset: string, reference: string) {
  return thornode(`/thorchain/memo/${asset}/${reference}`);
}

/** THORChain's own pre-flight answer: which reference would it read from this amount? */
export function checkAmount(asset: string, amount: string) {
  return thornode(`/thorchain/memo/check/${asset}/${amount}`);
}

/**
 * Put `reference` into the last five digits of an integer amount.
 * e.g. 5000000 with reference 20002 -> 5020002 (the documented Bitcoin example).
 */
export function encodeReference(amountUnits: bigint, reference: string): bigint {
  const ref = BigInt(reference);
  if (ref <= 0n || ref >= REFERENCE_MOD) throw new Error("Invalid reference number");
  return (amountUnits / REFERENCE_MOD) * REFERENCE_MOD + ref;
}
