# EcoSnap Testing Guide

## Prerequisites

### 1. Environment Variables
Create a `.env` file in the project root:
```
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Supabase Backend Checklist
- [ ] Project created and provisioned
- [ ] Email OTP authentication enabled
- [ ] Tables created: `users_profile`, `eco_actions`, `streaks`
- [ ] RLS policies enabled and applied
- [ ] Storage bucket `eco-action-images` created
- [ ] Auth trigger `on_auth_user_created` installed

---

## Testing Workflow

### Phase 1: Start the App

**iOS:**
```bash
npm run ios
```

**Android:**
```bash
npm run android
```

**Web:**
```bash
npm run web
```

**Expected:** Splash screen displays for ~1 second, then redirects to Auth screen.

---

### Phase 2: Authentication Flow

#### Test 2.1: Request OTP
1. Enter your email in the email field
2. Tap **"Send login code"**
3. **Expected:**
   - Button shows "Sending…"
   - Alert: "Check your email"
   - Email input locked, code input appears

#### Test 2.2: Check Email
1. Open your email inbox
2. **Expected:** Email from Supabase with 6-digit code

#### Test 2.3: Verify OTP
1. Enter the 6-digit code
2. Tap **"Verify & Continue"**
3. **Expected:**
   - Button shows "Verifying…"
   - Redirects to Home screen
   - User profile + streak row auto-created in DB

#### Test 2.4: Invalid Code
1. Enter wrong code (e.g., `000000`)
2. Tap **"Verify & Continue"**
3. **Expected:** Alert: "Sign-in failed" / "Invalid or expired code"

#### Test 2.5: Resend Code
1. Tap **"Resend code"**
2. **Expected:** New email sent, alert confirms

---

### Phase 3: Home Screen

#### Test 3.1: Initial State
**Expected:**
- Header shows "Welcome back" + "EcoSnap" + your email
- Streak badge shows `0-day streak`
- Current Streak card: `0 days`
- Eco Actions card: `0`
- Daily Tip displayed
- Sign out button visible

#### Test 3.2: Snap Action Button
1. Tap **"Snap Eco Action"**
2. **Expected:** Navigates to Camera screen

#### Test 3.3: Pull to Refresh
1. Pull down on Home screen
2. **Expected:** Spinner shows, stats reload

---

### Phase 4: Camera Screen

#### Test 4.1: Camera Permission
**First time:**
- **Expected:** Permission prompt appears
- Grant camera access

**Subsequent:**
- **Expected:** Camera preview loads immediately

#### Test 4.2: Capture Photo
1. Point camera at an eco-friendly action (reusable bag, recycling bin, plant, etc.)
2. Tap the white camera button
3. **Expected:**
   - Button shows spinner briefly
   - Photo captured
   - Navigates to Preview screen with captured image

#### Test 4.3: Permission Denied
1. Deny camera permission
2. **Expected:**
   - Message: "We need camera access to snap eco actions."
   - Button: "Allow Camera"

---

### Phase 5: Preview Screen

#### Test 5.1: Photo Display
**Expected:**
- Captured photo fills the top area
- "Confirm Action" button at bottom
- "Cancel" button below

#### Test 5.2: Confirm Action
1. Tap **"Confirm Action"**
2. **Expected:**
   - Button shows "Saving…"
   - Image uploads to Supabase Storage
   - Row inserted into `eco_actions` table
   - Streak calculated and updated
   - Navigates to Success screen

#### Test 5.3: Cancel
1. Tap **"Cancel"**
2. **Expected:** Returns to Camera screen

---

### Phase 6: Success Screen

#### Test 6.1: First Action
**Expected:**
- Green checkmark icon
- Title: "Action logged!"
- Subtitle: "Your streak just hit 1 days. Keep the momentum."
- Button: "Back to Home"

#### Test 6.2: Navigate Home
1. Tap **"Back to Home"**
2. **Expected:**
   - Returns to Home screen
   - Streak badge shows `1-day streak`
   - Current Streak: `1 days`
   - Eco Actions: `1`

---

### Phase 7: Multi-Day Streak Testing

#### Test 7.1: Same Day Action
1. Snap another action on the same day
2. **Expected:**
   - Success screen shows same streak (e.g., `1 days`)
   - Eco Actions count increases to `2`
   - Streak remains `1`

#### Test 7.2: Next Day Action (Consecutive)
**Option 1: Wait until next UTC day**
1. Wait for midnight UTC
2. Snap a new action

**Option 2: Manually update DB**
```sql
-- In Supabase SQL Editor
UPDATE streaks 
SET last_action_date = CURRENT_DATE - INTERVAL '1 day'
WHERE user_id = 'your-user-id';
```
3. Snap a new action
4. **Expected:** Streak increments to `2 days`

#### Test 7.3: Broken Streak
1. Manually set `last_action_date` to 3+ days ago:
```sql
UPDATE streaks 
SET last_action_date = CURRENT_DATE - INTERVAL '3 days'
WHERE user_id = 'your-user-id';
```
2. Snap a new action
3. **Expected:** Streak resets to `1 days`

---

### Phase 8: Sign Out

#### Test 8.1: Sign Out Flow
1. On Home screen, tap **"Sign out"** (top right)
2. **Expected:**
   - Session cleared
   - Redirects to Auth screen

#### Test 8.2: Sign Back In
1. Enter same email
2. Request OTP
3. Verify code
4. **Expected:**
   - Returns to Home screen
   - Previous streak and actions restored

---

### Phase 9: Location Permissions (Optional)

#### Test 9.1: Grant Location
1. When iOS/Android prompts for location access, grant it
2. Snap an action
3. **Expected:**
   - `latitude` and `longitude` fields populated in `eco_actions` table

#### Test 9.2: Deny Location
1. Deny location permission
2. Snap an action
3. **Expected:**
   - Action still logs successfully
   - `latitude` and `longitude` are `null`

---

## Verification in Supabase Dashboard

### Database Tables

**Check `users_profile`:**
```sql
SELECT * FROM users_profile;
```
- Should have 1 row per signed-in user

**Check `eco_actions`:**
```sql
SELECT * FROM eco_actions ORDER BY created_at DESC;
```
- Should show all logged actions with `image_url`, `action_date`, location

**Check `streaks`:**
```sql
SELECT * FROM streaks;
```
- `current_streak` should match app display
- `last_action_date` should be today (if action logged today)

### Storage Bucket

1. Navigate to Storage → `eco-action-images`
2. **Expected:** Folders named by `user_id` containing uploaded images
3. Click an image → verify it's the photo you captured

### Authentication

1. Navigate to Authentication → Users
2. **Expected:** Your email listed with "Confirmed" status

---

## Common Issues & Fixes

### Issue: "window is not defined" on web
**Fix:** Already applied - web uses `localStorage`, native uses `AsyncStorage`

### Issue: RLS policy blocks insert
**Fix:** Verify policies allow `auth.uid() = user_id`

### Issue: Storage upload fails
**Fix:**
- Verify bucket exists and is **private** (not public)
- Check storage policies allow authenticated users to upload to own folder

### Issue: Streak doesn't increment
**Fix:**
- Check `last_action_date` in `streaks` table
- Verify date logic: actions on same day don't increment, next day does

### Issue: Camera shows black screen
**Fix:**
- Grant camera permissions in device settings
- Restart app

---

## Success Criteria

✅ User can sign up/sign in with email OTP  
✅ User can capture photo with camera  
✅ Photo uploads to Supabase Storage  
✅ Action logged in `eco_actions` table  
✅ Streak increments correctly on consecutive days  
✅ Streak resets after missed days  
✅ Home screen displays accurate stats  
✅ Pull-to-refresh updates data  
✅ Sign out clears session  
✅ RLS prevents unauthorized access  

---

## Performance & Edge Cases

### Test with slow network
1. Enable network throttling (Chrome DevTools or Charles Proxy)
2. Capture and confirm action
3. **Expected:** Loading states display, no crash

### Test offline behavior
1. Turn off internet
2. Try to sign in
3. **Expected:** Alert: network error

### Test rapid taps
1. Tap "Confirm Action" multiple times quickly
2. **Expected:** Button disabled during save, no duplicate actions

### Test with no camera
1. Run on web browser (no camera)
2. **Expected:** Fallback or permission denied state

---

## Next Steps After Testing

- [ ] Add error logging/monitoring (Sentry)
- [ ] Add analytics (Mixpanel, Amplitude)
- [ ] Implement photo compression before upload
- [ ] Add image caching
- [ ] Implement offline queue for actions
- [ ] Add streak history view
- [ ] Add leaderboard/social features
