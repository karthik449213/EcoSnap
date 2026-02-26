import { RARE_DROP_CONFIG, RARITY_TIERS } from '../constants';
import { RarityTier } from '../models';

export interface RareDrop {
  tier: RarityTier;
  type: 'badge' | 'token' | 'frame';
}

/**
 * Determine if a rare drop occurs when a snap is submitted.
 * Returns metadata if a drop should happen, otherwise null.
 */
export function rollRareDrop(): RareDrop | null {
  const roll = Math.random();
  // legendary frame (<1%) has priority
  if (roll < RARE_DROP_CONFIG.frameChance) {
    return { tier: 'legendary', type: 'frame' };
  }
  if (roll < RARE_DROP_CONFIG.tokenChance + RARE_DROP_CONFIG.frameChance) {
    return { tier: 'epic', type: 'token' };
  }
  if (roll < RARE_DROP_CONFIG.badgeChance + RARE_DROP_CONFIG.tokenChance + RARE_DROP_CONFIG.frameChance) {
    return { tier: 'rare', type: 'badge' };
  }
  return null; // common, nothing special
}
