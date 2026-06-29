# Codemagic Build Workaround

Use this when this Mac cannot install/select the current App Store Xcode toolchain.

Codemagic can build Tellingly from GitHub on hosted Macs with Xcode 26 and upload the IPA to App Store Connect/TestFlight.

## Prepared Files

- `codemagic.yaml`
- `ios/App/App.xcodeproj/xcshareddata/xcschemes/App.xcscheme`
- `ios/App/App.xcodeproj`
- `app-store/app-icon-1024.png`
- `app-store/screenshots-6-9/`

The workflow:

1. Installs npm dependencies.
2. Runs `npm run ios:sync`.
3. Applies App Store signing profiles.
4. Builds an IPA with Xcode 26.
5. Uploads the IPA to App Store Connect using a Codemagic integration.

## One-Time Codemagic Setup

1. Create or repair GitHub repo `AZ-EZ/tellingly`.
2. Push `main`.
3. Open `https://codemagic.io`.
4. Sign in with GitHub.
5. Add repository `AZ-EZ/tellingly`.
6. Choose the `codemagic.yaml` workflow.
7. In Codemagic Team settings, open `Integrations` -> `Developer Portal`.
8. Use the existing App Store Connect API key integration:

```text
finite-time-app-store-connect
```

## App Store Connect API Key

Use an App Store Connect key with `App Manager` access.

Codemagic needs:

- `.p8` file
- Key ID
- Issuer ID

There is a local key candidate in Downloads:

```text
/Users/AZ/Downloads/AuthKey_QFNB8X5Y29.p8
```

Do not commit this key to git.

## Code Signing

In Codemagic, after the App Store Connect integration exists:

1. Open `Team settings` -> `codemagic.yaml settings` -> `Code signing identities`.
2. Generate or fetch an `Apple Distribution` certificate.
3. Fetch or create an App Store provisioning profile for:

```text
app.tellingly.ios
```

The workflow uses the existing `finite-time-app-store-connect` App Store Connect integration and this signing block:

```yaml
ios_signing:
  distribution_type: app_store
  bundle_identifier: app.tellingly.ios
```

## Start Build

1. Open the `tellingly` app in Codemagic.
2. Select workflow `Tellingly iOS TestFlight`.
3. Start build on branch `main`.
4. When it succeeds, open App Store Connect -> Tellingly -> TestFlight.
5. Confirm uploaded build `1.0 (2)` shows `Complete`.
6. If Apple asks for encryption compliance, answer that the app does not implement proprietary or standard encryption algorithms itself.
7. For App Store review, open App Store Connect -> Tellingly -> Distribution -> iOS App Version 1.0.
8. In the `Build` section, select build `1.0 (2)`, not the older build `1`.

## Current Blocker

The GitHub repo exists and `main` is pushed. App Store Connect still shows only the old build `1`, so the next blocker is starting the Codemagic hosted build for `main` and letting it upload build `1.0 (2)`.

This Mac cannot perform the local upload because `xcodebuild` is pointed at Command Line Tools instead of full Xcode, and no Codemagic API token/CLI is available in the shell.
