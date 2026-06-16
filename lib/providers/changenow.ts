const CHANGENOW_API_KEY = process.env.CHANGENOW_API_KEY!;
const BASE_URL = "https://api.changenow.io/v1";

export interface ChangeNowQuote {
  provider: "ChangeNOW";
  from: string;
  to: string;
  amount: string;
  estimatedAmount: number;
  rate: number;
  minAmount: number;
  maxAmount?: number;
}

export async function getChangeNowQuote(
  from: string,
  to: string,
  amount: string
): Promise<ChangeNowQuote | null> {
  try {
    const url = `${BASE_URL}/exchange-amount/${amount}/${from.toLowerCase()}_${to.toLowerCase()}?api_key=${CHANGENOW_API_KEY}`;
    
    const res = await fetch(url);
    if (!res.ok) return null;

    const data = await res.json();

    return {
      provider: "ChangeNOW",
      from,
      to,
      amount,
      estimatedAmount: data.estimatedAmount,
      rate: data.rate,
      minAmount: data.minAmount,
      maxAmount: data.maxAmount,
    };
  } catch (error) {
    console.error("ChangeNOW quote error:", error);
    return null;
  }
}

export async function createChangeNowTransaction({
  from,
  to,
  amount,
  address,
  refundAddress,
  extraId,
}: {
  from: string;
  to: string;
  amount: string;
  address: string;
  refundAddress?: string;
  extraId?: string;
}) {
  const res = await fetch(`${BASE_URL}/transactions/${CHANGENOW_API_KEY}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: from.toLowerCase(),
      to: to.toLowerCase(),
      amount,
      address,
      refundAddress,
      extraId,
    }),
  });

  return res.json();
}

export async function getChangeNowStatus(transactionId: string) {
  const res = await fetch(
    `${BASE_URL}/transactions/${transactionId}/${CHANGENOW_API_KEY}`
  );
  return res.json();
}
