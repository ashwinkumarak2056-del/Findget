import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { sampleExpenses, sampleBudgets, initialSettings, sampleInvoices, sampleVendors } from '../data/sampleData';

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
        settings: initialSettings
      };
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return {
      expenses: sampleExpenses,
      budgets: sampleBudgets,
      invoices: sampleInvoices,
      vendors: sampleVendors,
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
    case 'UPDATE_BUDGET':
      return {
        ...state,
        budgets: state.budgets.map(b => b.category === action.payload.category ? action.payload : b)
      };
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
    case 'LOGIN':
      return {
        ...state,
        settings: { ...state.settings, isAuthenticated: true, userMode: action.payload }
      };
    case 'LOGOUT':
      return {
        ...state,
        settings: { ...state.settings, isAuthenticated: false }
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
