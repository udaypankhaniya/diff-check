import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { extractZipEntries, FileEntry } from '@/services/zipDiff';

interface ZipState {
  files: {
    zip1: FileEntry[] | null;
    zip2: FileEntry[] | null;
  };
  uploadedFiles: {
    zip1: File | null;
    zip2: File | null;
  };
  loading: boolean;
  progress: number;
  error: string | null;
}

const initialState: ZipState = {
  files: {
    zip1: null,
    zip2: null,
  },
  uploadedFiles: {
    zip1: null,
    zip2: null,
  },
  loading: false,
  progress: 0,
  error: null,
};

export const processZipFiles = createAsyncThunk(
  'zip/processFiles',
  async (
    { zip1, zip2 }: { zip1: File; zip2: File },
    { dispatch }
  ) => {
    dispatch(setProgress(10));
    
    const [entries1, entries2] = await Promise.all([
      extractZipEntries(await zip1.arrayBuffer()),
      extractZipEntries(await zip2.arrayBuffer()),
    ]);
    
    dispatch(setProgress(100));
    
    return { zip1: entries1, zip2: entries2 };
  }
);

const zipSlice = createSlice({
  name: 'zip',
  initialState,
  reducers: {
    setUploadedFile: (
      state,
      action: PayloadAction<{ key: 'zip1' | 'zip2'; file: File | null }>
    ) => {
      state.uploadedFiles[action.payload.key] = action.payload.file;
      if (!action.payload.file) {
        state.files[action.payload.key] = null;
      }
    },
    setProgress: (state, action: PayloadAction<number>) => {
      state.progress = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    reset: (state) => {
      state.files = { zip1: null, zip2: null };
      state.uploadedFiles = { zip1: null, zip2: null };
      state.loading = false;
      state.progress = 0;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(processZipFiles.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.progress = 0;
      })
      .addCase(processZipFiles.fulfilled, (state, action) => {
        state.loading = false;
        state.files = action.payload;
        state.progress = 100;
      })
      .addCase(processZipFiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to process ZIP files';
        state.progress = 0;
      });
  },
});

export const { setUploadedFile, setProgress, clearError, reset } = zipSlice.actions;
export default zipSlice.reducer;