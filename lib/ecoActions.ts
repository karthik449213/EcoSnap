import * as Location from 'expo-location';
import { supabase } from './supabase';

const todayString = () => new Date().toISOString().slice(0, 10);

const toUTCDate = (date: string) => new Date(`${date}T00:00:00Z`);

const computeNextStreak = (current: number, lastDate: string | null, today: string) => {
  if (!lastDate) return Math.max(1, current || 0);
  const last = toUTCDate(lastDate);
  const todayDate = toUTCDate(today);
  const diffDays = Math.floor((todayDate.getTime() - last.getTime()) / 86400000);
  if (diffDays <= 0) return Math.max(1, current || 0);
  if (diffDays === 1) return (current || 0) + 1;
  return 1;
};

const fetchLocation = async () => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') return { lat: null as number | null, lon: null as number | null };
    const cached = await Location.getLastKnownPositionAsync();
    const position = cached || (await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced }));
    return {
      lat: position?.coords.latitude ?? null,
      lon: position?.coords.longitude ?? null,
    };
  } catch (_err) {
    return { lat: null as number | null, lon: null as number | null };
  }
};

export const logEcoAction = async (photoUri: string) => {
  console.log('[logEcoAction] Starting action log for photo:', photoUri);
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  if (sessionError) {
    console.error('[logEcoAction] Session error:', sessionError);
    throw sessionError;
  }
  const session = sessionData.session;
  if (!session) {
    console.error('[logEcoAction] No active session');
    throw new Error('You need to sign in first.');
  }
  const userId = session.user.id;
  console.log('[logEcoAction] User ID:', userId);

  const { lat, lon } = await fetchLocation();
  console.log('[logEcoAction] Location:', lat, lon);
  const response = await fetch(photoUri);
  const blob = await response.blob();
  const extension = photoUri.split('.').pop()?.split('?')[0] || 'jpg';
  const path = `${userId}/${Date.now()}.${extension}`;
  console.log('[logEcoAction] Uploading to storage:', path);

  const { error: uploadError } = await supabase.storage
    .from('eco-action-images')
    .upload(path, blob, { contentType: blob.type || 'image/jpeg' });
  if (uploadError) {
    console.error('[logEcoAction] Upload error:', uploadError);
    throw uploadError;
  }
  console.log('[logEcoAction] Upload successful');

  const today = todayString();
  console.log('[logEcoAction] Inserting action record for date:', today);
  const { error: actionError } = await supabase.from('eco_actions').insert({
    user_id: userId,
    image_url: path,
    latitude: lat,
    longitude: lon,
    action_date: today,
  });
  if (actionError) {
    console.error('[logEcoAction] Insert action error:', actionError);
    throw actionError;
  }
  console.log('[logEcoAction] Action record inserted');

  const { data: streakRow, error: streakFetchError } = await supabase
    .from('streaks')
    .select('current_streak, last_action_date')
    .eq('user_id', userId)
    .maybeSingle();
  if (streakFetchError) {
    console.error('[logEcoAction] Streak fetch error:', streakFetchError);
    throw streakFetchError;
  }
  console.log('[logEcoAction] Current streak data:', streakRow);

  const nextStreak = computeNextStreak(streakRow?.current_streak ?? 0, streakRow?.last_action_date ?? null, today);
  console.log('[logEcoAction] Next streak:', nextStreak);

  const { error: streakUpsertError } = await supabase.from('streaks').upsert({
    user_id: userId,
    current_streak: nextStreak,
    last_action_date: today,
    updated_at: new Date().toISOString(),
  });
  if (streakUpsertError) {
    console.error('[logEcoAction] Streak upsert error:', streakUpsertError);
    throw streakUpsertError;
  }
  console.log('[logEcoAction] Action logged successfully, streak:', nextStreak);

  return { streak: nextStreak };
};
