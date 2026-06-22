"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import { ASSETS } from "@/lib/assets";
import { AggregatedQuotes, NormalizedQuote, ProviderId, SwapInstruction, SwapStatus } from "@/lib/types";

const PROVIDER_INITIAL: Record<ProviderId, string> = {
  thorchain: "TC",
  chainflip: "CF",
  near_intents: "NI",
  cce: "CC",
  changenow: "CN",
};

const COIN_LETTER: Record<string, string> = {
  BTC: "\u20BF", ETH: "\u039E", SOL: "S", XRP: "X", DOGE: "D", USDT: "T", USDC: "U",
  LTC: "L", TON: "T", XMR: "M", ZEC: "Z", NEAR: "N", TAO: "T", HYPE: "H",
  ZANO: "Z", TRX: "T", USDT_TRC20: "T",
};

// gradient pairs per coin for the icon
const COIN_GRAD: Record<string, [string, string]> = {
  BTC: ["#f7931a", "#ffb347"], ETH: ["#7b7cf0", "#a5a6f8"], SOL: ["#14f1b2", "#19fb9b"],
  XRP: ["#4aa8e0", "#7cc8f0"], DOGE: ["#c2a633", "#e0c860"], USDT: ["#26a17b", "#3fd69b"],
  USDC: ["#2775ca", "#4f9be8"], LTC: ["#9aa0aa", "#c4c8d0"], TON: ["#0098ea", "#3ab8f5"],
  XMR: ["#ff6600", "#ff8c42"], ZEC: ["#f4b728", "#f4cd5e"], NEAR: ["#7b7cf0", "#a5a6f8"],
  TAO: ["#1ec0d6", "#52d8e8"], HYPE: ["#4aa8e0", "#7cc8f0"], ZANO: ["#e06f6f", "#f09595"],
  TRX: ["#e83b3b", "#ff6b6b"], USDT_TRC20: ["#26a17b", "#3fd69b"],
};

function coinGrad(id: string): string {
  const g = COIN_GRAD[id] ?? ["#3a4460", "#565f80"];
  return "linear-gradient(135deg," + g[0] + "," + g[1] + ")";
}

function fmt(n: number) {
  if (!isFinite(n) || n === 0) return "0";
  if (n < 0.0001) return n.toExponential(2);
  return n.toLocaleString(undefined, { maximumFractionDigits: 8 });
}

function fmtUsd(n: number) {
  if (!isFinite(n) || n <= 0) return null;
  return "$" + n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function pairProviders(fromId: string, toId: string): ProviderId[] {
  const from = ASSETS.find((a) => a.id === fromId);
  const to = ASSETS.find((a) => a.id === toId);
  if (!from || !to) return [];
  return (["thorchain", "chainflip", "near_intents", "cce", "changenow"] as ProviderId[]).filter(
    (p) => from.providerIds[p] && to.providerIds[p]
  );
}

function label(p?: ProviderId) {
  if (!p) return "";
  if (p === "thorchain") return "THORChain";
  if (p === "chainflip") return "Chainflip";
  if (p === "cce") return "CCE.Cash";
  if (p === "changenow") return "ChangeNOW";
  return "NEAR Intents";
}

const STATE_META: Record<string, { label: string; step: number; tone: string }> = {
  awaiting_deposit: { label: "Awaiting your deposit", step: 0, tone: "wait" },
  deposit_detected: { label: "Deposit detected", step: 1, tone: "go" },
  processing: { label: "Processing swap", step: 2, tone: "go" },
  success: { label: "Completed", step: 3, tone: "ok" },
  completed: { label: "Completed", step: 3, tone: "ok" },
  refunded: { label: "Refunded", step: 3, tone: "warn" },
  failed: { label: "Failed", step: 3, tone: "bad" },
  pending: { label: "Pending", step: 0, tone: "wait" },
  unknown: { label: "Status unavailable", step: 0, tone: "wait" },
};

export default function SwapTerminal() {
  const [fromId, setFromId] = useState("BTC");
  const [toId, setToId] = useState("ETH");
  const [amount, setAmount] = useState("0.1");
  const [destination, setDestination] = useState("");
  const [refund, setRefund] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AggregatedQuotes | null>(null);
  const [selected, setSelected] = useState<ProviderId | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [opening, setOpening] = useState(false);
  const [deposit, setDeposit] = useState<SwapInstruction | null>(null);
  const [showAllRoutes, setShowAllRoutes] = useState(false);

  const [liveOut, setLiveOut] = useState<number | null>(null);
  const [liveLoading, setLiveLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [prices, setPrices] = useState<Record<string, number>>({});
  const [status, setStatus] = useState<SwapStatus | null>(null);
  const statusTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const eligible = useMemo(() => pairProviders(fromId, toId), [fromId, toId]);
  const toSym = ASSETS.find((a) => a.id === toId)?.symbol ?? toId;
  const fromSym = ASSETS.find((a) => a.id === fromId)?.symbol ?? fromId;
  const fromName = ASSETS.find((a) => a.id === fromId)?.name ?? "";
  const toName = ASSETS.find((a) => a.id === toId)?.name ?? "";

  // load prices once
  useEffect(() => {
    fetch("/api/prices")
      .then((r) => r.text())
      .then((t) => { if (t) setPrices(JSON.parse(t)); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    setLiveOut(null);
    if (!amount || Number(amount) <= 0 || fromId === toId || eligible.length === 0) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setLiveLoading(true);
      try {
        const res = await fetch("/api/quote", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fromAssetId: fromId, toAssetId: toId, amount, slippageBps: 100 }),
        });
        const data = await res.json();
        if (res.ok && data.quotes?.length) {
          const best = data.quotes[data.bestIndex];
          if (best?.expectedOut) setLiveOut(best.expectedOut);
        }
      } catch {
        // silent
      } finally {
        setLiveLoading(false);
      }
    }, 600);
  }, [amount, fromId, toId]);

  useEffect(() => {
    if (!deposit || !selected) return;
    let stop = false;
    async function check() {
      try {
        const res = await fetch("/api/status?provider=" + selected + "&id=" + encodeURIComponent(deposit!.trackingId));
        const text = await res.text();
        const data = text ? JSON.parse(text) : null;
        if (!stop && data) setStatus(data);
        const st = STATE_META[data?.state]?.step ?? 0;
        if (st >= 3 && statusTimer.current) clearInterval(statusTimer.current);
      } catch {
        // silent
      }
    }
    check();
    statusTimer.current = setInterval(check, 15000);
    return () => { stop = true; if (statusTimer.current) clearInterval(statusTimer.current); };
  }, [deposit, selected]);

  const needsRefund = selected === "chainflip" || (!selected && eligible.includes("chainflip"));

  const canQuote =
    amount && Number(amount) > 0 && fromId !== toId && eligible.length > 0 && destination.trim().length > 0;

  function flip() {
    setFromId(toId);
    setToId(fromId);
    setDestination("");
    setRefund("");
    reset();
  }

  function reset() {
    setResult(null);
    setSelected(null);
    setDeposit(null);
    setError(null);
    setLiveOut(null);
    setStatus(null);
    setShowAllRoutes(false);
    if (statusTimer.current) clearInterval(statusTimer.current);
  }

  async function getQuotes() {
    reset();
    setLoading(true);
    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fromAssetId: fromId,
          toAssetId: toId,
          amount,
          destinationAddress: destination || undefined,
          refundAddress: refund || undefined,
          slippageBps: 100,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Quote failed");
      setResult(data);
      const best = data.quotes[data.bestIndex];
      if (best) setSelected(best.provider);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function openDeposit() {
    if (!selected) return;
    if (!destination) { setError("Enter the address where you want to receive funds first."); return; }
    if (selected === "chainflip" && !refund) {
      setError("Enter a " + fromSym + " refund address - required by Chainflip in case the swap fails.");
      return;
    }
    setOpening(true);
    setError(null);
    try {
      const res = await fetch("/api/swap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: selected,
          fromAssetId: fromId,
          toAssetId: toId,
          amount,
          destinationAddress: destination,
          refundAddress: refund || destination,
          slippageBps: 100,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not open deposit address");
      setDeposit(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setOpening(false);
    }
  }

  const sendUsd = prices[fromId] && Number(amount) > 0 ? fmtUsd(prices[fromId] * Number(amount)) : null;

  const outVal = result && selected
    ? (result.quotes.find((q) => q.provider === selected)?.expectedOut ?? 0)
    : liveOut ?? 0;
  const receiveValue = result && selected
    ? fmt(result.quotes.find((q) => q.provider === selected)?.expectedOut ?? 0)
    : liveLoading ? "..." : liveOut ? fmt(liveOut) : "0.0";
  const receiveEmpty = !result && !liveOut && !liveLoading;
  const receiveUsd = prices[toId] && outVal > 0 ? fmtUsd(prices[toId] * outVal) : null;

  const bestQuote = result ? result.quotes[result.bestIndex] : null;
  const otherQuotes = result ? result.quotes.filter((_, i) => i !== result.bestIndex) : [];

  return (
    <div>
      {/* tab header */}
      <div className="sw-header">
        <div className="sw-tabs">
          <span className="sw-tab active">Swap</span>
          <span className="sw-tab">Limit</span>
        </div>
        <div className="sw-header-right">
          <span className="sw-live"><span className="sw-live-dot" />{eligible.length} routes live</span>
        </div>
      </div>

      <div className="card pro">
        {/* PAY */}
        <div className="leg">
          <div className="leg-head">
            <span className="label">You pay</span>
            <div className="quickfill">
              <span className="qf-pill">25%</span>
              <span className="qf-pill">50%</span>
              <span className="qf-pill max">MAX</span>
            </div>
          </div>
          <div className="leg-body">
            <div className="leg-amount">
              <input
                className="amount-input"
                inputMode="decimal"
                placeholder="0.0"
                value={amount}
                onChange={(e) => { setAmount(e.target.value.replace(/[^0-9.]/g, "")); reset(); }}
                aria-label="Amount to send"
              />
              {sendUsd && <div className="fiat-hint">{"\u2248 " + sendUsd}</div>}
            </div>
            <TokenButton id={fromId} name={fromName} onChange={(v) => { setFromId(v); setRefund(""); reset(); }} exclude={toId} />
          </div>
        </div>

        <div className="swap-flip">
          <button className="flip-btn" onClick={flip} aria-label="Swap direction">
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
              <path d="M5 3v8M5 11l-2.5-2.5M5 11l2.5-2.5M11 13V5M11 5L8.5 7.5M11 5l2.5 2.5"
                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* RECEIVE */}
        <div className="leg">
          <div className="leg-head">
            <span className="label">You receive</span>
          </div>
          <div className="leg-body">
            <div className="leg-amount">
              <div className={receiveEmpty ? "amount-readout empty" : "amount-readout"}>{receiveValue}</div>
              {receiveUsd && <div className="fiat-hint">{"\u2248 " + receiveUsd}</div>}
            </div>
            <TokenButton id={toId} name={toName} onChange={(v) => { setToId(v); reset(); }} exclude={fromId} />
          </div>
        </div>

        {/* address fields */}
        {eligible.length > 0 && (
          <>
            <div className="card-divider" />
            <div className="addr-rows">
              <div className="addr-row">
                <label className="addr-row-label" htmlFor="dest">Destination ({toSym})</label>
                <input id="dest" value={destination} placeholder={"Where you receive " + toSym}
                  onChange={(e) => { setDestination(e.target.value); }} />
              </div>
              <div className="addr-row">
                <label className="addr-row-label" htmlFor="refund">
                  Refund ({fromSym}){needsRefund && <span className="req-tag"> - required</span>}
                </label>
                <input id="refund" value={refund} placeholder={"Your " + fromSym + " address (if swap fails)"}
                  onChange={(e) => { setRefund(e.target.value); }} />
              </div>
            </div>
          </>
        )}

        {/* best route strip (live estimate, before compare) */}
        {eligible.length > 0 && !result && (
          <div className="route-strip">
            <div className="route-strip-left">
              <span className="route-strip-mark">{liveLoading ? "\u00B7\u00B7" : PROVIDER_INITIAL[eligible[0]]}</span>
              <div>
                <div className="route-strip-name">{liveLoading ? "Finding best route..." : "Best of " + eligible.length + " routes"}</div>
                <div className="route-strip-meta">Compare to lock in the top rate</div>
              </div>
            </div>
          </div>
        )}

        {/* best route strip (after compare) */}
        {bestQuote && !bestQuote.error && (
          <div className="route-strip best">
            <div className="route-strip-left">
              <span className="route-strip-mark gold">{PROVIDER_INITIAL[bestQuote.provider]}</span>
              <div>
                <div className="route-strip-name">
                  {bestQuote.providerLabel}
                  <span className="route-strip-tag">BEST</span>
                </div>
                <div className="route-strip-meta">
                  {bestQuote.estimatedSeconds ? "~" + Math.round(bestQuote.estimatedSeconds / 60) + " min" : "intent-based"}
                  {bestQuote.feeOut ? " \u00B7 fee " + fmt(bestQuote.feeOut) + " " + toSym : ""}
                </div>
              </div>
            </div>
            {otherQuotes.length > 0 && (
              <button className="route-strip-more" onClick={() => setShowAllRoutes(!showAllRoutes)}>
                {showAllRoutes ? "hide" : otherQuotes.length + " more"} {showAllRoutes ? "\u25B4" : "\u25BE"}
              </button>
            )}
          </div>
        )}

        {/* expanded other routes */}
        {showAllRoutes && bestQuote && (
          <div className="route-extra">
            {otherQuotes.map((q) => (
              <div key={q.provider} className={"route-extra-row" + (selected === q.provider ? " sel" : "") + (q.error ? " err" : "")}
                onClick={() => !q.error && setSelected(q.provider)}>
                <span className="route-extra-mark">{PROVIDER_INITIAL[q.provider]}</span>
                <span className="route-extra-name">{q.providerLabel}</span>
                <span className="route-extra-out">
                  {q.error ? <span className="route-extra-fail">unavailable</span> : fmt(q.expectedOut) + " " + toSym}
                </span>
              </div>
            ))}
          </div>
        )}

        {eligible.length === 0 && (
          <div className="route-strip"><div className="route-strip-left"><div className="route-strip-name">No route for this pair</div></div></div>
        )}

        {/* CTA */}
        {eligible.length > 0 && !result && (
          <button className="btn-primary" disabled={!canQuote || loading} onClick={getQuotes}>
            {loading ? "Comparing routes..." : !destination.trim() ? "Enter destination address" : "Compare routes"}
          </button>
        )}
        {result && selected && !deposit && (
          <button className="btn-primary" disabled={opening} onClick={openDeposit}>
            {opening ? "Opening deposit address..." : "Swap via " + label(selected)}
          </button>
        )}
      </div>

      {/* trust line */}
      <div className="trust-line">
        <span><CheckIcon />Non-custodial</span>
        <span><CheckIcon />No account</span>
        <span><CheckIcon />No KYC</span>
      </div>

      {error && <div className="error">{error}</div>}

      {/* DEPOSIT + STATUS */}
      {deposit && (
        <div className="deposit">
          <h3>{"Send " + deposit.depositAmount + " " + fromSym + " to complete your swap"}</h3>
          <p className="sub">{"One-time address from " + label(deposit.provider) + ". The swap starts automatically once your deposit confirms."}</p>
          <div className="kv">
            <div className="row">
              <span className="k">Deposit address</span>
              <Copyable text={deposit.depositAddress} />
            </div>
            {deposit.memo && (
              <div className="row">
                <span className="k">Memo (required)</span>
                <Copyable text={deposit.memo} />
              </div>
            )}
          </div>
          <StatusTracker status={status} />
          {deposit.memo && (
            <p className="warn">You must include this exact memo. THORChain refunds deposits sent without the correct memo. On Bitcoin it goes in an OP_RETURN output.</p>
          )}
          {deposit.notes && <p className="warn">{deposit.notes}</p>}
          {deposit.expiresAt && (
            <p className="warn">{"Quote valid until " + new Date(deposit.expiresAt * 1000).toLocaleTimeString() + "."}</p>
          )}
        </div>
      )}
    </div>
  );
}

function TokenButton({ id, name, onChange, exclude }: {
  id: string; name: string; onChange: (v: string) => void; exclude: string;
}) {
  return (
    <div className="token-btn">
      <span className="token-coin-grad" style={{ background: coinGrad(id) }}>{COIN_LETTER[id] ?? id[0]}</span>
      <span className="token-btn-text">
        <span className="token-btn-sym">{ASSETS.find((a) => a.id === id)?.symbol ?? id}</span>
        <span className="token-btn-name">{name}</span>
      </span>
      <span className="token-btn-chev">{"\u25BE"}</span>
      <select className="token-btn-select" value={id} onChange={(e) => onChange(e.target.value)} aria-label="Select asset">
        {ASSETS.filter((a) => a.id !== exclude).map((a) => (
          <option key={a.id} value={a.id}>{a.symbol} - {a.name}</option>
        ))}
      </select>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#5fd6a6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

function StatusTracker({ status }: { status: SwapStatus | null }) {
  const meta = STATE_META[status?.state ?? "unknown"] ?? STATE_META.unknown;
  const steps = ["Deposit", "Detected", "Processing", "Done"];
  return (
    <div className="status-box">
      <div className="status-head">
        <span className={"status-pill tone-" + meta.tone}><span className="status-pulse" />{meta.label}</span>
        {status?.outboundTxHash && <span className="status-tx">tx: {status.outboundTxHash.slice(0, 10)}...</span>}
      </div>
      <div className="status-track">
        {steps.map((s, i) => (
          <div key={s} className={"status-step" + (i <= meta.step ? " done" : "") + (i === meta.step && meta.step < 3 ? " active" : "")}>
            <span className="status-node" />
            <span className="status-step-label">{s}</span>
          </div>
        ))}
      </div>
      <p className="status-hint">Status updates automatically every 15s.</p>
    </div>
  );
}

function Copyable({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="copyline">
      <code>{text}</code>
      <button className="copybtn" onClick={() => { navigator.clipboard?.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1400); }}>
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}
