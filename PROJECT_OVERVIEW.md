# Project Overview & Concepts

EcoSnap is a mobile application built using Expo and React Native that encourages environmental engagement through photo "snaps" of eco-friendly actions. The app tracks user activity, provides achievements, and displays locations on an interactive map.

## High-Level Purpose

The core idea is to gamify environmental stewardship: users take photos of themselves or surroundings doing green activities (recycling, tree planting, etc.), earn points and badges, and view community progress.

## Key Concepts Used

- **Snap**: A user-generated photo record. Stored in Supabase and displayed in views such as `snaps.tsx` and `snap-detail.tsx`.
- **Achievements and Streaks**: Users earn rewards for consistent usage (`achievements.tsx`, `StreakBadge.tsx`). Achievements are managed through a data model, likely in Supabase.
- **Mapping**: Each snap may be geo-tagged. Map views and the `MapScreen` allow browsing snaps by location.
- **Authentication & Demo Mode**: Real users sign in via Supabase auth; a demo login path (`demoLogin.tsx`, `DemoLoginScreen.tsx`) lets testers explore without accounts.
- **State Management**: A custom store (`snapsStore.tsx`) maintains client state such as current snaps, user info, and app settings.

## File Structure Highlights

- `app/`: Contains web-specific entry points and routing (for Expo Web or other targets).
- `screens/`: Contains native screens shown by React Navigation, each corresponding to a major feature.
- `components/`: Reusable UI fragments used across multiple screens.
- `lib/`: Utility code, including API interaction (`supabase.ts`), demo logic (`demoAuth.tsx`), configuration (`devConfig.ts`), and action creators (`ecoActions.ts`).

## Logic Flow

1. **Startup**: `SplashScreen` checks authentication and navigates to either `Home` or `Auth` flows.
2. **Authentication**: Users log in, after which `snapsStore` loads user-specific data (snaps, achievements).
3. **Home & Map**: The main dashboard presents quick actions and map overview. Users can tap to open camera or view their snaps.
4. **Camera & Snap Submission**: Camera screen captures images, collects optional metadata, and uploads to Supabase. Upon success, state updates propagate to history and map.
5. **Achievements & Stats**: Based on snap data and date logic, achievements are calculated and presented.

---
This document should serve as a reference for developers to understand the purpose and architecture of EcoSnap.