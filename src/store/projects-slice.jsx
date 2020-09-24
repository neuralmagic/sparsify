import { createSlice, createAsyncThunk, AsyncThunk, Slice } from "@reduxjs/toolkit";
import { createAsyncThunkWrapper } from "./utils";

import { requestGetProjects } from "../api";

/**
 * Async thunk for making a request to get the starting page for the projects on the server
 *
 * @type {AsyncThunk<Promise<*>, void, {}>}
 */
export const getProjectsThunk = createAsyncThunkWrapper(
  "projects/getProjects",
  async () => {
    const body = await requestGetProjects();

    return body.projects;
  }
);

/**
 * Slice for handling the projects states in the redux store.
 *
 * @type {Slice<{val: [], error: null, status: string}, {}, string>}
 */
const projectsSlice = createSlice({
  name: "projects",
  initialState: {
    val: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: {
    [getProjectsThunk.pending]: (state, action) => {
      state.status = "loading";
    },
    [getProjectsThunk.fulfilled]: (state, action) => {
      state.status = "succeeded";
      state.val = action.payload;
    },
    [getProjectsThunk.rejected]: (state, action) => {
      state.status = "failed";
      state.error = action.error.message;
    },
  },
});

/**
 * Available actions for projects redux store
 */
export const {} = projectsSlice.actions;

/**
 * Simple selector to get the current projects state
 * including the val, status, and error
 *
 * @param state - the redux store state
 * @returns {Reducer<State> | Reducer<{val: null, error: null, projectId: null, status: string}>}
 */
export const selectProjectsState = (state) => state.projects;

export default projectsSlice.reducer;
