# Recent Updates - January 2, 2026

## Features Implemented

### 1. ✅ Camera Flipping
- Camera flip button is available in the CameraScreen
- Located in the top-right corner
- Allows switching between front and back cameras
- Works without authentication requirements

### 2. ✅ Demo User Snap Capability Without Authentication
- Removed strict authentication checks from CameraScreen and PreviewScreen
- Demo users can now take photos without needing Supabase authentication
- Camera and preview screens work in "demo mode"

### 3. ✅ Snap Storage with Supabase (Demo-Friendly)
- Created `getDemoSnaps()` and `saveDemoSnap()` functions in `lib/ecoActions.ts`
- Uses AsyncStorage for local demo snap storage
- Each snap includes:
  - Unique ID
  - User ID
  - Image URI
  - Title (auto-generated based on category)
  - Timestamp
  - Points (randomly assigned 25-55)
  - Category (recycling, reduction, composting, food, transport)
  - Location (latitude/longitude)
- `logEcoAction()` function now supports both demo users and authenticated Supabase users
- Demo snaps are persisted locally and survive app restarts

### 4. ✅ Profile Images Instead of Avatar Icons
- Updated `DemoUser` interface to use `ImageSourcePropType` instead of string
- All 5 demo users now use actual profile images from `assets/images/`:
  - Alex Green: 1.png
  - Jordan Earth: 2.png
  - Sam Nature: 3.png
  - Casey Eco: 4.png
  - River Clean: 5.png
- Updated components to display images:
  - **HomeScreen**: User avatar in header
  - **DemoLoginScreen**: User selection cards
  - **Leaderboard**: Top 5 users with profile images
  - **SnapHistory**: (uses snap images, not user avatars)

### 5. ✅ Real-Time Snap History
- SnapHistory component now fetches and displays actual snaps from AsyncStorage
- Shows user-specific snaps (filtered by current user ID)
- Uses `useFocusEffect` to reload snaps when screen comes into focus
- Displays empty state when no snaps exist
- Shows real-time stats:
  - Number of snaps taken
  - Total points earned
- Snaps appear immediately after taking a photo

## Files Modified

### Core Libraries
- `lib/demoAuth.tsx` - Updated DemoUser interface and avatar type
- `lib/ecoActions.ts` - Added demo snap storage functions and updated logEcoAction

### Screens
- `screens/CameraScreen.tsx` - Removed auth redirect, enabled demo mode
- `screens/PreviewScreen.tsx` - Added demo user support, removed Supabase session check
- `screens/HomeScreen.tsx` - Updated to display profile images
- `screens/DemoLoginScreen.tsx` - Updated user cards with profile images

### Components
- `components/SnapHistory.tsx` - Integrated with demo snap storage, real-time updates
- `components/Leaderboard.tsx` - Updated to use profile images

## How It Works

### Taking a Snap (Demo User Flow)
1. User logs in as demo user (or no login required)
2. Navigates to camera screen
3. Can flip camera using top-right button
4. Takes photo (tap) or video (long press)
5. Preview screen shows the photo
6. User confirms action
7. `logEcoAction()` is called with demo user ID
8. Snap is saved to AsyncStorage with metadata
9. User redirected to success screen
10. Returns to home screen where snap appears in history

### Profile Images
- All profile images are loaded from local assets
- Using `require('@/assets/images/X.png')` for reliable loading
- Images display in circular containers with proper sizing
- Consistent styling across all screens

## Testing Recommendations

1. **Camera Flipping**: Open camera, tap flip button, verify camera switches
2. **Demo Snapping**: Take photos as different demo users, verify they save
3. **Snap History**: Check home screen snap history updates after taking photo
4. **Profile Images**: Verify all users show proper profile images not emojis
5. **Persistence**: Close and reopen app, verify snaps still appear in history
6. **Multiple Users**: Switch users, verify each user sees only their snaps

## Notes

- Camera flipping works on both iOS and Android
- Demo snaps are stored locally and don't require internet
- Profile images are bundled with the app
- Streak calculations work correctly for demo users
- Location data is captured if permissions are granted
