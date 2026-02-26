# Tech Stack Overview

This document outlines the technologies, frameworks, libraries, and architectural concepts used throughout the EcoSnap project. It is intended for developers, maintainers, and stakeholders who need a complete picture of the system.

## Core Platforms

- **React Native / Expo**: The application is built using Expo (managed workflow) as indicated by `app.json`, `eas.json`, and various Metro configuration files. Screens and components live under `screens/` and `components/` respectively, using React Native primitives.
- **TypeScript**: All source files use `.tsx`/`.ts` extensions, leveraging static typing for safety and developer productivity. The `tsconfig.json` configures compiler options and path aliases.
- **Node.js / npm**: Dependency management and build tooling are powered by Node.js and npm. The `package.json` file declares dependencies, scripts, and project metadata.

## State & Data Management

- **Supabase**: The backend uses `supabase.ts` for interacting with Supabase services (database, auth, storage). It acts as a hosted PostgreSQL replacement with real-time capabilities.
- **Custom Store**: `snapsStore.tsx` hints at a lightweight client-side store pattern, perhaps using React context or hooks to manage in-app state.
- **Redux / MobX?**: No explicit external state library is visible; the custom store may obviate the need for Redux.

## Navigation & UI

- **React Navigation**: Screens are organized using navigation patterns typical in React Native. Files such as `HomeScreen.tsx`, `MapScreen.tsx` imply stack/tab navigation flows.
- **Components**:
  - `PrimaryButton.tsx`, `Leaderboard.tsx`, `SnapHistory.tsx`, `StreakBadge.tsx`, etc. provide reusable UI building blocks.
  - Assets like icons and images are placed under `assets/`.

## Utilities & Services

- **Supabase Auth**: Authentication flows appear in `auth.tsx` and `demoAuth.tsx` for login and demo mode.
- **Location & Map**: `map.tsx` and `MapScreen.tsx` suggest integration with geolocation and mapping libraries (likely Expo Location / MapView).
- **Camera**: `camera.tsx` and `CameraScreen.tsx` hint at using Expo Camera for capturing snaps.
- **Demo Mode**: Dedicated logic exists (`demoLogin.tsx`, `demoAuth.tsx`, `DemoLoginScreen.tsx`) to simulate or test the app without a real account.

## Tooling & Configuration

- **ESLint**: `eslint.config.js` configures linting rules for consistent code style.
- **Metro config**: `metro.config.js` adjusts bundler behavior for assets and TypeScript.
- **EAS (Expo Application Services)**: `eas.json` is present for building and deploying the app to iOS/Android via Expo.
- **Continuous Integration**: While not in repo, common CI workflows would install dependencies via `npm` and run `expo` commands.

## Architectural Concepts

- **Modular Screens**: Separation between `app/` and `screens/` allows sharing components between web and native targets.
- **Structured Code**: Logical grouping by feature (auth, camera, map, snaps) aids maintainability.
- **Hook-based logic**: Likely heavy use of React hooks to manage state and lifecycle.

## Development Dependencies

The project uses typical development dependencies such as TypeScript, ESLint, Expo CLI, and testing frameworks (if any). These are declared under `devDependencies` in `package.json`.

---
This document can be updated as new technologies are introduced or parts of the stack change.