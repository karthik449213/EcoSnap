import { ImpactStats } from '../models';

/**
 * Update impact stats based on an action type and quantity (always 1 action here).
 */
export function impactForAction(actionType: string): Partial<ImpactStats> {
  switch (actionType) {
    case 'recycling':
      return { plasticSaved: 0.5 };
    case 'public_transport':
      return { co2Reduced: 1.2 };
    case 'composting':
      return { wasteDiverted: 0.8 };
    default:
      return {};
  }
}

export function addImpact(current: ImpactStats, delta: Partial<ImpactStats>): ImpactStats {
  return {
    plasticSaved: current.plasticSaved + (delta.plasticSaved || 0),
    co2Reduced: current.co2Reduced + (delta.co2Reduced || 0),
    wasteDiverted: current.wasteDiverted + (delta.wasteDiverted || 0),
  };
}
