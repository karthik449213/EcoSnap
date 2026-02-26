import { STREAK_TOKEN_EVERY_DAYS } from '../constants';
import { StreakHistoryEntry } from '../models';

interface StreakResult {
  newCount: number;
  tokenEarned: boolean;
  protected: boolean;
}

/**
 * Calculates the next streak count taking into account last action date and token usage.
 */
export function calculateNextStreak(
  currentStreak: number,
  lastDate: string | null,
  today: string,
  hasToken: boolean
): StreakResult {
  if (!lastDate) {
    return { newCount: 1, tokenEarned: false, protected: false };
  }
  const last = new Date(`${lastDate}T00:00:00Z`);
  const todayDate = new Date(`${today}T00:00:00Z`);
  const diffDays = Math.floor((todayDate.getTime() - last.getTime()) / 86400000);

  if (diffDays === 1) {
    const newCount = currentStreak + 1;
    const tokenEarned = newCount % STREAK_TOKEN_EVERY_DAYS === 0;
    return { newCount, tokenEarned, protected: false };
  }

  if (diffDays > 1) {
    if (hasToken) {
      // consume token and keep streak unchanged
      return { newCount: currentStreak, tokenEarned: false, protected: true };
    }
    // break streak
    return { newCount: 1, tokenEarned: false, protected: false };
  }

  // same day or backwards
  return { newCount: currentStreak, tokenEarned: false, protected: false };
}

/**
 * Record an entry to streak history for analytics
 */
export function addHistoryEntry(
  history: StreakHistoryEntry[],
  date: string,
  streakCount: number,
  preserved: boolean
): StreakHistoryEntry[] {
  return [...history, { date, streakCount, preserved }];
}
