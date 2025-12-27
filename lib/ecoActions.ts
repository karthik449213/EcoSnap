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
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  if (sessionError) throw sessionError;
  const session = sessionData.session;
  if (!session) throw new Error('You need to sign in first.');
  const userId = session.user.id;

  const { lat, lon } = await fetchLocation();
  const response = await fetch(photoUri);
  const blob = await response.blob();
  const extension = photoUri.split('.').pop()?.split('?')[0] || 'jpg';
  const path = `${userId}/${Date.now()}.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from('eco-action-images')
    .upload(path, blob, { contentType: blob.type || 'image/jpeg' });
  if (uploadError) throw uploadError;

  const today = todayString();
  const { error: actionError } = await supabase.from('eco_actions').insert({
    user_id: userId,
    image_url: path,
    latitude: lat,
    longitude: lon,
    action_date: today,
  });
  if (actionError) throw actionError;

  const { data: streakRow, error: streakFetchError } = await supabase
    .from('streaks')
    .select('current_streak, last_action_date')
    .eq('user_id', userId)
    .maybeSingle();
  if (streakFetchError) throw streakFetchError;

  const nextStreak = computeNextStreak(streakRow?.current_streak ?? 0, streakRow?.last_action_date ?? null, today);

  const { error: streakUpsertError } = await supabase.from('streaks').upsert({
    user_id: userId,
    current_streak: nextStreak,
    last_action_date: today,
    updated_at: new Date().toISOString(),
  });
  if (streakUpsertError) throw streakUpsertError;

  return { streak: nextStreak };
};
