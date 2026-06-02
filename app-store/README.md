# Tellingly App Store Package

Prepared on June 2, 2026.

## Submission Positioning

Submit as an iOS app named `Tellingly`, category `Lifestyle`, secondary category `Entertainment`, with the subtitle `How rare are you?`

The safest App Store strategy is **not** to submit a webview-only wrapper. Apple guideline 4.2 says apps should have features, content, and UI beyond a repackaged website. The prepared iOS wrapper should add native value before submission: local notification scheduling, native share sheet for cards/links, StoreKit subscription purchase, and offline/local pattern storage.

## Current URLs

- Web app: https://tellingly.zandrews77.workers.dev
- Privacy policy: https://tellingly.zandrews77.workers.dev/privacy.html
- Support URL: https://tellingly.zandrews77.workers.dev/support.html

Before submission, replace `support@tellingly.app` in the public support/privacy pages with a monitored mailbox.

## App Store Connect Fields

Use `app-store-connect-metadata.json` as the source of truth for:

- Name, subtitle, categories, SKU, bundle ID
- Description, keywords, promotional text, what's new
- Privacy/support URLs
- Review notes
- Recommended IAP products

## Monetization

Use a freemium launch:

- Free: daily question, live rarity, weekly card, one active comparison link.
- Tellingly Plus: full archive, trait trends, unlimited comparisons, and extra question packs.

Apple guideline 3.1.1 requires in-app purchase if you unlock digital features or functionality inside the app. Do not link users to an external checkout for these unlocks unless you have and implement the relevant entitlement and storefront-specific rules.

## Privacy Label Draft

Likely App Store privacy answers for this build:

- Data collected: User Content or Other Data for answer choices/comparison-link payloads, Contact Info only if waitlist email is enabled, Identifiers for anonymous hashed device ID.
- Linked to user: No for answer events if no account/email association is created.
- Used for tracking: No.
- Purposes: App Functionality, Product Personalization, Developer Communications for waitlist email only.

Confirm these answers against the final iOS build and any analytics, payment, or SDKs you add.

## Screenshot Set

Apple currently allows 1-10 screenshots and accepts high-resolution iPhone sizes. For the iPhone 6.9-inch display, prepare portrait screenshots at one accepted size such as `1320 x 2868`, `1290 x 2796`, or `1260 x 2736` pixels. Add iPad screenshots only if the app supports iPad.

Suggested screenshots:

1. Daily question with two answers visible.
2. Live distribution after a tap.
3. Rarity and micro-read panel.
4. Weekly pattern card.
5. Friend compatibility result.

## Official References Checked

- Apple Developer Program membership and TestFlight: https://developer.apple.com/programs/
- App Store Connect metadata and support/privacy URL requirements: https://developer.apple.com/help/app-store-connect/reference/app-information
- Version metadata limits: https://developer.apple.com/help/app-store-connect/reference/platform-version-information
- Screenshots and app previews: https://developer.apple.com/help/app-store-connect/manage-app-information/upload-app-previews-and-screenshots
- Screenshot specifications: https://developer.apple.com/help/app-store-connect/reference/app-information/screenshot-specifications/
- App privacy details: https://developer.apple.com/app-store/app-privacy-details/
- App Review Guidelines: https://developer.apple.com/app-store/review/guidelines/
- Privacy manifest files: https://developer.apple.com/documentation/bundleresources/privacy-manifest-files
