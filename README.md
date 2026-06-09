# tokensfund.xyz — cross-chain swap aggregator

Non-custodial cross-chain swaps. One request is quoted across **THORChain**,
**Chainflip**, and **NEAR Intents** in parallel; the best route wins; the user
sends to a one-time deposit address and receives at their own wallet. Your site
never holds funds.

## How it works

All three protocols share one model, which is what makes aggregation clean:

1. **Quote** — ask each protocol what you'd receive for a given input.
2. **Open a deposit address** — the chosen protocol returns a one-time address
   (THORChain: an inbound vault address + a memo; Chainflip: a deposit channel;
   NEAR Intents: a 1Click deposit address).
3. **User sends** the source asset to that address.
4. **Protocol delivers** the destination asset to the user's address, or refunds.

```
 Browser (SwapTerminal)
        │  POST /api/quote
        ▼
  Aggregator ──┬─► THORChain   (THORNode REST)
               ├─► Chainflip   (@chainflip/sdk)
               └─► NEAR Intents (1Click REST)
        │  ranks by best output
        ▼
  POST /api/swap  → opens deposit address with the chosen protocol
  GET  /api/status → polls progress
```

API keys and CORS-restricted calls live in the server-side API routes, never in
the browser.

## Project layout

| Path | Purpose |
|------|---------|
| `lib/assets.ts` | Canonical asset registry → per-protocol identifiers. **Expand this to add pairs.** |
| `lib/providers/*.ts` | One adapter per protocol (`getQuote`, `buildSwap`, `getStatus`). |
| `lib/aggregator.ts` | Fans out to eligible providers, normalizes, ranks. |
| `app/api/quote` / `swap` / `status` | Server endpoints. |
| `components/SwapTerminal.tsx` | The swap UI + quote race. |

## Run locally

```bash
cp .env.example .env.local   # fill in keys (all optional to start)
npm install
npm run dev                  # http://localhost:3000
```

Everything works with **zero keys** to start. Keys add revenue / remove fees:

- **NEAR Intents** — register at https://partners.near-intents.org for a JWT and
  set `NEAR_1CLICK_JWT` to skip the 0.2% no-key fee.
- **THORChain** — register a THORName, set `THOR_AFFILIATE` + `THOR_AFFILIATE_BPS`
  to earn affiliate fees.
- **Chainflip** — run a broker and set `CHAINFLIP_BROKER_URL` +
  `CHAINFLIP_COMMISSION_BPS` to collect commission.

## Deploy to tokensfund.xyz

**Option A — Vercel (simplest):**
1. Push this folder to a GitHub repo.
2. Import it at vercel.com → it auto-detects Next.js.
3. Add the env vars from `.env.example` in Project Settings → Environment Variables.
4. Project Settings → Domains → add `tokensfund.xyz`. Vercel shows you the DNS
   records (an `A`/`ALIAS` for the apex and a `CNAME` for `www`) to set at your
   registrar. Add them; HTTPS is issued automatically.

**Option B — your own server / VPS:**
```bash
npm install && npm run build
npm run start            # serves on :3000
```
Put Nginx/Caddy in front for TLS and proxy `tokensfund.xyz` → `127.0.0.1:3000`.

## Things to verify before going live

- **No testnet for NEAR Intents** — test with tiny real amounts.
- **Refresh NEAR `assetId`s** from `GET https://1click.chaindefuser.com/v0/tokens`;
  the ones in `lib/assets.ts` are seed examples.
- **THORChain memos are mandatory** — a deposit without the returned memo is
  refunded. On Bitcoin the memo goes in an OP_RETURN output; for EVM ERC20s use
  the returned router contract's `depositWithExpiry`.
- **Decimals differ per protocol** — THORChain quotes everything in 1e8; the
  registry tracks each asset's real decimals. Double-check any new asset.
- **Status polling** for THORChain needs the user's inbound tx hash
  (`/thorchain/tx/status/{hash}`); wire that in when you add a confirmation step.
- **Regulatory note** — operating a swap/exchange front end can carry licensing
  or registration obligations depending on where you and your users are. Worth a
  quick check with someone who knows your jurisdiction before you take volume.

This is an MVP scaffold: real integrations, clean architecture, room to grow.
Add wallet connection (send the deposit tx directly from the user's wallet),
more assets, price-in-USD display, and a live status screen next.
