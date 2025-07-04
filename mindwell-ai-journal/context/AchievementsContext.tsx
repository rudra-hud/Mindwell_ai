
import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Achievement, AchievementId } from '../types';
import { ACHIEVEMENTS_LIST } from '../constants';

type AchievementsState = {
  unlocked: Record<AchievementId, string | null>; // id -> timestamp
  toastQueue: Achievement[];
  hydrated: boolean;
};

type Action =
  | { type: 'LOAD_STATE'; payload: Partial<Record<AchievementId, string | null>> }
  | { type: 'UNLOCK'; payload: { id: AchievementId; timestamp: string } }
  | { type: 'DISMISS_TOAST' };

const initialState: AchievementsState = {
  unlocked: ACHIEVEMENTS_LIST.reduce((acc, a) => ({ ...acc, [a.id]: null }), {} as Record<AchievementId, string | null>),
  toastQueue: [],
  hydrated: false,
};

const achievementsReducer = (state: AchievementsState, action: Action): AchievementsState => {
  switch (action.type) {
    case 'LOAD_STATE':
        return {
            ...state,
            unlocked: { ...state.unlocked, ...action.payload },
            hydrated: true,
        };
    case 'UNLOCK':
        if (state.unlocked[action.payload.id]) {
            return state; // Already unlocked
        }
        const newUnlocked = { ...state.unlocked, [action.payload.id]: action.payload.timestamp };
        const achievementData = ACHIEVEMENTS_LIST.find(a => a.id === action.payload.id);
        
        try {
            localStorage.setItem('mindwell-achievements', JSON.stringify(newUnlocked));
        } catch (error) {
            console.error("Failed to save achievements to localStorage", error);
        }
        
        return {
            ...state,
            unlocked: newUnlocked,
            toastQueue: achievementData ? [...state.toastQueue, { ...achievementData, unlockedAt: action.payload.timestamp }] : state.toastQueue,
        };
    case 'DISMISS_TOAST':
        return {
            ...state,
            toastQueue: state.toastQueue.slice(1),
        };
    default:
      return state;
  }
};

const AchievementsContext = createContext<{
  state: AchievementsState;
  unlockAchievement: (id: AchievementId) => void;
  dismissToast: () => void;
} | undefined>(undefined);

export const AchievementsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(achievementsReducer, initialState);

  useEffect(() => {
    try {
      const storedAchievements = localStorage.getItem('mindwell-achievements');
      if (storedAchievements) {
        dispatch({ type: 'LOAD_STATE', payload: JSON.parse(storedAchievements) });
      } else {
        dispatch({ type: 'LOAD_STATE', payload: {} }); // Mark as hydrated even if empty
      }
    } catch (error) {
      console.error("Failed to load achievements from localStorage", error);
      dispatch({ type: 'LOAD_STATE', payload: {} });
    }
  }, []);

  const unlockAchievement = (id: AchievementId) => {
    dispatch({ type: 'UNLOCK', payload: { id, timestamp: new Date().toISOString() } });
  };

  const dismissToast = () => {
    dispatch({ type: 'DISMISS_TOAST' });
  };

  return (
    <AchievementsContext.Provider value={{ state, unlockAchievement, dismissToast }}>
      {children}
    </AchievementsContext.Provider>
  );
};

export const useAchievements = () => {
  const context = useContext(AchievementsContext);
  if (context === undefined) {
    throw new Error('useAchievements must be used within an AchievementsProvider');
  }
  return context;
};
