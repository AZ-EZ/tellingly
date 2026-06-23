# Tellingly Apple Submission Runbook

Prepared on June 22, 2026.

## Current Status

The Cloudflare web app is live, a real Capacitor iOS project now exists, and App Store metadata/assets have been prepared.

Cloudflare production URL:

- https://tellingly.zandrews77.workers.dev

Local git status:

- Submission package committed locally in commit `0979ee8`.
- Configured GitHub remote: `https://github.com/AZ-EZ/tellingly.git`.
- Push is blocked because GitHub returns `Repository not found`.
- The GitHub connector also returned 404 for `AZ-EZ/tellingly`.
- GitHub CLI (`gh`) is not installed on this Mac, so repo creation could not be completed locally.
- Chrome opened `https://github.com/new`, but GitHub requested sign-in.

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

Native app behavior has been added to reduce webview-only review risk:

- iOS native share sheet for comparison links through Capacitor Share.
- iOS local notification scheduling for the daily reminder through Capacitor Local Notifications.

Local blockers found:

- Full Xcode is not installed/selected. `xcodebuild -version` reports that only Command Line Tools are active.
- `xcrun altool` is not available.
- Apple Transporter is not installed.
- No App Store Connect API key is present in the workspace.
- No signed `.xcarchive` has been created or uploaded.

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
tellingly-app-store-connect
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

## Official References

- Create app record: https://developer.apple.com/help/app-store-connect/create-an-app-record/add-a-new-app/
- Upload builds: https://developer.apple.com/help/app-store-connect/manage-builds/upload-builds/
- Submit an app: https://developer.apple.com/help/app-store-connect/manage-submissions-to-app-review/submit-an-app/
- App Review Guidelines: https://developer.apple.com/app-store/review/guidelines/
- App Store Connect API: https://developer.apple.com/documentation/appstoreconnectapi
