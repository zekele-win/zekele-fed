# Zekele Fed

Real-time FOMC rate change probabilities, derived from CME FedWatch.
No account, no refresh, fast and lightweight.

## What it does

- Displays market-implied probabilities for the next FOMC rate decision
- Data is derived from CME interest rate futures pricing
- Automatically updates during market hours

## Why Zekele Fed

- Real-time updates (no manual refresh)
- Fast parsing (HTML parsing optimized, ~4ms per run)
- Clean UI (focused on probabilities, not clutter)
- No paid API (data fetched from public CME FedWatch page)

## Key Features

- Cut / Hold / Hike probabilities
- Countdown to next FOMC meeting
- Last update time (market-based)
- Multi-language support (i18n)
- Server-side caching via Cloudflare KV

## Tech Stack

- SvelteKit
- Cloudflare Workers + KV
- Scheduled Worker (cron)
- No client-side polling
- No external paid APIs

## Notes

- Data updates only when CME futures market is active
- Not financial advice

## License

MIT
