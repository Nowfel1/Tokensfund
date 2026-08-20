"use client";

import { useEffect, useRef, useState } from "react";
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

// Each provider tracks by a DIFFERENT identifier. A generic "address or id"
// prompt invites users to paste the wrong thing (e.g. a deposit address into
// Changee, which only knows exchange IDs) — so the input adapts per provider.
const PROVIDER_INPUT: Record<ProviderId, { placeholder: string; hint: string }> = {
  changee: {
    placeholder: "Changee exchange ID (e.g. b221f953d73ec3)",
    hint: "Use the exchange ID from your swap confirmation — not the deposit address.",
  },
  near_intents: {
    placeholder: "Deposit address you sent funds to",
    hint: "NEAR Intents swaps are tracked by the deposit address itself.",
  },
  chainflip: {
    placeholder: "Deposit channel ID (e.g. 12345678-Bitcoin-123)",
    hint: "Use the deposit channel ID shown when your swap was created.",
  },
  thorchain: {
    placeholder: "Your deposit transaction hash",
    hint: "Paste the TX hash of the deposit you sent — from your wallet or a block explorer.",
  },
  cce: {
    placeholder: "CCE order code (e.g. QIC05HYH92XV)",
    hint: "Use the order code from your swap — dashes and # are fine, we clean them up.",
  },
};

const PROVIDER_IDS: ProviderId[] = [
  "thorchain",
  "chainflip",
  "near_intents",
  "cce",
  "changee",
];

export default function TrackPage() {
  const [provider, setProvider] = useState<ProviderId>("changee");
  const [id, setId] = useState("");
  const [status, setStatus] = useState<SwapStatus | null>(null);
  const [busy, setBusy] = useState(false);
  const [touched, setTouched] = useState(false);
  const [copied, setCopied] = useState(false);
  const autoRan = useRef(false);

  // Deep link: /track?provider=cce&id=XXXX loads and runs the lookup
  // automatically, so every swap has its own shareable, bookmarkable URL.
  useEffect(() => {
    if (typeof window === "undefined" || autoRan.current) return;
    const q = new URLSearchParams(window.location.search);
    const p = q.get("provider") as ProviderId | null;
    const i = q.get("id");
    if (p && PROVIDER_IDS.includes(p)) setProvider(p);
    if (i) setId(i);
    if (p && PROVIDER_IDS.includes(p) && i) {
      autoRan.current = true;
      // defer so the state above is applied before the lookup reads it
      setTimeout(() => {
        void runLookup(p, i);
      }, 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Shareable URL for the current lookup
  const shareUrl =
    typeof window !== "undefined" && id.trim()
      ? `${window.location.origin}/track?provider=${provider}&id=${encodeURIComponent(id.trim())}`
      : "";

  function copyShare() {
    if (!shareUrl) return;
    navigator.clipboard?.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  const inputMeta = PROVIDER_INPUT[provider] ?? {
    placeholder: "Tracking ID",
    hint: "",
  };

  async function runLookup(p: ProviderId, rawId: string) {
    const value = rawId.trim();
    if (!value) return;
    setBusy(true);
    setStatus(null);
    setTouched(true);
    try {
      const res = await fetch("/api/status?provider=" + p + "&id=" + encodeURIComponent(value));
      const text = await res.text();
      const data = text ? JSON.parse(text) : { provider: p, state: "unknown", detail: "No response from server." };
      setStatus(data);
    } catch (e: any) {
      setStatus({ provider: p, state: "unknown", detail: e.message });
    } finally {
      setBusy(false);
    }
  }

  async function lookup() {
    await runLookup(provider, id);
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
          Check the live status of any swap. Pick the provider you used — the field below tells you
          exactly which reference to paste.
        </p>
      </section>

      <div className="card" style={{ padding: 18 }}>
        <div className="track-row">
          <select
            className="track-select"
            value={provider}
            onChange={(e) => { setProvider(e.target.value as ProviderId); setStatus(null); setTouched(false); }}
          >
            <option value="changee">Changee</option>
            <option value="near_intents">NEAR Intents</option>
            <option value="chainflip">Chainflip</option>
            <option value="thorchain">THORChain</option>
            <option value="cce">CCE.Cash</option>
          </select>
          <input
            className="track-input"
            placeholder={inputMeta.placeholder}
            value={id}
            onChange={(e) => setId(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") lookup(); }}
          />
        </div>
        {inputMeta.hint && (
          <p className="status-hint" style={{ textAlign: "left", margin: "8px 2px 0" }}>{inputMeta.hint}</p>
        )}
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
            {status?.provider === "cce" && status.state === "unknown" ? (
              <p className="status-hint">
                {status?.detail ?? "Live status unavailable."}{" "}
                <a href="https://cce.cash" target="_blank" rel="noopener noreferrer" className="status-ext-link">
                  Track on CCE.cash {"\u2192"}
                </a>
              </p>
            ) : (
              status?.detail && <p className="status-hint">{status.detail}</p>
            )}
          </div>
        )}

        {touched && !meta && !busy && (
          <p className="status-hint" style={{ marginTop: 16 }}>No status found. Double-check the ID and provider.</p>
        )}

        {/* Shareable per-swap URL. Monerica flagged the absence of unique order
            URLs as a suspicious practice — every lookup now has its own link
            that can be bookmarked, shared with support, or reopened later. */}
        {id.trim() && (
          <div className="track-share">
            <span className="track-share-label">Link to this swap</span>
            <code className="track-share-url">{shareUrl}</code>
            <button type="button" className="copybtn" onClick={copyShare}>
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        )}
      </div>

      <p className="foot">
        Live tracking depends on each provider&apos;s API. Some swaps may show
        <strong> status unavailable</strong> until funds are sent, or may need to be tracked on
        the provider&apos;s own page.
      </p>
    </main>
  );
}
