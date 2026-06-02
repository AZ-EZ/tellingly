# Microsoft Store Submission Checklist

## 1. Developer Account

1. Go to https://storedeveloper.microsoft.com.
2. Choose `Get started for free`.
3. Pick Individual or Company.
4. Complete identity/business verification.
5. Open Partner Center and go to `Apps and games`.

Microsoft's current onboarding docs say the new flow has no registration fees for either account type when started through the Store developer site.

## 2. Reserve Product Name

1. In Partner Center, choose `New product`.
2. Select `MSIX or PWA app`.
3. Reserve `Tellingly`.
4. Open `Product management > Product Identity`.
5. Save these values for PWABuilder:
   - Package ID
   - Publisher ID
   - Publisher display name

## 3. Package the PWA

1. Go to https://www.pwabuilder.com.
2. Enter `https://tellingly.zandrews77.workers.dev`.
3. Fix any report-card issues.
4. Choose `Package for Stores`.
5. Select Windows/Microsoft Store.
6. Enter the Partner Center identity values.
7. Download the package archive.

The archive should contain an `.msixbundle` and supporting files.

## 4. Upload Package

1. In Partner Center, open the Tellingly product.
2. Start a submission.
3. Upload the PWABuilder package.
4. Set supported platforms to Windows desktop only unless you intentionally support Xbox/HoloLens.

## 5. Pricing and Availability

Recommended:

- App price: Free.
- Markets: start with United States and other English-speaking markets, or all markets if you are comfortable supporting them.
- Visibility: Public after certification, or private audience for beta.
- Add-on/subscription: Tellingly Plus later.

## 6. Properties

Suggested:

- Category: Lifestyle.
- Secondary category: Social or Entertainment.
- Privacy policy URL: `https://tellingly.zandrews77.workers.dev/privacy.html`.
- Website/support URL: `https://tellingly.zandrews77.workers.dev/support.html`.
- Capabilities: keep minimal. No camera, contacts, microphone, or location.
- Age rating: answer honestly. Because questions can include moral dilemmas and relationship scenarios, start with a conservative teen-friendly rating rather than children-directed positioning.

## 7. Store Listing

Use:

- Description and keywords from `store-listing-metadata.json`.
- Screenshot: `assets/store/tellingly-store-screenshot-desktop.png`.
- Tile icon: `assets/store/tellingly-store-tile-300.png`.
- Optional trailer: `marketing/reels/tellingly-daily-ritual/renders/tellingly-reel.mp4`.

Microsoft requires at least a text description and one screenshot for the Store listing.

## 8. Certification

Before submitting:

- Install the package on a Windows 10/11 machine.
- Confirm it launches as a standalone PWA.
- Answer a question and confirm API calls work.
- Create a comparison link.
- Confirm privacy/support links work.
- Confirm no broken icons/images in the package.

Submit to certification from Partner Center.
