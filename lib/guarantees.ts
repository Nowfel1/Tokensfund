import type { ProviderId } from "./types";

// TokensFund Guarantee — collateral deposited with TokensFund by exchanger
// providers. If a provider fails to complete a swap made through TokensFund,
// the affected user is compensated from that provider's deposit. Users' own
// funds never pass through TokensFund.
//
// List a provider here ONLY once its deposit has actually arrived. Providers
// not listed show a dash in the routes table's "Guarantee" column.
// To remove a provider's guarantee (for example if they withdraw it), delete
// or comment out its line.

export interface Guarantee {
  usd: number;    // amount deposited, in US dollars
  asset: string;  // what was deposited, e.g. "USDT"
}

// No provider has deposited yet (Nov 2026), so every route shows a dash.
// Example once a deposit arrives:  cce: { usd: 5000, asset: "USDT" },
export const GUARANTEES: Partial<Record<ProviderId, Guarantee>> = {};

/** Keep the Guarantee column visible even while every entry is a dash.
 *  Set to false to hide the column entirely. */
export const SHOW_GUARANTEE_COLUMN = true;

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
