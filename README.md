# Tellingly

One sharp question a day. Answer in one tap, see the live distribution, get a rarity read, and compare with a friend.

Live app:

https://tellingly.zandrews77.workers.dev

## What Is Built

- Cloudflare Worker with Static Assets.
- Cloudflare D1 database for answer tallies, share tokens, and waitlist emails.
- Dependency-free frontend app in `public/`.
- Daily deterministic five-question deck.
- Live answer distributions using seeded population counts plus real D1 increments.
- Local private pattern map.
- 30-day expiring comparison links.
- Downloadable share card.
- Public privacy and support pages.
- App Store prep files.
- Marketing launch package and rendered vertical reel.

## Key Commands

```bash
npm install
npm run dev
npm run db:migrate:remote
npm run deploy
npm run reel:lint
npm run reel:inspect
npm run reel:render
```

## Cloudflare

The production D1 database is `tellingly-prod`:

```text
8e7a00bd-b47a-40e6-ab01-485b0815dd3f
```

The Worker secret `ANSWER_SALT` is set in Cloudflare and used to hash anonymous local device IDs before answer events are stored.

## Reel

Rendered video:

`marketing/reels/tellingly-daily-ritual/renders/tellingly-reel.mp4`

Specs verified:

- H.264
- 1080 x 1920
- 15 seconds

## App Store

Start with:

- `app-store/README.md`
- `app-store/app-store-connect-metadata.json`
- `app-store/privacy-label-draft.md`
- `app-store/review-notes.md`
- `ios/README.md`

Before submission, replace placeholder support email/domain values with production contact details and add native iOS value beyond a webview shell.

## Microsoft Store

Start with:

- `microsoft-store/README.md`
- `microsoft-store/submission-checklist.md`
- `microsoft-store/store-listing-metadata.json`
- `microsoft-store/commerce-plan.md`
- `microsoft-store/pwa-package-notes.md`

The recommended Windows path is a PWA package through PWABuilder and Partner Center. You do not need a Microsoft phone; this is for Windows 10/11 users.

## GitHub

The local initial commit is ready. See `GITHUB_PUBLISH.md` for the one remaining step: creating `AZ-EZ/tellingly` on GitHub or providing a GitHub CLI/token path so this checkout can push.
