import { Circle } from '../models';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CIRCLES_KEY = 'eco_circles';

/**
 * Simple local storage implementation for circles. In Supabase mode these would be synced.
 */
export async function getCircles(): Promise<Circle[]> {
  const data = await AsyncStorage.getItem(CIRCLES_KEY);
  if (data) {
    try {
      return JSON.parse(data) as Circle[];
    } catch {}
  }
  return [];
}

export async function saveCircle(circle: Circle): Promise<void> {
  const circles = await getCircles();
  const idx = circles.findIndex((c) => c.id === circle.id);
  if (idx >= 0) circles[idx] = circle;
  else circles.push(circle);
  await AsyncStorage.setItem(CIRCLES_KEY, JSON.stringify(circles));
}

export async function simulateDemoUsers(circleId: string) {
  // generate 10 fake users with random weekly scores
  const circles = await getCircles();
  const circle = circles.find((c) => c.id === circleId);
  if (!circle) return;
  for (let i = 0; i < 10; i++) {
    circle.totalPoints += Math.floor(Math.random() * 200);
  }
  circle.weeklyRank = 1; // for simplicity
  await saveCircle(circle);
}
