import { createSlice, createAsyncThunk, AsyncThunk, Slice } from "@reduxjs/toolkit";

/**
 * Slice for handling the serverStatus info in the redux store.
 *
 * @type {Slice<{val: [], error: null, status: string}, {}, string>}
 */
const serverStatusSlice = createSlice({
  name: "serverStatus",
  initialState: {
    online: null,
    status: "idle",
    error: null,
  },
  reducers: {
    serverLoading: (state, action) => {
      state.status = "loading";
    },
    serverOnline: (state, action) => {
      state.status = "success";
      state.online = true;
    },
    serverOffline: (state, action) => {
      state.status = "rejected";
      state.online = false;
    },
  },
});

/**
 * Available actions for serverStatus redux store
 */
export const { serverOnline, serverOffline, serverLoading } = serverStatusSlice.actions;

/**
 * Simple selector to get the current serverStatus state
 * including the val, status, and error
 *
 * @param state - the redux store state
 * @returns {Reducer<State> | Reducer<{serverOnline: null, error: null, status: string}>}
 */
export const selectServerState = (state) => state.serverStatus;

export default serverStatusSlice.reducer;
