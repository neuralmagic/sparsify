import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunkWrapper } from "../store/utils";

import { requestCreateProjectOptimizer } from "../api";

/**
 * Async thunk for making a request to create a project optimizer
 *
 * @type {AsyncThunk<Promise<*>, {readonly projectId?: *, name?: string, add_pruning?: boolean, add_quantization?: boolean, add_lr_schedule?: boolean, add_trainable?: boolean}, {}>}
 */
export const createOptimThunk = createAsyncThunkWrapper(
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
 * Slice for handling the creating project's optimizations state in the redux store.
 *
 * @type {Slice<{val: [], error: null, projectId: null, status: string}, {}, string>}
 */
const createdOptimsSlice = createSlice({
  name: "createdOptims",
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
  },
  extraReducers: {
    [createOptimThunk.pending]: (state, action) => {
      state.status = "loading";
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
  },
});

/***
 * Available actions for cretedOptims redux store
 */
export const { setCreateOptimModalOpen } = createdOptimsSlice.actions;

/**
 * Simple selector to get the created optimizations state
 * including the val, status, error, and projectId
 *
 * @param state - the redux store state
 * @returns {Reducer<State> | Reducer<{val: *[], error: null, projectId: null, status: string}>}
 */
export const selectCreatedOptimsState = (state) => state.createdOptims;

export default createdOptimsSlice.reducer;
