# Tellingly Apple Submission Runbook

Prepared on June 22, 2026. Updated on June 29, 2026.

## Current Status

The Cloudflare web app is live, a real Capacitor iOS project exists, the App Store Connect app record exists, the iOS build has been uploaded, the App Store product-page metadata/screenshots have been submitted through the App Store Connect API, and the app has been submitted to Apple for review.

Cloudflare production URL:

- https://tellingly.zandrews77.workers.dev

Current App Store Connect status as of June 29, 2026:

- App Store Connect app ID: `6783204675`.
- Bundle ID: `app.tellingly.ios`.
- Version ID: `73e35076-21af-4f5d-bbb8-1b3875362a91`.
- Review submission ID: `00365c45-f3d9-4c75-95fd-d23b40f7ff9b`.
- Localization ID: `05631e3d-c3fc-4879-b034-ee5d5817754b`.
- Screenshot set ID: `114b7841-43e0-431f-a26b-0195db03bab9`.
- Selected build ID: `c215a2f0-5dab-4a57-bff1-aafe0cef3a43`.
- App Review detail ID: `5e249c35-5302-45a7-a65c-39062148a5f6`.
- State: `REJECTED`.
- Submitted for review: `2026-06-24T01:38:03.585Z`.
- Export compliance: cleared; the build declares no non-exempt encryption.
- Product-page metadata: description, keywords, promotional text, support URL, marketing URL, copyright, release type, and IDFA flag are set.
- Screenshots: five iPhone screenshots are uploaded and verified as `COMPLETE`.
- App Review detail: contact name, phone, email, review notes, and `demoAccountRequired=false` are set.

Prior App Store Connect submission status:

- Review submission `00365c45-f3d9-4c75-95fd-d23b40f7ff9b` exists and includes review submission item `MDAzNjVjNDUtZjNkOS00Yzc1LTk1ZmQtZDIzYjQwZjdmZjlifDZ8ODg3MzE5Mjg0`.
- The iOS version `73e35076-21af-4f5d-bbb8-1b3875362a91` now reports `REJECTED`.
- The review submission itself now reports `UNRESOLVED_ISSUES`; the review submission item reports `REJECTED`.
- Content rights were patched to `DOES_NOT_USE_THIRD_PARTY_CONTENT`.
- Primary category was patched to `LIFESTYLE`.
- Age rating was patched with all required content attributes set to `NONE` or `false`.
- Pricing was set to free (`$0.00`) in App Store Connect's Pricing and Availability UI; the subsequent API attach succeeded.
- The final App Store Connect UI submission succeeded; the page confirmed `Your submission has been submitted to App Review`, `1 Item Submitted`, and `Waiting for Review`.
- Latest API verification: `/v1/reviewSubmissions/00365c45-f3d9-4c75-95fd-d23b40f7ff9b` is `UNRESOLVED_ISSUES`; `/v1/appStoreVersions/73e35076-21af-4f5d-bbb8-1b3875362a91` is `REJECTED`.

Prepared files:

- `codemagic.yaml` hosted build/upload workflow.
- `ios/App/App.xcodeproj` native iOS project.
- `ios/App/App.xcodeproj/xcshareddata/xcschemes/App.xcscheme` shared Xcode scheme.
- `capacitor.config.json` with bundle ID `app.tellingly.ios`.
- `app-store/app-icon-1024.png`.
- `app-store/screenshots-6-9/` with five 6.9-inch iPhone screenshots.
- `app-store/app-store-connect-metadata.json`.
- `app-store/review-notes.md`.
- `app-store/privacy-label-draft.md`.
- `ios/App/App/PrivacyInfo.xcprivacy`.
- `fastlane/` App Store metadata/screenshot package.
- `scripts/app-store-connect-submit.mjs` for API-based metadata/build/review-detail updates.
- `scripts/app-store-upload-screenshots.mjs` for API-based screenshot upload.
- `app-store/monetization-plan.md` with subscription account setup status.
- `app-store/subscription-review-notes.md` with the prepared fixed `1.0` subscription review note and screenshot checklist.

Native app behavior has been added to reduce webview-only review risk:

- iOS native share sheet for comparison links through Capacitor Share.
- iOS local notification scheduling for the daily reminder through Capacitor Local Notifications.

Historical local blockers that were worked around:

- Full Xcode is not installed/selected.
- `xcrun altool` is not available.
- Apple Transporter is not installed.
- Browser automation against App Store Connect is unreliable because Chrome can block automation when an extension popup is active.
- Codemagic and the App Store Connect API were used instead for build upload and listing updates.

## Apple Requirements To Finish Submission

Apple requires:

1. A registered Apple Developer Program account.
2. An App Store Connect app record.
3. A bundle ID such as `app.tellingly.ios`.
4. Signing certificates/profiles or automatic signing through Xcode.
5. A signed `.xcarchive` uploaded through Xcode, Transporter, or App Store Connect API tooling.
6. App privacy answers, screenshots, age rating, pricing/availability, export compliance, and review notes.

## Safest Credential Path

Do not paste an Apple ID password into this repo or chat.

Use one of these:

- Sign in locally in Xcode with the Apple ID that owns the developer account.
- Or create an App Store Connect API key and place it outside git:
  - Key ID
  - Issuer ID
  - Private `.p8` key file

Add `.p8` files to `.gitignore` before use.

## Recommended Submission Path

### 0. Create/Repair GitHub Remote

Create an empty repository named `tellingly` under the `AZ-EZ` GitHub account or update `origin` to the correct repository URL.

Then push:

```bash
git push origin main
```

### 0.5. Use Codemagic Hosted Build

This mirrors the Finite app workaround. See `app-store/codemagic-build-workaround.md`.

Codemagic workflow file:

```text
codemagic.yaml
```

Expected integration name:

```text
finite-time-app-store-connect
```

### 1. Install/Select Full Xcode

Install Xcode from the Mac App Store or Apple Developer downloads.

Then:

```bash
sudo xcode-select -s /Applications/Xcode.app/Contents/Developer
xcodebuild -version
```

### 2. Open The Prepared Xcode Project

Open:

```bash
open ios/App/App.xcodeproj
```

In Xcode:

- Select the `App` target.
- Set Team to the Apple Developer team.
- Confirm bundle ID `app.tellingly.ios`.
- Confirm display name `Tellingly`.
- Let Xcode repair signing if prompted.

The original Swift starter files were moved to `ios-starter/` for reference. The submit-ready project is the Capacitor project in `ios/App/`.

### 3. Create App Record In App Store Connect

Use:

- `app-store/app-store-connect-metadata.json`
- `app-store/review-notes.md`
- `app-store/privacy-label-draft.md`

### 4. Archive and Upload

In Xcode:

1. Select `Any iOS Device`.
2. Product > Archive.
3. Distribute App.
4. App Store Connect.
5. Upload.

Alternative: upload an exported archive with Transporter after installing it from Apple.

Command-line upload can be added later with an App Store Connect API key, but do not commit the `.p8` private key.

### 5. Submit For Review

In App Store Connect:

1. Select the processed build.
2. Complete privacy, age rating, pricing, and export compliance.
3. Add screenshots.
4. Paste review notes.
5. Submit for review.

## Rejection Risk To Address First

Apple App Review guideline 4.2 can reject apps that are merely websites wrapped as apps or have limited functionality. Tellingly now includes native share and local notification hooks, but a future Plus release should add StoreKit subscriptions inside the iOS build if the app is sold with paid features.

## Current Submission Status

As of June 29, 2026, the App Store review submission is rejected with unresolved issues:

- Review submission ID: `00365c45-f3d9-4c75-95fd-d23b40f7ff9b`
- App Store version ID: `73e35076-21af-4f5d-bbb8-1b3875362a91`
- App Store Connect state: `REJECTED`
- Submitted date: `2026-06-24T01:38:03.585Z`

TestFlight status:

- Build ID: `c215a2f0-5dab-4a57-bff1-aafe0cef3a43`
- Build processing state: `VALID`
- Internal group: `Tellingly Internal`
- Internal group ID: `4cdada8a-6d38-468f-b7f3-58eb7796555b`
- Internal tester invited: `zandrews77@hotmail.com`
- External group: `Tellingly Testers`
- External group ID: `6a590cb2-d74e-4306-9e43-ad613cc0b23a`
- External beta review state: `WAITING_FOR_BETA_REVIEW`

External TestFlight emails cannot be sent until Apple approves beta review. Once approved, retry the beta tester invitation for `zandrews77@hotmail.com`.

Subscription setup status for the fixed `1.0` resubmission:

- Subscription group: `Tellingly Plus`, group ID `22183253`.
- Monthly subscription: `app.tellingly.plus.monthly`, Apple ID `6783584502`.
- Annual subscription: `app.tellingly.plus.annual`, Apple ID `6783584539`.
- Availability: set for both subscriptions with `availableInNewTerritories=true`.
- Starting prices: monthly `$3.99`; annual `$24.99`.
- Product-level subscription review notes: added to both subscriptions in App Store Connect.
- Local fixed `1.0` code now includes the RevenueCat Capacitor SDK, native-iOS-only paywall, purchase flow, entitlement check, and Restore Purchases control.
- Local fixed `1.0` native config now bundles the app assets inside the iOS binary instead of loading the Cloudflare website through `server.url`; the native app calls Cloudflare only for `/api/*`.
- RevenueCat `default` offering is configured with `$rc_monthly` -> `app.tellingly.plus.monthly` and `$rc_annual` -> `app.tellingly.plus.annual`.
- The RevenueCat iOS public SDK key is installed locally and deployed to Cloudflare.
- The iOS project is set to marketing version `1.0`, build `2`, because App Store Connect will not create `1.1` while the first `1.0` version is rejected.
- Latest Cloudflare deployment with the SDK key and native API-base fix: `a6bd28bc-04b0-410d-bb6f-75fbcbb18cb1`.
- Still needed before resubmission: build and upload the signed `1.0` build `2` IPA, upload App Review screenshots showing the real paywall, attach the first subscription to the existing rejected `1.0` app version, and resubmit.
- The rejected v1.0 submission should be resolved with a new build that contains the bundled app shell and RevenueCat paywall. The exact Resolution Center rejection text was not available through the App Store Connect API.

## Official References

- Create app record: https://developer.apple.com/help/app-store-connect/create-an-app-record/add-a-new-app/
- Upload builds: https://developer.apple.com/help/app-store-connect/manage-builds/upload-builds/
- Submit an app: https://developer.apple.com/help/app-store-connect/manage-submissions-to-app-review/submit-an-app/
- App Review Guidelines: https://developer.apple.com/app-store/review/guidelines/
- App Store Connect API: https://developer.apple.com/documentation/appstoreconnectapi
