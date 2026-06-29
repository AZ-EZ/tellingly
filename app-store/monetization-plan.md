# Tellingly Monetization Plan

Updated on June 24, 2026.

## Recommendation

Launch the current App Store version as free while it is in review. Do not promise or expose paid unlocks in the live listing until the next binary includes RevenueCat purchase, restore, and entitlement checks.

Use a freemium subscription model for v1.1:

- Free: daily question, live rarity result, weekly share card, and one active compatibility link.
- Plus monthly: `app.tellingly.plus.monthly`, recommended U.S. price `$3.99/month`.
- Plus annual: `app.tellingly.plus.annual`, recommended U.S. price `$24.99/year`, with a 7-day trial only if the paywall is shown after the user has experienced at least three free insights.

## Why This Model

Tellingly's growth loop depends on screenshots and compatibility links, so the viral surface should stay free. The paid tier should monetize accumulated identity value: archive, trends, deeper reads, unlimited comparisons, and extra question packs. That keeps the first-session loop clean while giving heavy users a reason to subscribe after the habit forms.

Avoid ads. Ads dilute the intimate trust signal and make the product feel less private. Avoid a hard paywall before the first rarity result; it would block the moment that makes the app shareable.

## Apple Account Setup Completed

Created in App Store Connect:

- Subscription group: `Tellingly Plus`
- Apple subscription group ID: `22183253`
- Monthly subscription:
  - Reference name: `Tellingly Plus Monthly`
  - Product ID: `app.tellingly.plus.monthly`
  - Apple ID: `6783584502`
  - Duration: 1 month
  - Localization: English (U.S.)
  - Availability: enabled for the U.S. and new territories through `subscriptionAvailability`
  - Starting price: `$3.99` using U.S. price point `eyJzIjoiNjc4MzU4NDUwMiIsInQiOiJVU0EiLCJwIjoiMTAwNDkifQ`
  - Subscription price ID: `eyJhIjoiNjc4MzU4NDUwMiIsImMiOiJVUyIsImQiOjAsInAiOiIwIn0`
  - Review note: added in App Store Connect
  - Status: `Missing Metadata` until the App Review screenshot is uploaded and the first subscription is attached to a v1.1 app version
- Annual subscription:
  - Reference name: `Tellingly Plus Annual`
  - Product ID: `app.tellingly.plus.annual`
  - Apple ID: `6783584539`
  - Duration: 1 year
  - Localization: English (U.S.)
  - Availability: enabled for the U.S. and new territories through `subscriptionAvailability`
  - Starting price: `$24.99` using U.S. price point `eyJzIjoiNjc4MzU4NDUzOSIsInQiOiJVU0EiLCJwIjoiMTAyMDIifQ`
  - Subscription price ID: `eyJhIjoiNjc4MzU4NDUzOSIsImMiOiJVUyIsImQiOjAsInAiOiIwIn0`
  - Review note: added in App Store Connect
  - Status: `Missing Metadata` until the App Review screenshot is uploaded

## Apple Setup Still Needed

Complete these in App Store Connect after the v1.1 binary includes RevenueCat:

- Add App Review screenshots for each subscription showing the in-app paywall and restore control.
- Attach the first subscription to the new app version before submitting v1.1 for review. Apple states the first subscription must be submitted with a new app version.

Do not attach either subscription to the already-submitted free v1.0 review submission. The current binary does not include RevenueCat purchase, restore, or entitlement handling, so attaching subscriptions to that build would create an App Review mismatch.

## RevenueCat Setup

Completed in RevenueCat:

- Project: `Tellingly`
- RevenueCat project URL: `https://app.revenuecat.com/projects/3d0112fc/overview`
- RevenueCat project ID in URL: `3d0112fc`
- App Store app configuration: `Tellingly (App Store)`
- RevenueCat App Store app ID: `app8ebe4ca928`
- Bundle ID: `app.tellingly.ios`
- In-app purchase key: existing key `Z5QJ498GR5`
- Credential status shown by RevenueCat: `Valid credentials`
- Entitlement:
  - ID: `entl783a5b126a`
  - Identifier: `plus`
  - Display name: `Tellingly Plus`
- Monthly product:
  - RevenueCat product ID: `prod9edb54cbf9`
  - Apple product ID / identifier: `app.tellingly.plus.monthly`
  - Display name: `Tellingly Plus Monthly`
  - Type: Subscription
  - Attached entitlement: `plus`
- Annual product:
  - RevenueCat product ID: `prodd34e886f67`
  - Apple product ID / identifier: `app.tellingly.plus.annual`
  - Display name: `Tellingly Plus Annual`
  - Type: Subscription
  - Attached entitlement: `plus`

Target configuration:

- Project/app: Tellingly iOS, bundle ID `app.tellingly.ios`.
- Entitlement ID: `plus`.
- Products:
  - `app.tellingly.plus.monthly`
  - `app.tellingly.plus.annual`
- Offering ID: `default`.
- Packages:
  - Monthly package -> `app.tellingly.plus.monthly`
  - Annual package -> `app.tellingly.plus.annual`

The app should check RevenueCat entitlement `plus`; do not hard-code product IDs as feature gates. Product IDs belong in the paywall/offering layer, while the entitlement controls access.

Current RevenueCat blocker: the live dashboard session was blocked by a Chrome extension overlay while the `default` offering page was open with identifier `default` and display name `Default`. Still needed in RevenueCat after dismissing the overlay:

RevenueCat offering status:

- Offering `default` is created.
- Monthly package `$rc_monthly` maps to `app.tellingly.plus.monthly`.
- Annual package `$rc_annual` maps to `app.tellingly.plus.annual`.
- The production RevenueCat iOS public SDK key for `Tellingly (App Store)` is installed in `public/assets/revenuecat-config.js`.

Implemented locally for the v1.1 binary path:

- Installed `@revenuecat/purchases-capacitor`.
- Synced the plugin into `ios/App/CapApp-SPM/Package.swift`.
- Added the iOS In-App Purchase capability marker to `ios/App/App.xcodeproj/project.pbxproj`.
- Added native-iOS-only RevenueCat configuration, entitlement check, offering fetch, package purchase, and restore purchase flow.
- Added a Plus paywall with monthly/annual plan buttons and a visible `Restore Purchases` control.
- Gated the second compatibility link behind Plus while keeping the first compatibility link free.
- Bumped the iOS project to marketing version `1.1`, build `2`.

Apple blocker:

- App Store Connect rejected creating version `1.1` while the first version `1.0` is still `WAITING_FOR_REVIEW`: `You cannot create a new version of the App in the current state.`
- Full Xcode and `altool` are not available on this Mac, so a signed v1.1 IPA cannot be built/uploaded locally.

## Paid Feature Gates

Gate only features that deepen existing value:

- Full answer archive beyond the current week.
- Trait-axis history and trend lines.
- Unlimited compatibility links.
- Friend comparison history.
- Extra weekend question packs.
- Optional future: private group comparison rooms.

Keep these free:

- Today's question.
- First rarity result.
- Weekly card generation.
- One active compatibility link.
- Basic friend compatibility result.

## Paywall Timing

Best first paywall moments:

- After the third completed daily question.
- After a user opens the weekly card and taps to see historical pattern detail.
- After a user tries to create a second active compatibility link.
- After a friend comparison result, offering deeper divergence analysis.

Avoid showing the paywall before the first answer distribution appears.
