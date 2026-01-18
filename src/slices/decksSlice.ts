import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// Define a basic interface for individual deck metadata
// We don't have a clear structure yet, so keep it general.
export interface DeckMetadata {
  id: string; // Assuming an id
  name: string;
  icon?: {
    name: string;
    color: string;
  };
  size: number; // Added property
  modified: string; // Added property
}

// Define the shape of the decks data, assuming it's an object of DeckMetadata keyed by ID
export interface DecksData {
  [id: string]: DeckMetadata;
}

// Define the overall state shape for the decks slice
interface DecksState {
  data: DecksData;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

// Define the async thunk for fetching deck metadata
export const fetchDeckMetadata = createAsyncThunk(
  'decks/fetchDeckMetadata',
  async (): Promise<DecksData> => { // Specify return type for the thunk
    const response = await fetch('/api/decks');
    if (!response.ok) {
      throw new Error('Failed to fetch deck metadata');
    }
    const data: DecksData = await response.json(); // Type the JSON response
    return data;
  }
);

const initialState: DecksState = {
  data: {},
  status: 'idle',
  error: null,
};

const decksSlice = createSlice({
  name: 'decks',
  initialState,
  reducers: {
    // No regular reducers needed for this slice yet
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDeckMetadata.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchDeckMetadata.fulfilled, (state, action: PayloadAction<DecksData>) => {
        state.status = 'succeeded';
        state.data = action.payload; // action.payload contains the fetched data
      })
      .addCase(fetchDeckMetadata.rejected, (state, action) => {
        state.status = 'failed';
        // action.error.message can be undefined, so handle that
        state.error = action.error.message || 'An unknown error occurred';
      });
  },
});

export default decksSlice.reducer;
