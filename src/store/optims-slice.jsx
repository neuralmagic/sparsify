import {
  compose,
  path,
  propEq,
  find,
  curry,
  map,
  when,
  always,
  mergeRight,
  tap,
} from "ramda";
import { createSlice, createAsyncThunk, AsyncThunk, Slice } from "@reduxjs/toolkit";

import {
  requestGetProjectOptims,
  requestChangeModifierSettings,
  requestCreateProjectOptimizer,
} from "../api";

/**
 * Async thunk for making a request to create a project optimizer
 *
 * @type {AsyncThunk<Promise<*>, {readonly projectId?: *, name?: string, add_pruning?: boolean, add_quantization?: boolean, add_lr_schedule?: boolean, add_trainable?: boolean}, {}>}
 */
export const createOptimThunk = createAsyncThunk(
  "selectedOptims/createProjectOptims",
  async ({
    projectId,
    name,
    add_pruning,
    add_quantization,
    add_lr_schedule,
    add_trainable,
  }) => {
    const body = await requestCreateProjectOptimizer(
      projectId,
      name,
      add_pruning,
      add_quantization,
      add_lr_schedule,
      add_trainable
    );

    return body.optim;
  }
);

/**
 * Async thunk for making a request to get the starting page for a project's optimizers
 *
 * @type {AsyncThunk<Promise<*>, {readonly projectId?: *}, {}>}
 */
export const getOptimsThunk = createAsyncThunk(
  "selectedOptims/getProjectOptims",
  async ({ projectId }) => {
    const body = await requestGetProjectOptims(projectId);

    return body.optims;
  }
);

export const changeModifierSettingsThunk = createAsyncThunk(
  "selectedOptims/changeModifierSettings",
  async ({ projectId, modifierId, optimId, settings }, thunk) => {
    const body = await requestChangeModifierSettings(
      projectId,
      optimId,
      modifierId,
      settings
    );

    return body.optim;
  }
);

/**
 * Slice for handling the selected project's optimizations state in the redux store.
 *
 * @type {Slice<{val: [], error: null, projectId: null, status: string}, {}, string>}
 */
const selectedOptimsSlice = createSlice({
  name: "selectedOptims",
  initialState: {
    val: [],
    status: "idle",
    error: null,
    projectId: null,
    selectedId: null,
    selectedProfilePerfId: null,
    selectedProfileLossId: null,
  },
  reducers: {
    setSelectedOptim: (state, action) => {
      state.selectedId = action.payload;
    },
    setSelectedOptimProfilePerf: (state, action) => {
      state.selectedProfilePerfId = action.payload;
    },
    setSelectedOptimProfileLoss: (state, action) => {
      state.selectedProfileLossId = action.payload;
    },
  },
  extraReducers: {
    [getOptimsThunk.pending]: (state, action) => {
      state.status = "loading";
      state.projectId = action.meta.arg.projectId;
    },
    [getOptimsThunk.fulfilled]: (state, action) => {
      state.status = "succeeded";
      state.val = action.payload;
      state.projectId = action.meta.arg.projectId;
    },
    [getOptimsThunk.rejected]: (state, action) => {
      state.status = "failed";
      state.error = action.error.message;
      state.projectId = action.meta.arg.projectId;
    },
    [changeModifierSettingsThunk.fulfilled]: (state, action) => {
      state.val = map(
        when(propEq("optim_id", action.payload.optim_id), always(action.payload)),
        state.val
      );
    },
    [createOptimThunk.pending]: (state, action) => {
      state.status = "loading";
      state.projectId = action.meta.arg.projectId;
    },
    [createOptimThunk.fulfilled]: (state, action) => {
      state.status = "succeeded";
      state.val.push(action.payload);
      state.projectId = action.meta.arg.projectId;
    },
    [createOptimThunk.rejected]: (state, action) => {
      state.status = "failed";
      state.error = action.error.message;
      state.projectId = action.meta.arg.projectId;
    },
  },
});

/***
 * Available actions for selectedOptims redux store
 */
export const {
  setSelectedOptim,
  setSelectedOptimProfilePerf,
  setSelectedOptimProfileLoss,
} = selectedOptimsSlice.actions;

/**
 * Simple selector to get the current selected optimizations state
 * including the val, status, error, and projectId
 *
 * @param state - the redux store state
 * @returns {Reducer<State> | Reducer<{val: *[], error: null, projectId: null, status: string}>}
 */
export const selectSelectedOptimsState = (state) => state.selectedOptims;
export const selectedOptimById = curry((id, state) =>
  compose(find(propEq("optim_id", id)), path(["selectedOptims", "val"]))(state)
);

export default selectedOptimsSlice.reducer;
