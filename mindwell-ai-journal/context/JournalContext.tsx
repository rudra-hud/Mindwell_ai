
import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { JournalEntry } from '../types';

type JournalState = {
  entries: JournalEntry[];
};

type Action = { type: 'ADD_ENTRY'; payload: JournalEntry } | { type: 'LOAD_ENTRIES'; payload: JournalEntry[] };

const initialState: JournalState = {
  entries: [],
};

const journalReducer = (state: JournalState, action: Action): JournalState => {
  switch (action.type) {
    case 'LOAD_ENTRIES':
      return { ...state, entries: action.payload };
    case 'ADD_ENTRY':
      const newEntries = [action.payload, ...state.entries];
      try {
        localStorage.setItem('journalEntries', JSON.stringify(newEntries));
      } catch (error) {
        console.error("Failed to save to localStorage", error);
      }
      return { ...state, entries: newEntries };
    default:
      return state;
  }
};

const JournalContext = createContext<{
  state: JournalState;
  addEntry: (entry: JournalEntry) => void;
} | undefined>(undefined);

export const JournalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(journalReducer, initialState);

  useEffect(() => {
    try {
      const storedEntries = localStorage.getItem('journalEntries');
      if (storedEntries) {
        dispatch({ type: 'LOAD_ENTRIES', payload: JSON.parse(storedEntries) });
      }
    } catch (error) {
      console.error("Failed to load from localStorage", error);
    }
  }, []);

  const addEntry = (entry: JournalEntry) => {
    dispatch({ type: 'ADD_ENTRY', payload: entry });
  };

  return (
    <JournalContext.Provider value={{ state, addEntry }}>
      {children}
    </JournalContext.Provider>
  );
};

export const useJournal = () => {
  const context = useContext(JournalContext);
  if (context === undefined) {
    throw new Error('useJournal must be used within a JournalProvider');
  }
  return context;
};
