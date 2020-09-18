import { createSlice, createAsyncThunk, AsyncThunk, Slice } from "@reduxjs/toolkit";

import { requestGetProjectProfilesLoss } from "../api";

/**
 * Async thunk for making a request to get the starting page for a project's loss profiles
 *
 * @type {AsyncThunk<Promise<*>, {readonly projectId?: *}, {}>}
 */
export const getProfilesLossThunk = createAsyncThunk(
  "selectedProfilesLoss/getProjectProfilesLoss",
  async ({ projectId }) => {
    const body = await requestGetProjectProfilesLoss(projectId);

    return body.profiles;
  }
);

/**
 * Slice for handling the selected project's loss profiles state in the redux store.
 *
 * @type {Slice<{val: [], error: null, projectId: null, status: string}, {}, string>}
 */
const selectedProfilesLossSlice = createSlice({
  name: "selectedProfilesLoss",
  initialState: {
    val: [],
    status: "idle",
    error: null,
    projectId: null,
  },
  reducers: {},
  extraReducers: {
    [getProfilesLossThunk.pending]: (state, action) => {
      state.status = "loading";
      state.projectId = action.meta.arg.projectId;
    },
    [getProfilesLossThunk.fulfilled]: (state, action) => {
      state.status = "succeeded";
      state.val = action.payload;
      state.projectId = action.meta.arg.projectId;
    },
    [getProfilesLossThunk.rejected]: (state, action) => {
      state.status = "failed";
      state.error = action.error.message;
      state.projectId = action.meta.arg.projectId;
    },
  },
});

/***
 * Available actions for selectedProfilesLoss redux store
 */
export const {} = selectedProfilesLossSlice.actions;

/**
 * Simple selector to get the current selected loss profiles state
 * including the val, status, error, and projectId
 *
 * @param state - the redux store state
 * @returns {Reducer<State> | Reducer<{val: *[], error: null, projectId: null, status: string}>}
 */
export const selectSelectedProfilesLossState = (state) => state.selectedProfilesLoss;

export default selectedProfilesLossSlice.reducer;
