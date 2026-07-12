"use client";

import { useEffect, useState } from "react";

// Thin live-rate strip under the masthead. One fetch on load (no polling —
// keep it cheap); renders nothing if prices are unavailable so the layout
// degrades cleanly.
const PAIRS: Array<[string, string]> = [
  ["BTC", "ETH"],
  ["XMR", "BTC"],
  ["ETH", "USDC"],
  ["SOL", "XMR"],
  ["LTC", "BTC"],
];

function fmtRate(n: number): string {
  if (!isFinite(n) || n <= 0) return "";
  if (n >= 1000) return n.toLocaleString(undefined, { maximumFractionDigits: 0 });
  if (n >= 1) return n.toLocaleString(undefined, { maximumFractionDigits: 3 });
  return n.toLocaleString(undefined, { maximumFractionDigits: 5 });
}

export default function RateTicker() {
  const [prices, setPrices] = useState<Record<string, number> | null>(null);

  useEffect(() => {
    fetch("/api/prices")
      .then((r) => r.text())
      .then((t) => { if (t) setPrices(JSON.parse(t)); })
      .catch(() => {});
  }, []);

  if (!prices) return null;

  const rows = PAIRS
    .map(([a, b]) => {
      const pa = prices[a];
      const pb = prices[b];
      if (!pa || !pb) return null;
      return { a, b, rate: fmtRate(pa / pb) };
    })
    .filter((r): r is { a: string; b: string; rate: string } => !!r && !!r.rate);

  if (rows.length === 0) return null;

  return (
    <div className="ticker" aria-label="Live exchange rates">
      {rows.map((r, i) => (
        <span key={r.a + r.b} className="ticker-item">
          {i > 0 && <span className="ticker-dot">·</span>}
          <span className="ticker-pair">{r.a} → {r.b}</span>
          <span className="ticker-rate">{r.rate}</span>
        </span>
      ))}
      <span className="ticker-note">live rates</span>
    </div>
  );
}
