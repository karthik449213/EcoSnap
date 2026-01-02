# EcoSnap Demo Mode - Quick Start

## Installation

```bash
# Install dependencies (Zustand is now included)
npm install
# or
yarn install
```

## Running the App

```bash
# Start development server
npm start
# or
yarn start
```

## First Time Setup

1. **Select Platform**
   - Press `i` for iOS
   - Press `a` for Android
   - Press `w` for Web

2. **Allow Permissions**
   - Accept camera permissions when prompted
   - Accept location permissions when prompted

3. **Select Demo User**
   - Welcome screen shows "Select Demo User"
   - Tap to see the 5 demo users
   - Tap a user to log in

## Available Demo Users

Quick access emails for testing:
- **alex@ecosnap.app** (8,500 points, 42 day streak) 🟢
- **jordan@ecosnap.app** (7,200 points, 28 day streak) 🌍
- **sam@ecosnap.app** (9,100 points, 55 day streak) 🌿
- **casey@ecosnap.app** (6,800 points, 21 day streak) ♻️
- **river@ecosnap.app** (12,300 points, 73 day streak) 💧

## Testing Camera Feature

1. Tap **"Snap Eco Action"** on home screen
2. Grant camera permission when prompted
3. Tap **📷** to capture a photo
4. View preview and confirm
5. (Demo: photo stays local, no upload)

## Switching Users

1. Tap **"Switch User"** button in top-right corner
2. Select a different demo user from the list
3. Home screen updates with new user's data

## Features to Explore

✅ **Home Screen** - User stats and streak tracking
✅ **Camera** - Photo capture (works offline)
✅ **Map** - Recycling locations with markers
✅ **Achievements** - Mock achievement system
✅ **Navigation** - Bottom tab navigation
✅ **Dark/Light Mode** - System theme support

## Troubleshooting

### Camera Not Opening
- Check that camera permissions are granted
- Try switching users and back
- Restart the app

### Map Not Showing
- Google Maps API key is configured in app.json
- Ensure location permissions are granted
- Works offline with demo data

### Permission Issues
- On real device: Check system settings
- On simulator: May need to enable camera in simulator settings

## Internet
🌐 **No internet required** - All demo data is local

## File Structure
```
EcoSnap/
├── lib/
│   ├── demoAuth.ts          # Demo authentication store
│   └── supabase.ts          # (Supabase config - not used in demo)
├── screens/
│   ├── DemoLoginScreen.tsx  # User selection screen (NEW)
│   ├── SplashScreen.tsx     # Auto-login check (MODIFIED)
│   ├── HomeScreen.tsx       # Home with demo data (MODIFIED)
│   ├── CameraScreen.tsx     # Camera with demo auth (MODIFIED)
│   └── ... other screens
├── app/
│   ├── demoLogin.tsx        # Demo login route (NEW)
│   └── ... other routes
├── DEMO_MODE.md             # Full demo documentation
└── package.json             # Added zustand dependency
```

## Restoring Supabase (If Needed)

To go back to real authentication:
1. Revert changes in SplashScreen, HomeScreen, CameraScreen
2. Change imports from `useDemoAuth` back to `supabase`
3. Remove DemoLoginScreen
4. Update WelcomeScreen routes

See DEMO_MODE.md for detailed restoration instructions.

## Support

For issues or questions:
1. Check browser console for logs (Web)
2. Check device logs (Mobile)
3. All screens have detailed logging with `[ScreenName]` prefixes

Enjoy testing EcoSnap! 🌱
