import { ACTION_DIFFICULTY, SCORING_CONFIG } from '../constants';
import { ActionType, EcoScoreBreakdown, Snap } from '../models';

/**
 * Compute the eco score for a given action.
 * Returns both the final score and the breakdown for transparency.
 */
export function computeEcoScore(
  actionType: ActionType,
  consecutiveDays: number,
  communityActionCount24h: number
): { ecoScore: number; breakdown: EcoScoreBreakdown } {
  // base difficulty from constants, default to 0
  const actionDifficulty = ACTION_DIFFICULTY[actionType] ?? 0;

  // consistency multiplier calculation
  let consistencyMultiplier = 1.0;
  if (consecutiveDays >= SCORING_CONFIG.consistencyPeriodDays) {
    const extraPeriods = Math.floor(consecutiveDays / SCORING_CONFIG.consistencyPeriodDays);
    consistencyMultiplier += extraPeriods * SCORING_CONFIG.consistencyIncrement;
  }
  if (consistencyMultiplier > SCORING_CONFIG.maxConsistencyMultiplier) {
    consistencyMultiplier = SCORING_CONFIG.maxConsistencyMultiplier;
  }

  // community boost
  const communityBoost = communityActionCount24h > SCORING_CONFIG.communityThreshold ? 0.25 : 0;

  // random bonus sampling
  let randomBonus = 1.0;
  const roll = Math.random();
  // check highest multiplier first
  for (const bonus of SCORING_CONFIG.randomBonuses.slice().sort((a, b) => b.multiplier - a.multiplier)) {
    if (roll < bonus.chance) {
      randomBonus = bonus.multiplier;
      break;
    }
  }

  const ecoScore = actionDifficulty * consistencyMultiplier * (1 + communityBoost) * randomBonus;

  const breakdown: EcoScoreBreakdown = {
    actionDifficulty,
    consistencyMultiplier,
    communityBoost,
    randomBonus,
  };

  return { ecoScore, breakdown };
}

/**
 * Helper to recompute individual snap if later corrections needed (e.g. AI adjustment).
 */
export function recalcSnapScore(snap: Snap, updatedDifficulty: number) {
  const breakdown = snap.ecoScoreBreakdown;
  breakdown.actionDifficulty = updatedDifficulty;
  const ecoScore =
    breakdown.actionDifficulty *
    breakdown.consistencyMultiplier *
    (1 + breakdown.communityBoost) *
    breakdown.randomBonus;
  return { ecoScore, breakdown };
}
