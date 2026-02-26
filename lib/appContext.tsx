import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { Snap, User, EMPTY_IMPACT } from './models';
import { computeEcoScore } from './services/scoringEngine';
import { impactForAction, addImpact } from './services/impactEngine';
import { rollRareDrop } from './services/rewardEngine';
import { calculateNextStreak, addHistoryEntry } from './services/streakEngine';
import { checkStreakRisk, checkLevelUp } from './services/notificationEngine';
import { trackSnapSubmitted, trackRareDrop } from './services/analyticsEngine';
import { LEVEL_REWARDS } from './constants';

interface AppState {
  user: User;
  snaps: Snap[];
  lastSnapTime: Date | null;
}

type Action =
  | { type: 'ADD_SNAP'; snap: Snap }
  | { type: 'UPDATE_USER'; user: Partial<User> }
  | { type: 'SET_SNAPS'; snaps: Snap[] }
  | { type: 'SET_LAST_SNAP_TIME'; time: Date };

const initialUser: User = {
  id: 'anon',
  totalPoints: 0,
  totalXP: 0,
  level: 1,
  streakCount: 0,
  streakLevel: 0,
  streakProtectionTokens: 0,
  streakHistory: [],
  impactStats: EMPTY_IMPACT,
  unlockedRewards: [],
};

const initialState: AppState = {
  user: initialUser,
  snaps: [],
  lastSnapTime: null,
};

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'ADD_SNAP':
      return { ...state, snaps: [action.snap, ...state.snaps] };
    case 'UPDATE_USER':
      return { ...state, user: { ...state.user, ...action.user } };
    case 'SET_SNAPS':
      return { ...state, snaps: action.snaps };
    case 'SET_LAST_SNAP_TIME':
      return { ...state, lastSnapTime: action.time };
    default:
      return state;
  }
}

interface AppContextType extends AppState {
  addSnap: (snap: Snap) => void;
  recalcLevel: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const recalcLevel = () => {
    const newLevel = Math.floor(Math.sqrt(state.user.totalXP / 100));
    if (newLevel !== state.user.level) {
      dispatch({ type: 'UPDATE_USER', user: { level: newLevel } });
    }
  };

  const addSnap = (snap: Snap) => {
    // compute XP & points when snap already includes ecoScore
    dispatch({ type: 'ADD_SNAP', snap });

    // update user totals
    const addedXP = snap.ecoScore * 1.2;
    const newTotalXP = state.user.totalXP + addedXP;
    const newPoints = state.user.totalPoints + snap.ecoScore;

    // update impact stats
    const deltaImpact = impactForAction(snap.actionType);
    const newImpact = addImpact(state.user.impactStats, deltaImpact);

    // streak handling
    const todayStr = (snap.timestamp instanceof Date ? snap.timestamp : new Date(snap.timestamp)).toISOString().slice(0, 10);
    const streakRes = calculateNextStreak(
      state.user.streakCount,
      state.lastSnapTime ? state.lastSnapTime.toISOString().slice(0, 10) : null,
      todayStr,
      state.user.streakProtectionTokens > 0
    );

    const newStreak = streakRes.newCount;
    let newTokens = state.user.streakProtectionTokens;
    if (streakRes.protected) {
      newTokens = Math.max(0, newTokens - 1);
    }
    if (streakRes.tokenEarned) {
      newTokens += 1;
    }
    const newHistory = addHistoryEntry(
      state.user.streakHistory,
      todayStr,
      newStreak,
      streakRes.protected
    );

    dispatch({
      type: 'UPDATE_USER',
      user: {
        totalXP: newTotalXP,
        totalPoints: newPoints,
        impactStats: newImpact,
        streakCount: newStreak,
        streakProtectionTokens: newTokens,
        streakHistory: newHistory,
      },
    });

    // last snap time and notifications
    dispatch({ type: 'SET_LAST_SNAP_TIME', time: snap.timestamp instanceof Date ? snap.timestamp : new Date(snap.timestamp) });
    checkStreakRisk({ ...state.user, streakCount: newStreak }, state.lastSnapTime);
    checkLevelUp({ ...state.user, totalXP: newTotalXP });
    
    // analytics tracking
    trackSnapSubmitted(snap.actionType).catch(() => {});
    if (snap.rarityDrop) {
      trackRareDrop(true).catch(() => {});
    }
    
    recalcLevel();
  };

  // effect: when user level changes, maybe unlock rewards
  useEffect(() => {
    const reward = Object.entries(LEVEL_REWARDS).find(
      ([lvl]: [string, string]) => parseInt(lvl, 10) === state.user.level
    );
    if (reward && !state.user.unlockedRewards.includes(reward[1])) {
      dispatch({
        type: 'UPDATE_USER',
        user: { unlockedRewards: [...state.user.unlockedRewards, reward[1]] },
      });
    }
  }, [state.user.level]);

  const value: AppContextType = {
    ...state,
    addSnap,
    recalcLevel,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
