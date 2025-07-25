import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SettingsState {
  sidebarCollapsed: boolean;
  fontSize: 'small' | 'medium' | 'large';
  showLineNumbers: boolean;
  wrapLines: boolean;
  highlightSyntax: boolean;
}

const initialState: SettingsState = {
  sidebarCollapsed: false,
  fontSize: 'medium',
  showLineNumbers: true,
  wrapLines: false,
  highlightSyntax: true,
};

// Load settings from localStorage
const loadSettings = (): SettingsState => {
  if (typeof window === 'undefined') return initialState;
  
  try {
    const saved = localStorage.getItem('diffChecker_settings');
    return saved ? { ...initialState, ...JSON.parse(saved) } : initialState;
  } catch {
    return initialState;
  }
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState: loadSettings(),
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
      if (typeof window !== 'undefined') {
        localStorage.setItem('diffChecker_settings', JSON.stringify(state));
      }
    },
    setFontSize: (state, action: PayloadAction<'small' | 'medium' | 'large'>) => {
      state.fontSize = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('diffChecker_settings', JSON.stringify(state));
      }
    },
    toggleLineNumbers: (state) => {
      state.showLineNumbers = !state.showLineNumbers;
      if (typeof window !== 'undefined') {
        localStorage.setItem('diffChecker_settings', JSON.stringify(state));
      }
    },
    toggleWrapLines: (state) => {
      state.wrapLines = !state.wrapLines;
      if (typeof window !== 'undefined') {
        localStorage.setItem('diffChecker_settings', JSON.stringify(state));
      }
    },
    toggleSyntaxHighlight: (state) => {
      state.highlightSyntax = !state.highlightSyntax;
      if (typeof window !== 'undefined') {
        localStorage.setItem('diffChecker_settings', JSON.stringify(state));
      }
    },
  },
});

export const {
  toggleSidebar,
  setFontSize,
  toggleLineNumbers,
  toggleWrapLines,
  toggleSyntaxHighlight,
} = settingsSlice.actions;
export default settingsSlice.reducer;