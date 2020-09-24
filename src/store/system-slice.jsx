import { createSlice, createAsyncThunk, AsyncThunk, Slice } from "@reduxjs/toolkit";

import { requestGetSystemInfo } from "../api";
import { createAsyncThunkWrapper } from "./utils";
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
    status: "idle",
    error: null,
  },
  extraReducers: {
    [getSystemInfoThunk.pending]: (state, action) => {
      state.status = "loading";
    },
    [getSystemInfoThunk.fulfilled]: (state, action) => {
      state.status = "succeeded";
      state.val = action.payload;
      state.error = null;
    },
    [getSystemInfoThunk.rejected]: (state, action) => {
      state.status = "failed";
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
