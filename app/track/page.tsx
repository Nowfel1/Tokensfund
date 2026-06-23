"use client";

import { useState } from "react";
import Logo from "@/components/Logo";
import { ProviderId, SwapStatus } from "@/lib/types";

const STATE_META: Record<string, { label: string; step: number; tone: string }> = {
  awaiting_deposit: { label: "Awaiting deposit", step: 0, tone: "wait" },
  deposit_detected: { label: "Deposit detected", step: 1, tone: "go" },
  processing: { label: "Processing swap", step: 2, tone: "go" },
  success: { label: "Completed", step: 3, tone: "ok" },
  completed: { label: "Completed", step: 3, tone: "ok" },
  refunded: { label: "Refunded", step: 3, tone: "warn" },
  failed: { label: "Failed", step: 3, tone: "bad" },
  pending: { label: "Pending", step: 0, tone: "wait" },
  unknown: { label: "Status unavailable", step: 0, tone: "wait" },
};

export default function TrackPage() {
  const [provider, setProvider] = useState<ProviderId>("changee");
  const [id, setId] = useState("");
  const [status, setStatus] = useState<SwapStatus | null>(null);
  const [busy, setBusy] = useState(false);
  const [touched, setTouched] = useState(false);

  async function lookup() {
    if (!id.trim()) return;
    setBusy(true);
    setStatus(null);
    setTouched(true);
    try {
      const res = await fetch("/api/status?provider=" + provider + "&id=" + encodeURIComponent(id.trim()));
      const text = await res.text();
      const data = text ? JSON.parse(text) : { provider, state: "unknown", detail: "No response from server." };
      setStatus(data);
    } catch (e: any) {
      setStatus({ provider, state: "unknown", detail: e.message });
    } finally {
      setBusy(false);
    }
  }

  const meta = status ? (STATE_META[status.state] ?? STATE_META.unknown) : null;
  const steps = ["Deposit", "Detected", "Processing", "Done"];

  return (
    <main className="wrap">
      <header className="masthead">
        <div className="header-inner">
          <a href="/" className="brand">
            <Logo size={34} />
            <span>tokensfund<span className="tld">.xyz</span></span>
          </a>
          <nav className="main-nav">
            <a href="/" className="nav-link">Swap</a>
            <a href="/track" className="nav-link">Track</a>
            <a href="/blog" className="nav-link">Blog</a>
          </nav>
        </div>
      </header>

      <section className="hero" style={{ paddingBottom: 24 }}>
        <h1 style={{ fontSize: 34 }}>Track your <span className="accent">swap</span></h1>
        <p className="sub">
          Check the live status of any swap. Pick the provider you used and paste your deposit
          address or tracking ID.
        </p>
      </section>

      <div className="card" style={{ padding: 18 }}>
        <div className="track-row">
          <select className="track-select" value={provider} onChange={(e) => setProvider(e.target.value as ProviderId)}>
            <option value="changee">Changee</option>
            <option value="near_intents">NEAR Intents</option>
            <option value="chainflip">Chainflip</option>
            <option value="thorchain">THORChain</option>
            <option value="cce">CCE.Cash</option>
          </select>
          <input
            className="track-input"
            placeholder="Deposit address or tracking ID"
            value={id}
            onChange={(e) => setId(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") lookup(); }}
          />
        </div>
        <button className="btn-primary" disabled={busy || !id.trim()} onClick={lookup}>
          {busy ? "Checking..." : "Check status"}
        </button>

        {meta && (
          <div className="status-box" style={{ marginTop: 18 }}>
            <div className="status-head">
              <span className={"status-pill tone-" + meta.tone}>
                <span className="status-pulse" />{meta.label}
              </span>
              {status?.outboundTxHash && (
                <span className="status-tx">tx: {status.outboundTxHash.slice(0, 12)}...</span>
              )}
            </div>
            <div className="status-track">
              {steps.map((s, i) => (
                <div key={s} className={"status-step" + (i <= meta.step ? " done" : "") + (i === meta.step && meta.step < 3 ? " active" : "")}>
                  <span className="status-node" />
                  <span className="status-step-label">{s}</span>
                </div>
              ))}
            </div>
            {status?.detail && (
              <p className="status-hint">{status.detail}</p>
            )}
          </div>
        )}

        {touched && !meta && !busy && (
          <p className="status-hint" style={{ marginTop: 16 }}>No status found. Double-check the ID and provider.</p>
        )}
      </div>

      <p className="foot">
        Live tracking depends on each provider's API. Some swaps may show
        <strong> status unavailable</strong> until funds are sent, or may need to be tracked on
        the provider's own page.
      </p>
    </main>
  );
}
