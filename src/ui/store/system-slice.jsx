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

import { createSlice, createAsyncThunk, AsyncThunk, Slice } from "@reduxjs/toolkit";

import { requestGetSystemInfo } from "../api";
import {
  createAsyncThunkWrapper,
  STATUS_FAILED,
  STATUS_IDLE,
  STATUS_LOADING,
  STATUS_SUCCEEDED,
} from "./utils";

/**
 * Async thunk for making a request to get the system info from the server
 *
 * @type {AsyncThunk<Promise<*>, void, {}>}
 */
export const getSystemInfoThunk = createAsyncThunkWrapper(
  "system/getSystemInfo",
  async () => {
    const body = await requestGetSystemInfo();
    return body.info;
  }
);

/**
 * Slice for handling the system info in the redux store.
 *
 * @type {Slice<{val: [], error: null, status: string}, {}, string>}
 */
const systemSlice = createSlice({
  name: "system",
  initialState: {
    val: null,
    status: STATUS_IDLE,
    error: null,
  },
  extraReducers: {
    [getSystemInfoThunk.pending]: (state, action) => {
      state.status = STATUS_LOADING;
    },
    [getSystemInfoThunk.fulfilled]: (state, action) => {
      state.status = STATUS_SUCCEEDED;
      state.val = action.payload;
      state.error = null;
    },
    [getSystemInfoThunk.rejected]: (state, action) => {
      state.status = STATUS_FAILED;
      state.error = action.error.message;
    },
  },
});

/***
 * Available actions for system redux store
 */
export const {} = systemSlice.actions;

/**
 * Simple selector to get the system state
 * including the val, status, error, and projectId
 *
 * @param state - the redux store state
 * @returns {Reducer<State> | Reducer<{val: {}, error: null, status: string}>}
 */
export const selectSystemState = (state) => state.system;

export default systemSlice.reducer;
