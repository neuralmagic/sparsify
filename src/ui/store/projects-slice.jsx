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
      state.error = null;
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
