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

import {
  requestGetProjectConfig,
  requestGetAvailableCodeSamples,
  requestGetAvailableFrameworks,
  requestGetCodeSample,
} from "../api";

/**
 * Async thunk for making a request to get a project optimizer's config
 *
 * @type {AsyncThunk<Promise<*>, {readonly projectId?: *, readonly optimId?: *, readonly framework?: *}, {}>}
 */
export const getConfigThunk = createAsyncThunkWrapper(
  "selectedProjectConfig/getProjectConfig",
  async ({ projectId, optimId, framework }) => {
    const body = await requestGetProjectConfig(projectId, optimId, framework);
    return body;
  }
);

/**
 * Async thunk for making a request to get a project's available frameworks
 *
 * @type {AsyncThunk<Promise<*>, {readonly projectId?: *,}, {}>}
 */
export const getAvailableFrameworksThunk = createAsyncThunkWrapper(
  "selectedProjectConfig/getAvailableFrameworks",
  async ({ projectId }) => {
    const body = await requestGetAvailableFrameworks(projectId);

    return body.frameworks;
  }
);

/**
 * Async thunk for making a request to get a project's available frameworks
 *
 * @type {AsyncThunk<Promise<*>, {readonly projectId?: *, readonly framework?: *}, {}>}
 */
export const getAvailableCodeSamplesThunk = createAsyncThunkWrapper(
  "selectedProjectConfig/getAvailableCodeSamples",
  async ({ projectId, framework }) => {
    const body = await requestGetAvailableCodeSamples(projectId, framework);

    return body.samples;
  }
);

/**
 * Async thunk for making a request to get a code sample
 *
 * @type {AsyncThunk<Promise<*>, {readonly projectId?: *, readonly framework?: *, readonly sampleType?: *}, {}>}
 */
export const getCodeSampleThunk = createAsyncThunkWrapper(
  "selectedProjectConfig/getCodeSample",
  async ({ projectId, framework, sampleType }) => {
    const body = await requestGetCodeSample(projectId, framework, sampleType);

    return body;
  }
);

/**
 * Slice for handling the selected project's config state in the redux store.
 *
 * @type {Slice<{config: {}, codeSamples: {}, availableFrameworks: [], availableCodeSamples: [], error: null, projectId: null, optimId: null, status: string}, {}, string>}
 */
const selectedConfigSlice = createSlice({
  name: "selectedProjectConfig",
  initialState: {
    config: {},
    codeSamples: {},
    availableFrameworks: [],
    availableCodeSamples: {},
    status: "idle",
    configStatus: "idle",
    codeSampleStatus: "idle",
    configError: null,
    codeSampleError: null,
    error: null,
    projectId: null,
    optimId: null,
  },
  reducers: {},
  extraReducers: {
    [getConfigThunk.pending]: (state, action) => {
      state.configStatus = "loading";
      state.projectId = action.meta.arg.projectId;
      state.optimId = action.meta.arg.optimId;
      state.configError = null;
    },
    [getConfigThunk.fulfilled]: (state, action) => {
      state.configStatus = "succeeded";
      state.projectId = action.meta.arg.projectId;
      state.optimId = action.meta.arg.optimId;
      state.config[action.meta.arg.framework] = action.payload;
      state.configError = null;
    },
    [getConfigThunk.rejected]: (state, action) => {
      state.configStatus = "failed";
      state.configError = action.error.message;
      state.projectId = action.meta.arg.projectId;
      state.optimId = action.meta.arg.optimId;
    },
    [getAvailableFrameworksThunk.pending]: (state, action) => {
      state.status = "loading";
      state.projectId = action.meta.arg.projectId;
      state.error = null;
    },
    [getAvailableFrameworksThunk.fulfilled]: (state, action) => {
      state.status = "succeeded";
      state.projectId = action.meta.arg.projectId;
      state.availableFrameworks = action.payload;
      state.error = null;
    },
    [getAvailableFrameworksThunk.rejected]: (state, action) => {
      state.status = "failed";
      state.error = action.error.message;
      state.projectId = action.meta.arg.projectId;
    },
    [getAvailableCodeSamplesThunk.pending]: (state, action) => {
      state.status = "loading";
      state.projectId = action.meta.arg.projectId;
      state.error = null;
    },
    [getAvailableCodeSamplesThunk.fulfilled]: (state, action) => {
      state.status = "succeeded";
      state.projectId = action.meta.arg.projectId;
      state.availableCodeSamples[action.meta.arg.framework] = action.payload;
      state.error = null;
    },
    [getAvailableCodeSamplesThunk.rejected]: (state, action) => {
      state.status = "failed";
      state.error = action.error.message;
      state.projectId = action.meta.arg.projectId;
    },
    [getCodeSampleThunk.pending]: (state, action) => {
      state.codeSampleStatus = "loading";
      state.projectId = action.meta.arg.projectId;
      state.codeSampleError = null;
    },
    [getCodeSampleThunk.fulfilled]: (state, action) => {
      state.codeSampleStatus = "succeeded";
      state.projectId = action.meta.arg.projectId;
      if (!(action.meta.arg.framework in state.codeSamples)) {
        state.codeSamples[action.meta.arg.framework] = {};
      }
      state.codeSamples[action.meta.arg.framework][action.meta.arg.sampleType] =
        action.payload;
      state.codeSampleError = null;
    },
    [getCodeSampleThunk.rejected]: (state, action) => {
      state.codeSampleStatus = "failed";
      state.codeSampleError = action.error.message;
      state.projectId = action.meta.arg.projectId;
    },
  },
});

/***
 * Available actions for selectedConfig redux store
 */
export const {} = selectedConfigSlice.actions;

/**
 * Simple selector to get the current selected config state
 * including the val, status, error, and projectId
 *
 * @param state - the redux store state
 * @returns {Reducer<State> | Reducer<{config: {}, codeSamples: {}, availableFrameworks: *[], availableCodeSamples: *[],  error: null, projectId: null, optimId: null, status: string}>}
 */
export const selectSelectedConfigState = (state) => state.selectedConfig;

export default selectedConfigSlice.reducer;
