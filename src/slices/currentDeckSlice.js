import { createSlice } from '@reduxjs/toolkit';

const currentDeckSlice = createSlice({
  name: 'currentDeck',
  initialState: null, // Initial state for currentDeck
  reducers: {
    configureDeck: (state, action) => {
      // Assuming action.payload is the deckId, as createSlice actions put their argument into payload
      return action.payload;
    },
    startDeck: (state, action) => {
      // Assuming action.payload is the deckId
      return action.payload;
    },
  },
});

export const { configureDeck, startDeck } = currentDeckSlice.actions;
export default currentDeckSlice.reducer;
