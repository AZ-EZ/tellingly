# iOS Wrapper Prep

This folder contains starter Swift files for an iOS shell around the Cloudflare app.

## Why Not Submit a Plain Webview

Apple guideline 4.2 warns against apps that are merely repackaged websites. Before submitting, add native features:

- Daily local notifications.
- Native share sheet for the generated card and compatibility link.
- StoreKit for `Tellingly Plus`.
- In-app privacy/support screens.

## Suggested Xcode Setup

1. In Xcode, create a new iOS App project.
2. Product Name: `Tellingly`.
3. Interface: SwiftUI.
4. Bundle Identifier: `app.tellingly.ios`.
5. Deployment target: choose the lowest iOS version you plan to support.
6. Add `TellinglyApp.swift`, `TellinglyWebView.swift`, `Info.plist`, and `PrivacyInfo.xcprivacy` from this folder to the app target.
7. Replace the default app entry point with `TellinglyApp`.
8. Add App Groups/Keychain only if you introduce account features.
9. Add StoreKit products in App Store Connect before wiring subscriptions.

## Build Notes

The wrapper points at:

`https://tellingly.zandrews77.workers.dev`

Before App Store submission, use your production custom domain, for example:

`https://tellingly.app`
