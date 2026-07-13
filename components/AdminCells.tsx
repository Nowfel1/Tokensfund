"use client";

import { useState } from "react";

// Full-width copyable cell: shows the complete value (word-break instead of
// ellipsis) and copies on click. For admin use where truncation hides the
// exact thing you need.
export function CopyText({ text }: { text: string | null }) {
  const [copied, setCopied] = useState(false);
  if (!text) return <span style={{ color: "#565f80" }}>—</span>;
  return (
    <span
      onClick={() => {
        navigator.clipboard?.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
      }}
      title="Click to copy"
      style={{
        cursor: "pointer",
        wordBreak: "break-all",
        color: copied ? "#5fd6a6" : undefined,
      }}
    >
      {text}
      {copied && <span style={{ marginLeft: 6, fontSize: 11, color: "#5fd6a6" }}>copied</span>}
    </span>
  );
}

// CCE stores a composite tracking id: "{orderNo}~{queryCode}" (both identifiers,
// since status lookups may need either). For display, show the human query code
// grouped like CCE's own UI (UBBP-BTVM-NIKS) with the internal no beneath.
// The RAW composite must keep flowing to status lookups — format display only.
function parseCceTracking(text: string): { code: string; no: string } | null {
  const parts = text.split("~");
  if (parts.length !== 2) return null;
  const [no, raw] = parts;
  const code = raw.replace(/(.{4})(?=.)/g, "$1-");
  return { code, no };
}

export function TrackingCell({ provider, text }: { provider: string; text: string | null }) {
  if (!text) return <span style={{ color: "#565f80" }}>—</span>;
  if (provider === "cce") {
    const parsed = parseCceTracking(text);
    if (parsed) {
      return (
        <span>
          <CopyText text={parsed.code} />
          <span style={{ display: "block", fontSize: 10, color: "#565f80", marginTop: 2 }}>
            no: {parsed.no}
          </span>
        </span>
      );
    }
  }
  return <CopyText text={text} />;
}

const STATE_COLOR: Record<string, string> = {
  awaiting_deposit: "#8a95b8",
  pending: "#8a95b8",
  deposit_detected: "#9b9cf5",
  processing: "#9b9cf5",
  success: "#5fd6a6",
  completed: "#5fd6a6",
  refunded: "#f4c64e",
  failed: "#ff6b7d",
  unknown: "#565f80",
};

// On-demand status: one click = one /api/status call for that order.
// Deliberately NOT auto-fetched for every row — 200 rows would mean 200
// provider API calls per page load.
export function StatusCell({ provider, trackingId }: { provider: string; trackingId: string | null }) {
  const [state, setState] = useState<string | null>(null);
  const [detail, setDetail] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (!trackingId) return <span style={{ color: "#565f80" }}>—</span>;

  async function check() {
    setBusy(true);
    try {
      const res = await fetch(
        "/api/status?provider=" + encodeURIComponent(provider) + "&id=" + encodeURIComponent(trackingId!)
      );
      const data = await res.json();
      setState(data.state ?? "unknown");
      setDetail(data.detail ?? null);
    } catch {
      setState("unknown");
      setDetail("lookup failed");
    } finally {
      setBusy(false);
    }
  }

  if (state) {
    return (
      <span title={detail ?? undefined} style={{ color: STATE_COLOR[state] ?? "#8a95b8", cursor: "pointer" }} onClick={check}>
        {busy ? "…" : state}
      </span>
    );
  }
  return (
    <button
      onClick={check}
      disabled={busy}
      style={{
        background: "#1a2342",
        border: "1px solid #2a3358",
        color: "#8a95b8",
        borderRadius: 6,
        padding: "3px 10px",
        fontSize: 11,
        fontFamily: "inherit",
        cursor: "pointer",
      }}
    >
      {busy ? "…" : "check"}
    </button>
  );
}
