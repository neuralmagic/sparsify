import {
  compose,
  path,
  propEq,
  find,
  curry,
  map,
  when,
  always,
  indexBy,
  prop,
  filter,
  defaultTo,
  mergeRight,
  addIndex
} from "ramda";
import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunkWrapper } from "../store/utils";

import { createSelector } from "@reduxjs/toolkit";

import {
  requestGetProjectOptims,
  requestChangeModifierSettings,
  requestUpdateOptim,
} from "../api";

import { selectSelectedProjectModelAnalysis } from "./project-slice";
import { selectSelectedProfileLoss } from "./profiles-loss-slice";
import { selectSelectedProfilePerf } from "./profiles-perf-slice";

const mapIndexed = addIndex(map);

/**
 * Async thunk for making a request to get the starting page for a project's optimizers
 *
 * @type {AsyncThunk<Promise<*>, {readonly projectId?: *}, {}>}
 */
export const getOptimsThunk = createAsyncThunkWrapper(
  "selectedOptims/getProjectOptims",
  async ({ projectId }) => {
    const body = await requestGetProjectOptims(projectId);

    return body.optims;
  }
);

export const updateOptimsThunk = createAsyncThunkWrapper(
  "selectedOptims/updateProjectOptims",
  async ({
    projectId,
    optimId,
    name = undefined,
    profilePerfId = undefined,
    profileLossId = undefined,
    startEpoch = undefined,
    endEpoch = undefined,
  }) => {
    const body = await requestUpdateOptim(
      projectId,
      optimId,
      name,
      profilePerfId,
      profileLossId,
      startEpoch,
      endEpoch
    );
    const optimsBody = await requestGetProjectOptims(projectId);
    return { optim: body.optim, optims: optimsBody.optims };
  }
);

export const changeModifierSettingsThunk = createAsyncThunkWrapper(
  "selectedOptims/changeModifierSettings",
  async ({ projectId, modifierId, optimId, settings }) => {
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
    updateStatus: "idle",
  },
  reducers: {
    setSelectedOptim: (state, action) => {
      const selectedOptim = state.val.find(
        (optim) => optim.optim_id === action.payload
      );

      if (selectedOptim) {
        state.selectedId = selectedOptim.optim_id;
        state.selectedProfileLossId = selectedOptim.profile_loss_id;
        state.selectedProfilePerfId = selectedOptim.profile_perf_id;
      }
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
      state.error = null;
      if (state.val && state.val.length > 0) {
        state.selectedId = state.val[0].optim_id;
        state.selectedProfilePerfId = state.val[0].profile_perf_id;
        state.selectedProfileLossId = state.val[0].profile_loss_id;
      }
    },
    [getOptimsThunk.rejected]: (state, action) => {
      state.status = "failed";
      state.error = action.error.message;
      state.projectId = action.meta.arg.projectId;
    },
    [updateOptimsThunk.pending]: (state, action) => {
      state.updateStatus = "loading";
      state.projectId = action.meta.arg.projectId;
    },
    [updateOptimsThunk.fulfilled]: (state, action) => {
      state.updateStatus = "succeeded";
      state.val = action.payload.optims;
      state.projectId = action.meta.arg.projectId;
      state.error = null;

      const selectedOptim = action.payload.optim;
      state.selectedId = selectedOptim.optim_id;
      state.selectedProfilePerfId = selectedOptim.profile_perf_id;
      state.selectedProfileLossId = selectedOptim.profile_loss_id;
    },
    [updateOptimsThunk.rejected]: (state, action) => {
      state.updateStatus = "failed";
      state.error = action.error.message;
      state.projectId = action.meta.arg.projectId;
    },
    [changeModifierSettingsThunk.fulfilled]: (state, action) => {
      state.val = map(
        when(propEq("optim_id", action.payload.optim_id), always(action.payload)),
        state.val
      );
      state.error = null;
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

export const selectSelectedProjectPrunableNodesById = createSelector(
  [
    selectSelectedProjectModelAnalysis,
    selectSelectedProfileLoss,
    selectSelectedProfilePerf,
  ],
  (modelAnalysis, loss, perf) => {
    const profileLayerPruningMeasurements = layer => compose(
      prop("measurements"),
      find(propEq("id", layer.id)),
      defaultTo([]),
      path(["analysis", "pruning", "ops"])
    )

    return compose(
      indexBy(prop("id")),
      mapIndexed((layer, index) =>
        mergeRight({
          index,
          measurements: {
            loss: compose(
              defaultTo({ 0: 0, 1: layer.prunable_equation_sensitivity }),
              profileLayerPruningMeasurements(layer)
            )(loss),
            perf: compose(
              defaultTo({ 0: layer.flops, 1: layer.flops *3/4, 2: layer.flops *2/4, 3: layer.flops *1/4, 4: 0 }),
              profileLayerPruningMeasurements(layer)
            )(perf),
          },
        })(layer)
      ),
      filter(propEq("prunable", true)),
      prop("nodes")
    )(modelAnalysis)
  }
);

export default selectedOptimsSlice.reducer;
