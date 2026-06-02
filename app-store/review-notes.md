# App Review Notes

Tellingly is a daily identity ritual. It asks one short question, records an anonymous answer event, shows the live aggregate distribution, and gives the user a short behavioral read.

No account is required.

## How to Review

1. Launch the app.
2. Tap any answer on the daily question.
3. Confirm the live distribution and rarity read appear.
4. Continue through the five-question set.
5. On the final screen, download the share card or create a comparison link.

## Data and Privacy

- Answer events are stored in Cloudflare D1 as aggregate tallies.
- The anonymous device ID is hashed server-side with the Worker secret `ANSWER_SALT`.
- The user's longer-running profile map stays local unless the user creates a comparison link.
- Comparison links store the minimum answers needed for a friend comparison and expire after 30 days.
- No camera, contacts, microphone, location, health data, or social login are used.
- No third-party ads are used.

## Native Functionality To Add Before Submission

This package includes SwiftUI wrapper prep files, but the final App Store binary should include native functionality to avoid a minimum-functionality rejection:

- Local notification scheduling for the daily question.
- Native share sheet for card image and comparison link.
- StoreKit IAP for Plus unlocks, if monetized.
- In-app support/privacy access.
