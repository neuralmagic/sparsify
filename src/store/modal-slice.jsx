import { createSlice } from "@reduxjs/toolkit";

/**
 * Slice for handling the modals' open status in the redux store
 *
 * @type {Slice<{perfModalOpen: boolean, lossModalOpen: boolean, optimVersionModalOpen:boolean}, {}, string>}
 */
const modalsSlice = createSlice({
  name: "modals",
  initialState: {
    perfModalOpen: false,
    lossModalOpen: false,
    optimVersionModalOpen: false,
  },
  reducers: {
    setPerfModalOpen: (state, action) => {
      state.perfModalOpen = action.payload;
      if (state.perfModalOpen) {
        state.lossModalOpen = false;
        state.optimVersionModalOpen = false;
      }
    },
    setLossModalOpen: (state, action) => {
      state.lossModalOpen = action.payload;
      if (state.lossModalOpen) {
        state.perfModalOpen = false;
        state.optimVersionModalOpen = false;
      }
    },
    setOptimVersionModalOpen: (state, action) => {
      state.optimVersionModalOpen = action.payload;
      if (state.optimVersionModalOpen) {
        state.perfModalOpen = false;
        state.lossModalOpen = false;
      }
    },
  },
});

/**
 * Available actions for modalsSlice redux store
 */
export const {
  setPerfModalOpen,
  setLossModalOpen,
  setOptimVersionModalOpen,
} = modalsSlice.actions;

/**
 * Simple selector to get the modals' open status
 *
 * @param state - the redux store state
 * @returns {Reducer<State> | Reducer<{perfModalOpen: boolean, lossModalOpen: boolean, optimVersionModalOpen:boolean}>}
 */
export const selectModalsState = (state) => state.modals;

export default modalsSlice.reducer;
