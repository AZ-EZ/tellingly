# PWA Package Notes

## Current PWA State

The live app includes:

- `manifest.webmanifest`
- PNG icons at 192 and 512 sizes
- SVG icon fallback
- HTTPS production URL
- Privacy/support pages

## PWABuilder Input URL

```text
https://tellingly.zandrews77.workers.dev
```

## Expected Package Output

PWABuilder's Microsoft Store flow should generate a package archive containing Windows package artifacts, commonly including an `.msixbundle`.

## Values to Paste From Partner Center

After reserving the product name, copy:

- Package ID
- Publisher ID
- Publisher display name

Paste those values into PWABuilder's Windows package form.

## Testing Notes

Final package testing should happen on Windows 10/11:

- Install package.
- Launch from Start menu.
- Confirm standalone app window.
- Confirm `/api/today`, `/api/answer`, and `/api/share` work.
- Confirm privacy/support links open correctly.
- Confirm uninstall works cleanly.

## Domain Upgrade

Before public Store launch, point a production domain such as `tellingly.app` at Cloudflare and update:

- `public/index.html` canonical/social metadata if added.
- `microsoft-store/store-listing-metadata.json`.
- `app-store/app-store-connect-metadata.json`.
- `ios/TellinglyWebView.swift`.
