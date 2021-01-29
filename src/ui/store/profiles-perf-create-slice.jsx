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

import { createSlice, createAsyncThunk, AsyncThunk } from "@reduxjs/toolkit";

import {
  jobProgressValue,
  requestGetJobTerminal,
  requestCreateProfilePerf,
  requestGetProjectProfilePerf,
  JOB_CANCELED,
  requestDeleteAndCancelProjectProfilePerf,
} from "../api";
import {
  STATUS_FAILED,
  STATUS_IDLE,
  STATUS_LOADING,
  STATUS_SUCCEEDED,
  createAsyncThunkWrapper,
} from "./utils";

const SLICE_ID = "createPerfProfile";
const createPerfProfileThunkType = `${SLICE_ID}/createPerfProfileThunk`;
const createPerfProfileProgressType = `${createPerfProfileThunkType}/progress`;

const createPerfProfileProgress = (stage, progress, profile) => ({
  type: createPerfProfileProgressType,
  payload: {
    stage,
    progress,
    profile,
  },
});

export const createPerfProfileThunk = createAsyncThunkWrapper(
  createPerfProfileThunkType,
  async (
    {
      projectId,
      name,
      batchSize,
      coreCount,
      warmupIterations = 5,
      iterations = 10,
      pruningEstimations = true,
      quantizedEstimations = false,
    },
    thunkAPI
  ) => {
    const createBody = await requestCreateProfilePerf(
      projectId,
      name,
      batchSize,
      coreCount,
      warmupIterations,
      iterations,
      pruningEstimations,
      quantizedEstimations
    );

    const createdProfile = createBody.profile;

    thunkAPI.dispatch(
      createPerfProfileProgress("profilePerfCreate", 0, createdProfile)
    );
    return await requestGetJobTerminal(
      createdProfile.job.job_id,
      (progress) => {
        thunkAPI.dispatch(
          createPerfProfileProgress(
            "profilePerfProgress",
            jobProgressValue(progress),
            createdProfile
          )
        );
      },
      () => false
    ).then(async (jobBody) => {
      if (jobBody.job.status === JOB_CANCELED) {
        throw Error("Job Cancelled");
      }

      // get the completed profile
      const getBody = await requestGetProjectProfilePerf(
        projectId,
        createdProfile.profile_id
      );
      return getBody.profile;
    });
  }
);

const cancelAndDeletePerfProfileThunkType = `${SLICE_ID}/cancelAndDeletePerfProfileThunk`;

export const cancelAndDeletePerfProfileThunk = createAsyncThunk(
  cancelAndDeletePerfProfileThunkType,
  async ({ projectId, profileId }) => {
    return await requestDeleteAndCancelProjectProfilePerf(projectId, profileId);
  }
);

const createPerfProfileSlice = createSlice({
  name: SLICE_ID,
  initialState: {
    val: null,
    status: STATUS_IDLE,
    error: null,
    progressStage: null,
    progressValue: null,
    profileId: null,
    cancelingStatus: STATUS_IDLE,
  },
  reducers: {
    clearCreatePerfProfile: (state, action) => {
      state.error = null;
      state.val = null;
      state.progressStage = null;
      state.progressValue = null;
      state.status = STATUS_IDLE;
      state.profileId = null;
      state.cancelingStatus = STATUS_IDLE;
    },
  },
  extraReducers: {
    [cancelAndDeletePerfProfileThunk.fulfilled]: (state, action) => {
      state.error = null;
      state.cancelingStatus = STATUS_SUCCEEDED;
    },
    [cancelAndDeletePerfProfileThunk.pending]: (state, action) => {
      state.cancelingStatus = STATUS_LOADING;
    },
    [cancelAndDeletePerfProfileThunk.rejected]: (state, action) => {
      state.status = STATUS_FAILED;
      state.error = action.error.message;
      state.progressStage = null;
      state.progressValue = null;
      state.cancelingStatus = STATUS_FAILED;
    },
    [createPerfProfileThunk.pending]: (state, action) => {
      state.status = STATUS_LOADING;
      state.error = null;
      state.val = null;
      state.progressStage = null;
      state.progressValue = null;
      state.profileId = null;
    },
    [createPerfProfileThunk.fulfilled]: (state, action) => {
      state.status = STATUS_SUCCEEDED;
      if (state.cancelingStatus === STATUS_IDLE) {
        state.error = null;
        state.val = action.payload;
        state.progressStage = null;
        state.progressValue = null;
        state.profileId = action.payload.profile_id;
      }
    },
    [createPerfProfileThunk.rejected]: (state, action) => {
      state.status = STATUS_FAILED;
      if (state.cancelingStatus === STATUS_IDLE) {
        state.error = action.error.message;
      }
      state.progressStage = null;
      state.progressValue = null;
    },
    [createPerfProfileProgressType]: (state, action) => {
      state.status = STATUS_LOADING;
      state.error = null;
      state.val = action.payload.profile;
      state.progressStage = action.payload.stage;
      state.progressValue = action.payload.progress;
      state.profileId = action.payload.profile.profile_id;
    },
  },
});

/**
 * Available actions for createPerfProfileSlice redux store
 */
export const { clearCreatePerfProfile } = createPerfProfileSlice.actions;

/**
 * Simple selector to get perf profile being created state
 * including the val, status, error, progressStage, and progressVal
 *
 * @param state - the redux store state
 * @returns {Reducer<State> | Reducer<{val: *[], error: null,progressStage: null, progressVal: null, status: string}>}
 */
export const selectCreatePerfProfile = (state) => state.createPerfProfile;

export default createPerfProfileSlice.reducer;
