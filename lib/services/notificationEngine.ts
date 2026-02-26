import * as Notifications from 'expo-notifications';
import { User } from '../models';

/**
 * Send a local push notification. Wrapper for Expo Notifications API.
 */
export async function sendNotification(title: string, body: string) {
  await Notifications.scheduleNotificationAsync({
    content: { title, body },
    trigger: null,
  });
}

/**
 * Evaluate triggers and schedule notifications accordingly.
 * These functions would be called whenever user state updates or periodically.
 */

export function checkStreakRisk(user: User, lastSnapTime: Date | null) {
  if (!lastSnapTime) return;
  const now = new Date();
  const diff = now.getTime() - lastSnapTime.getTime();
  // 20 hours = 72000000 ms
  if (diff > 72000000 && user.streakCount > 0) {
    sendNotification('Streak at risk!', 'Log an eco action to save your streak 🔥');
  }
}

export function checkLevelUp(user: User) {
  const nextLevelXP = Math.pow(user.level + 1, 2) * 100;
  if (user.totalXP >= nextLevelXP * 0.9 && user.totalXP < nextLevelXP) {
    sendNotification('Almost there!', 'You are close to reaching the next level.');
  }
}

export function checkCircleCompetition(user: User, friendTotal: number) {
  if (friendTotal > user.totalPoints) {
    sendNotification('Circle Challenge', 'A friend just surpassed you in your circle!');
  }
}
