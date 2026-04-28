import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { sampleExpenses, sampleBudgets, commercialExpenses, commercialBudgets, initialSettings, sampleInvoices, sampleVendors } from '../data/sampleData';

const AppContext = createContext();

const loadState = () => {
  try {
    const serializedState = localStorage.getItem('finAppState');
    if (serializedState === null) {
      return {
        expenses: sampleExpenses,
        budgets: sampleBudgets,
        invoices: sampleInvoices,
        vendors: sampleVendors,
        notifications: [],
        settings: initialSettings
      };
    }
    const parsed = JSON.parse(serializedState);
    // Ensure notifications array exists for older states
    if (!parsed.notifications) parsed.notifications = [];
    return parsed;
  } catch (err) {
    return {
      expenses: sampleExpenses,
      budgets: sampleBudgets,
      invoices: sampleInvoices,
      vendors: sampleVendors,
      notifications: [],
      settings: initialSettings
    };
  }
};

const initialState = loadState();

const appReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_EXPENSE':
      return { ...state, expenses: [action.payload, ...state.expenses] };
    case 'UPDATE_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.map(e => e.id === action.payload.id ? action.payload : e)
      };
    case 'DELETE_EXPENSE':
      return { ...state, expenses: state.expenses.filter(e => e.id !== action.payload) };
    case 'ADD_BUDGET':
      if (state.budgets.some(b => b.category.toLowerCase() === action.payload.category.toLowerCase())) {
        return state;
      }
      return {
        ...state,
        budgets: [...state.budgets, action.payload]
      };
    case 'UPDATE_BUDGET':
      return {
        ...state,
        budgets: state.budgets.map(b => b.category === action.payload.category ? action.payload : b)
      };
    case 'SET_BUDGETS':
      return { ...state, budgets: action.payload };
    case 'TOGGLE_THEME':
      return {
        ...state,
        settings: { ...state.settings, theme: state.settings.theme === 'dark' ? 'light' : 'dark' }
      };
    case 'SET_USER_MODE':
      return {
        ...state,
        settings: { ...state.settings, userMode: action.payload }
      };
    case 'LOGIN': {
      // Swap to mode-appropriate demo data
      const mode = action.payload;
      const newExpenses = mode === 'commercial' ? commercialExpenses : sampleExpenses;
      const newBudgets = mode === 'commercial' ? commercialBudgets : sampleBudgets;
      return {
        ...state,
        expenses: newExpenses,
        budgets: newBudgets,
        notifications: [], // Clear old notifications on login
        settings: { ...state.settings, isAuthenticated: true, userMode: mode }
      };
    }
    case 'LOGOUT':
      return {
        ...state,
        settings: { ...state.settings, isAuthenticated: false }
      };
    case 'SET_FINANCIAL_PROFILE':
      return {
        ...state,
        settings: {
          ...state.settings,
          financialProfile: {
            ...state.settings.financialProfile,
            [action.payload.mode]: {
              ...state.settings.financialProfile?.[action.payload.mode],
              ...action.payload.data
            }
          }
        }
      };
    case 'UPDATE_PROFILE':
      return {
        ...state,
        settings: {
          ...state.settings,
          profile: { ...state.settings.profile, ...action.payload }
        }
      };
    case 'ADD_NOTIFICATION':
      // Prevent duplicate notifications with same message
      if (state.notifications.some(n => n.message === action.payload.message)) {
        return state;
      }
      return {
        ...state,
        notifications: [action.payload, ...state.notifications].slice(0, 20) // Keep max 20
      };
    case 'CLEAR_NOTIFICATIONS':
      return { ...state, notifications: [] };
    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map(n =>
          n.id === action.payload ? { ...n, read: true } : n
        )
      };
    default:
      return state;
  }
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    localStorage.setItem('finAppState', JSON.stringify(state));
    document.documentElement.setAttribute('data-theme', state.settings.theme);
  }, [state]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
