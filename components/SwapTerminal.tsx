"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import { ASSETS } from "@/lib/assets";
import { AggregatedQuotes, NormalizedQuote, ProviderId, SwapInstruction } from "@/lib/types";

const PROVIDER_INITIAL: Record<ProviderId, string> = {
  thorchain: "TC",
  chainflip: "CF",
  near_intents: "NI",
  cce: "CC",
  changenow: "CN",
};

const COIN_LETTER: Record<string, string> = {
  BTC: "B", ETH: "E", SOL: "S", XRP: "X", DOGE: "D", USDT: "T", USDC: "U",
  LTC: "L", TON: "T", XMR: "M", ZEC: "Z", NEAR: "N", TAO: "T", HYPE: "H",
  ZANO: "Z", TRX: "T",
};

const COIN_COLOR: Record<string, string> = {
  BTC: "#f7931a", ETH: "#9b9cf5", SOL: "#14f1b2", XRP: "#5fb8e8", DOGE: "#cfa84e",
  USDT: "#26a17b", USDC: "#2775ca", LTC: "#b8b8c0", TON: "#3aa0e8", XMR: "#e06f6f",
  ZEC: "#f4c64e", NEAR: "#9b9cf5", TAO: "#1ec0d6", HYPE: "#5fb8e8",
  ZANO: "#e06f6f", TRX: "#e83b3b", USDT_TRC20: "#26a17b",
};

function coinColor(id: string) {
  return COIN_COLOR[id] ?? "#8a93b8";
}

function fmt(n: number) {
  if (!isFinite(n) || n === 0) return "0";
  if (n < 0.0001) return n.toExponential(2);
  return n.toLocaleString(undefined, { maximumFractionDigits: 8 });
}

function pairProviders(fromId: string, toId: string): ProviderId[] {
  const from = ASSETS.find((a) => a.id === fromId);
  const to = ASSETS.find((a) => a.id === toId);
  if (!from || !to) return [];
  return (["thorchain", "chainflip", "near_intents", "cce", "changenow"] as ProviderId[]).filter(
    (p) => from.providerIds[p] && to.providerIds[p]
  );
}

export default function SwapTerminal() {
  const [fromId, setFromId] = useState("BTC");
  const [toId, setToId] = useState("ETH");
  const [amount, setAmount] = useState("0.1");
  const [maxBalance, setMaxBalance] = useState<number | null>(null);
  const [destination, setDestination] = useState("");
  const [refund, setRefund] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AggregatedQuotes | null>(null);
  const [selected, setSelected] = useState<ProviderId | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [opening, setOpening] = useState(false);
  const [deposit, setDeposit] = useState<SwapInstruction | null>(null);

  const [liveOut, setLiveOut] = useState<number | null>(null);
  const [liveLoading, setLiveLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const eligible = useMemo(() => pairProviders(fromId, toId), [fromId, toId]);
  const toSym = ASSETS.find((a) => a.id === toId)?.symbol ?? toId;
  const fromSym = ASSETS.find((a) => a.id === fromId)?.symbol ?? fromId;

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
          body: JSON.stringify({
            fromAssetId: fromId,
            toAssetId: toId,
            amount,
            slippageBps: 100,
          }),
        });
        const data = await res.json();
        if (res.ok && data.quotes?.length) {
          const best = data.quotes[data.bestIndex];
          if (best?.expectedOut) setLiveOut(best.expectedOut);
        }
      } catch {
        // silent fail
      } finally {
        setLiveLoading(false);
      }
    }, 600);
  }, [amount, fromId, toId]);

  const needsRefund = selected === "chainflip" || (!selected && eligible.includes("chainflip"));

  const canQuote =
    amount &&
    Number(amount) > 0 &&
    fromId !== toId &&
    eligible.length > 0 &&
    destination.trim().length > 0;

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
  }

  function applyPercent(pct: number) {
    if (maxBalance === null) return;
    const val = (maxBalance * pct) / 100;
    setAmount(val.toString());
    reset();
  }

  function clearAmount() {
    setAmount("");
    reset();
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
    if (!destination) {
      setError("Enter the address where you want to receive funds first.");
      return;
    }
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

  const receiveValue = result && selected
    ? fmt(result.quotes.find((q) => q.provider === selected)?.expectedOut ?? 0)
    : liveLoading ? "..." : liveOut ? fmt(liveOut) : "0.0";

  const receiveEmpty = !result && !liveOut && !liveLoading;

  const bestProviderLabel = result
    ? label(result.quotes[result.bestIndex]?.provider)
    : liveOut
    ? "comparing..."
    : null;

  return (
    <div>
      <div className="card">
        {/* FROM */}
        <div className="leg">
          <div className="leg-head">
            <span className="label">You send</span>
            <div className="quickfill">
              <span className="qf-pill" onClick={clearAmount}>Clear</span>
              <span className="qf-pill" onClick={() => applyPercent(50)}>50%</span>
              <span className="qf-pill" onClick={() => applyPercent(100)}>100%</span>
            </div>
          </div>
          <div>
            <input
              className="amount-input"
              inputMode="decimal"
              placeholder="0.0"
              value={amount}
              onChange={(e) => { setAmount(e.target.value.replace(/[^0-9.]/g, "")); reset(); }}
              aria-label="Amount to send"
            />
          </div>
          <div className="token-select-wrap">
            <div className="token-coin" style={{ background: coinColor(fromId) + "22", color: coinColor(fromId) }}>{COIN_LETTER[fromId] ?? fromId[0]}</div>
            <select
              className="token-select"
              value={fromId}
              onChange={(e) => { setFromId(e.target.value); setRefund(""); reset(); }}
              aria-label="Asset to send"
            >
              {ASSETS.map((a) => (
                <option key={a.id} value={a.id}>{a.symbol}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="swap-flip">
          <button className="flip-btn" onClick={flip} aria-label="Swap direction">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M5 3v8M5 11l-2.5-2.5M5 11l2.5-2.5M11 13V5M11 5L8.5 7.5M11 5l2.5 2.5"
                stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* TO */}
        <div className="leg">
          <div className="leg-head">
            <span className="label">You receive</span>
          </div>
          <div>
            <div className={receiveEmpty ? "amount-readout empty" : "amount-readout"}>
              {receiveValue}
            </div>
          </div>
          <div className="token-select-wrap">
            <div className="token-coin" style={{ background: coinColor(toId) + "22", color: coinColor(toId) }}>{COIN_LETTER[toId] ?? toId[0]}</div>
            <select
              className="token-select"
              value={toId}
              onChange={(e) => { setToId(e.target.value); reset(); }}
              aria-label="Asset to receive"
            >
              {ASSETS.map((a) => (
                <option key={a.id} value={a.id}>{a.symbol}</option>
              ))}
            </select>
          </div>
        </div>

        {eligible.length > 0 && (
          <>
            <div className="card-divider" />
            <div className="addr-rows">
              <div className="addr-row">
                <label className="addr-row-label" htmlFor="dest">
                  Destination ({toSym})
                </label>
                <input
                  id="dest"
                  value={destination}
                  placeholder={"Where you receive " + toSym}
                  onChange={(e) => { setDestination(e.target.value); }}
                />
              </div>
              <div className="addr-row">
                <label className="addr-row-label" htmlFor="refund">
                  Refund ({fromSym}){needsRefund && <span className="req-tag"> - required</span>}
                </label>
                <input
                  id="refund"
                  value={refund}
                  placeholder={"Your " + fromSym + " address (if swap fails)"}
                  onChange={(e) => { setRefund(e.target.value); }}
                />
              </div>
            </div>
            <div className="route-summary">
              <span>{eligible.length} {eligible.length === 1 ? "route" : "routes"} compared</span>
              {bestProviderLabel && (
                <span className="route-best">
                  <span className="route-dot" />
                  Best: {bestProviderLabel}
                </span>
              )}
            </div>
            <button
              className="btn-primary"
              disabled={!canQuote || loading}
              onClick={getQuotes}
            >
              {loading
                ? "Comparing routes..."
                : !destination.trim()
                ? "Enter destination address"
                : "Compare routes"}
            </button>
          </>
        )}
        {eligible.length === 0 && (
          <div className="route-summary">
            <span>No route for this pair</span>
          </div>
        )}
      </div>

      {error && <div className="error">{error}</div>}

      {/* QUOTE RACE */}
      {(loading || result) && (
        <div className="race">
          <div className="race-head">
            <h2>Routes</h2>
            <span className="count">
              {loading
                ? eligible.length + " networks quoting..."
                : result?.quotes.filter((q) => !q.error).length + "/" + result?.quotes.length + " routed"}
            </span>
          </div>
          {loading
            ? eligible.map((p) => (
                <div className="quote" key={p}>
                  <div className="pmark">{PROVIDER_INITIAL[p]}</div>
                  <div>
                    <div className="pname">{label(p)}</div>
                    <div className="pmeta">requesting quote</div>
                  </div>
                  <div className="shimmer" />
                </div>
              ))
            : result?.quotes.map((q, i) => (
                <QuoteCard
                  key={q.provider}
                  q={q}
                  best={i === result.bestIndex}
                  selected={selected === q.provider}
                  sym={toSym}
                  onSelect={() => !q.error && setSelected(q.provider)}
                />
              ))}
          {result && selected && !deposit && (
            <button className="btn-primary" disabled={opening} onClick={openDeposit}>
              {opening ? "Opening deposit address..." : "Swap via " + label(selected)}
            </button>
          )}
        </div>
      )}

      {/* DEPOSIT INSTRUCTIONS */}
      {deposit && (
        <div className="deposit">
          <h3>
            {"Send " + deposit.depositAmount + " " + (ASSETS.find((a) => a.id === fromId)?.symbol ?? "") + " to complete your swap"}
          </h3>
          <p className="sub">
            {"This is a one-time address from " + label(deposit.provider) + ". The swap starts automatically once your deposit confirms."}
          </p>
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
          {deposit.memo && (
            <p className="warn">
              You must include this exact memo. THORChain refunds deposits sent without the correct memo. On Bitcoin it goes in an OP_RETURN output.
            </p>
          )}
          {deposit.notes && <p className="warn">{deposit.notes}</p>}
          {deposit.expiresAt && (
            <p className="warn">
              {"Quote valid until " + new Date(deposit.expiresAt * 1000).toLocaleTimeString() + "."}
            </p>
          )}
        </div>
      )}
    </div>
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

function QuoteCard({ q, best, selected, sym, onSelect }: {
  q: NormalizedQuote;
  best: boolean;
  selected: boolean;
  sym: string;
  onSelect: () => void;
}) {
  const cls = "quote" + (best ? " best" : "") + (q.error ? " failed" : " selectable") + (selected ? " selected" : "");
  return (
    <div
      className={cls}
      onClick={onSelect}
      role={q.error ? undefined : "button"}
      tabIndex={q.error ? undefined : 0}
      onKeyDown={(e) => {
        if (!q.error && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onSelect();
        }
      }}
    >
      {best && <span className="tag-best">Best route</span>}
      <div className="pmark">{PROVIDER_INITIAL[q.provider]}</div>
      <div>
        <div className="pname">{q.providerLabel}</div>
        <div className="pmeta">
          {q.error
            ? q.error.slice(0, 60)
            : q.estimatedSeconds
            ? "~" + Math.round(q.estimatedSeconds / 60) + " min" + (q.feeOut ? " - fee " + fmt(q.feeOut) + " " + sym : "")
            : "intent-based"}
        </div>
      </div>
      <div className="out">
        {q.error ? (
          <div className="num" style={{ color: "var(--muted-2)" }}>-</div>
        ) : (
          <div>
            <div className="num">{fmt(q.expectedOut)}</div>
            <div className="sym">{sym}</div>
          </div>
        )}
      </div>
    </div>
  );
}

function Copyable({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="copyline">
      <code>{text}</code>
      <button
        className="copybtn"
        onClick={() => {
          navigator.clipboard?.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1400);
        }}
      >
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}
