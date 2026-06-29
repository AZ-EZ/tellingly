# Tellingly Plus App Review Notes

Updated on June 24, 2026.

Use these notes for the v1.1 App Review submission after the binary includes RevenueCat purchase, restore, and entitlement handling.

## Subscription Review Note

Tellingly Plus unlocks the full answer archive, trait trends, unlimited compatibility links, comparison history, and extra question packs. In v1.1, trigger the paywall by answering the daily question, then opening Archive/Trends, or by creating an additional compatibility link. The paywall includes a visible Restore Purchases control.

## Screenshot Requirements

Upload one App Review screenshot for each subscription:

- `app.tellingly.plus.monthly`: paywall screen showing the `$3.99/month` option selected or visible, plus the Restore Purchases control.
- `app.tellingly.plus.annual`: paywall screen showing the `$24.99/year` option selected or visible, plus the Restore Purchases control.

The screenshots must come from the v1.1 iOS binary. Do not upload a mock or website-only screenshot if the submitted binary does not contain the same paywall and restore behavior.

## v1.1 Submission Order

1. Build and upload the signed v1.1 IPA.
2. Capture subscription App Review screenshots from the v1.1 binary.
3. Create the v1.1 App Store Connect version once Apple allows it after the current v1.0 review state changes.
4. Attach the processed v1.1 build.
5. Attach the first subscription to the v1.1 app version before submitting for review.
6. Submit the v1.1 app version and the first subscription together.

The local v1.1 code path now includes the RevenueCat Capacitor SDK, purchase flow, entitlement check, second-comparison-link gate, and visible Restore Purchases control. The RevenueCat `default` offering and iOS public SDK key are configured.
