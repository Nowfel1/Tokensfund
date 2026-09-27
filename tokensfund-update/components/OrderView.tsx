"use client";

import { useEffect, useRef, useState } from "react";
import { SwapStatus } from "@/lib/types";

const STATE_META: Record<string, { label: string; step: number; tone: string }> = {
  awaiting_deposit: { label: "Awaiting deposit", step: 0, tone: "wait" },
  pending: { label: "Awaiting deposit", step: 0, tone: "wait" },
  deposit_detected: { label: "Deposit detected", step: 1, tone: "go" },
  processing: { label: "Processing", step: 2, tone: "go" },
  success: { label: "Completed", step: 3, tone: "ok" },
  completed: { label: "Completed", step: 3, tone: "ok" },
  refunded: { label: "Refunded", step: 3, tone: "warn" },
  failed: { label: "Failed", step: 3, tone: "bad" },
  unknown: { label: "Checking status", step: 0, tone: "wait" },
};

const STEPS = ["Deposit", "Detected", "Processing", "Done"];

function providerLabel(p: string) {
  if (p === "thorchain") return "THORChain";
  if (p === "chainflip") return "Chainflip";
  if (p === "cce") return "CCE.Cash";
  if (p === "changee") return "Changee";
  if (p === "near_intents") return "NEAR Intents";
  return p;
}

function mask(v: string) {
  return v.length > 12 ? v.slice(0, 4) + "\u2026" + v.slice(-4) : v;
}

function group(code: string) {
  return code.replace(/(.{4})(?=.)/g, "$1-");
}

interface Props {
  code: string;
  provider: string;
  trackingId: string;
  amount: string;
  fromSymbol: string;
  toSymbol: string;
  toName: string;
  destination: string;
  deposit: string;
  created: string;
}

export default function OrderView(p: Props) {
  const [status, setStatus] = useState<SwapStatus | null>(null);
  const [copied, setCopied] = useState(false);
  const [showDst, setShowDst] = useState(false);
  const [showDep, setShowDep] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  // Live status for the customer, polled from the provider every 15s.
  // Stops once the swap reaches a terminal state.
  useEffect(() => {
    if (!p.trackingId) return;
    let stop = false;
    async function check() {
      try {
        const res = await fetch(
          "/api/status?provider=" + p.provider + "&id=" + encodeURIComponent(p.trackingId)
        );
        const text = await res.text();
        const data = text ? JSON.parse(text) : null;
        if (!stop && data) setStatus(data);
        if ((STATE_META[data?.state]?.step ?? 0) >= 3 && timer.current) {
          clearInterval(timer.current);
        }
      } catch {
        // keep showing the last known state
      }
    }
    check();
    timer.current = setInterval(check, 15000);
    return () => {
      stop = true;
      if (timer.current) clearInterval(timer.current);
    };
  }, [p.provider, p.trackingId]);

  const meta = STATE_META[status?.state ?? "awaiting_deposit"] ?? STATE_META.unknown;

  function copyCode() {
    navigator.clipboard?.writeText(p.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <section className="ov">
      <div className="ov-top">
        <span className="ov-eyebrow">ORDER</span>
        <span className={"ov-pill tone-" + meta.tone}>
          <span className="ov-dot" />
          {meta.label}
        </span>
      </div>

      <div className="ov-code-row">
        <span className="ov-code">{group(p.code)}</span>
        <button type="button" className="ov-icon-btn" onClick={copyCode} aria-label="Copy order code">
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <p className="ov-created">Created {p.created}</p>

      <div className="ov-pair">
        <div>
          <div className="ov-pair-k">You send</div>
          <div className="ov-pair-v">
            {p.amount} {p.fromSymbol}
          </div>
        </div>
        <div className="ov-arrow" aria-hidden="true">{"\u2192"}</div>
        <div className="ov-right">
          <div className="ov-pair-k">You receive</div>
          <div className="ov-pair-v">{p.toSymbol}</div>
        </div>
      </div>

      <div className="ov-track">
        {STEPS.map((s, i) => {
          const done = i < meta.step || (i === meta.step && meta.step === 3);
          const active = i === meta.step && meta.step < 3;
          return (
            <div key={s} className="ov-step-wrap">
              <div className="ov-step">
                <span className={"ov-node" + (done ? " done" : active ? " active" : "")} />
                <span className={"ov-step-label" + (active ? " active" : done ? " done" : "")}>{s}</span>
              </div>
              {i < STEPS.length - 1 && <span className={"ov-line" + (i < meta.step ? " done" : "")} />}
            </div>
          );
        })}
      </div>
      <p className="ov-hint">
        {p.trackingId
          ? meta.step >= 3
            ? "This swap is finished."
            : "Updates automatically every 15 seconds"
          : "Live status isn't available for this route. Check your destination wallet."}
      </p>

      <div className="ov-details">
        <div className="ov-row">
          <span className="ov-k">Route</span>
          <span className="ov-v">{providerLabel(p.provider)}</span>
        </div>
        <div className="ov-row">
          <span className="ov-k">Destination</span>
          <span className="ov-addr">
            <code>{showDst ? p.destination : mask(p.destination)}</code>
            <button type="button" className="ov-show" onClick={() => setShowDst(!showDst)}>
              {showDst ? "Hide" : "Show"}
            </button>
          </span>
        </div>
        {p.deposit && (
          <div className="ov-row">
            <span className="ov-k">Deposit address</span>
            <span className="ov-addr">
              <code>{showDep ? p.deposit : mask(p.deposit)}</code>
              <button type="button" className="ov-show" onClick={() => setShowDep(!showDep)}>
                {showDep ? "Hide" : "Show"}
              </button>
            </span>
          </div>
        )}
      </div>

      <div className="ov-private">
        <span className="ov-lock" aria-hidden="true">{"\u{1F512}"}</span>
        <p>
          Your private status link. It isn&apos;t indexed or listed anywhere — only people you
          share it with can open it. Nobody from TokensFund will ever contact you about this swap
          or ask for your seed phrase.
        </p>
      </div>

      <p className="ov-help">Need help? Quote the order code above.</p>
    </section>
  );
}
