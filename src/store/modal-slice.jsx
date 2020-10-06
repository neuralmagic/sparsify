import { createSlice } from "@reduxjs/toolkit";

/**
 * Slice for handling the modals' open status in the redux store
 *
 * @type {Slice<{perfModalOpen: boolean, lossModalOpen: boolean}, {}, string>}
 */
const modalsSlice = createSlice({
  name: "modals",
  initialState: {
    perfModalOpen: false,
    lossModalOpen: false,
  },
  reducers: {
    setPerfModalOpen: (state, action) => {
      state.perfModalOpen = action.payload;
      if (state.perfModalOpen) {
        state.lossModalOpen = false;
      }
    },
    setLossModalOpen: (state, action) => {
      state.lossModalOpen = action.payload;
      if (state.lossModalOpen) {
        state.perfModalOpen = false;
      }
    },
  },
});

/**
 * Available actions for modalsSlice redux store
 */
export const { setPerfModalOpen, setLossModalOpen } = modalsSlice.actions;

/**
 * Simple selector to get the modals' open status
 *
 * @param state - the redux store state
 * @returns {Reducer<State> | Reducer<{perfModalOpen: boolean, lossModalOpen: boolean}>}
 */
export const selectModalsState = (state) => state.modals;

export default modalsSlice.reducer;
