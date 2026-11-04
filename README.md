# BURAK Mobile

BURAK is a mobile-first restaurant operations app built with Expo, React Native, TypeScript, and Expo Router. It adapts the restaurant branding and food imagery from the BURAK desktop Figma design for touch-sized screens.

## Run locally

```bash
npx expo start
```

Use `npx expo start --android` or `npx expo start --ios` to open the development app on a configured simulator or device. `npx expo lint` runs linting, and `npx tsc --noEmit` runs the TypeScript check.

## Screens

- **Home:** order totals, pending and completed counts, revenue overview, quick actions, and recent orders.
- **Products:** searchable menu, category filters, availability, product details, and local add/edit flows.
- **Orders:** searchable status filters, customer and payment details, and paused → process → finished actions.
- **Help:** expandable FAQs, contact options, and a support email draft.

## Structure

- `src/app/` — Expo Router tabs and detail/editor routes.
- `src/screens/` — screen implementations.
- `src/components/` — reusable branded UI and native/web tab bars.
- `src/data/` — typed local mock products, orders, customers, and dashboard statistics.
- `src/services/burakRepository.ts` — local data boundary; replace this implementation with API requests when the backend is connected.
- `src/types/` — shared domain models.
- `assets/images/burak/` — locally bundled food and hero imagery from the Figma design.

Product edits and order status changes are kept in memory for the current app session. No backend, database, or authentication is configured.
