import { createSlice } from '@reduxjs/toolkit';

const configSlice = createSlice({
  name: 'config',
  initialState: { randomize: false, showSide: 'front' },
  reducers: {
    setDeckConfig: (state, action) => {
      return action.payload; // action.payload should be the config object
    },
  },
});

export const { setDeckConfig } = configSlice.actions;
export default configSlice.reducer;
