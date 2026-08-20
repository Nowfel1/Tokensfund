import { AggregatedQuotes, NormalizedQuote, ProviderId, QuoteRequest } from "./types";
import { getAsset, providersForPair } from "./assets";
import * as thorchain from "./providers/thorchain";
import * as chainflip from "./providers/chainflip";
import * as cce from "./providers/cce";
import * as changee from "./providers/changee";

// NOTE: NEAR Intents was removed 2026-08-17 (see the header note in
// lib/assets.ts for why). Its provider module has been deleted, so there is
// nothing to import here. The label below is kept because ProviderId still
// includes "near_intents" and historical records may reference it.
const LABELS: Record<ProviderId, string> = {
  thorchain: "THORChain",
  chainflip: "Chainflip",
  near_intents: "NEAR Intents",
  cce: "CCE.Cash",
  changee: "Changee",
};

export async function aggregateQuotes(req: QuoteRequest): Promise<AggregatedQuotes> {
  const fromAsset = getAsset(req.fromAssetId);
  const toAsset = getAsset(req.toAssetId);
  if (!fromAsset || !toAsset) throw new Error("Unknown asset.");
  if (fromAsset.id === toAsset.id) throw new Error("Pick two different assets.");

  // providersForPair reads lib/assets.ts, where every near_intents ref is
  // commented out — so "near_intents" can never appear here. Filtered again
  // anyway so a stray ref can't reintroduce a route that has no module.
  const eligible = providersForPair(fromAsset.id, toAsset.id).filter(
    (p) => p !== "near_intents"
  );

  const settled = await Promise.allSettled(
    eligible.map((p) => {
      if (p === "thorchain") return thorchain.getQuote(fromAsset, toAsset, req);
      if (p === "chainflip") return chainflip.getQuote(fromAsset, toAsset, req);
      if (p === "cce") return cce.getQuote(fromAsset, toAsset, req);
      return changee.getQuote(fromAsset, toAsset, req);
    })
  );

  const quotes: NormalizedQuote[] = settled.map((s, i) => {
    if (s.status === "fulfilled") return s.value;
    return {
      provider: eligible[i],
      providerLabel: LABELS[eligible[i]],
      expectedOut: 0,
      raw: null,
      error: s.reason?.message ?? "Quote failed",
    };
  });

  quotes.sort((a, b) => {
    if (a.error && !b.error) return 1;
    if (!a.error && b.error) return -1;
    return b.expectedOut - a.expectedOut;
  });

  const bestIndex = quotes.findIndex((q) => !q.error && q.expectedOut > 0);
  return { request: req, fromAsset, toAsset, quotes, bestIndex };
}
