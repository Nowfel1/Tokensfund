// TokensFund's own fee — every piece of fee wording on the live site comes
// from this file.
//
// TokensFund currently charges NO fee of its own (FEE_FREE = true).
//
// TO CHARGE A FEE AGAIN:
//   1. set FEE_FREE to false (the wording below switches back to "at most 1%"),
//   2. restore the fee settings: in Vercel set THOR_AFFILIATE_BPS=100,
//      CHAINFLIP_COMMISSION_BPS=100 and WAGYU_FEE_PERCENT=1, then set the
//      partner fee back to 1% in the Changee and Wagyu dashboards, and redeploy.

export const FEE_FREE = true;

// Kept under this name because the homepage imports it.
export const FEE_PROMO_ACTIVE = FEE_FREE;

// Short label for badges and trust lines.
export const FEE_SHORT = FEE_FREE ? "No TokensFund fee" : "Fee at most 1%, in the quote";

// Homepage badge.
export const FEE_PROMO_LINE = "No TokensFund fee — you get each provider's own rate";

// Lower-case phrase for the end of descriptions:
// "Non-custodial, no account, no KYC for standard swaps, <FEE_PHRASE>."
export const FEE_PHRASE = FEE_FREE ? "no TokensFund fee" : "fee of at most 1% already in the quote";

// Homepage "how it works" step.
export const FEE_STEP = FEE_FREE
  ? "Five routes quoted at once. The best rate wins — and TokensFund adds no fee on top."
  : "Five routes quoted at once. The best rate wins, with our fee already included in the number you see.";

// "What does it cost?" answers on pair pages.
export const FEE_ANSWER = FEE_FREE
  ? "Nothing from TokensFund — we charge no fee, so every quote is the provider's own rate. Each provider's own fees and the blockchains' network fees still apply, and they're already reflected in the quote you see."
  : "Our fee is at most 1%, already included in the quote you see. Each provider's own fees and the blockchains' network fees are reflected in the quote as well.";

// FAQ: "How does TokensFund make money? Do you charge a fee?"
export const FEE_FAQ_ANSWER = FEE_FREE
  ? "Right now, it doesn't. TokensFund charges no fee of its own, so every quote you see is the provider's own rate. Providers' fees and network fees still apply and are already reflected in the quote. If we ever introduce a fee, it will be shown inside the quote before you confirm — never added at the end."
  : "TokensFund charges a fee of at most 1% per swap, and it's already included in the rate you see before you confirm. There's no separate charge added at the end — the quoted output is what you receive, aside from network fees.";

// Terms of service fee clause.
export const FEE_TERMS = FEE_FREE
  ? "TokensFund currently charges no fee of its own. Providers' fees and network fees still apply and are reflected in the quote shown to you. If we introduce a fee, it will be shown in the quote before you confirm a swap."
  : "TokensFund charges a fee of at most 1%, which is already reflected in the quote shown to you.";
