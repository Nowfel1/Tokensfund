import { NextResponse } from "next/server";
import { createHmac, randomBytes } from "crypto";

export async function GET() {
  const API_KEY = process.env.CCE_API_KEY ?? "";
  const API_SECRET = process.env.CCE_API_SECRET ?? "";
  const nonce = randomBytes(16).toString("hex");
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const body = "{}";
  const sig = createHmac("sha256", API_SECRET)
    .update(API_KEY + nonce + timestamp + body)
    .digest("hex");

  const res = await fetch("https://cce.cash/api/v1/openapi/coin/list", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Api-Key": API_KEY,
      "X-Api-Nonce": nonce,
      "X-Api-Timestamp": timestamp,
      "X-Api-Signature": sig,
    },
    body,
  });
  const data = await res.json();
  return NextResponse.json(data);
}
