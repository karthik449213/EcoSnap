import AsyncStorage from '@react-native-async-storage/async-storage';
import { Mission, ActionType } from '../models';
import { ACTION_DIFFICULTY, MISSION_TIERS } from '../constants';

const DAILY_MISSION_KEY = 'daily_mission';
const WEEKLY_MISSION_KEY = 'weekly_mission';

// utilities
function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickUniqueRandom<T>(arr: T[], count: number): T[] {
  const copy = [...arr];
  const result: T[] = [];
  while (result.length < count && copy.length) {
    const idx = Math.floor(Math.random() * copy.length);
    result.push(copy.splice(idx, 1)[0]);
  }
  return result;
}

/**
 * Generate a new set of daily missions ensuring they don't repeat previous day's actions.
 */
export async function generateDailyMission(): Promise<Mission> {
  const availableActions = Object.keys(ACTION_DIFFICULTY) as ActionType[];
  const prevJson = await AsyncStorage.getItem(DAILY_MISSION_KEY);
  let prevActions: ActionType[] = [];
  if (prevJson) {
    try {
      const prev = JSON.parse(prevJson) as Mission;
      prevActions = prev.actions || [];
    } catch {}
  }

  // pick three unique actions not in prevActions if possible
  let actions = pickUniqueRandom(availableActions, 3);
  if (prevActions && prevActions.length > 0) {
    const filtered = availableActions.filter((a) => !prevActions || !prevActions.includes(a));
    if (filtered.length >= 3) {
      actions = pickUniqueRandom(filtered, 3);
    }
  }

  const rewardXP = actions.reduce((sum, act) => sum + (ACTION_DIFFICULTY[act] ?? 0) * 3, 0);

  const mission: Mission = {
    id: `daily-${Date.now()}`,
    type: 'daily',
    actions,
    status: 'pending',
    rewardXP,
  };
  await AsyncStorage.setItem(DAILY_MISSION_KEY, JSON.stringify(mission));
  return mission;
}

/**
 * Returns the current daily mission (may be expired) or generates a new one if missing.
 */
export async function getDailyMission(): Promise<Mission> {
  const stored = await AsyncStorage.getItem(DAILY_MISSION_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {}
  }
  return generateDailyMission();
}

/**
 * Generate a simple weekly mission template (5 actions in 7 days)
 */
export async function generateWeeklyMission(): Promise<Mission> {
  const mission: Mission = {
    id: `weekly-${Date.now()}`,
    type: 'weekly',
    actions: [], // not specific actions, it's just "5 actions in 7 days"
    status: 'pending',
    rewardXP: 500, // arbitrary bonus
  };
  await AsyncStorage.setItem(WEEKLY_MISSION_KEY, JSON.stringify(mission));
  return mission;
}

export async function getWeeklyMission(): Promise<Mission> {
  const stored = await AsyncStorage.getItem(WEEKLY_MISSION_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {}
  }
  return generateWeeklyMission();
}
