# EcoSnap Demo Mode Setup

## Overview
Authentication has been disabled and replaced with a **local demo mode** with 5 pre-configured users.

## Demo Users

| Username | Email | Points | Streak | Avatar |
|----------|-------|--------|--------|--------|
| Alex Green | alex@ecosnap.app | 8,500 | 42 days | 🟢 |
| Jordan Earth | jordan@ecosnap.app | 7,200 | 28 days | 🌍 |
| Sam Nature | sam@ecosnap.app | 9,100 | 55 days | 🌿 |
| Casey Eco | casey@ecosnap.app | 6,800 | 21 days | ♻️ |
| River Clean | river@ecosnap.app | 12,300 | 73 days | 💧 |

## How It Works

### Authentication Flow
1. **SplashScreen** → Auto-checks authentication state
2. **WelcomeScreen** → Shows "Select Demo User" button
3. **DemoLoginScreen** → Lists all 5 demo users with stats
4. **Select User** → Logs in directly to app
5. **HomeScreen** → Displays user data and app features

### Files Modified

#### New Files
- `/lib/demoAuth.ts` - Demo authentication store using Zustand
- `/screens/DemoLoginScreen.tsx` - User selection UI
- `/app/demoLogin.tsx` - Route for demo login screen

#### Updated Files
- `/screens/SplashScreen.tsx` - Uses demo auth instead of Supabase
- `/screens/WelcomeScreen.tsx` - Routes to demo login instead of auth
- `/screens/HomeScreen.tsx` - Uses demo user data instead of Supabase
- `/screens/CameraScreen.tsx` - Uses demo auth check instead of Supabase
- `/app/demoLogin.tsx` - New route added

## Camera Integration

The **Camera** feature works without internet:
- ✅ Camera permissions are requested
- ✅ Photos can be captured
- ✅ Preview screen works with local files
- ✅ No Supabase upload (data stays local)

### Camera Usage
1. Tap "Snap Eco Action" on HomeScreen
2. Allow camera permissions
3. Tap 📷 to capture
4. Preview photo
5. Can retake or confirm

## Switching Users

Click **"Switch User"** button in the header to:
- Sign out current user
- Return to user selection screen
- Select a different demo user

## Features Still Available
- ✅ Home screen with user stats
- ✅ Camera with photo capture
- ✅ Map screen (with demo locations)
- ✅ Streak tracking (demo data)
- ✅ Eco-Points display
- ✅ Bottom navigation
- ✅ User switching

## No Internet Required
All features work **offline** with demo data:
- No API calls
- No authentication
- No database syncing
- Local state management only

## To Restore Supabase Auth
Replace imports in screens:
```tsx
// Change from:
import { useDemoAuth } from '@/lib/demoAuth';

// Back to:
import { supabase } from '@/lib/supabase';
```

Then restore original logic in SplashScreen, AuthScreen, HomeScreen, and CameraScreen.

## Testing Checklist
- [ ] Select demo user from list
- [ ] See user data on home screen
- [ ] Request camera permissions
- [ ] Capture photo
- [ ] View preview
- [ ] Switch to different user
- [ ] Check streak displays
- [ ] Check eco-points display
- [ ] Map screen loads
