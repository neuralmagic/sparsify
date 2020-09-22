import { createSlice, createAsyncThunk, AsyncThunk, Slice } from "@reduxjs/toolkit";

import { requestGetProjectOptimBestEstimated } from "../api";

/**
 * Async thunk for making a request to get the best estimated values
 * for a project's optimization
 *
 * @type {AsyncThunk<Promise<*>, {readonly projectId?: *}, {}>}
 */
export const getOptimsBestEstimatedThunk = createAsyncThunk(
  "selectedOptimsBestEstimated/",
  async ({ projectId, profilePerfId, profileLossId }) => {
    const body = await requestGetProjectOptimBestEstimated(
      projectId,
      profilePerfId,
      profileLossId
    );

    return body;
  }
);

/**
 * Slice for handling the selected project's the state for the
 * best estimated values for optimization in the redux store.
 *
 * @type {Slice<{
 *     val: {}, error: string, projectId: string,
 *     profilePerfId: string, profileLossId: string,  status: string
 *   }, {}, string>
 * }
 */
const selectedOptimsBestEstimatedSlice = createSlice({
  name: "selectedOptimsBestEstimated",
  initialState: {
    val: null,
    status: "idle",
    error: null,
    projectId: null,
    profilePerfId: null,
    profileLossId: null,
  },
  reducers: {},
  extraReducers: {
    [getOptimsBestEstimatedThunk.pending]: (state, action) => {
      state.status = "loading";
      state.val = null;
      state.projectId = action.meta.arg.projectId;
      state.profilePerfId = action.meta.arg.profilePerfId;
      state.profileLossId = action.meta.arg.profileLossId;
    },
    [getOptimsBestEstimatedThunk.fulfilled]: (state, action) => {
      state.status = "succeeded";
      state.val = action.payload;
      state.projectId = action.meta.arg.projectId;
      state.profilePerfId = action.meta.arg.profilePerfId;
      state.profileLossId = action.meta.arg.profileLossId;
    },
    [getOptimsBestEstimatedThunk.rejected]: (state, action) => {
      state.status = "failed";
      state.error = action.error.message;
      state.projectId = action.meta.arg.projectId;
      state.profilePerfId = action.meta.arg.profilePerfId;
      state.profileLossId = action.meta.arg.profileLossId;
    },
  },
});

/***
 * Available actions for selectedOptimsBestEstimated redux store
 */
export const {} = selectedOptimsBestEstimatedSlice.actions;

/**
 * Simple selector to get the current selected best estimated optimizations state
 * including the val, status, error, projectId, profileLossId, and profilePerfId
 *
 * @param state - the redux store state
 * @returns {
 *   Reducer<State> |
 *   Reducer<{
 *     val: {}, error: string, projectId: string,
 *     profilePerfId: string, profileLossId: string, status: string
 *   }>
 * }
 */
export const selectSelectedOptimsBestEstimated = (state) =>
  state.selectedOptimsBestEstimated;

export default selectedOptimsBestEstimatedSlice.reducer;
