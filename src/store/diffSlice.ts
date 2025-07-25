import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { compareZipEntries, DiffResult, FileEntry } from '@/services/zipDiff';

interface DiffState {
  result: DiffResult | null;
  selectedFile: string | null;
  loading: boolean;
  error: string | null;
  viewMode: 'split' | 'unified';
  showUnchanged: boolean;
}

const initialState: DiffState = {
  result: null,
  selectedFile: null,
  loading: false,
  error: null,
  viewMode: 'split',
  showUnchanged: false,
};

export const generateDiff = createAsyncThunk(
  'diff/generate',
  async ({ zip1, zip2 }: { zip1: FileEntry[]; zip2: FileEntry[] }) => {
    return compareZipEntries(zip1, zip2);
  }
);

const diffSlice = createSlice({
  name: 'diff',
  initialState,
  reducers: {
    setSelectedFile: (state, action: PayloadAction<string | null>) => {
      state.selectedFile = action.payload;
    },
    setViewMode: (state, action: PayloadAction<'split' | 'unified'>) => {
      state.viewMode = action.payload;
    },
    toggleShowUnchanged: (state) => {
      state.showUnchanged = !state.showUnchanged;
    },
    clearError: (state) => {
      state.error = null;
    },
    reset: (state) => {
      state.result = null;
      state.selectedFile = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateDiff.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateDiff.fulfilled, (state, action) => {
        state.loading = false;
        state.result = action.payload;
      })
      .addCase(generateDiff.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to generate diff';
      });
  },
});

export const {
  setSelectedFile,
  setViewMode,
  toggleShowUnchanged,
  clearError,
  reset,
} = diffSlice.actions;
export default diffSlice.reducer;