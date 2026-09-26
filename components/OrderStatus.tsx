"use client";

import { useEffect, useRef, useState } from "react";
import { SwapStatus } from "@/lib/types";

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

export default function OrderStatus({
  provider,
  trackingId,
}: {
  provider: string;
  trackingId: string;
}) {
  const [status, setStatus] = useState<SwapStatus | null>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!trackingId) return;
    let stop = false;

    async function check() {
      try {
        const res = await fetch(
          "/api/status?provider=" + provider + "&id=" + encodeURIComponent(trackingId)
        );
        const text = await res.text();
        const data = text ? JSON.parse(text) : null;
        if (!stop && data) setStatus(data);
        const step = STATE_META[data?.state]?.step ?? 0;
        if (step >= 3 && timer.current) clearInterval(timer.current);
      } catch {
        // silent — the panel keeps showing the last known state
      }
    }

    check();
    timer.current = setInterval(check, 15000);
    return () => {
      stop = true;
      if (timer.current) clearInterval(timer.current);
    };
  }, [provider, trackingId]);

  const meta = STATE_META[status?.state ?? "awaiting_deposit"] ?? STATE_META.unknown;
  const steps = ["Deposit", "Detected", "Processing", "Done"];

  return (
    <div className="status-box">
      <div className="status-head">
        <span className={"status-pill tone-" + meta.tone}>
          <span className="status-pulse" />
          {meta.label}
        </span>
        {status?.outboundTxHash && (
          <span className="status-tx">tx: {status.outboundTxHash.slice(0, 10)}...</span>
        )}
      </div>
      <div className="status-track">
        {steps.map((s, i) => (
          <div
            key={s}
            className={
              "status-step" +
              (i <= meta.step ? " done" : "") +
              (i === meta.step && meta.step < 3 ? " active" : "")
            }
          >
            <span className="status-node" />
            <span className="status-step-label">{s}</span>
          </div>
        ))}
      </div>
      <p className="status-hint">
        {trackingId
          ? "Status updates automatically every 15s."
          : "This route has no live status lookup. Check your destination wallet."}
      </p>
    </div>
  );
}
