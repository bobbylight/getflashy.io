import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Define the async thunk for fetching deck metadata
export const fetchDeckMetadata = createAsyncThunk(
  'decks/fetchDeckMetadata',
  async () => {
    const response = await fetch('/api/decks'); // Replace jQuery $.ajax with native fetch
    if (!response.ok) {
      throw new Error('Failed to fetch deck metadata');
    }
    const data = await response.json();
    return data;
  }
);

const decksSlice = createSlice({
  name: 'decks',
  initialState: {
    data: {}, // Store deck metadata here
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {
    // No regular reducers needed for this slice yet
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDeckMetadata.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchDeckMetadata.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload; // action.payload contains the fetched data
      })
      .addCase(fetchDeckMetadata.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default decksSlice.reducer;