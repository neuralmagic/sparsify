/*
Copyright 2021-present Neuralmagic, Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing,
software distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

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
