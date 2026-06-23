# Tellingly Apple Submission Runbook

Prepared on June 22, 2026.

## Current Status

The Cloudflare web app is live and App Store metadata has been prepared, but this machine cannot submit the app yet.

Local blockers found:

- Full Xcode is not installed/selected. `xcodebuild -version` reports that only Command Line Tools are active.
- `xcrun altool` is not available.
- Apple Transporter is not installed.
- No App Store Connect API key is present in the workspace.
- The `ios/` folder contains Swift starter files, not a complete signed Xcode archive.

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

### 1. Install/Select Full Xcode

Install Xcode from the Mac App Store or Apple Developer downloads.

Then:

```bash
sudo xcode-select -s /Applications/Xcode.app/Contents/Developer
xcodebuild -version
```

### 2. Create a Real Xcode Project

Use Xcode to create an iOS SwiftUI app:

- Product Name: `Tellingly`
- Bundle ID: `app.tellingly.ios`
- Team: your Apple Developer team
- Interface: SwiftUI

Add:

- `ios/TellinglyApp.swift`
- `ios/TellinglyWebView.swift`
- `ios/Info.plist`
- `ios/PrivacyInfo.xcprivacy`

Before submission, add native functionality beyond a plain webview:

- Daily local notifications.
- Native share sheet for cards/comparison links.
- In-app privacy/support screens.
- StoreKit purchase flow if selling Plus.

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

### 5. Submit For Review

In App Store Connect:

1. Select the processed build.
2. Complete privacy, age rating, pricing, and export compliance.
3. Add screenshots.
4. Paste review notes.
5. Submit for review.

## Rejection Risk To Address First

Apple App Review guideline 4.2 can reject apps that are merely websites wrapped as apps or have limited functionality. Tellingly should not be submitted as a webview-only shell. Add native notifications/share/StoreKit before review.

## Official References

- Create app record: https://developer.apple.com/help/app-store-connect/create-an-app-record/add-a-new-app/
- Upload builds: https://developer.apple.com/help/app-store-connect/manage-builds/upload-builds/
- Submit an app: https://developer.apple.com/help/app-store-connect/manage-submissions-to-app-review/submit-an-app/
- App Review Guidelines: https://developer.apple.com/app-store/review/guidelines/
- App Store Connect API: https://developer.apple.com/documentation/appstoreconnectapi
