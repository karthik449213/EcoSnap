# EcoSnap Quick Fix Reference

## 🚨 Critical Setup Step

**Before testing, configure Supabase:**
1. Go to your Supabase project dashboard
2. Navigate to: **Authentication → URL Configuration**
3. Set **Site URL** to: `ecosnap://login`
4. Add **Redirect URL**: `ecosnap://login`
5. Click **Save**

Without this, auth will fail silently!

---

## 🧪 Testing Workflow

### Test in Expo Go
```bash
# Start with clean cache
npx expo start -c

# Scan QR code with Expo Go app
```

### Build Android APK
```bash
# Build preview APK (no app store needed)
eas build --profile preview --platform android

# Install on device when complete
# Download from build URL in terminal
```

---

## 🐛 Common Issues & Fixes

### ❌ "Failed to download remote updates"
**Status:** ✅ FIXED in app.json
**If still occurring:**
```bash
npx expo start -c
```

### ❌ OTP code doesn't work / Auth fails
**Cause:** Supabase redirect URL not configured
**Fix:** See "Critical Setup Step" above

### ❌ Console shows "[Supabase] URL present: false"
**Cause:** Environment variables not loading
**Fix:**
1. Verify `.env` file exists in project root
2. Check it contains:
   ```
   EXPO_PUBLIC_SUPABASE_URL="https://..."
   EXPO_PUBLIC_SUPABASE_ANON_KEY="eyJh..."
   ```
3. Restart Metro: `npx expo start -c`

### ❌ Photo upload fails
**Cause:** Supabase storage RLS policy too restrictive
**Fix:**
1. Go to Supabase → Storage → Policies
2. Check `eco-action-images` bucket
3. Ensure policy allows INSERT for `authenticated` users
4. Sample policy:
   ```sql
   CREATE POLICY "Users can upload own images"
   ON storage.objects FOR INSERT
   TO authenticated
   WITH CHECK (bucket_id = 'eco-action-images');
   ```

### ❌ Streak doesn't update
**Cause:** RLS policy blocking streak upsert
**Fix:**
1. Go to Supabase → Table Editor → streaks
2. Check RLS policies
3. Ensure UPSERT allowed for authenticated users
4. Sample policy:
   ```sql
   CREATE POLICY "Users can upsert own streak"
   ON streaks FOR ALL
   TO authenticated
   USING (auth.uid() = user_id)
   WITH CHECK (auth.uid() = user_id);
   ```

### ❌ Actions don't save
**Cause:** RLS policy blocking insert
**Fix:**
1. Go to Supabase → Table Editor → eco_actions
2. Check RLS policies
3. Ensure INSERT allowed for authenticated users
4. Sample policy:
   ```sql
   CREATE POLICY "Users can insert own actions"
   ON eco_actions FOR INSERT
   TO authenticated
   WITH CHECK (auth.uid() = user_id);
   ```

---

## 📋 Essential Console Logs

### On App Launch (Good)
```
[Supabase] Initializing client...
[Supabase] URL present: true
[Supabase] Anon key present: true
[Supabase] Client initialized successfully
[SplashScreen] Checking for existing session...
```

### On Auth (Good)
```
[AuthScreen] Requesting OTP for: user@example.com
[AuthScreen] OTP sent successfully
[AuthScreen] Verifying OTP for: user@example.com
[AuthScreen] OTP verified successfully
```

### On Action Log (Good)
```
[logEcoAction] Starting action log for photo: ...
[logEcoAction] Location: 37.7749, -122.4194
[logEcoAction] Uploading to storage: user-id/timestamp.jpg
[logEcoAction] Upload successful
[logEcoAction] Action record inserted
[logEcoAction] Action logged successfully, streak: 1
```

### Bad Signs (Errors)
```
[Supabase] CRITICAL: Environment variables missing!
[AuthScreen] OTP request error: ...
[logEcoAction] Upload error: ...
[HomeScreen] Streak fetch error: ...
```

---

## 🛠️ Clear Cache Commands

```bash
# Clear everything (nuclear option)
npx expo start -c
rm -rf .expo
rm -rf node_modules/.cache
npm install
```

---

## ✅ Testing Checklist

### Expo Go
- [ ] App loads without update errors
- [ ] Can request OTP code
- [ ] Can verify code and sign in
- [ ] Home screen loads with stats
- [ ] Can open camera
- [ ] Can capture photo
- [ ] Can confirm action
- [ ] Success screen shows
- [ ] Can sign out

### Android APK
- [ ] App installs without errors
- [ ] Camera permission granted
- [ ] Location permission granted
- [ ] Complete auth flow works
- [ ] Photo uploads successfully
- [ ] Action saves to database
- [ ] Streak updates correctly
- [ ] Session persists after restart

---

## 📱 Test on Device

### Via Expo Go
1. Install Expo Go from Play Store
2. Run `npx expo start`
3. Scan QR code
4. Test full flow

### Via APK
1. Run `eas build --profile preview --platform android`
2. Wait for build to complete (~10 min)
3. Download APK from build URL
4. Install on Android device
5. Test full flow

---

## 🔍 View Logs on Android APK

```bash
# Connect device via USB
# Enable USB debugging

# View React Native logs
adb logcat | grep ReactNativeJS

# View specific component
adb logcat | grep "\[AuthScreen\]"
adb logcat | grep "\[logEcoAction\]"

# View all app logs
adb logcat | grep "com.ecosnap.app"
```

---

## 📞 Quick Support

### Issue Not Listed?
1. Check console logs for error messages
2. Look for `[ComponentName] Error: ...` patterns
3. Check FIXES_APPLIED.md for detailed debugging
4. Review Supabase dashboard for:
   - Auth configuration
   - RLS policies
   - Storage policies
   - Recent errors in logs

### Still Stuck?
Review the full report: [FIXES_APPLIED.md](FIXES_APPLIED.md)
