import { compose, prop, propEq, filter, indexBy } from 'ramda';
import {
  createSlice,
  createAsyncThunk,
  AsyncThunk,
  Slice,
  createSelector,
} from "@reduxjs/toolkit";

import { requestDeleteProject, requestGetProject, requestUpdateProject } from "../api";
import {
  createAsyncThunkWrapper,
  STATUS_FAILED,
  STATUS_IDLE,
  STATUS_LOADING,
  STATUS_SUCCEEDED,
} from "./utils";
import { summarizeObjValuesArray } from "./utils";

/**
 * Async thunk for making a request to get/select a project
 *
 * @type {AsyncThunk<Promise<*>, {readonly projectId?: *}, {}>}
 */
export const getProjectThunk = createAsyncThunkWrapper(
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
export const updateProjectThunk = createAsyncThunkWrapper(
  "selectedProject/updateProject",
  async ({
    projectId,
    name,
    description,
    trainingOptimizer,
    trainingEpochs,
    trainingLRInit,
    trainingLRFinal,
    noUpdateStore,
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
export const deleteProjectThunk = createAsyncThunkWrapper(
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
    status: STATUS_IDLE,
    error: null,
    projectId: null,
    deleted: false,
  },
  reducers: {},
  extraReducers: {
    [getProjectThunk.pending]: (state, action) => {
      state.status = STATUS_LOADING;
      state.projectId = action.meta.arg.projectId;
      state.deleted = false;
    },
    [getProjectThunk.fulfilled]: (state, action) => {
      state.status = STATUS_SUCCEEDED;
      state.val = action.payload;
      state.projectId = action.meta.arg.projectId;
      state.error = null;
    },
    [getProjectThunk.rejected]: (state, action) => {
      state.status = STATUS_FAILED;
      state.error = action.error.message;
      state.projectId = action.meta.arg.projectId;
    },
    [updateProjectThunk.pending]: (state, action) => {
      if (action.meta.arg.noUpdateStore) {
        return;
      }

      state.status = STATUS_LOADING;
      state.projectId = action.meta.arg.projectId;
      state.deleted = false;
    },
    [updateProjectThunk.fulfilled]: (state, action) => {
      if (action.meta.arg.noUpdateStore) {
        return;
      }

      state.status = STATUS_SUCCEEDED;
      state.val = action.payload;
      state.projectId = action.meta.arg.projectId;
      state.error = null;
    },
    [updateProjectThunk.rejected]: (state, action) => {
      if (action.meta.arg.noUpdateStore) {
        return;
      }

      state.status = STATUS_FAILED;
      state.error = action.error.message;
      state.projectId = action.meta.arg.projectId;
    },
    [deleteProjectThunk.pending]: (state, action) => {
      state.status = STATUS_LOADING;
      state.projectId = action.meta.arg.projectId;
      state.deleted = false;
    },
    [deleteProjectThunk.fulfilled]: (state, action) => {
      state.status = STATUS_SUCCEEDED;
      state.deleted = true;
      state.projectId = action.meta.arg.projectId;
      state.error = null;
    },
    [deleteProjectThunk.rejected]: (state, action) => {
      state.status = STATUS_FAILED;
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

export const selectSelectedProject = (state) => {
  const projectState = selectSelectedProjectState(state);

  if (projectState.status !== STATUS_SUCCEEDED) {
    return null;
  }

  return projectState.val;
};

export const selectSelectedProjectAnyStatus = (state) => {
  const projectState = selectSelectedProjectState(state);

  return projectState.val;
};

export const selectSelectedProjectModel = (state) => {
  const project = selectSelectedProject(state);

  return project && project.model ? project.model : null;
};

export const selectSelectedProjectModelAnalysis = (state) => {
  const projectModel = selectSelectedProjectModel(state);

  return projectModel && projectModel.analysis ? projectModel.analysis : null;
};

export const selectSelectedProjectModelAnalysisBatchSize = createSelector(
  [selectSelectedProjectModelAnalysis],
  (analysis) => {
    if (!analysis || !analysis.nodes) {
      return null;
    }

    let batchSize = null;
    analysis.nodes.forEach((node) => {
      if (
        !batchSize &&
        node.input_shapes &&
        node.input_shapes.length > 0 &&
        node.input_shapes[0] &&
        node.input_shapes[0][0]
      ) {
        batchSize = node.input_shapes[0][0];
      }
    });

    return batchSize;
  }
);

export const selectSelectedProjectModelAnalysisNodeParams = createSelector(
  [selectSelectedProjectModelAnalysis],
  (analysis) => {
    if (!analysis) {
      return null;
    }

    const prunableNodes = [];
    analysis.nodes.forEach((node) => {
      if (node.prunable) {
        prunableNodes.push(node);
      }
    });

    return {
      "Params Count": summarizeObjValuesArray(
        prunableNodes,
        (node, objIndex) => objIndex,
        (node) => (node.params ? node.params : null),
        (node) => {
          return { id: node.id, opType: node.op_type, weightName: node.weight_name };
        }
      ),
    };
  }
);

export const selectSelectedProjectPrunableNodesById = createSelector(
  [selectSelectedProjectModelAnalysis],
  compose(
    indexBy(prop('id')),
    filter(propEq('prunable', true)),
    prop('nodes')))

export const selectSelectedProjectModelAnalysisPerfNodeSummaries = createSelector(
  [selectSelectedProjectModelAnalysis],
  (analysis) => {
    if (!analysis) {
      return null;
    }

    return {
      FLOPS: summarizeObjValuesArray(
        analysis.nodes,
        (node) => node.op_type,
        (node) => (node.flops ? node.flops : null),
        (node) => {
          return { opType: node.op_type };
        }
      ),
    };
  }
);

export const selectSelectedProjectModelAnalysisPerfNodeResults = createSelector(
  [selectSelectedProjectModelAnalysis],
  (analysis) => {
    if (!analysis) {
      return null;
    }

    return {
      FLOPS: summarizeObjValuesArray(
        analysis.nodes,
        (node, objIndex) => objIndex,
        (node) => (node.flops ? node.flops : null),
        (node) => {
          return { id: node.id, opType: node.op_type, weightName: node.weight_name };
        },
        false
      ),
    };
  }
);

export const selectSelectedProjectModelAnalysisLossSensitivityNodeResults = createSelector(
  [selectSelectedProjectModelAnalysis],
  (analysis) => {
    if (!analysis) {
      return null;
    }

    const prunableNodes = [];
    analysis.nodes.forEach((node) => {
      if (node.prunable) {
        prunableNodes.push(node);
      }
    });

    return {
      "Pruning Sensitivity": summarizeObjValuesArray(
        analysis.nodes,
        (node, objIndex) => objIndex,
        (node) =>
          node.prunable_equation_sensitivity
            ? node.prunable_equation_sensitivity
            : null,
        (node) => {
          return { id: node.id, opType: node.op_type, weightName: node.weight_name };
        },
        false
      ),
    };
  }
);

export default selectedProjectSlice.reducer;
