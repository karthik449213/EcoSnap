# 🔍 Console Logs Not Showing in Expo Go?

## Quick Fix - Try These Steps in Order

### Step 1: Start Expo with Correct Flags
```bash
# Stop current Expo server (Ctrl+C)

# Start with these flags
npx expo start --clear

# OR for more verbose output
npx expo start --clear --dev-client
```

### Step 2: Check Terminal Output Mode
When Expo starts, you should see:
```
› Metro waiting on exp://...
› Scan the QR code above with Expo Go (Android) or the Camera app (iOS)
```

**Make sure you're looking at the terminal where you ran `npx expo start`**, not a different terminal.

### Step 3: Enable Logging in Expo Go App
1. Shake your device while in Expo Go
2. Tap "Toggle Performance Monitor" (if needed)
3. Tap "Debug Remote JS" (if available)
4. Or tap "Reload" to restart with fresh logs

### Step 4: Check Console Output
After scanning QR code, you should immediately see:
```
═══════════════════════════════════════
🌱 EcoSnap App Started
═══════════════════════════════════════
[Supabase] Initializing client...
[Supabase] URL present: true
[Supabase] Anon key present: true
[Supabase] Client initialized successfully
[Supabase] Platform: android
[SplashScreen] Checking for existing session...
```

### Step 5: If Still Not Showing

#### Option A: Use Expo DevTools
```bash
# Start with DevTools
npx expo start

# Then press 'w' in terminal to open web interface
# OR open http://localhost:8081 in browser
```

In the DevTools, you can see logs in the browser console.

#### Option B: Use React Native Debugger
```bash
# Install if not already installed
npm install -g react-native-debugger

# Start debugger
react-native-debugger

# Then enable "Debug Remote JS" in Expo Go
```

#### Option C: Use ADB for Android
```bash
# Connect device via USB
# Enable USB debugging

# View logs in real-time
adb logcat | grep ReactNativeJS

# Or filter for our app specifically
adb logcat | grep -E "\[Supabase\]|\[Auth|\[Home|\[Camera"
```

### Step 6: Verify Logs Are Working
Open the app and you should see logs appear in your terminal like this:

```
LOG  ═══════════════════════════════════════
LOG  🌱 EcoSnap App Started
LOG  ═══════════════════════════════════════
LOG  [Supabase] Initializing client...
LOG  [Supabase] URL present: true
LOG  [Supabase] Anon key present: true
LOG  [Supabase] Client initialized successfully
LOG  [Supabase] Platform: android
LOG  [SplashScreen] Checking for existing session...
LOG  [SplashScreen] No session, redirecting to /auth
```

---

## Common Issues

### ❌ "No logs appear at all"
**Cause:** Metro bundler not forwarding logs
**Fix:**
1. Close Expo Go completely (force quit)
2. Stop Expo server (Ctrl+C)
3. Clear cache: `npx expo start --clear`
4. Reopen Expo Go and scan QR code

### ❌ "Only seeing warnings, no custom logs"
**Cause:** Log level filtering
**Fix:**
```bash
# Set log level to verbose
export EXPO_DEBUG=true
npx expo start --clear
```

### ❌ "Logs stop after app starts"
**Cause:** Silent failures or app crashed
**Fix:**
1. Check for red error screen in Expo Go
2. Look for JavaScript errors in terminal
3. Try: Shake device → "Reload"

### ❌ "Terminal shows 'Connected to Metro bundler' but no logs"
**Cause:** Console override or JS bundle issue
**Fix:**
```bash
# Clear Metro cache
npx expo start --clear --reset-cache

# Or nuclear option
rm -rf .expo
rm -rf node_modules/.cache
npm install
npx expo start --clear
```

---

## Testing Logs Are Working

After starting the app, trigger specific logs by:

1. **Open app** → Should see splash screen logs
2. **Go to Auth screen** → Should see AuthScreen logs  
3. **Request OTP** → Should see OTP request logs
4. **Enter code** → Should see verification logs
5. **Home screen** → Should see data loading logs

If you see ANY of these logs, the logging system is working correctly!

---

## Alternative: View Logs in Browser DevTools

1. Start Expo: `npx expo start`
2. Press `w` to open web version
3. Open browser DevTools (F12)
4. Go to Console tab
5. Refresh the page
6. All logs will appear in browser console

This is especially useful for debugging since browser DevTools are more powerful.

---

## Still Not Working?

### Last Resort - Add Visual Indicators

If console logs absolutely won't show, you can add visual debugging:

1. Check the app - you should see screens load correctly
2. Auth should work even without seeing logs
3. The logging is there for debugging, not required for functionality

The app will work fine even if you can't see logs in terminal. The logs are primarily for debugging issues, but the core functionality doesn't depend on them.

---

## Quick Command Reference

```bash
# Standard start (shows logs)
npx expo start

# Start with cache clear
npx expo start --clear

# Start with full reset
npx expo start --clear --reset-cache

# View Android logs via ADB
adb logcat | grep ReactNativeJS

# View iOS logs (Mac only)
xcrun simctl spawn booted log stream --predicate 'processImagePath endswith "Expo Go"'
```

---

## Expected Output in Terminal

When working correctly, your terminal should look like:
```
› Metro waiting on exp://192.168.x.x:8081
› Scan the QR code above with Expo Go (Android) or the Camera app (iOS)

› Press a │ open Android
› Press w │ open web
› Press r │ reload app
› Press m │ toggle menu

LOG  ═══════════════════════════════════════
LOG  🌱 EcoSnap App Started
LOG  ═══════════════════════════════════════
LOG  [Supabase] Initializing client...
LOG  [Supabase] URL present: true
LOG  [Supabase] Anon key present: true
```

Each `LOG` line represents a `console.log()` call from your app code.
