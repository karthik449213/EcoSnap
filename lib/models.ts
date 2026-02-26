// Centralized data models used across the application

export type ActionType =
  | 'recycling'
  | 'composting'
  | 'public_transport'
  | 'zero_plastic_day'
  | 'food'
  | 'transport'
  | string; // fallback for future actions

export interface EcoScoreBreakdown {
  actionDifficulty: number;
  consistencyMultiplier: number;
  communityBoost: number;
  randomBonus: number;
}

export type RarityTier = 'common' | 'rare' | 'epic' | 'legendary';

export interface Snap {
  id: string;
  imageUri: string;
  title: string;
  description?: string;
  timestamp: Date;
  actionType: ActionType;
  ecoScore: number;
  points: number;
  category?: string;
  ecoScoreBreakdown: EcoScoreBreakdown;
  rarityDrop?: {
    tier: RarityTier;
    type: 'badge' | 'token' | 'frame';
  };
  missionRelated?: { daily?: boolean; weekly?: boolean };
}

export interface StreakHistoryEntry {
  date: string; // yyyy-mm-dd
  preserved: boolean; // if token used
  streakCount: number;
}

export interface ImpactStats {
  plasticSaved: number; // kg
  co2Reduced: number; // kg
  wasteDiverted: number; // kg
}

export interface User {
  id: string;
  totalPoints: number;
  totalXP: number;
  level: number;
  streakCount: number;
  streakLevel: number;
  streakProtectionTokens: number;
  streakHistory: StreakHistoryEntry[];
  impactStats: ImpactStats;
  unlockedRewards: string[];
  circleId?: string;
}

export interface Mission {
  id: string;
  type: 'daily' | 'weekly';
  actions: ActionType[];
  status: 'pending' | 'completed';
  rewardXP: number;
}

export interface Circle {
  id: string;
  name: string;
  members: string[]; // user IDs
  totalPoints: number;
  weeklyRank: number;
}

// exported for convenience
export const EMPTY_IMPACT: ImpactStats = {
  plasticSaved: 0,
  co2Reduced: 0,
  wasteDiverted: 0,
};
