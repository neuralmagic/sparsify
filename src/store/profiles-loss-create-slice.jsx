import { createSlice, createAsyncThunk, AsyncThunk } from "@reduxjs/toolkit";

import {
  jobProgressValue,
  requestGetJobTerminal,
  requestCreateProfileLoss,
  requestGetProjectProfileLoss,
} from "../api";
import { STATUS_FAILED, STATUS_IDLE, STATUS_LOADING, STATUS_SUCCEEDED } from "./utils";

const SLICE_ID = "createLossProfile";
const createLossProfileThunkType = `${SLICE_ID}/createLossProfileThunk`;
const createLossProfileProgressType = `${createLossProfileThunkType}/progress`;

const createLossProfileProgress = (stage, progress, profile) => ({
  type: createLossProfileProgressType,
  payload: {
    stage,
    progress,
    profile,
  },
});

export const createLossProfileThunk = createAsyncThunk(
  createLossProfileThunkType,
  async (
    {
      projectId,
      name,
      pruningEstimations = true,
      pruningEstimationType = "weight_magnitude",
      pruningStructure = "unstructured",
      quantizedEstimations = false,
    },
    thunkAPI
  ) => {
    const createBody = await requestCreateProfileLoss(
      projectId,
      name,
      pruningEstimations,
      pruningEstimationType,
      pruningStructure,
      quantizedEstimations
    );

    const createdProfile = createBody.profile;

    thunkAPI.dispatch(
      createLossProfileProgress("profileLossCreate", 0, createdProfile)
    );
    await requestGetJobTerminal(
      createdProfile.job.job_id,
      (progress) => {
        thunkAPI.dispatch(
          createLossProfileProgress(
            "profileLossProgress",
            jobProgressValue(progress),
            createdProfile
          )
        );
      },
      () => false
    );

    // get the completed profile
    const getBody = await requestGetProjectProfileLoss(
      projectId,
      createdProfile.profile_id
    );
    return getBody.profile;
  }
);

const createLossProfileSlice = createSlice({
  name: SLICE_ID,
  initialState: {
    val: null,
    status: STATUS_IDLE,
    error: null,
    progressStage: null,
    progressValue: null,
    profileId: null,
  },
  reducers: {
    clearCreateLossProfile: (state, action) => {
      state.error = null;
      state.val = null;
      state.progressStage = null;
      state.progressValue = null;
      state.status = STATUS_IDLE;
      state.profileId = null;
    },
  },
  extraReducers: {
    [createLossProfileThunk.pending]: (state, action) => {
      state.status = STATUS_LOADING;
      state.error = null;
      state.val = null;
      state.progressStage = null;
      state.progressValue = null;
      state.profileId = null;
    },
    [createLossProfileThunk.fulfilled]: (state, action) => {
      state.status = STATUS_SUCCEEDED;
      state.error = null;
      state.val = action.payload;
      state.progressStage = null;
      state.progressValue = null;
      state.profileId = action.payload.profile_id;
    },
    [createLossProfileThunk.rejected]: (state, action) => {
      state.status = STATUS_FAILED;
      state.error = action.error.message;
      state.val = null;
      state.progressStage = null;
      state.progressValue = null;
      state.profileId = null;
    },
    [createLossProfileProgressType]: (state, action) => {
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
 * Available actions for createLossProfileSlice redux store
 */
export const { clearCreateLossProfile } = createLossProfileSlice.actions;

/**
 * Simple selector to get loss profile being created state
 * including the val, status, error, progressStage, and progressVal
 *
 * @param state - the redux store state
 * @returns {Reducer<State> | Reducer<{val: *[], error: null,progressStage: null, progressVal: null, status: string}>}
 */
export const selectCreateLossProfile = (state) => state.createLossProfile;

export default createLossProfileSlice.reducer;
