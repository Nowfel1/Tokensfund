import { CanonicalAsset, NormalizedQuote, QuoteRequest } from "../types";

const CHANGENOW_API_KEY = process.env.CHANGENOW_API_KEY ?? "";
const BASE_URL = "https://api.changenow.io/v1";

export async function getQuote(
  from: CanonicalAsset,
  to: CanonicalAsset,
  req: QuoteRequest
): Promise<NormalizedQuote> {
  if (!CHANGENOW_API_KEY) {
    throw new Error("ChangeNOW API key is not configured");
  }

  const fromTicker = from.providerIds.changenow || from.symbol.toLowerCase();
  const toTicker = to.providerIds.changenow || to.symbol.toLowerCase();

  try {
    const url = `${BASE_URL}/exchange-amount/${req.amount}/${fromTicker}_${toTicker}?api_key=${CHANGENOW_API_KEY}`;

    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`ChangeNOW API error: ${res.status}`);
    }

    const data = await res.json();

    if (data.error || !data.estimatedAmount) {
      throw new Error(data.error || "No quote available from ChangeNOW");
    }

    return {
      provider: "changenow",
      providerLabel: "ChangeNOW",
      expectedOut: Number(data.estimatedAmount),
      estimatedSeconds: 300, // ~5 minutes average
      raw: data,
    };
  } catch (error: any) {
    throw new Error(`ChangeNOW quote failed: ${error.message}`);
  }
}
