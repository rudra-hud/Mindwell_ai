
import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Goal } from '../types';

type GoalsState = {
  goals: Goal[];
};

type Action = 
    | { type: 'LOAD_GOALS'; payload: Goal[] }
    | { type: 'ADD_GOAL'; payload: Goal }
    | { type: 'TOGGLE_GOAL'; payload: string }
    | { type: 'REMOVE_GOAL'; payload: string };

const initialState: GoalsState = {
  goals: [],
};

const goalsReducer = (state: GoalsState, action: Action): GoalsState => {
  let newGoals: Goal[];
  switch (action.type) {
    case 'LOAD_GOALS':
      return { ...state, goals: action.payload };
    case 'ADD_GOAL':
      newGoals = [action.payload, ...state.goals];
      break;
    case 'TOGGLE_GOAL':
      newGoals = state.goals.map(goal =>
        goal.id === action.payload ? { ...goal, isCompleted: !goal.isCompleted } : goal
      );
      break;
    case 'REMOVE_GOAL':
      newGoals = state.goals.filter(goal => goal.id !== action.payload);
      break;
    default:
      return state;
  }
  
  try {
    localStorage.setItem('mindwell-goals', JSON.stringify(newGoals));
  } catch (error) {
    console.error("Failed to save goals to localStorage", error);
  }
  return { ...state, goals: newGoals };
};

const GoalsContext = createContext<{
  state: GoalsState;
  addGoal: (goal: Goal) => void;
  toggleGoalCompletion: (id: string) => void;
  removeGoal: (id: string) => void;
} | undefined>(undefined);

export const GoalsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(goalsReducer, initialState);

  useEffect(() => {
    try {
      const storedGoals = localStorage.getItem('mindwell-goals');
      if (storedGoals) {
        dispatch({ type: 'LOAD_GOALS', payload: JSON.parse(storedGoals) });
      }
    } catch (error) {
      console.error("Failed to load goals from localStorage", error);
    }
  }, []);

  const addGoal = (goal: Goal) => {
    dispatch({ type: 'ADD_GOAL', payload: goal });
  };
  
  const toggleGoalCompletion = (id: string) => {
    dispatch({ type: 'TOGGLE_GOAL', payload: id });
  };

  const removeGoal = (id: string) => {
      dispatch({ type: 'REMOVE_GOAL', payload: id });
  }

  return (
    <GoalsContext.Provider value={{ state, addGoal, toggleGoalCompletion, removeGoal }}>
      {children}
    </GoalsContext.Provider>
  );
};

export const useGoals = () => {
  const context = useContext(GoalsContext);
  if (context === undefined) {
    throw new Error('useGoals must be used within a GoalsProvider');
  }
  return context;
};