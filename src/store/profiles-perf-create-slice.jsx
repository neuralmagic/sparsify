import { createSlice, createAsyncThunk, AsyncThunk } from "@reduxjs/toolkit";

import {
  jobProgressValue,
  requestGetJobTerminal,
  requestCreateProfilePerf,
  requestGetProjectProfilePerf,
} from "../api";
import { STATUS_FAILED, STATUS_IDLE, STATUS_LOADING, STATUS_SUCCEEDED } from "./utils";

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

export const createPerfProfileThunk = createAsyncThunk(
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
      (warmupIterations = warmupIterations),
      (iterations = iterations),
      (pruningEstimations = pruningEstimations),
      (quantizedEstimations = quantizedEstimations)
    );

    const createdProfile = createBody.profile;

    thunkAPI.dispatch(createPerfProfileProgress("profilePerfCreate", 0));
    await requestGetJobTerminal(
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
    );

    // get the completed profile
    const getBody = await requestGetProjectProfilePerf(
      projectId,
      createdProfile.profile_id
    );
    return getBody.profile;
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
  },
  reducers: {
    clearCreatePerfProfile: (state, action) => {
      state.error = null;
      state.val = null;
      state.progressStage = null;
      state.progressValue = null;
      state.status = STATUS_IDLE;
    },
  },
  extraReducers: {
    [createPerfProfileThunk.pending]: (state, action) => {
      state.status = STATUS_LOADING;
      state.error = null;
      state.val = null;
      state.progressStage = null;
      state.progressValue = null;
    },
    [createPerfProfileThunk.fulfilled]: (state, action) => {
      state.status = STATUS_SUCCEEDED;
      state.error = null;
      state.val = action.payload;
      state.progressStage = null;
      state.progressValue = null;
    },
    [createPerfProfileThunk.rejected]: (state, action) => {
      state.status = STATUS_FAILED;
      state.error = action.error.message;
      state.val = null;
      state.progressStage = null;
      state.progressValue = null;
    },
    [createPerfProfileProgressType]: (state, action) => {
      state.status = STATUS_LOADING;
      state.error = null;
      state.val = action.payload.profile;

      state.progressStage = action.payload.stage;
      state.progressValue = action.payload.progress;
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
export const selectCreatePerfProfileSlice = (state) => state.createPerfProfile;

export default createPerfProfileSlice.reducer;
