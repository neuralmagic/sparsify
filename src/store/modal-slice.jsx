import { createSlice } from "@reduxjs/toolkit";

/**
 * Slice for handling the modals' open status in the redux store
 *
 * @type {Slice<{error: null}, {}, string>}
 */
const modalsSlice = createSlice({
  name: "modals",
  initialState: {
    perfModalOpen: false,
  },
  reducers: {
    setPerfModalOpen: (state, action) => {
      state.perfModalOpen = action.payload;
    },
  },
});

/**
 * Available actions for modalsSlice redux store
 */
export const { setPerfModalOpen } = modalsSlice.actions;

/**
 * Simple selector to get the modals' open status
 *
 * @param state - the redux store state
 * @returns {Reducer<State> | Reducer<{perfModalOpen: boolean}>}
 */
export const selectModalsState = (state) => state.modals;

export default modalsSlice.reducer;
