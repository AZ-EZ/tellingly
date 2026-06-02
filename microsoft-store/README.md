# Microsoft Store Submission Package

Prepared on June 2, 2026.

## Can You Sell This Without a Microsoft Phone?

Yes. The Microsoft Store path here is for **Windows 10/Windows 11 PCs**, not Windows Phone. You do not need a Microsoft phone. You should have access to a Windows PC, Windows VM, or a trusted tester on Windows for final install/certification testing.

The fastest package path for Tellingly is a **PWA package**:

1. Keep the Cloudflare app live.
2. Make sure the PWA manifest has PNG icons and the app works offline enough to install cleanly.
3. Reserve the app name in Partner Center.
4. Use PWABuilder with the live URL to generate the Windows package.
5. Upload the generated `.msixbundle`/PWA package in Partner Center.
6. Complete pricing, properties, age ratings, Store listing, privacy URL, and certification.

## Current Live URLs

- App: https://tellingly.zandrews77.workers.dev
- Privacy: https://tellingly.zandrews77.workers.dev/privacy.html
- Support: https://tellingly.zandrews77.workers.dev/support.html

## Files Prepared

- `store-listing-metadata.json`: listing copy, categories, URLs, keywords, pricing recommendation.
- `submission-checklist.md`: step-by-step Partner Center flow.
- `commerce-plan.md`: how to sell without fighting the fact that the web app is public.
- `pwa-package-notes.md`: PWABuilder/package guidance.
- `assets/store/tellingly-store-tile-300.png`: 1:1 Store tile art.
- `assets/store/tellingly-store-screenshot-desktop.png`: desktop Store screenshot.
- `marketing/reels/tellingly-daily-ritual/renders/tellingly-reel.mp4`: optional trailer source.

## Recommended Sales Strategy

Launch the Microsoft Store listing as free, then monetize with `Tellingly Plus`.

Reason: the web app URL is publicly accessible. If the Store app itself is paid while the same app is free on the web, users can feel tricked. A better posture is:

- Free Store install: daily question, live rarity, weekly card, one active comparison link.
- Paid Plus: archive, unlimited comparisons, trait trends, extra packs.

Microsoft Store policy allows non-game PC apps to use either Microsoft in-product purchase APIs or a secure third-party purchase API for digital in-app purchases. If you use third-party billing, disclose it in Partner Center and in-product.

## Official References

- Microsoft Store publishing overview: https://learn.microsoft.com/en-us/windows/apps/publish/
- Developer account onboarding: https://learn.microsoft.com/en-us/windows/apps/publish/partner-center/open-a-developer-account
- Publish a PWA to Microsoft Store: https://learn.microsoft.com/en-us/microsoft-edge/progressive-web-apps/how-to/microsoft-store
- PWA package requirements: https://learn.microsoft.com/en-us/windows/apps/publish/publish-your-app/pwa/app-package-requirements
- PWA Store listing requirements: https://learn.microsoft.com/en-us/windows/apps/publish/publish-your-app/pwa/create-app-store-listing
- Microsoft Store policies: https://learn.microsoft.com/en-us/windows/apps/publish/store-policies
