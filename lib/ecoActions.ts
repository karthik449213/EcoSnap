import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
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

// Demo user snap storage key
const DEMO_SNAPS_KEY = 'demo_snaps';
const INITIALIZED_USERS_KEY = 'initialized_users';

export interface DemoSnap {
  id: string;
  userId: string;
  imageUri: string;
  title: string;
  timestamp: string;
  points: number;
  category: string;
  latitude: number | null;
  longitude: number | null;
}

// Default snaps to add for new users
const DEFAULT_SNAPS: Omit<DemoSnap, 'userId' | 'id'>[] = [
  {
    imageUri: 'snap1.jpeg',
    title: 'Recycling Plastic Bottles',
    timestamp: new Date(2026, 0, 1, 10, 30).toISOString(),
    points: 50,
    category: 'recycling',
    latitude: 40.7128,
    longitude: -74.0060,
  },
  {
    imageUri: 'snap2.jpeg',
    title: 'Using Reusable Shopping Bag',
    timestamp: new Date(2025, 11, 31, 14, 15).toISOString(),
    points: 30,
    category: 'reduction',
    latitude: 40.7129,
    longitude: -74.0061,
  },
  {
    imageUri: 'snap3.jpeg',
    title: 'Started Home Composting',
    timestamp: new Date(2025, 11, 30, 9, 45).toISOString(),
    points: 40,
    category: 'composting',
    latitude: 40.7130,
    longitude: -74.0062,
  },
  {
    imageUri: 'snap4.jpeg',
    title: 'Plant-Based Meal Prep',
    timestamp: new Date(2025, 11, 29, 12, 0).toISOString(),
    points: 25,
    category: 'food',
    latitude: 40.7131,
    longitude: -74.0063,
  },
  {
    imageUri: 'snap5.jpeg',
    title: 'Taking Public Transport',
    timestamp: new Date(2025, 11, 28, 8, 30).toISOString(),
    points: 35,
    category: 'transport',
    latitude: 40.7132,
    longitude: -74.0064,
  },
];

// Get all demo snaps
export const getDemoSnaps = async (userId?: string): Promise<DemoSnap[]> => {
  try {
    const stored = await AsyncStorage.getItem(DEMO_SNAPS_KEY);
    let allSnaps: DemoSnap[] = stored ? JSON.parse(stored) : [];
    
    // Migrate old Unsplash URLs to local filenames
    allSnaps = allSnaps.map(snap => {
      // Check if using old Unsplash URLs and convert to local filenames
      if (snap.imageUri && snap.imageUri.includes('unsplash.com')) {
        // Map Unsplash URLs to local files based on category
        const urlToFilename: { [key: string]: string } = {
          'photo-1532996122724': 'snap1.jpeg', // recycling
          'photo-1542601906990': 'snap2.jpeg', // reduction/transport
          'photo-1542838132-92c': 'snap3.jpeg', // composting
          'photo-1611284446314': 'snap4.jpeg', // food
          'photo-1558618666-fcd': 'snap5.jpeg', // transport
        };
        
        for (const [urlPart, filename] of Object.entries(urlToFilename)) {
          if (snap.imageUri.includes(urlPart)) {
            return { ...snap, imageUri: filename };
          }
        }
      }
      return snap;
    });
    
    if (userId) {
      return allSnaps.filter(snap => snap.userId === userId);
    }
    return allSnaps;
  } catch (error) {
    console.error('[getDemoSnaps] Error:', error);
    return [];
  }
};

// Save demo snap
export const saveDemoSnap = async (snap: DemoSnap): Promise<void> => {
  try {
    const snaps = await getDemoSnaps();
    snaps.unshift(snap); // Add to beginning
    await AsyncStorage.setItem(DEMO_SNAPS_KEY, JSON.stringify(snaps));
    console.log('[saveDemoSnap] Snap saved successfully:', snap.id);
  } catch (error) {
    console.error('[saveDemoSnap] Error:', error);
    throw error;
  }
};

// Clear all demo snaps (for testing/reset)
export const clearDemoSnaps = async (): Promise<void> => {
  try {
    await AsyncStorage.setItem(DEMO_SNAPS_KEY, JSON.stringify([]));
    console.log('[clearDemoSnaps] All snaps cleared');
  } catch (error) {
    console.error('[clearDemoSnaps] Error:', error);
    throw error;
  }
};

// Delete a snap
export const deleteSnap = async (snapId: string, userId?: string): Promise<void> => {
  try {
    const snaps = await getDemoSnaps();
    // Filter out the snap to delete, and ensure it belongs to the current user if userId is provided
    const filtered = snaps.filter(snap => {
      if (snap.id === snapId) {
        // Verify ownership if userId is provided
        if (userId && snap.userId !== userId) {
          console.warn('[deleteSnap] Snap does not belong to current user:', snapId);
          return true; // Keep the snap if it doesn't belong to current user
        }
        return false; // Remove this snap
      }
      return true; // Keep all other snaps
    });
    await AsyncStorage.setItem(DEMO_SNAPS_KEY, JSON.stringify(filtered));
    console.log('[deleteSnap] Snap deleted:', snapId);
  } catch (error) {
    console.error('[deleteSnap] Error:', error);
    throw error;
  }
};

// Initialize default snaps for a user
export const initializeDefaultSnaps = async (userId: string): Promise<void> => {
  try {
    const initializedUsers = await AsyncStorage.getItem(INITIALIZED_USERS_KEY);
    const initialized = initializedUsers ? JSON.parse(initializedUsers) : [];
    
    // Check if user already initialized
    if (initialized.includes(userId)) {
      console.log('[initializeDefaultSnaps] User already initialized:', userId);
      return;
    }
    
    // Add default snaps for this user
    const snaps = await getDemoSnaps();
    const defaultSnapsForUser = DEFAULT_SNAPS.map((snap, index) => ({
      ...snap,
      id: `default-snap-${userId}-${index}`,
      userId: userId,
    }));
    
    // Add to existing snaps
    const updatedSnaps = [...defaultSnapsForUser, ...snaps];
    await AsyncStorage.setItem(DEMO_SNAPS_KEY, JSON.stringify(updatedSnaps));
    
    // Mark user as initialized
    initialized.push(userId);
    await AsyncStorage.setItem(INITIALIZED_USERS_KEY, JSON.stringify(initialized));
    
    console.log('[initializeDefaultSnaps] Default snaps added for user:', userId);
  } catch (error) {
    console.error('[initializeDefaultSnaps] Error:', error);
    throw error;
  }
};

export const logEcoAction = async (photoUri: string, demoUserId?: string, currentStreak: number = 0) => {
  console.log('[logEcoAction] Starting action log for photo:', photoUri);
  
  // Check if this is a demo user
  if (demoUserId) {
    console.log('[logEcoAction] Demo mode - User ID:', demoUserId);
    const { lat, lon } = await fetchLocation();
    console.log('[logEcoAction] Location:', lat, lon);
    
    // Random category and points for demo
    const categories = ['recycling', 'reduction', 'composting', 'food', 'transport'];
    const category = categories[Math.floor(Math.random() * categories.length)];
    const points = Math.floor(Math.random() * 30) + 25; // 25-55 points
    
    const today = todayString();
    
    // Get last action date from stored snaps
    const existingSnaps = await getDemoSnaps(demoUserId);
    const lastSnapDate = existingSnaps.length > 0 ? existingSnaps[0].timestamp.slice(0, 10) : null;
    const nextStreak = computeNextStreak(currentStreak, lastSnapDate, today);
    
    // Create demo snap
    const demoSnap: DemoSnap = {
      id: `snap-${Date.now()}`,
      userId: demoUserId,
      imageUri: photoUri,
      title: `Eco Action - ${category}`,
      timestamp: new Date().toISOString(),
      points: points,
      category: category,
      latitude: lat,
      longitude: lon,
    };
    
    await saveDemoSnap(demoSnap);
    console.log('[logEcoAction] Demo snap saved, streak:', nextStreak);
    
    return { streak: nextStreak };
  }
  
  // Regular Supabase flow for authenticated users
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
