/*
Copyright (c) 2021 - present / Neuralmagic, Inc. All Rights Reserved.

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

import { createSlice, createAsyncThunk, AsyncThunk, Slice } from "@reduxjs/toolkit";

/**
 * Slice for handling the serverStatus info in the redux store.
 *
 * @type {Slice<{val: [], error: null, status: string}, {}, string>}
 */
const serverStatusSlice = createSlice({
  name: "serverStatus",
  initialState: {
    online: null,
    status: "idle",
    error: null,
  },
  reducers: {
    serverLoading: (state, action) => {
      state.status = "loading";
    },
    serverOnline: (state, action) => {
      state.status = "success";
      state.online = true;
    },
    serverOffline: (state, action) => {
      state.status = "rejected";
      state.online = false;
    },
  },
});

/**
 * Available actions for serverStatus redux store
 */
export const { serverOnline, serverOffline, serverLoading } = serverStatusSlice.actions;

/**
 * Simple selector to get the current serverStatus state
 * including the val, status, and error
 *
 * @param state - the redux store state
 * @returns {Reducer<State> | Reducer<{serverOnline: null, error: null, status: string}>}
 */
export const selectServerState = (state) => state.serverStatus;

export default serverStatusSlice.reducer;
