
import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';

// A simple but effective non-crypto hash function.
const simpleHash = (str: string): string => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash |= 0; // Convert to 32bit integer
    }
    return hash.toString();
};

type SettingsState = {
  pinHash: string | null;
  isLocked: boolean;
};

type Action =
  | { type: 'SET_PIN'; payload: string }
  | { type: 'UNLOCK' }
  | { type: 'REMOVE_PIN' }
  | { type: 'LOAD_STATE'; payload: Partial<SettingsState> };

const initialState: SettingsState = {
  pinHash: null,
  isLocked: false,
};

const settingsReducer = (state: SettingsState, action: Action): SettingsState => {
  switch (action.type) {
    case 'LOAD_STATE':
        const hasPin = !!action.payload.pinHash;
        return {
            ...state,
            pinHash: action.payload.pinHash || null,
            isLocked: hasPin,
        };
    case 'SET_PIN':
        const newPinHash = simpleHash(action.payload);
        localStorage.setItem('mindwell-pin-hash', newPinHash);
        return { ...state, pinHash: newPinHash, isLocked: false };
    case 'UNLOCK':
        return { ...state, isLocked: false };
    case 'REMOVE_PIN':
        localStorage.removeItem('mindwell-pin-hash');
        return { ...state, pinHash: null, isLocked: false };
    default:
      return state;
  }
};

const SettingsContext = createContext<{
  state: SettingsState;
  checkPin: (pin: string) => boolean;
  setPin: (pin: string) => void;
  removePin: () => void;
  unlockApp: () => void;
} | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(settingsReducer, initialState);

  useEffect(() => {
    try {
      const storedPinHash = localStorage.getItem('mindwell-pin-hash');
      dispatch({ type: 'LOAD_STATE', payload: { pinHash: storedPinHash } });
    } catch (error) {
      console.error("Failed to load settings from localStorage", error);
    }
  }, []);

  const checkPin = (pin: string): boolean => {
    if (!state.pinHash) return false;
    const isCorrect = simpleHash(pin) === state.pinHash;
    if (isCorrect) {
        dispatch({ type: 'UNLOCK' });
    }
    return isCorrect;
  };

  const setPin = (pin: string) => {
    dispatch({ type: 'SET_PIN', payload: pin });
  };

  const removePin = () => {
    dispatch({ type: 'REMOVE_PIN' });
  }

  const unlockApp = () => {
      dispatch({type: 'UNLOCK'})
  }

  return (
    <SettingsContext.Provider value={{ state, checkPin, setPin, removePin, unlockApp }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
