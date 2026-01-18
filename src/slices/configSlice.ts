import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ConfigState {
  randomize: boolean;
  showSide: 'front' | 'back';
  showDetails: 'always' | 'never' | 'beforeFlipping';
}

const initialState: ConfigState = { randomize: false, showSide: 'front', showDetails: 'always' }; // Updated initialState

const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {
    setDeckConfig: (state, action: PayloadAction<ConfigState>) => {
      return action.payload; // action.payload should be the config object
    },
  },
});

export const { setDeckConfig } = configSlice.actions;
export default configSlice.reducer;
