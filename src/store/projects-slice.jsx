import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { requestGetProjects } from "../api";

export const getProjectsThunk = createAsyncThunk(
  "projects/getProjects",
  async () => {
    const body = await requestGetProjects();

    return body.projects;
  }
);

const projectsSlice = createSlice({
  name: "projects",
  initialState: {
    val: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: {
    [getProjectsThunk.pending]: (state, action) => {
      state.status = "loading";
    },
    [getProjectsThunk.fulfilled]: (state, action) => {
      state.status = "succeeded";
      state.val = action.payload;
    },
    [getProjectsThunk.rejected]: (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    },
  },
});

export const { postAdded, postUpdated, reactionAdded } = projectsSlice.actions;

export default projectsSlice.reducer;

export const selectProjectsState = (state) => state.projects;
