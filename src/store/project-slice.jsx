import { createSlice, createAsyncThunk, AsyncThunk, Slice } from "@reduxjs/toolkit";

import {requestDeleteProject, requestGetProject, requestUpdateProject} from "../api";

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
 * Async thunk for making a request to update/select a project
 *
 * @type {AsyncThunk<Promise<*>, {readonly projectId?: *}, {}>}
 */
export const updateProjectThunk = createAsyncThunk(
  "selectedProject/updateProject",
  async ({
    projectId,
    name,
    description,
    trainingOptimizer,
    trainingEpochs,
    trainingLRInit,
    trainingLRFinal,
  }) => {
    const body = await requestUpdateProject(
      projectId,
      name,
      description,
      trainingOptimizer,
      trainingEpochs,
      trainingLRInit,
      trainingLRFinal
    );

    return body.project;
  }
);

/**
 * Async thunk for making a request to delete a project
 *
 * @type {AsyncThunk<Promise<*>, {readonly projectId?: *}, {}>}
 */
export const deleteProjectThunk = createAsyncThunk(
    "selectedProject/deleteProject",
    async ({ projectId }) => {
      const body = await requestDeleteProject(projectId);

      return body;
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
    deleted: false,
  },
  reducers: {},
  extraReducers: {
    [getProjectThunk.pending]: (state, action) => {
      state.status = "loading";
      state.projectId = action.meta.arg.projectId;
      state.deleted = false;
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
    [updateProjectThunk.pending]: (state, action) => {
      state.status = "loading";
      state.projectId = action.meta.arg.projectId;
      state.deleted = false;
    },
    [updateProjectThunk.fulfilled]: (state, action) => {
      state.status = "succeeded";
      state.val = action.payload;
      state.projectId = action.meta.arg.projectId;
    },
    [updateProjectThunk.rejected]: (state, action) => {
      state.status = "failed";
      state.error = action.error.message;
      state.projectId = action.meta.arg.projectId;
    },
    [deleteProjectThunk.pending]: (state, action) => {
      state.status = "loading";
      state.projectId = action.meta.arg.projectId;
      state.deleted = false;
    },
    [deleteProjectThunk.fulfilled]: (state, action) => {
      state.status = "succeeded";
      state.deleted = true;
      state.projectId = action.meta.arg.projectId;
    },
    [deleteProjectThunk.rejected]: (state, action) => {
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
