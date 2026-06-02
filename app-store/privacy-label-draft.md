# App Privacy Label Draft

Confirm in App Store Connect after the final iOS build is complete.

## Data Types

| Data Type | Collected | Linked to User | Tracking | Purpose |
| --- | --- | --- | --- | --- |
| User Content / Other Data: answer choices | Yes | No, if no account join is made | No | App Functionality, Product Personalization |
| Identifiers: anonymous local ID hashed server-side | Yes | No | No | App Functionality, fraud/duplicate prevention |
| Contact Info: email | Only if waitlist is enabled and user submits it | Yes | No | Developer Communications |
| Diagnostics | No in current web build | No | No | N/A |
| Location, Contacts, Camera, Microphone, Health, Financial Info | No | No | No | N/A |

## Notes

Do not add analytics, advertising SDKs, or crash reporting SDKs without updating this file, the privacy policy, and App Store Connect privacy answers.

If the iOS app adds StoreKit subscriptions, Apple handles payment details. If you never receive payment information directly, Apple says payment information entered outside your app by a payment service is not collected by you for privacy-label purposes.
