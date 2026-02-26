import AsyncStorage from '@react-native-async-storage/async-storage';

const ANALYTICS_KEY = 'analytics_data';

export interface AnalyticsData {
  snapFrequency: number; // Snaps per day
  streakBreaks: number;
  missionCompletionRate: number; // 0-1
  rareDropTriggerRate: number; // 0-1
  retention: {
    day1: boolean;
    day7: boolean;
    day30: boolean;
  };
  lastSnapDate: string | null;
  createdAt: string;
}

const DEFAULT_ANALYTICS: AnalyticsData = {
  snapFrequency: 0,
  streakBreaks: 0,
  missionCompletionRate: 0,
  rareDropTriggerRate: 0,
  retention: { day1: false, day7: false, day30: false },
  lastSnapDate: null,
  createdAt: new Date().toISOString(),
};

export async function getAnalytics(): Promise<AnalyticsData> {
  const data = await AsyncStorage.getItem(ANALYTICS_KEY);
  if (data) {
    try {
      return JSON.parse(data);
    } catch {}
  }
  return DEFAULT_ANALYTICS;
}

export async function trackSnapSubmitted(actionType: string): Promise<void> {
  const analytics = await getAnalytics();
  analytics.lastSnapDate = new Date().toISOString().slice(0, 10);
  // increment frequency
  analytics.snapFrequency += 1;
  await AsyncStorage.setItem(ANALYTICS_KEY, JSON.stringify(analytics));
}

export async function trackStreakBreak(): Promise<void> {
  const analytics = await getAnalytics();
  analytics.streakBreaks += 1;
  await AsyncStorage.setItem(ANALYTICS_KEY, JSON.stringify(analytics));
}

export async function trackMissionCompletion(completed: boolean): Promise<void> {
  const analytics = await getAnalytics();
  // simple average
  const total = (analytics.missionCompletionRate * 100 + (completed ? 1 : 0)) / 100;
  analytics.missionCompletionRate = Math.min(1, total);
  await AsyncStorage.setItem(ANALYTICS_KEY, JSON.stringify(analytics));
}

export async function trackRareDrop(occurred: boolean): Promise<void> {
  const analytics = await getAnalytics();
  const total = (analytics.rareDropTriggerRate * 100 + (occurred ? 1 : 0)) / 100;
  analytics.rareDropTriggerRate = Math.min(1, total);
  await AsyncStorage.setItem(ANALYTICS_KEY, JSON.stringify(analytics));
}

export async function updateRetention(days: number): Promise<void> {
  const analytics = await getAnalytics();
  if (days >= 1) analytics.retention.day1 = true;
  if (days >= 7) analytics.retention.day7 = true;
  if (days >= 30) analytics.retention.day30 = true;
  await AsyncStorage.setItem(ANALYTICS_KEY, JSON.stringify(analytics));
}
