import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunkWrapper } from "../store/utils";

import {
  requestCreateProjectOptimizer,
  requestCreateProjectOptimVersion,
  requestUpdateOptim,
  requestUpdateOptimModifierPruning,
  requestUpdateProject,
} from "../api";

/**
 * Async thunk for making a request to create a new optimization version
 *
 * @type {AsyncThunk<Promise<*>, {readonly projectId?: string, optimId?: string, name?: string, notes?: string, abortController?: AbortController}, {}>}
 */
export const createOptimVersionThunk = createAsyncThunkWrapper(
  "createdOptims/createProjectsOptimsVersionThunk",
  async ({ projectId, optimId, name, notes, abortController = undefined }) => {
    const body = await requestCreateProjectOptimVersion(
      projectId,
      optimId,
      name,
      notes,
      abortController
    );

    return body.optim;
  }
);

/**
 * Async thunk for making a request to create a project optimizer
 *
 * @type {AsyncThunk<Promise<*>, {readonly projectId?: *, name?: string, add_pruning?: boolean, add_quantization?: boolean, add_lr_schedule?: boolean, add_trainable?: boolean}, {}>}
 */
export const createOptimThunk = createAsyncThunkWrapper(
  "createOptims/createProjectOptimsThunk",
  async ({
    projectId,
    projectSettings,
    name,
    addPruning = true,
    addQuantization = false,
    addLRSchedule = false,
    addTrainable = false,
    abortController = undefined,
    profilePerfId = null,
    profileLossId = null,
  }) => {
    const projectBody = await requestUpdateProject(
      projectId,
      projectSettings.name,
      projectSettings.description,
      projectSettings.trainingOptimizer,
      projectSettings.trainingEpochs,
      projectSettings.trainingLRInit,
      projectSettings.trainingLRFinal
    );
    const createBody = await requestCreateProjectOptimizer(
      projectId,
      name,
      addPruning,
      addQuantization,
      addLRSchedule,
      addTrainable,
      abortController
    );
    let body = await requestUpdateOptim(
      projectId,
      createBody.optim.optim_id,
      name,
      profilePerfId,
      profileLossId
    );

    if (addPruning) {
      // make a request to update pruning for now at 85% until it's better automated
      body = await requestUpdateOptimModifierPruning(
        projectId,
        createBody.optim.optim_id,
        createBody.optim.pruning_modifiers[0].modifier_id,
        {
          sparsity: 0.85,
          balance_perf_loss: 1.0,
          filter_min_sparsity: 0.4,
          filter_min_perf_gain: 0.75,
          filter_min_recovery: -1.0,
        }
      );
    }

    return body.optim;
  }
);

/**
 * Slice for handling the creating project's optimizations state in the redux store.
 *
 * @type {Slice<{val: [], error: null, projectId: null, status: string}, {}, string>}
 */
const createdOptimsSlice = createSlice({
  name: "createOptims",
  initialState: {
    val: null,
    status: "idle",
    error: null,
    projectId: null,
    modalOpen: false,
  },
  reducers: {
    setCreateOptimModalOpen: (state, action) => {
      state.modalOpen = action.payload;
    },
    clearOptim: (state, action) => {
      state.val = null;
      state.status = "idle";
      state.error = null;
      state.projectId = null;
    },
  },
  extraReducers: {
    [createOptimThunk.pending]: (state, action) => {
      state.status = "loading";
      state.val = null;
      state.projectId = action.meta.arg.projectId;
    },
    [createOptimThunk.fulfilled]: (state, action) => {
      state.status = "succeeded";
      state.projectId = action.meta.arg.projectId;
      state.val = action.payload;
      state.error = null;
    },
    [createOptimThunk.rejected]: (state, action) => {
      state.status = "failed";
      state.error = action.error.message;
      state.projectId = action.meta.arg.projectId;
    },
    [createOptimVersionThunk.pending]: (state, action) => {
      state.status = "loading";
      state.val = null;
      state.projectId = action.meta.arg.projectId;
    },
    [createOptimVersionThunk.fulfilled]: (state, action) => {
      state.status = "succeeded";
      state.projectId = action.meta.arg.projectId;
      state.val = action.payload;
      state.error = null;
    },
    [createOptimVersionThunk.rejected]: (state, action) => {
      state.status = "failed";
      state.error = action.error.message;
      state.projectId = action.meta.arg.projectId;
    },
  },
});

/***
 * Available actions for cretedOptims redux store
 */
export const { setCreateOptimModalOpen, clearOptim } = createdOptimsSlice.actions;

/**
 * Simple selector to get the created optimizations state
 * including the val, status, error, and projectId
 *
 * @param state - the redux store state
 * @returns {Reducer<State> | Reducer<{val: *[], error: null, projectId: null, status: string}>}
 */
export const selectCreatedOptimsState = (state) => state.createdOptims;

export default createdOptimsSlice.reducer;
