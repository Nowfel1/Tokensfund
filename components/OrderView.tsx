"use client";

import { useEffect, useRef, useState } from "react";
import { QRCodeSVG } from "@/lib/vendor/qrcode-react";
import type { EvmContractExecution } from "@/lib/types";

// What /api/order-status sends back. Provider tracking details stay on the server.
interface LiveStatus {
  state?: string;
  detail?: string;
  outboundTxHash?: string;
  needsTx?: boolean;
  hasTx?: boolean;
}

// stage: 0 deposit · 1 confirming · 2 swapping · 3 finished
const STATE_META: Record<string, { label: string; stage: number; tone: string }> = {
  awaiting_deposit: { label: "Awaiting deposit", stage: 0, tone: "wait" },
  pending: { label: "Awaiting deposit", stage: 0, tone: "wait" },
  deposit_detected: { label: "Confirming", stage: 1, tone: "go" },
  processing: { label: "Swapping", stage: 2, tone: "go" },
  success: { label: "Complete", stage: 3, tone: "ok" },
  completed: { label: "Complete", stage: 3, tone: "ok" },
  refunded: { label: "Refunded", stage: 3, tone: "warn" },
  failed: { label: "Not completed", stage: 3, tone: "bad" },
};

const STEPS = ["Deposit", "Confirming", "Swapping", "Sent"];

const COIN_COLOR: Record<string, string> = {
  BTC: "#f7931a", ETH: "#8a9cf0", SOL: "#19fb9b", XRP: "#7cc8f0", DOGE: "#e0c860",
  USDT: "#3fd69b", USDC: "#4f9be8", LTC: "#c4c8d0", TON: "#3ab8f5", XMR: "#ff8c42",
  ZEC: "#f4cd5e", TRX: "#ff6b6b", USDT_TRC20: "#3fd69b", USDT_BSC: "#f8d33a",
  BNB: "#f8d777", USDC_SOL: "#4f9be8", DAI: "#f5ac37",
};

// How long a deposit usually takes to confirm, by network.
const CONFIRM_TIME: Record<string, string> = {
  Bitcoin: "usually 10 to 30 minutes",
  Ethereum: "usually a few minutes",
  Litecoin: "usually 5 to 15 minutes",
  Dogecoin: "usually 5 to 15 minutes",
  Monero: "usually about 20 minutes",
  Zcash: "usually 5 to 15 minutes",
  Solana: "usually under a minute",
  Tron: "usually a minute or two",
  "BNB Smart Chain": "usually under a minute",
  "XRP Ledger": "usually under a minute",
  TON: "usually under a minute",
};

// Where a payout can be looked up, by destination network.
const EXPLORER: Record<string, { url: string; evm?: boolean; hex?: boolean }> = {
  Bitcoin: { url: "https://mempool.space/tx/", hex: true },
  Ethereum: { url: "https://etherscan.io/tx/", evm: true },
  "BNB Smart Chain": { url: "https://bscscan.com/tx/", evm: true },
  Litecoin: { url: "https://litecoinspace.org/tx/", hex: true },
  Dogecoin: { url: "https://blockchair.com/dogecoin/transaction/", hex: true },
  "XRP Ledger": { url: "https://xrpscan.com/tx/", hex: true },
  Tron: { url: "https://tronscan.org/#/transaction/", hex: true },
  Solana: { url: "https://solscan.io/tx/" },
};

function explorerLink(chain: string, hash: string): { href: string; shown: string } | null {
  const e = EXPLORER[chain];
  const raw = hash.trim();
  if (!e || !raw) return null;
  if (e.evm || e.hex) {
    const h = raw.replace(/^0x/i, "");
    if (!/^[0-9a-fA-F]{64}$/.test(h)) return null;
    const id = e.evm ? "0x" + h.toLowerCase() : chain === "XRP Ledger" ? h.toUpperCase() : h.toLowerCase();
    return { href: e.url + id, shown: id };
  }
  if (!/^[1-9A-HJ-NP-Za-km-z]{60,100}$/.test(raw)) return null;
  return { href: e.url + raw, shown: raw };
}

function providerLabel(p: string) {
  if (p === "thorchain") return "THORChain";
  if (p === "chainflip") return "Chainflip";
  if (p === "cce") return "CCE.Cash";
  if (p === "changee") return "Changee";
  if (p === "wagyu") return "Wagyu";
  if (p === "anonchange") return "AnonChange";
  if (p === "near_intents") return "NEAR Intents";
  return p;
}

function short(v: string) {
  return v.length > 14 ? v.slice(0, 6) + "…" + v.slice(-4) : v;
}

// Sensible decimals: 2 for large amounts (e.g. USDT), more for small ones.
function fmtAmount(v: string | number | null | undefined): string | null {
  const n = Number(v);
  if (v == null || v === "" || !Number.isFinite(n) || n <= 0) return null;
  const digits = n >= 100 ? 2 : n >= 1 ? 4 : 8;
  return n.toLocaleString("en-US", { maximumFractionDigits: digits });
}

function fmtLeft(secs: number) {
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  if (h > 0) return `${h}h ${String(m).padStart(2, "0")}m`;
  return `${m}:${String(s).padStart(2, "0")}`;
}

// A memoless amount carries the swap's reference in its last five digits
// (counted at 8 decimals, or the coin's own decimals when it has fewer).
// Returns the amount written out in full, split so those digits can be marked.
function splitReference(amount: string, decimals: number): [string, string] | null {
  if (!/^\d+(\.\d+)?$/.test(amount)) return null;
  const places = Math.min(8, decimals);
  const [whole, frac = ""] = amount.split(".");
  if (frac.length > places) return null;
  const full = whole + "." + frac.padEnd(places, "0");
  const digits = full.replace(".", "");
  if (digits.length < 6) return null;
  // walk back over five digits, skipping the decimal point
  let i = full.length;
  let seen = 0;
  while (i > 0 && seen < 5) {
    i--;
    if (full[i] !== ".") seen++;
  }
  return [full.slice(0, i), full.slice(i)];
}

// Wallets read the amount as well as the address from these links, which
// matters when the amount has to be exact. Other coins get the plain address.
const URI_SCHEME: Record<string, string> = { BTC: "bitcoin", LTC: "litecoin", DOGE: "dogecoin" };

function CopyBtn({ text, label = "Copy" }: { text: string; label?: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      className="op-gb"
      onClick={() => {
        navigator.clipboard?.writeText(text);
        setDone(true);
        setTimeout(() => setDone(false), 1500);
      }}
    >
      {done ? "Copied" : label}
    </button>
  );
}

function Address({ value }: { value: string }) {
  // First and last four characters stand out — those are what people check.
  if (value.length <= 12) return <b>{value}</b>;
  const middle = value.slice(4, -4).match(/.{1,4}/g) ?? [];
  return (
    <>
      <b className="g">{value.slice(0, 4)}</b>
      {middle.map((g, i) => (
        <span key={i} className="g">{g}</span>
      ))}
      <b className="g">{value.slice(-4)}</b>
    </>
  );
}

interface Props {
  code: string;
  provider: string;
  canTrack: boolean;
  amount: string;
  expectedOut?: string | null;
  fromId: string;
  toId: string;
  fromSymbol: string;
  toSymbol: string;
  fromChain: string;
  toChain: string;
  fromNetwork?: string;
  toNetwork?: string;
  fromDecimals: number;
  destination: string;
  deposit: string;
  created: string;
  createdAt: number;
  /** Created in the last few minutes (decided on the server). */
  fresh: boolean;
  detailsSaved: boolean;
  memoless: boolean;
  memo?: string | null;
  expiresAt?: number | null;
  execution?: EvmContractExecution | null;
  notes?: string | null;
}

export default function OrderView(p: Props) {
  const [status, setStatus] = useState<LiveStatus | null>(null);
  const [now, setNow] = useState<number | null>(null);
  const [origin, setOrigin] = useState("https://tokensfund.xyz");
  const [tx, setTx] = useState("");
  const [txBusy, setTxBusy] = useState(false);
  const [txMsg, setTxMsg] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastStage = useRef(0);
  const [tick, setTick] = useState(0); // bump to re-check status straight away

  // Live status, checked through our server by order code every 30s, so the
  // provider's tracking details never reach the browser. Stops once finished.
  useEffect(() => {
    if (!p.canTrack) return;
    let stop = false;
    async function check() {
      try {
        const res = await fetch("/api/order-status?code=" + encodeURIComponent(p.code), { cache: "no-store" });
        const text = await res.text();
        const data = text ? JSON.parse(text) : null;
        if (stop || !data || data.error) return;
        setStatus(data);
        if ((STATE_META[data.state]?.stage ?? 0) >= 3 && timer.current) clearInterval(timer.current);
      } catch {
        // keep showing the last known state
      }
    }
    check();
    timer.current = setInterval(check, 30000);
    return () => {
      stop = true;
      if (timer.current) clearInterval(timer.current);
    };
  }, [p.code, p.canTrack, tick]);

  // Clock for the deadline countdown, and the address this page was opened on
  // (so "Copy link" gives the .onion link to someone using the Tor mirror).
  // Both are set in the browser only, so server and browser render the same.
  useEffect(() => {
    setOrigin(window.location.origin);
    setNow(Math.floor(Date.now() / 1000));
    const t = setInterval(() => setNow(Math.floor(Date.now() / 1000)), 1000);
    return () => clearInterval(t);
  }, []);

  const known = status?.state ? STATE_META[status.state] : undefined;
  if (known) lastStage.current = known.stage;
  // An unreadable status keeps the last stage we knew rather than jumping back.
  const stage = known ? known.stage : lastStage.current;
  const tone = known ? known.tone : "wait";
  const state = known ? (status!.state as string) : "awaiting_deposit";
  const finished = stage >= 3;
  const ok = state === "success" || state === "completed";

  // Don't flash payment instructions on an old order while its status loads.
  // A fresh order shows them at once — and in the page's HTML, so they are
  // readable with JavaScript switched off (common in Tor Browser).
  const loading = p.canTrack && !status && !p.fresh;

  const secsLeft = p.expiresAt && now != null ? p.expiresAt - now : null;
  const expired = stage === 0 && secsLeft != null && secsLeft <= 0;
  const window_ = p.expiresAt ? Math.max(1, p.expiresAt - p.createdAt) : 1;
  const leftPct = secsLeft != null ? Math.max(0, Math.min(100, (secsLeft / window_) * 100)) : 100;

  const out = fmtAmount(p.expectedOut);
  const rate =
    Number(p.expectedOut) > 0 && Number(p.amount) > 0 ? fmtAmount(Number(p.expectedOut) / Number(p.amount)) : null;
  const route = providerLabel(p.provider);
  const fromNet = p.fromNetwork ? ` on ${p.fromNetwork}` : "";
  const split = p.memoless ? splitReference(p.amount, p.fromDecimals) : null;
  const copyAmount = split ? split[0] + split[1] : p.amount;
  const needsMemo = Boolean(p.memo) && !p.execution;
  const showQr = Boolean(p.deposit) && p.detailsSaved && !p.execution && !needsMemo;
  const scheme = p.memoless ? URI_SCHEME[p.fromId] : undefined;
  const qrValue = scheme ? `${scheme}:${p.deposit}?amount=${copyAmount}` : p.deposit;
  const oldThor = !p.detailsSaved && p.provider === "thorchain";
  const payout = status?.outboundTxHash ? explorerLink(p.toChain, status.outboundTxHash) : null;
  const canAddTx = p.provider === "thorchain" && !finished && !status?.hasTx;

  const chip = loading
    ? "Checking status"
    : expired
    ? "Expired"
    : known
    ? known.label
    : status
    ? "Checking status"
    : "Awaiting deposit";

  let headline: string;
  let sub: string;
  if (loading) {
    headline = "Checking your order";
    sub = "One moment — fetching the latest status.";
  } else if (expired) {
    headline = "This order has expired";
    sub = `Please don't send to it now. If you've already sent your ${p.fromSymbol}, keep this page — it will update when the deposit is seen. Otherwise start a new swap for a fresh rate.`;
  } else if (stage === 0) {
    headline = `Send your ${p.fromSymbol} to start the swap`;
    sub = "Everything is set up and waiting for your deposit. This page updates by itself once it arrives — save the link and come back any time.";
  } else if (stage === 1) {
    headline = "We've seen your deposit";
    sub = `Your ${p.fromSymbol} has arrived. Nothing more to do — you can close this page and come back any time.`;
  } else if (stage === 2) {
    headline = `Swapping ${p.fromSymbol} for ${p.toSymbol}`;
    sub = "Your deposit is confirmed and the swap is underway.";
  } else if (ok) {
    headline = `Done — your ${p.toSymbol} is on its way`;
    sub = "The swap is complete. Check your destination wallet.";
  } else if (state === "refunded") {
    headline = "This swap was refunded";
    sub = `${route} couldn't complete the swap and sent your ${p.fromSymbol} back.`;
  } else {
    headline = "This swap didn't complete";
    sub = `${route} reports that this order did not go through — most often because no deposit arrived in time.`;
  }

  async function submitTx() {
    setTxBusy(true);
    setTxMsg(null);
    try {
      const res = await fetch("/api/order-tx", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: p.code, tx }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error || "Couldn't save that. Please try again.");
      setTxMsg("Saved — checking now.");
      setTx("");
      setTick((n) => n + 1);
    } catch (e: any) {
      setTxMsg(e?.message ?? "Couldn't save that. Please try again.");
    } finally {
      setTxBusy(false);
    }
  }

  const txBox = canAddTx && (
    <details className="op-tx">
      <summary>
        Already sent it? <u>Add your transaction ID</u> to track this swap
      </summary>
      <div className="op-txrow">
        <input
          className="op-input"
          value={tx}
          onChange={(e) => setTx(e.target.value.trim())}
          placeholder={`Your ${p.fromSymbol} transaction ID (hash)`}
          aria-label="Deposit transaction ID"
          spellCheck={false}
          autoComplete="off"
        />
        <button type="button" className="op-btn" disabled={txBusy || tx.length < 60} onClick={submitTx}>
          {txBusy ? "Saving…" : "Track"}
        </button>
      </div>
      <p className="op-note">
        {p.memoless
          ? "We normally spot your deposit by itself. If this page still says awaiting deposit after your payment has confirmed, paste its ID here."
          : `${route} follows a swap by your own payment, so this page needs its ID to show progress. Your wallet shows it after you send.`}
      </p>
      {txMsg && <p className="op-note w">{txMsg}</p>}
    </details>
  );

  return (
    <section className="op">
      <div className="op-hd">
        <div>
          <div className="op-lbl">Order</div>
          <div className="op-code m">
            <span>
              {(p.code.match(/.{1,4}/g) ?? [p.code]).map((g, i) => (
                <span key={i}>
                  {i > 0 && <b>{"·"}</b>}
                  {g}
                </span>
              ))}
            </span>
            <CopyBtn label="Copy link" text={origin + "/order/" + p.code} />
          </div>
        </div>
        <span className={"op-chip t-" + (expired && !loading ? "bad" : tone)}>
          <span className={"op-pd" + (finished || expired ? "" : " live")} />
          {chip}
        </span>
      </div>

      {/* route line */}
      <div className="op-rt">
        <div className="op-side">
          <div className="op-cn" style={{ background: COIN_COLOR[p.fromId] ?? "#9aa5c2" }}>{p.fromSymbol}</div>
          <div className="a m">{p.amount}</div>
          <div className="s">you send{fromNet}</div>
        </div>
        <div className="op-trk" role="img" aria-label={`Progress: ${chip}`}>
          <div className="op-bar" />
          <div className={"op-fill t-" + tone} style={{ width: (stage * 100) / 3 + "%" }} />
          {STEPS.map((s, i) => {
            const k = finished ? (ok || i < 3 ? "d" : state === "refunded" ? "r" : "x") : i < stage ? "d" : i === stage && !loading && !expired ? "n" : "";
            const x = (i * 100) / 3;
            const label = i === 3 && finished && !ok ? (state === "refunded" ? "Refunded" : "Stopped") : s;
            return (
              <span key={s}>
                <span className={"op-nd " + k} style={{ left: x + "%" }} />
                <span className={"op-nl " + k} style={{ left: (i === 0 ? 4 : i === 3 ? 96 : x) + "%" }}>{label}</span>
              </span>
            );
          })}
        </div>
        <div className="op-side">
          <div className="op-cn" style={{ background: COIN_COLOR[p.toId] ?? "#9aa5c2" }}>{p.toSymbol}</div>
          <div className="a m">{out ? "≈ " + out : p.toSymbol}</div>
          <div className="s">{out ? "estimate" : "you receive"}{p.toNetwork ? ` · on ${p.toNetwork}` : ""}</div>
        </div>
      </div>

      <h1 className="op-hl">{headline}</h1>
      <p className="op-sb">{sub}</p>

      {/* ---- awaiting deposit: how to pay ---- */}
      {!loading && stage === 0 && oldThor && (
        <div className="op-pn warn">
          <p className="op-note" style={{ marginTop: 0 }}>
            <strong>Not paid yet? Please start a new swap.</strong> This order was created before payment
            details were kept on this page, and a THORChain deposit needs details that aren&apos;t shown here.
          </p>
          <p className="op-note"><a className="op-btn ghost" href="/">Start a new swap</a></p>
          {txBox}
        </div>
      )}

      {!loading && stage === 0 && !oldThor && p.execution && (
        <div className={"op-pn warn" + (expired ? " dim" : "")}>
          <div className="op-pay" style={{ display: "block" }}>
            <p className="op-note w" style={{ marginTop: 0 }}>
              <strong>Do not send a normal transfer.</strong> This {p.execution.chain} route completes by calling a
              contract — a plain wallet send can&apos;t carry the routing details, and funds sent that way would be stranded.
            </p>
            <p className="op-note">
              Easiest path: run this swap in an interface that builds the call for you, such as{" "}
              <a className="x" href={p.execution.helperUrl ?? "https://app.thorswap.finance/"} target="_blank" rel="noopener noreferrer">THORSwap</a>{" "}
              — or <a className="x" href="/">start again</a> and pick another route, which uses a plain deposit address.
            </p>
            <p className="op-lbl" style={{ marginTop: 14 }}>Advanced — call the router with these exact values</p>
            <div className="op-kv">
              {(
                [
                  ["Contract (router)", p.execution.router],
                  ["Function", p.execution.functionName],
                  ["vault", p.execution.vault],
                  ["asset", p.execution.tokenAddress],
                  ["amount", p.execution.amountBaseUnits],
                  ["memo", p.execution.memo],
                  ["expiry", String(p.execution.expiry)],
                  ["payable value", p.execution.nativeValue ?? "0"],
                ] as [string, string][]
              ).map(([k, v]) => (
                <div key={k}>
                  <span className="k">{k}</span>
                  <code>{v}</code>
                  <CopyBtn text={v} />
                </div>
              ))}
            </div>
            <p className="op-note">
              {p.execution.nativeValue && p.execution.nativeValue !== "0"
                ? "Native coin: send the amount as the transaction's value."
                : "Token: approve the router for this amount first, then call the function with value 0."}{" "}
              Amounts are in base units. Check every field before signing.
            </p>
          </div>
          {secsLeft != null && secsLeft > 0 && (
            <p className="op-note">Valid for <strong className="m">{fmtLeft(secsLeft)}</strong></p>
          )}
          {expired && (
            <p className="op-note"><a className="op-btn ghost" href="/">Start a new swap</a></p>
          )}
          {txBox}
        </div>
      )}

      {!loading && stage === 0 && !oldThor && !p.execution && p.deposit && (
        <div className={"op-pn" + (expired ? " dim bad" : "")}>
          <div className="op-pay" style={showQr ? undefined : { gridTemplateColumns: "1fr" }}>
            <div>
              <div className="op-lbl">{p.memoless ? "Send exactly" : "Send"}</div>
              <div className="op-amt m">
                {split ? (
                  <>
                    {split[0]}
                    <b>{split[1]}</b>
                  </>
                ) : (
                  p.amount
                )}
                <span className="u">{p.fromSymbol}</span>
                <CopyBtn text={copyAmount} />
              </div>
              {split && <div className="op-hint">{"↑"} these digits identify your swap — don&apos;t round them</div>}

              <div className="op-lbl" style={{ marginTop: 14 }}>
                To this {p.fromChain || p.fromSymbol} address
              </div>
              <div className="op-adr m">
                <Address value={p.deposit} /> <CopyBtn text={p.deposit} />
              </div>

              {needsMemo && (
                <>
                  <div className="op-lbl" style={{ marginTop: 14, color: "var(--gd)" }}>With this memo / tag — required</div>
                  <div className="op-memo m">
                    {p.memo} <CopyBtn text={p.memo as string} />
                  </div>
                </>
              )}

              <div className="op-tags">
                {p.memoless ? (
                  <>
                    <span className="op-tg">No memo needed</span>
                    <span className="op-tg">Any wallet</span>
                    <span className="op-tg">One payment</span>
                  </>
                ) : needsMemo ? (
                  <span className="op-tg w">Memo required — without it the swap can&apos;t be matched</span>
                ) : p.detailsSaved ? (
                  <>
                    <span className="op-tg">One-time address</span>
                    <span className="op-tg">Any wallet</span>
                  </>
                ) : null}
                {p.fromNetwork && <span className="op-tg w">{p.fromNetwork} network only</span>}
              </div>
            </div>

            {showQr && (
              <div>
                <div className="op-qr">
                  <QRCodeSVG value={qrValue} size={130} level="M" bgColor="#ffffff" fgColor="#0b1020" />
                </div>
                <div className="op-qrcap">{scheme ? "Address + amount" : "Address only"}</div>
                {secsLeft != null && (
                  <div className="op-exp">
                    {secsLeft > 0 ? (
                      <>Send within <b className="m">{fmtLeft(secsLeft)}</b></>
                    ) : (
                      <b>Expired</b>
                    )}
                    <div className="op-eb"><i style={{ width: leftPct + "%" }} /></div>
                  </div>
                )}
              </div>
            )}
          </div>

          {!showQr && secsLeft != null && secsLeft > 0 && (
            <p className="op-note">Send within <strong className="m">{fmtLeft(secsLeft)}</strong></p>
          )}
          {needsMemo && p.provider === "thorchain" && (
            <p className="op-note w">
              THORChain refunds deposits sent without the exact memo.
              {p.fromId === "XRP"
                ? " On the XRP Ledger it goes in the payment's Memo field — a destination tag is not the same thing."
                : ["BTC", "LTC", "DOGE"].includes(p.fromId)
                ? " It goes in an OP_RETURN output, which your wallet may call a memo or message field."
                : " Use your wallet's memo field."}
            </p>
          )}
          {!p.detailsSaved && (
            <p className="op-note w">
              This is an older order. If you were shown a memo or tag when you created it and no longer have it,
              start a new swap instead of paying this one.
            </p>
          )}
          {p.notes && <p className="op-note">{p.notes}</p>}
          {expired && (
            <p className="op-note"><a className="op-btn ghost" href="/">Start a new swap</a></p>
          )}
          {txBox}
        </div>
      )}

      {/* ---- confirming / swapping ---- */}
      {!loading && (stage === 1 || stage === 2) && (
        <div className="op-pn">
          <div className="op-wait">
            <span className="op-sp" />
            <span>
              {stage === 1
                ? `Waiting for ${p.fromChain || p.fromSymbol} network confirmations — ${CONFIRM_TIME[p.fromChain] ?? "this depends on the network"}.`
                : `${route} is executing the swap and sending your ${p.toSymbol} — usually a few minutes.`}
            </span>
          </div>
          {txBox}
        </div>
      )}

      {loading && (
        <div className="op-pn">
          <div className="op-wait"><span className="op-sp" /><span>Fetching the latest status from {route}…</span></div>
        </div>
      )}

      {/* ---- finished ---- */}
      {finished && (
        <div className={"op-pn " + (ok ? "ok" : state === "refunded" ? "warn" : "bad")}>
          <div className="op-ok">
            <div className={"op-tick" + (ok ? "" : state === "refunded" ? " warn" : " bad")}>
              {ok ? "✓" : state === "refunded" ? "↩" : "!"}
            </div>
            <div>
              <div className="t">
                {ok ? (
                  <>
                    <span className="m">{out ? "≈ " + out + " " : ""}{p.toSymbol}</span> sent to your wallet
                  </>
                ) : state === "refunded" ? (
                  <>Your {p.fromSymbol} was sent back</>
                ) : (
                  <>No swap took place</>
                )}
              </div>
              <div className="d">
                {status?.outboundTxHash ? (
                  <>
                    {ok ? "Payout" : "Refund"} transaction{" "}
                    {payout ? (
                      <a className="x m" href={payout.href} target="_blank" rel="noopener noreferrer">
                        {short(payout.shown)} {"↗"}
                      </a>
                    ) : (
                      <>
                        <span className="m">{short(status.outboundTxHash)}</span>{" "}
                        <CopyBtn text={status.outboundTxHash} />
                      </>
                    )}
                  </>
                ) : ok ? (
                  "The amount is the estimate from when you created the order — your wallet shows the exact figure."
                ) : state === "refunded" ? (
                  "Check the wallet you paid from, or your refund address."
                ) : (
                  "If you did send funds to this order, contact us with the order code above."
                )}
              </div>
            </div>
          </div>
          {!ok && <p className="op-note"><a className="op-btn ghost" href="/">Start a new swap</a></p>}
        </div>
      )}

      {!p.canTrack && (
        <p className="op-note" style={{ margin: "0 2px 12px" }}>
          Live status isn&apos;t available for this order. Check your destination wallet.
        </p>
      )}

      {/* ---- details ---- */}
      <div className="op-gd4">
        <div>
          <div className="op-lbl">Route</div>
          <div className="v">{route}</div>
        </div>
        <div>
          <div className="op-lbl">Rate</div>
          <div className="v m nb">{rate ? `1 ${p.fromSymbol} ≈ ${rate} ${p.toSymbol}` : "—"}</div>
        </div>
        <div>
          <div className="op-lbl">Destination</div>
          <div className="v m">
            {short(p.destination)}
            <CopyBtn text={p.destination} />
          </div>
        </div>
        <div>
          <div className="op-lbl">Created</div>
          <div className="v">{p.created}</div>
        </div>
      </div>

      <p className="op-ft">
        {"\u{1F512}"} Private link — save it to pay or check back later. It isn&apos;t listed anywhere; only people you
        share it with can open it. Nobody from TokensFund will ever contact you about this swap or ask for your seed
        phrase. Need help? Quote the order code.
      </p>
    </section>
  );
}
