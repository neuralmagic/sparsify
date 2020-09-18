import { createSlice, createAsyncThunk, AsyncThunk, Slice } from "@reduxjs/toolkit";

import { requestGetProjectProfilesPerf } from "../api";

/**
 * Async thunk for making a request to get the starting page for a project's performance profiles
 *
 * @type {AsyncThunk<Promise<*>, {readonly projectId?: *}, {}>}
 */
export const getProfilesPerfThunk = createAsyncThunk(
  "selectedProfilesPerf/getProjectProfilesPerf",
  async ({ projectId }) => {
    const body = await requestGetProjectProfilesPerf(projectId);

    return body.profiles;
  }
);

/**
 * Slice for handling the selected project's performance profiles state in the redux store.
 *
 * @type {Slice<{val: [], error: null, projectId: null, status: string}, {}, string>}
 */
const selectedProfilesPerfSlice = createSlice({
  name: "selectedProfilesPerf",
  initialState: {
    val: [],
    status: "idle",
    error: null,
    projectId: null,
  },
  reducers: {},
  extraReducers: {
    [getProfilesPerfThunk.pending]: (state, action) => {
      state.status = "loading";
      state.projectId = action.meta.arg.projectId;
    },
    [getProfilesPerfThunk.fulfilled]: (state, action) => {
      state.status = "succeeded";
      state.val = action.payload;
      state.projectId = action.meta.arg.projectId;
    },
    [getProfilesPerfThunk.rejected]: (state, action) => {
      state.status = "failed";
      state.error = action.error.message;
      state.projectId = action.meta.arg.projectId;
    },
  },
});

/***
 * Available actions for selectedProfilesPerf redux store
 */
export const {} = selectedProfilesPerfSlice.actions;

/**
 * Simple selector to get the current selected performance profiles state
 * including the val, status, error, and projectId
 *
 * @param state - the redux store state
 * @returns {Reducer<State> | Reducer<{val: *[], error: null, projectId: null, status: string}>}
 */
export const selectSelectedProfilesPerfState = (state) => state.selectedProfilesPerf;

export default selectedProfilesPerfSlice.reducer;
