# Tellingly Plus App Review Notes

Updated on June 24, 2026.

Use these notes for the fixed `1.0` App Review resubmission after the binary includes RevenueCat purchase, restore, and entitlement handling.

## Subscription Review Note

Tellingly Plus unlocks the full answer archive, trait trends, unlimited compatibility links, comparison history, and extra question packs. In the fixed `1.0` build, trigger the paywall by answering the daily question, creating one free compatibility link, then tapping Compare again. The paywall includes a visible Restore Purchases control.

## Screenshot Requirements

Upload one App Review screenshot for each subscription:

- `app.tellingly.plus.monthly`: paywall screen showing the `$3.99/month` option selected or visible, plus the Restore Purchases control.
- `app.tellingly.plus.annual`: paywall screen showing the `$24.99/year` option selected or visible, plus the Restore Purchases control.

The screenshots must come from the fixed `1.0` iOS binary. Do not upload a mock or website-only screenshot if the submitted binary does not contain the same paywall and restore behavior.

## Fixed 1.0 Submission Order

1. Build and upload the signed `1.0` IPA with build number `2`.
2. Capture subscription App Review screenshots from the fixed `1.0` binary.
3. Attach the processed build `2` to the existing rejected `1.0` App Store version.
4. Attach the first subscription to the `1.0` app version before resubmitting for review.
5. Submit the fixed `1.0` app version and the first subscription together.

The local fixed `1.0` code path now includes the RevenueCat Capacitor SDK, purchase flow, entitlement check, second-comparison-link gate, and visible Restore Purchases control. The RevenueCat `default` offering and iOS public SDK key are configured.
