// Global constants and configuration for engagement algorithms

export const ACTION_DIFFICULTY: Record<string, number> = {
  recycling: 10,
  composting: 20,
  'public_transport': 30,
  'zero_plastic_day': 40,
};

export const SCORING_CONFIG = {
  consistencyPeriodDays: 3,
  consistencyIncrement: 0.1,
  maxConsistencyMultiplier: 2.0,
  communityThreshold: 10,
  randomBonuses: [
    { chance: 0.01, multiplier: 2.0 },
    { chance: 0.10, multiplier: 1.5 },
  ],
};

export const RARITY_TIERS = ['common', 'rare', 'epic', 'legendary'] as const;

export const RARE_DROP_CONFIG = {
  badgeChance: 0.05, // 5%
  tokenChance: 0.02, // 2%
  frameChance: 0.01, // 1%
};

export const LEVEL_REWARDS: Record<number, string> = {
  5: 'bronze_frame',
  10: 'silver_frame',
  20: 'gold_frame',
  30: 'animated_border',
};

export const MISSION_TIERS = ['easy', 'medium', 'hard'] as const;

// Soft caps and other parameters
export const STREAK_TOKEN_EVERY_DAYS = 7;
export const MAX_LEVEL_CAP = 100; // arbitrary
