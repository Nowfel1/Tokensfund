import { SwapStatus } from "../types";

// LEGACY, STATUS-ONLY provider.
// TokensFund routed swaps through ChangeNOW before switching providers in
// July 2026. This module exists so those historical swaps remain trackable —
// it deliberately exposes NO getQuote/buildSwap, so ChangeNOW can never be
// quoted or routed as a live provider. Requires CHANGENOW_API_KEY (the old
// partner key) in the environment.

const API_KEY = process.env.CHANGENOW_API_KEY ?? "";
const BASE = "https://api.changenow.io/v2";

// If "changenow" is added to the ProviderId union in lib/types.ts (the proper
// fix — one word), this cast becomes a no-op. Until then it keeps the legacy
// module compiling without widening the live-provider type.
const PROVIDER = "changenow" as unknown as SwapStatus["provider"];

export async function getStatus(trackingId: string): Promise<SwapStatus> {
  // ChangeNOW transaction ids are 14-char alphanumeric; strip paste debris.
  const id = String(trackingId).trim().replace(/^#+/, "");

  if (!API_KEY) {
    return {
      provider: PROVIDER,
      state: "unknown",
      detail: "Legacy ChangeNOW tracking is not configured (missing API key).",
    };
  }

  let res: Response;
  try {
    res = await fetch(`${BASE}/exchange/by-id?id=${encodeURIComponent(id)}`, {
      headers: { "x-changenow-api-key": API_KEY },
    });
  } catch (e: any) {
    return { provider: PROVIDER, state: "unknown", detail: e?.message ?? "network error" };
  }

  const data: any = await res.json().catch(() => null);

  // TEMPORARY DEBUG: remove once legacy tracking is confirmed working.
  console.log("CHANGENOW status", id, "→", res.status, JSON.stringify(data));

  if (!res.ok || !data) {
    return {
      provider: PROVIDER,
      state: "unknown",
      detail: data?.message
        ? `ChangeNOW: ${data.message}`
        : `ChangeNOW lookup failed (HTTP ${res.status})`,
    };
  }

  const rawStatus = String(data.status ?? "").trim().toLowerCase();

  const map: Record<string, SwapStatus["state"]> = {
    new: "awaiting_deposit",
    waiting: "awaiting_deposit",
    confirming: "deposit_detected",
    exchanging: "processing",
    verifying: "processing",
    sending: "processing",
    finished: "success",
    failed: "failed",
    expired: "failed",
    refunded: "refunded",
  };

  const mapped = map[rawStatus];

  return {
    provider: PROVIDER,
    state: mapped ?? "unknown",
    detail: mapped ? rawStatus : `Unmapped ChangeNOW status: "${rawStatus || "(empty)"}"`,
    outboundTxHash: data.payoutHash || undefined,
  };
}
