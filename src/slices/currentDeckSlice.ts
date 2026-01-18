import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Assuming DeckId is a string, adjust if it's a more complex type
type DeckId = string | null;

const currentDeckSlice = createSlice({
  name: 'currentDeck',
  initialState: null as DeckId, // Initial state for currentDeck
  reducers: {
    configureDeck: (state, action: PayloadAction<string>) => {
      // Assuming action.payload is the deckId, as createSlice actions put their argument into payload
      return action.payload;
    },
    startDeck: (state, action: PayloadAction<string>) => {
      // Assuming action.payload is the deckId
      return action.payload;
    },
  },
});

export const { configureDeck, startDeck } = currentDeckSlice.actions;
export default currentDeckSlice.reducer;
