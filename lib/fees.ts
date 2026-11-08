// TokensFund's own fee — every piece of fee wording on the live site comes
// from this file, so the launch promotion can be ended or extended here.
//
// TO END THE PROMOTION:
//   1. set FEE_PROMO_ACTIVE to false (the wording below switches back to 1%),
//   2. restore the fee settings: in Vercel set THOR_AFFILIATE_BPS=100,
//      CHAINFLIP_COMMISSION_BPS=100 and WAGYU_FEE_PERCENT=1, then set the
//      partner fee back to 1% in the Changee and Wagyu dashboards, and redeploy.
// TO EXTEND IT: change FEE_PROMO_END.

export const FEE_PROMO_ACTIVE = false;
export const FEE_PROMO_END = "January 31, 2027";

// Short label for badges and trust lines.
export const FEE_SHORT = FEE_PROMO_ACTIVE ? "No TokensFund fee" : "Fee at most 1%, in the quote";

// Headline promo line, with the date.
export const FEE_PROMO_LINE = `No TokensFund fee until ${FEE_PROMO_END}`;

// Lower-case phrase for the end of descriptions:
// "Non-custodial, no account, no KYC for standard swaps, <FEE_PHRASE>."
export const FEE_PHRASE = FEE_PROMO_ACTIVE
  ? `no TokensFund fee until ${FEE_PROMO_END}`
  : "fee of at most 1% already in the quote";

// Homepage "how it works" step.
export const FEE_STEP = FEE_PROMO_ACTIVE
  ? "Five routes quoted at once. The best rate wins — and during our launch period there's no TokensFund fee at all."
  : "Five routes quoted at once. The best rate wins, with our fee already included in the number you see.";

// "What does it cost?" answers on pair pages.
export const FEE_ANSWER = FEE_PROMO_ACTIVE
  ? `Nothing from TokensFund until ${FEE_PROMO_END} — during our launch period we charge no fee, so every quote is the provider's own rate. Each provider's own fees and the blockchains' network fees still apply, and they're already reflected in the quote you see.`
  : "Our fee is at most 1%, already included in the quote you see. Each provider's own fees and the blockchains' network fees are reflected in the quote as well.";

// FAQ: "How does TokensFund make money? Do you charge a fee?"
export const FEE_FAQ_ANSWER = FEE_PROMO_ACTIVE
  ? `During our launch period, it doesn't. Until ${FEE_PROMO_END}, TokensFund charges no fee of its own, so every quote you see is the provider's own rate. Providers' fees and network fees still apply and are already reflected in the quote. If we introduce a fee later, it will always be shown inside the quote before you confirm — never added at the end.`
  : "TokensFund charges a fee of at most 1% per swap, and it's already included in the rate you see before you confirm. There's no separate charge added at the end — the quoted output is what you receive, aside from network fees.";

// Terms of service fee clause.
export const FEE_TERMS = FEE_PROMO_ACTIVE
  ? `During our launch promotion, until ${FEE_PROMO_END}, TokensFund charges no fee of its own. Providers' fees and network fees still apply and are reflected in the quote shown to you. If we introduce a fee, it will be shown in the quote before you confirm a swap.`
  : "TokensFund charges a fee of at most 1%, which is already reflected in the quote shown to you.";
