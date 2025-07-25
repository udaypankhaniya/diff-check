'use client';

import React, { createContext, useContext, useReducer, ReactNode } from 'react';

interface AppState {
  toasts: Toast[];
  modals: {
    settings: boolean;
    export: boolean;
  };
  globalLoading: boolean;
}

interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

type AppAction =
  | { type: 'ADD_TOAST'; payload: Omit<Toast, 'id'> }
  | { type: 'REMOVE_TOAST'; payload: string }
  | { type: 'TOGGLE_MODAL'; payload: { modal: keyof AppState['modals']; open?: boolean } }
  | { type: 'SET_GLOBAL_LOADING'; payload: boolean };

const initialState: AppState = {
  toasts: [],
  modals: {
    settings: false,
    export: false,
  },
  globalLoading: false,
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'ADD_TOAST':
      return {
        ...state,
        toasts: [
          ...state.toasts,
          {
            ...action.payload,
            id: Math.random().toString(36).substr(2, 9),
          },
        ],
      };
    case 'REMOVE_TOAST':
      return {
        ...state,
        toasts: state.toasts.filter((toast) => toast.id !== action.payload),
      };
    case 'TOGGLE_MODAL':
      return {
        ...state,
        modals: {
          ...state.modals,
          [action.payload.modal]: action.payload.open ?? !state.modals[action.payload.modal],
        },
      };
    case 'SET_GLOBAL_LOADING':
      return {
        ...state,
        globalLoading: action.payload,
      };
    default:
      return state;
  }
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  toggleModal: (modal: keyof AppState['modals'], open?: boolean) => void;
  setGlobalLoading: (loading: boolean) => void;
} | null>(null);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    dispatch({ type: 'ADD_TOAST', payload: { ...toast } });

    // Auto-remove toast after duration
    const duration = toast.duration || 5000;
    setTimeout(() => {
      dispatch({ type: 'REMOVE_TOAST', payload: id });
    }, duration);
  };

  const removeToast = (id: string) => {
    dispatch({ type: 'REMOVE_TOAST', payload: id });
  };

  const toggleModal = (modal: keyof AppState['modals'], open?: boolean) => {
    dispatch({ type: 'TOGGLE_MODAL', payload: { modal, open } });
  };

  const setGlobalLoading = (loading: boolean) => {
    dispatch({ type: 'SET_GLOBAL_LOADING', payload: loading });
  };

  return (
    <AppContext.Provider
      value={{
        state,
        dispatch,
        addToast,
        removeToast,
        toggleModal,
        setGlobalLoading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};