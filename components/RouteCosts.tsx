"use client";

import { useEffect, useState } from "react";
import { ASSETS } from "@/lib/assets";
import type { ProviderId } from "@/lib/types";

type Costs = Record<string, Record<string, number | null>>;

const ROUTES: { id: ProviderId; name: string; type: string; holds: string }[] = [
  { id: "thorchain", name: "THORChain", type: "Protocol", holds: "No" },
  { id: "chainflip", name: "Chainflip", type: "Protocol", holds: "No" },
  { id: "cce", name: "CCE.Cash", type: "Instant exchanger", holds: "Briefly" },
  { id: "changee", name: "Changee", type: "Instant exchanger", holds: "Briefly" },
  { id: "wagyu", name: "Wagyu", type: "Orderbook", holds: "Briefly" },
];

const PAIRS = [
  { key: "btcXmr", label: "BTC → XMR" },
  { key: "btcEth", label: "BTC → ETH" },
];

// Key coins shown as badges, in this order. Any USDT network counts as USDT.
const KEY_COINS: { symbol: string; letter: string; bg: string; fg: string }[] = [
  { symbol: "BTC", letter: "B", bg: "#f7931a", fg: "#2b1700" },
  { symbol: "XMR", letter: "M", bg: "#ff6600", fg: "#2b1100" },
  { symbol: "ZEC", letter: "Z", bg: "#f4b728", fg: "#2b1f00" },
  { symbol: "ETH", letter: "E", bg: "#8a9cf0", fg: "#141a3d" },
  { symbol: "USDT", letter: "T", bg: "#26a17b", fg: "#04251b" },
];

function coinsFor(route: ProviderId) {
  const assets = ASSETS.filter((a) => a.providerIds[route]);
  const symbols = new Set(assets.map((a) => a.symbol));
  const badges = KEY_COINS.filter((c) => symbols.has(c.symbol));
  const keySet = new Set(KEY_COINS.map((c) => c.symbol));
  const others = new Set(assets.map((a) => a.symbol).filter((s) => !keySet.has(s))).size;
  return { badges, others };
}

function ago(iso: string) {
  const mins = Math.max(0, Math.round((Date.now() - Date.parse(iso)) / 60000));
  return mins < 1 ? "just now" : `${mins} min ago`;
}

export default function RouteCosts() {
  const [costs, setCosts] = useState<Costs | null>(null);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    fetch("/api/route-costs")
      .then((r) => r.json())
      .then((d) => {
        if (d?.costs) {
          setCosts(d.costs);
          setUpdatedAt(d.updatedAt);
        } else setFailed(true);
      })
      .catch(() => setFailed(true));
  }, []);

  // Cheapest route per column, for the green highlight.
  const best: Record<string, number | undefined> = {};
  if (costs) {
    for (const p of PAIRS) {
      const vals = ROUTES.map((r) => costs[r.id]?.[p.key]).filter((v): v is number => typeof v === "number");
      if (vals.length) best[p.key] = Math.min(...vals);
    }
  }

  return (
    <section className="rc" aria-label="Live route costs">
      <div className="rc-head">
        <h2 className="rc-title">Routes right now</h2>
        <span className="rc-updated">
          {updatedAt ? `Updated ${ago(updatedAt)}` : failed ? "Live costs unavailable right now" : "Checking live costs…"}
        </span>
      </div>

      <div className="rc-table">
        <div className="rc-row rc-row-head">
          <span>Route</span>
          <span className="rc-coins-col">Coins</span>
          {PAIRS.map((p) => (
            <span key={p.key} className="rc-num">{p.label}</span>
          ))}
          <span className="rc-num">Holds funds</span>
        </div>

        {ROUTES.map((r) => {
          const { badges, others } = coinsFor(r.id);
          return (
            <div key={r.id} className="rc-row">
              <span>
                <span className="rc-name">{r.name}</span>
                <span className="rc-type">{r.type}</span>
              </span>
              <span className="rc-coins-col">
                {badges.map((c) => (
                  <span key={c.symbol} className="rc-coin" title={c.symbol} style={{ background: c.bg, color: c.fg }}>
                    {c.letter}
                  </span>
                ))}
                {others > 0 && <span className="rc-more">+{others}</span>}
              </span>
              {PAIRS.map((p) => {
                const v = costs?.[r.id]?.[p.key];
                const isBest = typeof v === "number" && v === best[p.key];
                return (
                  <span key={p.key} className={"rc-num" + (isBest ? " rc-best" : "")}>
                    {costs ? (typeof v === "number" ? `${v.toFixed(1)}%` : "—") : <span className="rc-skel" />}
                  </span>
                );
              })}
              <span className="rc-num rc-holds">{r.holds}</span>
            </div>
          );
        })}
      </div>

      <p className="rc-note">
        Cost is what you pay versus the market price for a 0.01 BTC swap, with every fee included.
        Green marks the cheapest route; a dash means that route couldn&apos;t give a quote just now.
      </p>
    </section>
  );
}
