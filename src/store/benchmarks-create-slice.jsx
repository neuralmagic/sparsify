import { createSlice, createSelector } from "@reduxjs/toolkit";
import {
  requestCreateProjectBenchmarks,
  requestDeleteAndCancelProjectBenchmark,
  requestGetProjectBenchmark,
} from "../api/benchmarks";
import _ from "lodash";

import { createAsyncThunkWrapper, STATUS_SUCCEEDED } from "./utils";
import { JOB_COMPLETED, requestGetJobTerminal } from "../api";
import { updateBenchmarkList } from "./benchmarks-slice";

const benchmarkJobProgress = "createBenchmarks/jobProgress";

const benchmarkJobProgressAction = (progress, benchmark) => {
  return {
    type: benchmarkJobProgress,
    payload: {
      progress: _.get(progress, "iter_val") ? progress.iter_val * 100 : 0,
      benchmark,
    },
  };
};

const trackBenchmarkJob = async (projectId, benchmark, thunkAPI) => {
  const job = await requestGetJobTerminal(
    _.get(benchmark, "job.job_id"),
    (progress) => {
      if (progress !== null) {
        thunkAPI.dispatch(benchmarkJobProgressAction(progress, benchmark));
      }
    },
    () => {}
  );
  if (_.get(job, "job.status") === JOB_COMPLETED) {
    thunkAPI.dispatch(
      benchmarkJobProgressAction(
        {
          iter_val: 1,
        },
        benchmark
      )
    );
  } else {
    thunkAPI.dispatch(benchmarkJobProgressAction(null, benchmark));
  }

  return job.job;
};

export const createBenchmarkCopyThunk = createAsyncThunkWrapper(
  "createBenchmarks/createBenchmarksCopy",
  async ({ benchmark }, thunkAPI) => {
    thunkAPI.dispatch(
      createBenchmarkThunk({
        projectId: benchmark.project_id,
        inferenceModels: benchmark.inference_models,
        coreCounts: benchmark.core_counts,
        batchSizes: benchmark.batch_sizes,
        name: benchmark.name,
        iterationsPerCheck: benchmark.iterations_per_check,
        warmupIterationsPerCheck: benchmark.warmup_iterations_per_check,
      })
    );
  }
);

export const createBenchmarkThunk = createAsyncThunkWrapper(
  "createBenchmarks/createBenchmarks",
  async (
    {
      projectId,
      inferenceModels,
      coreCounts,
      batchSizes,
      name,
      iterationsPerCheck,
      warmupIterationsPerCheck,
    },
    thunkAPI
  ) => {
    const body = await requestCreateProjectBenchmarks(
      projectId,
      inferenceModels,
      coreCounts,
      batchSizes,
      name,
      iterationsPerCheck,
      warmupIterationsPerCheck
    );
    thunkAPI.dispatch(updateBenchmarkList(body.benchmark));

    await trackBenchmarkJob(projectId, body.benchmark, thunkAPI);
    const getBody = await requestGetProjectBenchmark(
      projectId,
      body.benchmark.benchmark_id
    );

    return getBody.benchmark;
  }
);

export const setCreatedBenchmarkThunk = createAsyncThunkWrapper(
  "createBenchmarks/selectCreateBenchmarks",
  async ({ projectId, benchmark }, thunkAPI) => {
    thunkAPI.dispatch(
      setBenchmark({
        benchmark,
      })
    );
    await trackBenchmarkJob(projectId, benchmark, thunkAPI);
    const getBody = await requestGetProjectBenchmark(projectId, benchmark.benchmark_id);

    return getBody.benchmark;
  }
);

export const deleteBenchmarkThunk = createAsyncThunkWrapper(
  "createBenchmarks/deleteBenchmarks",
  async ({ projectId, benchmarkId }) => {
    const response = await requestDeleteAndCancelProjectBenchmark(
      projectId,
      benchmarkId
    );
    return response;
  }
);

const createBenchmarksSlice = createSlice({
  name: "createBenchmark",
  initialState: {
    val: null,
    status: "idle",
    error: null,
    projectId: null,
    progressValue: null,
    cancelStatus: "idle",
  },
  reducers: {
    setBenchmark: (state, action) => {
      state.val = action.payload.benchmark;
    },
  },
  extraReducers: {
    [deleteBenchmarkThunk.pending]: (state, action) => {
      state.cancelStatus = "loading";
      state.projectId = action.meta.arg.projectId;
    },
    [deleteBenchmarkThunk.fulfilled]: (state, action) => {
      state.cancelStatus = "succeeded";
      state.projectId = action.meta.arg.projectId;
      state.error = null;
      state.val = null;
    },
    [deleteBenchmarkThunk.rejected]: (state, action) => {
      state.cancelStatus = "failed";
      state.error = action.error.message;
      state.projectId = action.meta.arg.projectId;
    },
    [createBenchmarkThunk.pending]: (state, action) => {
      state.status = "loading";
      state.projectId = action.meta.arg.projectId;
      state.progressValue = null;
    },
    [createBenchmarkThunk.fulfilled]: (state, action) => {
      state.status = "succeeded";
      state.val = action.payload;
      state.projectId = action.meta.arg.projectId;
      state.error = null;
      state.progressValue = null;
    },
    [createBenchmarkThunk.rejected]: (state, action) => {
      state.status = "failed";
      state.error = action.error.message;
      state.projectId = action.meta.arg.projectId;
    },
    [setCreatedBenchmarkThunk.pending]: (state, action) => {
      state.status = "loading";
      state.progressValue = null;
      state.projectId = action.meta.arg.projectId;
    },
    [setCreatedBenchmarkThunk.fulfilled]: (state, action) => {
      state.status = "succeeded";
      state.val = null;
      state.projectId = action.meta.arg.projectId;
      state.error = null;
    },
    [setCreatedBenchmarkThunk.rejected]: (state, action) => {
      state.status = "failed";
      state.error = action.error.message;
      state.projectId = action.meta.arg.projectId;
    },
    [benchmarkJobProgress]: (state, action) => {
      state.progressValue = action.payload.progress;
      state.val = action.payload.benchmark;
    },
  },
});

export const { setBenchmark } = createBenchmarksSlice.actions;

export const selectCreatedBenchmarkId = (state) => {
  return state.createdBenchmarks.val && state.status !== STATUS_SUCCEEDED
    ? state.createdBenchmarks.val.benchmark_id
    : null;
};

export const selectCreatedBenchmark = (state) => {
  return state.createdBenchmarks;
};

export default createBenchmarksSlice.reducer;
