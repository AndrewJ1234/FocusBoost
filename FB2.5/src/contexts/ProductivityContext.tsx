import React, { createContext, useContext, useReducer, ReactNode } from 'react';

interface ProductivityState {
  todayScore: number;
  weeklyAverage: number;
  focusTime: number;
  distractionTime: number;
  currentStreak: number;
  goals: Goal[];
  activities: Activity[];
}

interface Goal {
  id: string;
  title: string;
  target: number;
  current: number;
  category: string;
  deadline?: Date;
}

interface Activity {
  id: string;
  name: string;
  category: string;
  duration: number;
  productivityScore: number;
  timestamp: Date;
}

type ProductivityAction = 
  | { type: 'UPDATE_SCORE'; payload: number }
  | { type: 'ADD_ACTIVITY'; payload: Activity }
  | { type: 'UPDATE_GOAL'; payload: { id: string; current: number } };

const initialState: ProductivityState = {
  todayScore: 78,
  weeklyAverage: 72,
  focusTime: 285, // minutes
  distractionTime: 125, // minutes
  currentStreak: 12,
  goals: [],
  activities: []
};

const productivityReducer = (state: ProductivityState, action: ProductivityAction): ProductivityState => {
  switch (action.type) {
    case 'UPDATE_SCORE':
      return { ...state, todayScore: action.payload };
    case 'ADD_ACTIVITY':
      return { 
        ...state, 
        activities: [action.payload, ...state.activities.slice(0, 49)] 
      };
    case 'UPDATE_GOAL':
      return {
        ...state,
        goals: state.goals.map(goal => 
          goal.id === action.payload.id 
            ? { ...goal, current: action.payload.current }
            : goal
        )
      };
    default:
      return state;
  }
};

const ProductivityContext = createContext<{
  state: ProductivityState;
  dispatch: React.Dispatch<ProductivityAction>;
} | null>(null);

export const ProductivityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(productivityReducer, initialState);

  return (
    <ProductivityContext.Provider value={{ state, dispatch }}>
      {children}
    </ProductivityContext.Provider>
  );
};

export const useProductivityContext = () => {
  const context = useContext(ProductivityContext);
  if (!context) {
    throw new Error('useProductivityContext must be used within ProductivityProvider');
  }
  return context;
};