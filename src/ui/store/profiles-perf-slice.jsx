import {
  createSlice,
  createAsyncThunk,
  AsyncThunk,
  Slice,
  createSelector,
} from "@reduxjs/toolkit";
import { compose, defaultTo, find, propEq } from "ramda";

import { requestGetProjectProfilesPerf } from "../api";
import {
  createAsyncThunkWrapper,
  STATUS_SUCCEEDED,
  summarizeObjValuesArray,
} from "./utils";
import { selectSelectedProjectModelAnalysis } from "./project-slice";

/**
 * Async thunk for making a request to get the starting page for a project's performance profiles
 *
 * @type {AsyncThunk<Promise<*>, {readonly projectId?: *}, {}>}
 */
export const getProfilesPerfThunk = createAsyncThunkWrapper(
  "selectedProfilesPerf/getProjectProfilesPerf",
  async ({ projectId }) => {
    const body = await requestGetProjectProfilesPerf(projectId);

    return body.profiles;
  }
);

/**
 * Slice for handling the selected project's performance profiles state in the redux store.
 *
 * @type {Slice<{val: [], error: null, projectId: null, status: string}, {}, string>}
 */
const selectedProfilesPerfSlice = createSlice({
  name: "selectedProfilesPerf",
  initialState: {
    val: [],
    status: "idle",
    error: null,
    projectId: null,
    selectedId: null,
  },
  reducers: {
    setSelectedProfilePerf: (state, action) => {
      state.selectedId = action.payload;
    },
  },
  extraReducers: {
    [getProfilesPerfThunk.pending]: (state, action) => {
      state.status = "loading";
      state.projectId = action.meta.arg.projectId;
    },
    [getProfilesPerfThunk.fulfilled]: (state, action) => {
      state.status = "succeeded";
      state.val = action.payload;
      state.projectId = action.meta.arg.projectId;
      state.error = null;
      if (state.val && state.val.length > 0) {
        state.selectedId = state.val[0].profile_id;
      }
    },
    [getProfilesPerfThunk.rejected]: (state, action) => {
      state.status = "failed";
      state.error = action.error.message;
      state.projectId = action.meta.arg.projectId;
    },
  },
});

/***
 * Available actions for selectedProfilesPerf redux store
 */
export const { setSelectedProfilePerf } = selectedProfilesPerfSlice.actions;

/**
 * Simple selector to get the current selected performance profiles state
 * including the val, status, error, and projectId
 *
 * @param state - the redux store state
 * @returns {Reducer<State> | Reducer<{val: *[], error: null, projectId: null, status: string}>}
 */
export const selectSelectedProfilesPerfState = (state) => state.selectedProfilesPerf;

export const selectDefaultProfilesPerf = (state) => {
  if (state.selectedProfilesPerf.val.length > 0) {
    return state.selectedProfilesPerf.val[0];
  }
};

export const selectSelectedProfilesPerf = (state) => {
  const profilesPerfState = selectSelectedProfilesPerfState(state);

  return profilesPerfState.status !== STATUS_SUCCEEDED ? null : profilesPerfState.val;
};

export const selectSelectedProfilesPerfAnyStatus = (state) => {
  return selectSelectedProfilesPerfState(state).val;
};

export const selectSelectedProfilePerf = (state) => {
  const profilesPerfState = selectSelectedProfilesPerfState(state);

  if (profilesPerfState.status !== STATUS_SUCCEEDED || !profilesPerfState.selectedId) {
    return null;
  }

  return compose(
    find(propEq("profile_id", profilesPerfState.selectedId)),
    defaultTo(null)
  )(profilesPerfState.val);
};

const getOpType = (node, nodeLookup) => {
  const analysisNode = nodeLookup.hasOwnProperty(node.id) ? nodeLookup[node.id] : null;

  let opType;
  if (analysisNode) {
    opType = analysisNode.op_type;
  } else if (node.name.includes("ORT Subgraph")) {
    opType = "ORT";
  } else {
    opType = node.name.split("_")[0];
    opType = opType.charAt(0).toUpperCase() + opType.slice(1);
  }
  return opType;
};

export const selectSelectedProfilePerfNodeSummaries = createSelector(
  [selectSelectedProjectModelAnalysis, selectSelectedProfilePerf],
  (analysis, profilePerf) => {
    if (!analysis || !profilePerf || !profilePerf.analysis) {
      return {};
    }

    const nodeLookup = {};
    if (analysis.nodes) {
      analysis.nodes.forEach((node) => {
        nodeLookup[node.id] = node;
      });
    }

    const summaries = {};

    // baseline
    if (profilePerf.analysis.baseline) {
      summaries["Baseline MS"] = summarizeObjValuesArray(
        profilePerf.analysis.baseline.ops,
        (node) => {
          return getOpType(node, nodeLookup);
        },
        (node) => {
          return node.measurement ? node.measurement * 1000.0 : node.measurement;
        },
        (node) => {
          return { opType: getOpType(node, nodeLookup) };
        }
      );
    }

    // fill in pruning
    if (profilePerf.analysis.pruning) {
      Object.keys(profilePerf.analysis.pruning.model.measurements).forEach(
        (pruningLevel) => {
          summaries[`Pruned ${pruningLevel} MS`] = summarizeObjValuesArray(
            profilePerf.analysis.pruning.ops,
            (node) => {
              return getOpType(node, nodeLookup);
            },
            (node) => {
              return node.measurements[pruningLevel]
                ? node.measurements[pruningLevel] * 1000.0
                : node.measurements[pruningLevel];
            },
            (node) => {
              return { opType: getOpType(node, nodeLookup) };
            }
          );
        }
      );
    }

    return summaries;
  }
);

export const selectSelectedProfilePerfNodeResults = createSelector(
  [selectSelectedProjectModelAnalysis, selectSelectedProfilePerf],
  (analysis, profilePerf) => {
    if (!analysis || !profilePerf || !profilePerf.analysis) {
      return {};
    }

    const nodeLookup = {};
    if (analysis.nodes) {
      analysis.nodes.forEach((node) => {
        nodeLookup[node.id] = node;
      });
    }

    const results = {};

    // baseline
    if (profilePerf.analysis.baseline) {
      results["Baseline MS"] = summarizeObjValuesArray(
        profilePerf.analysis.baseline.ops,
        (node, objIndex) => {
          return objIndex;
        },
        (node) => {
          return node.measurement ? node.measurement * 1000.0 : node.measurement;
        },
        (node) => {
          const analysisNode = nodeLookup.hasOwnProperty(node.id)
            ? nodeLookup[node.id]
            : null;

          let opType = getOpType(node, nodeLookup);

          return {
            id: analysisNode ? analysisNode.id : node.name,
            opType,
            weightName: analysisNode ? analysisNode.weight_name : null,
          };
        },
        false
      );
    }

    // fill in pruning
    if (profilePerf.analysis.pruning) {
      Object.keys(profilePerf.analysis.pruning.model.measurements).forEach(
        (pruningLevel) => {
          results[`Pruned ${pruningLevel} MS`] = summarizeObjValuesArray(
            profilePerf.analysis.pruning.ops,
            (node, objIndex) => {
              return objIndex;
            },
            (node) => {
              return node.measurements[pruningLevel]
                ? node.measurements[pruningLevel] * 1000.0
                : node.measurements[pruningLevel];
            },
            (node) => {
              const analysisNode = nodeLookup.hasOwnProperty(node.id)
                ? nodeLookup[node.id]
                : null;

              let opType = getOpType(node, nodeLookup);

              return {
                id: analysisNode ? analysisNode.id : node.name,
                opType,
                weightName: analysisNode ? analysisNode.weight_name : null,
              };
            },
            false
          );
        }
      );
    }

    return results;
  }
);

export default selectedProfilesPerfSlice.reducer;
