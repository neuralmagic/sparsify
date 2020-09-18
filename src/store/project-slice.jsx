import { createSlice, createAsyncThunk, AsyncThunk, Slice } from "@reduxjs/toolkit";

import { requestGetProject } from "../api";

/**
 * Async thunk for making a request to get/select a project
 *
 * @type {AsyncThunk<Promise<*>, {readonly projectId?: *}, {}>}
 */
export const getProjectThunk = createAsyncThunk(
  "selectedProject/getProject",
  async ({ projectId }) => {
    const body = await requestGetProject(projectId);

    return body.project;
  }
);

/**
 * Slice for handling the selected projects state in the redux store.
 *
 * @type {Slice<{val: null, error: null, projectId: null, status: string}, {}, string>}
 */
const selectedProjectSlice = createSlice({
  name: "selectedProject",
  initialState: {
    val: null,
    status: "idle",
    error: null,
    projectId: null,
  },
  reducers: {},
  extraReducers: {
    [getProjectThunk.pending]: (state, action) => {
      state.status = "loading";
      state.projectId = action.meta.arg.projectId;
    },
    [getProjectThunk.fulfilled]: (state, action) => {
      state.status = "succeeded";
      state.val = action.payload;
      state.projectId = action.meta.arg.projectId;
    },
    [getProjectThunk.rejected]: (state, action) => {
      state.status = "failed";
      state.error = action.error.message;
      state.projectId = action.meta.arg.projectId;
    },
  },
});

/***
 * Available actions for selectedProfile redux store
 */
export const {} = selectedProjectSlice.actions;

/**
 * Simple selector to get the current selected performance profiles state
 * including the val, status, error, and projectId
 *
 * @param state - the redux store state
 * @returns {Reducer<State>|Reducer<{val: null, error: null, projectId: null, status: string}>}
 */
export const selectSelectedProjectState = (state) => state.selectedProject;

export default selectedProjectSlice.reducer;
