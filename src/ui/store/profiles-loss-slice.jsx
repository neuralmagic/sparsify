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

import {
  createSlice,
  createAsyncThunk,
  AsyncThunk,
  Slice,
  createSelector,
} from "@reduxjs/toolkit";

import { requestGetProjectProfilesLoss } from "../api";
import {
  createAsyncThunkWrapper,
  STATUS_SUCCEEDED,
  summarizeObjValuesArray,
} from "./utils";
import { compose, defaultTo, find, propEq } from "ramda";
import { selectSelectedProjectModelAnalysis } from "./project-slice";

/**
 * Async thunk for making a request to get the starting page for a project's loss profiles
 *
 * @type {AsyncThunk<Promise<*>, {readonly projectId?: *}, {}>}
 */
export const getProfilesLossThunk = createAsyncThunkWrapper(
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
    selectedId: null,
  },
  reducers: {
    setSelectedProfileLoss: (state, action) => {
      state.selectedId = action.payload;
    },
  },
  extraReducers: {
    [getProfilesLossThunk.pending]: (state, action) => {
      state.status = "loading";
      state.projectId = action.meta.arg.projectId;
    },
    [getProfilesLossThunk.fulfilled]: (state, action) => {
      state.status = "succeeded";
      state.val = action.payload;
      state.projectId = action.meta.arg.projectId;
      state.error = null;
      if (state.val && state.val.length > 0) {
        state.selectedId = state.val[0].profile_id;
      }
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
export const { setSelectedProfileLoss } = selectedProfilesLossSlice.actions;

/**
 * Simple selector to get the current selected loss profiles state
 * including the val, status, error, and projectId
 *
 * @param state - the redux store state
 * @returns {Reducer<State> | Reducer<{val: *[], error: null, projectId: null, status: string}>}
 */
export const selectSelectedProfilesLossState = (state) => state.selectedProfilesLoss;

export const selectSelectedProfilesLoss = (state) => {
  const profilesLossState = selectSelectedProfilesLossState(state);

  return profilesLossState.status !== STATUS_SUCCEEDED ? null : profilesLossState.val;
};

export const selectDefaultProfilesLoss = (state) => {
  if (state.selectedProfilesLoss.val.length > 0) {
    return state.selectedProfilesLoss.val[0];
  }
};

export const selectSelectedProfilesLossAnyStatus = (state) => {
  return selectSelectedProfilesLossState(state).val;
};

export const selectSelectedProfileLoss = (state) => {
  const profilesLossState = selectSelectedProfilesLossState(state);

  if (profilesLossState.status !== STATUS_SUCCEEDED || !profilesLossState.selectedId) {
    return null;
  }

  return compose(
    find(propEq("profile_id", profilesLossState.selectedId)),
    defaultTo(null)
  )(profilesLossState.val);
};

export const selectSelectedProfileLossNodeResults = createSelector(
  [selectSelectedProjectModelAnalysis, selectSelectedProfileLoss],
  (analysis, profileLoss) => {
    if (!analysis || !profileLoss || !profileLoss.analysis) {
      return {};
    }

    const results = {};

    const nodeLookup = {};
    if (analysis.nodes) {
      analysis.nodes.forEach((node) => {
        nodeLookup[node.id] = node;
      });
    }

    // fill in pruning
    if (profileLoss.pruning_estimations && profileLoss.analysis.pruning) {
      results["Pruning Sensitivity"] = summarizeObjValuesArray(
        profileLoss.analysis.pruning.ops,
        (node, objIndex) => {
          return objIndex;
        },
        (node) => {
          if (node.measurements.length < 1 || !node.baseline_measurement_key) {
            return null;
          }

          const keys = Object.keys(node.measurements);
          let targetIndex = Math.round(0.95 * keys.length);

          if (targetIndex > keys.length) {
            targetIndex = keys.length - 1;
          }

          const targetKey = keys[targetIndex];

          return (
            node.measurements[targetKey] -
            node.measurements[node.baseline_measurement_key]
          );
        },
        (node) => {
          const analysisNode = nodeLookup.hasOwnProperty(node.id)
            ? nodeLookup[node.id]
            : null;

          return {
            id: analysisNode ? analysisNode.id : node.name,
            opType: analysisNode ? analysisNode.op_type : "Other",
            weightName: analysisNode ? analysisNode.weight_name : null,
          };
        },
        false
      );
    }

    return results;
  }
);

export default selectedProfilesLossSlice.reducer;
