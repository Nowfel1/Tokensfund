import { AggregatedQuotes, NormalizedQuote, ProviderId, QuoteRequest } from "./types";
import { getAsset, providersForPair } from "./assets";
import * as thorchain from "./providers/thorchain";
import * as chainflip from "./providers/chainflip";
import * as nearIntents from "./providers/nearIntents";

const LABELS: Record<ProviderId, string> = {
  thorchain: "THORChain",
  chainflip: "Chainflip",
  near_intents: "NEAR Intents",
};

export async function aggregateQuotes(req: QuoteRequest): Promise<AggregatedQuotes> {
  const fromAsset = getAsset(req.fromAssetId);
  const toAsset = getAsset(req.toAssetId);
  if (!fromAsset || !toAsset) throw new Error("Unknown asset.");
  if (fromAsset.id === toAsset.id) throw new Error("Pick two different assets.");

  const eligible = providersForPair(fromAsset.id, toAsset.id);

  const settled = await Promise.allSettled(
    eligible.map((p) => {
      if (p === "thorchain") return thorchain.getQuote(fromAsset, toAsset, req);
      if (p === "chainflip") return chainflip.getQuote(fromAsset, toAsset, req);
      return nearIntents.getQuote(fromAsset, toAsset, req);
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

  // Rank: highest expectedOut wins. Failed quotes sink to the bottom.
  quotes.sort((a, b) => (b.error ? -1 : 0) - (a.error ? -1 : 0) || b.expectedOut - a.expectedOut);
  const bestIndex = quotes.findIndex((q) => !q.error && q.expectedOut > 0);

  return { request: req, fromAsset, toAsset, quotes, bestIndex };
}
