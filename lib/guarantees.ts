import type { ProviderId } from "./types";

// TokensFund Guarantee — collateral deposited with TokensFund by exchanger
// providers. If a provider fails to complete a swap made through TokensFund,
// the affected user is compensated from that provider's deposit. Users' own
// funds never pass through TokensFund.
//
// List a provider here ONLY once its deposit has actually arrived. The
// "Guarantee" column appears in the routes table as soon as one entry exists.
// To remove a provider's guarantee (for example if they withdraw it), delete
// or comment out its line.

export interface Guarantee {
  usd: number;    // amount deposited, in US dollars
  asset: string;  // what was deposited, e.g. "USDT"
}

export const GUARANTEES: Partial<Record<ProviderId, Guarantee>> = {
  cce: { usd: 5000, asset: "USDT" },
  changee: { usd: 5000, asset: "USDT" },
  wagyu: { usd: 5000, asset: "USDT" },
};

export function activeGuarantees(): Partial<Record<ProviderId, Guarantee>> {
  const out: Partial<Record<ProviderId, Guarantee>> = {};
  for (const [id, g] of Object.entries(GUARANTEES) as [ProviderId, Guarantee][]) {
    if (g && g.usd > 0) out[id] = g;
  }
  return out;
}

export function formatUsd(usd: number): string {
  return usd >= 1000 ? `$${Math.round(usd / 100) / 10}k` : `$${usd}`;
}
