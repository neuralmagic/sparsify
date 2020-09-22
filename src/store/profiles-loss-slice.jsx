import { createSlice, createAsyncThunk, AsyncThunk, Slice } from "@reduxjs/toolkit";

import { requestGetProjectProfilesLoss } from "../api";
import {STATUS_SUCCEEDED} from "./utils";
import {compose, defaultTo, find, propEq} from "ramda";

/**
 * Async thunk for making a request to get the starting page for a project's loss profiles
 *
 * @type {AsyncThunk<Promise<*>, {readonly projectId?: *}, {}>}
 */
export const getProfilesLossThunk = createAsyncThunk(
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

export default selectedProfilesLossSlice.reducer;
