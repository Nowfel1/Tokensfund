import {
  Client,
  AssetRuneNative,
  MSG_DEPOSIT_TYPE_URL,
  DEPOSIT_GAS_LIMIT_VALUE,
  parseAssetToTHORNodeAsset,
} from "@xchainjs/xchain-thorchain";
import { bech32ToBase64, makeClientPath } from "@xchainjs/xchain-cosmos-sdk";
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { SigningStargateClient } from "@cosmjs/stargate";
import { TxRaw } from "cosmjs-types/cosmos/tx/v1beta1/tx";

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
// Everything here talks to THORChain over the REST API (the same one our quotes
// use). Transactions are signed offline, so no RPC connection is needed — the
// public RPC gateway refuses requests from our server.
//
// SERVER-ONLY: never import this file from a client component.

const THORNODE = process.env.THORNODE_URL || "https://gateway.liquify.com/chain/thorchain_api";

// Clean up the usual copy-paste problems: quotes around the phrase, commas,
// list numbers ("1. word"), capitals, line breaks and repeated spaces.
const PHRASE = (process.env.THOR_MEMOLESS_MNEMONIC ?? "")
  .toLowerCase()
  .replace(/["'`,;]/g, " ")
  .replace(/\b\d+[.)]?/g, " ")
  .trim()
  .split(/\s+/)
  .filter(Boolean)
  .join(" ");
const PHRASE_WORDS = PHRASE ? PHRASE.split(" ").length : 0;

// RUNE attached to the registration itself, in 1e8 units. The protocol's
// registration cost is currently 0, so only the normal network fee is paid.
const REGISTRATION_RUNE = process.env.THOR_MEMOLESS_RUNE_AMOUNT ?? "0";

export const REFERENCE_DIGITS = 5;
const REFERENCE_MOD = 100_000n;

export function memolessConfigured(): boolean {
  return PHRASE_WORDS > 0;
}

// ---------------------------------------------------------------- wallet ---

type Wallet = { address: string; signer: DirectSecp256k1HdWallet; registry: any };
let cachedWallet: Promise<Wallet> | null = null;

function wallet(): Promise<Wallet> {
  if (!memolessConfigured()) throw new Error("THOR_MEMOLESS_MNEMONIC is not set");
  if (![12, 15, 18, 21, 24].includes(PHRASE_WORDS)) {
    throw new Error(
      `Recovery phrase has ${PHRASE_WORDS} words; it must have 12 or 24. Check THOR_MEMOLESS_MNEMONIC for a missing or extra word.`
    );
  }
  if (!cachedWallet) {
    cachedWallet = (async () => {
      let client: Client;
      try {
        // Constructing the client is offline; we only use it for the address
        // derivation path and its THORChain message registry.
        client = new Client({ network: "mainnet" as any, phrase: PHRASE });
      } catch {
        throw new Error(
          `Recovery phrase has ${PHRASE_WORDS} words but is not valid: one word is misspelled, or the words are in the wrong order.`
        );
      }
      const address = await client.getAddressAsync(0);
      const signer = await DirectSecp256k1HdWallet.fromMnemonic(PHRASE, {
        prefix: "thor",
        // getFullDerivationPath is internal to the library, hence the cast.
        hdPaths: [makeClientPath((client as any).getFullDerivationPath(0))],
      });
      const [account] = await signer.getAccounts();
      if (account.address !== address) throw new Error("Wallet address derivation mismatch.");
      return { address, signer, registry: (client as any).registry };
    })();
    cachedWallet.catch(() => (cachedWallet = null));
  }
  return cachedWallet;
}

// ------------------------------------------------------------------ REST ---

async function rest(
  path: string,
  init?: { method?: string; body?: unknown }
): Promise<{ ok: boolean; status: number; data: any }> {
  const res = await fetch(`${THORNODE}${path}`, {
    method: init?.method ?? "GET",
    cache: "no-store",
    headers: {
      accept: "application/json",
      "user-agent": "TokensFund/1.0 (+https://tokensfund.xyz)",
      ...(init?.body ? { "content-type": "application/json" } : {}),
    },
    ...(init?.body ? { body: JSON.stringify(init.body) } : {}),
  });
  const text = await res.text();
  let data: any;
  try {
    data = JSON.parse(text);
  } catch {
    data = { raw: text.slice(0, 200).replace(/\s+/g, " ") };
  }
  return { ok: res.ok, status: res.status, data };
}

function fail(step: string, r: { status: number; data: any }): never {
  const detail = r.data?.message ?? r.data?.error ?? r.data?.raw ?? JSON.stringify(r.data).slice(0, 200);
  throw new Error(`THORChain ${step} failed (HTTP ${r.status}): ${detail}`);
}

/** RUNE balance in 1e8 units, as a string. */
async function runeBalance(address: string): Promise<string> {
  let r = await rest(`/cosmos/bank/v1beta1/balances/${address}`);
  if (!r.ok) r = await rest(`/bank/balances/${address}`); // older REST path
  if (!r.ok) fail("balance lookup", r);
  const list: any[] = r.data?.balances ?? r.data?.result ?? [];
  return String(list.find((b) => b?.denom === "rune")?.amount ?? "0");
}

/** Account number and sequence, needed to sign. Throws if the wallet was never funded. */
async function accountInfo(address: string): Promise<{ accountNumber: number; sequence: number }> {
  let r = await rest(`/cosmos/auth/v1beta1/accounts/${address}`);
  if (!r.ok) r = await rest(`/auth/accounts/${address}`); // older REST path
  if (!r.ok) {
    if (r.status === 404) {
      throw new Error("The registration wallet has no RUNE yet. Send a few RUNE to its address first.");
    }
    fail("account lookup", r);
  }
  const acc = r.data?.account ?? r.data?.result?.value ?? r.data?.result ?? {};
  const accountNumber = Number(acc.account_number ?? acc.accountNumber);
  const sequence = Number(acc.sequence ?? 0);
  if (!Number.isFinite(accountNumber)) {
    throw new Error("The registration wallet has no RUNE yet. Send a few RUNE to its address first.");
  }
  return { accountNumber, sequence };
}

let cachedChainId: string | null = null;
async function chainId(): Promise<string> {
  if (cachedChainId) return cachedChainId;
  const r = await rest(`/cosmos/base/tendermint/v1beta1/node_info`);
  const id = r.ok ? r.data?.default_node_info?.network ?? r.data?.node_info?.network : null;
  cachedChainId = typeof id === "string" && id ? id : process.env.THORCHAIN_CHAIN_ID || "thorchain-1";
  return cachedChainId;
}

function format1e8(units: string): string {
  const padded = units.padStart(9, "0");
  const whole = padded.slice(0, -8);
  const frac = padded.slice(-8).replace(/0+$/, "");
  return frac ? `${whole}.${frac}` : whole;
}

/** The registration wallet's address and RUNE balance (for checking it is funded). */
export async function walletInfo(): Promise<{ address: string; rune: string }> {
  const w = await wallet();
  return { address: w.address, rune: format1e8(await runeBalance(w.address)) };
}

// ----------------------------------------------------------- registration ---

// One registration at a time, so two swaps never reuse the same sequence number.
let queue: Promise<unknown> = Promise.resolve();
function serial<T>(fn: () => Promise<T>): Promise<T> {
  const run = queue.then(fn, fn);
  queue = run.catch(() => undefined);
  return run;
}

async function signAndBroadcast(fullMemo: string): Promise<string> {
  const w = await wallet();
  const [{ accountNumber, sequence }, chain] = await Promise.all([accountInfo(w.address), chainId()]);

  const signingClient = await SigningStargateClient.offline(w.signer, { registry: w.registry });
  const raw = await signingClient.sign(
    w.address,
    [
      {
        typeUrl: MSG_DEPOSIT_TYPE_URL,
        value: {
          signer: bech32ToBase64(w.address),
          memo: fullMemo,
          coins: [{ amount: REGISTRATION_RUNE, asset: parseAssetToTHORNodeAsset(AssetRuneNative) }],
        },
      },
    ],
    { amount: [], gas: DEPOSIT_GAS_LIMIT_VALUE },
    fullMemo,
    { accountNumber, sequence, chainId: chain }
  );
  const txBytes = Buffer.from(TxRaw.encode(raw).finish()).toString("base64");

  const r = await rest(`/cosmos/tx/v1beta1/txs`, {
    method: "POST",
    body: { tx_bytes: txBytes, mode: "BROADCAST_MODE_SYNC" },
  });
  if (!r.ok) fail("broadcast", r);
  const tx = r.data?.tx_response ?? {};
  if (tx.code && Number(tx.code) !== 0) {
    throw new Error(`THORChain rejected the registration (code ${tx.code}): ${String(tx.raw_log ?? "").slice(0, 200)}`);
  }
  if (!tx.txhash) throw new Error("THORChain accepted the broadcast but returned no transaction hash.");
  return String(tx.txhash);
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

  const hash = await serial(async () => {
    try {
      return await signAndBroadcast(fullMemo);
    } catch (e: any) {
      // A stale sequence number (two registrations close together) is safe to retry once.
      if (/sequence/i.test(String(e?.message))) {
        await new Promise((r) => setTimeout(r, 1500));
        return signAndBroadcast(fullMemo);
      }
      throw e;
    }
  });

  // The reference is available once the registration block is final.
  const deadline = Date.now() + 25_000;
  let last: any = null;
  while (Date.now() < deadline) {
    await new Promise((r) => setTimeout(r, 2500));
    const res = await rest(`/thorchain/memo/${hash}`);
    last = res.data;
    const ref = res.ok ? String(res.data?.reference ?? "") : "";
    if (/^\d{1,5}$/.test(ref) && Number(ref) > 0) {
      return { hash, reference: ref.padStart(REFERENCE_DIGITS, "0"), registered: res.data };
    }
  }
  throw new Error(`Registration ${hash} did not return a reference in time: ${JSON.stringify(last).slice(0, 200)}`);
}

/** What THORChain has stored for this asset + reference. */
export function lookupReference(asset: string, reference: string) {
  return rest(`/thorchain/memo/${asset}/${reference}`);
}

/** THORChain's own pre-flight answer: which reference would it read from this amount? */
export function checkAmount(asset: string, amount: string) {
  return rest(`/thorchain/memo/check/${asset}/${amount}`);
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

// ------------------------------------------------------- swap integration ---

// Coins THORChain accepts as a plain send (its "walletless" list), that we
// route through THORChain. ERC-20 tokens (USDT, USDC, DAI) have no direct-send
// path, and Zcash isn't on the list, so those keep the normal memo/contract flow.
export const MEMOLESS_ASSETS = new Set(["BTC.BTC", "LTC.LTC", "DOGE.DOGE", "ETH.ETH", "XRP.XRP"]);

// Emergency switch: set THOR_MEMOLESS_DISABLED=1 in Vercel to go back to memo deposits.
const DISABLED = process.env.THOR_MEMOLESS_DISABLED === "1";

export function memolessEnabledFor(asset: string): boolean {
  return !DISABLED && memolessConfigured() && MEMOLESS_ASSETS.has(asset.toUpperCase());
}

const pow10 = (n: number) => 10n ** BigInt(n);

function toUnits(human: string, decimals: number): bigint {
  const [whole, frac = ""] = String(human).trim().split(".");
  const f = (frac + "0".repeat(decimals)).slice(0, decimals);
  return BigInt(whole || "0") * pow10(decimals) + BigInt(f || "0");
}

function fromUnits(units: bigint, decimals: number): string {
  const s = units.toString().padStart(decimals + 1, "0");
  const whole = s.slice(0, s.length - decimals);
  const frac = s.slice(s.length - decimals).replace(/0+$/, "");
  return frac ? `${whole}.${frac}` : whole;
}

/** Encode the reference so the result is never less than what the user asked to send. */
function encodeAtLeast(base: bigint, reference: bigint): bigint {
  let v = (base / REFERENCE_MOD) * REFERENCE_MOD + reference;
  if (v < base) v += REFERENCE_MOD;
  return v;
}

/**
 * Register the swap and work out the exact amount the user must send.
 *
 * SAFETY RULE: an amount is only returned after THORChain's own pre-flight
 * check confirms that this exact amount resolves to OUR reference and OUR swap
 * memo, unused. If anything fails or doesn't match, this returns null and the
 * caller falls back to normal memo instructions — no guesswork reaches a user.
 *
 * The amount the user sends is never below what they asked for, so the swap's
 * minimum-output limit (computed for their original amount) is always met.
 */
export async function prepareMemolessDeposit(
  asset: string,
  memo: string,
  amountHuman: string,
  decimals: number
): Promise<{ amountHuman: string; reference: string; registrationHash: string } | null> {
  if (!memolessEnabledFor(asset) || !memo) return null;
  try {
    const { hash, reference } = await registerReference(asset, memo);
    const ref = BigInt(reference);
    const native = toUnits(amountHuman, decimals);

    // Where the reference digits sit depends on the coin's decimals:
    //  - 8 or more (BTC, LTC, DOGE, ETH): in THORChain's 8-decimal units.
    //  - fewer than 8 (XRP): in the coin's own smallest unit.
    // Either way, THORChain's check below must confirm it before we use it.
    let nativeAmount: bigint;
    let observed: bigint; // the amount THORChain will see, in its 8-decimal units
    if (decimals >= 8) {
      const scale = pow10(decimals - 8);
      const base8 = (native + scale - 1n) / scale; // round up: never below the request
      const enc8 = encodeAtLeast(base8, ref);
      nativeAmount = enc8 * scale;
      observed = enc8;
    } else {
      nativeAmount = encodeAtLeast(native, ref);
      observed = nativeAmount * pow10(8 - decimals);
    }

    const r = await checkAmount(asset, observed.toString());
    const d = r.data ?? {};
    const confirmed =
      r.ok &&
      String(d.reference ?? "").padStart(REFERENCE_DIGITS, "0") === reference &&
      d.memo === memo &&
      Number(d.usage_count ?? 0) < Number(d.max_use ?? 1);

    if (!confirmed) {
      console.warn(
        `memoless: THORChain check did not confirm reference ${reference} for ${asset} (amount ${observed}); using memo deposit.`,
        JSON.stringify(d).slice(0, 300)
      );
      return null;
    }
    return { amountHuman: fromUnits(nativeAmount, decimals), reference, registrationHash: hash };
  } catch (e: any) {
    console.warn("memoless unavailable, using memo deposit:", e?.message ?? e);
    return null;
  }
}
