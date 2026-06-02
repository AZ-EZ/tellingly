# Microsoft Store Commerce Plan

## Recommended Model

Use a free Microsoft Store listing with paid `Tellingly Plus`.

## Why Not Charge for the Base App?

The Cloudflare web app is publicly available. If the Microsoft Store app is paid but contains the same public experience, buyers may feel misled. Charging works better when the Store version includes paid-only Windows value, such as:

- Native Windows notifications.
- Offline archive.
- Unlimited comparisons.
- Plus-only question packs.
- Better export/share tools.

## Microsoft Store Policy Implication

Tellingly is a non-game PC product. Microsoft Store policy allows non-game PC apps to use either:

- Microsoft Store in-product purchase APIs, or
- a secure third-party purchase API

for in-app purchases of digital goods/services consumed in the app.

If you use Stripe or another third-party billing provider:

- Identify the commerce provider during checkout.
- Authenticate/confirm the transaction.
- Disclose the use of third-party purchase API in Partner Center.
- Keep metadata clear about price range and terms.

If you use Microsoft Store in-product purchase:

- Create an add-on/subscription in Partner Center.
- Wire the app to Microsoft Store purchase APIs.
- Keep subscription value stable for existing buyers.

## Product IDs

Suggested:

- `tellingly_plus_monthly`
- `tellingly_plus_annual`
- `tellingly_question_pack_weekend`

## Prices

Suggested launch:

- Tellingly Plus monthly: `$3.99`.
- Tellingly Plus annual: `$19.99`.

Use Partner Center price tiers and market-specific pricing.
