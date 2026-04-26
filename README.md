# myhome

Android React Native app for shared daily life management between trusted small groups.

The app combines shared expenses, notes, calendar events, tasks, notifications, app lock, and deep settings in one private group experience.

## Platform

- Android only
- React Native CLI
- TypeScript
- No Expo
- No iOS project in this repository

## Requirements

- Node.js 22.11 or newer
- npm
- Android Studio
- Android SDK and emulator, or a connected Android device
- React Native Android environment configured

## Install

```sh
npm install
```

## Run

Start Metro:

```sh
npm start
```

In another terminal, build and install the Android app:

```sh
npm run android
```

## Scripts

- `npm start`: starts Metro
- `npm run android`: builds and runs android
- `npm run lint`: runs ESLint
- `npm test`: runs Jest

## Project Structure

```text
src/
  app/ App-level provider wiring, chrome, and tab configuration
  features/ Feature-local screens, components, forms, and sections
  i18n/ Locale resolution, typed translation keys, dictionaries
  shared/
    format/ Locale-aware date, time, and currency formatting helpers
    theme/ Global design tokens and theme composition
    ui/ Small shared UI primitives with real current reuse
  store/ Mock repositories, models, seed data, selectors, store
```

## Architecture Notes

- `src/app/AppShell.tsx` owns app-level provider wiring.
- `src/app/AppChrome.tsx` owns app phase rendering and tab chrome.
- Features live under `src/features/` and keep feature-specific UI local.
- Shared UI is deliberately small: `AppText`, `Button`, `Card`, `Field`, `Screen`, `Section`, `EmptyState`, and `ModalSheet`.
- Theme values live in `src/shared/theme/` as explicit tokens for colors, spacing, typography, radius, borders, elevation, and motion.
- Formatting lives in `src/shared/format/` and reads locale/currency through i18n context.
- Selectors should derive data only. They should not format user-facing values.

## Internationalization

User-facing text should use the i18n layer under `src/i18n/`.

- Supported locales: English and Finnish
- Locale preference: `system`, `en`, or `fi`
- Locale fallback: explicit supported preference, then system locale, then English
- Dates, times, and currency should use `src/shared/format/`
- Seed data stores raw values and product data, not display-ready formatted strings

## Styling Direction

The UI uses a warm graphite foundation, bone-colored surfaces, ember/coral action accents, and green success states. The intent is polished and private, not generic fintech blue and not default React Native starter gray.

Use the shared theme tokens before adding one-off values. Keep screen-specific styles local unless a pattern is already reused across features.

## Branding Status

The current `myhome` name is treated as existing repository branding. Do not rename the app, package, launcher label, or Android package path without an approved branding decision.

Deferred branding files:

- `app.json`
- `android/app/src/main/res/values/strings.xml`
- `android/app/src/main/java/com/myhome/`
- Android launcher icon resources

## Development Rules

- Keep files short and focused.
- Prefer feature-local organization first.
- Do not add shared components without current cross-feature reuse.
- Do not hard-code user-facing strings in screens or components.
- Do not put formatting logic in selectors.
- Do not add iOS files or scripts.
- Do not introduce Expo.

## Verification

Run these before handing off changes:

```sh
npm run lint
npm test
```
