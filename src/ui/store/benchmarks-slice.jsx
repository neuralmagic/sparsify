/*
Copyright 2021-present Neuralmagic, Inc.

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

import { createSlice } from "@reduxjs/toolkit";
import { requestGetProjectBenchmarks } from "../api/benchmarks";
import _ from "lodash";

import { createAsyncThunkWrapper, summarizeObjValuesArray } from "./utils";
import { dateUtcToLocalString, inferenceEngineToName } from "../components";

export const getBenchmarksThunk = createAsyncThunkWrapper(
  "benchmarks/getBenchmarks",
  async ({ projectId }, thunkAPI) => {
    const body = await requestGetProjectBenchmarks(projectId);
    return body.benchmarks;
  }
);

const benchmarksSlice = createSlice({
  name: "benchmarks",
  initialState: {
    val: [],
    status: "idle",
    error: null,
    projectId: null,
    analysis: {},
    jobProgress: null,
    benchmarkInProgress: null,
    createStatus: "idle",
  },
  reducers: {
    updateBenchmarkList: (state, action) => {
      for (let i = 0; i < state.val; i++) {
        if (state.val[i].benchmark_id === action.payload.benchmark_id) {
          state.val[i] = action.payload;
          return;
        }
      }
      state.val.unshift(action.payload);
    },
  },
  extraReducers: {
    [getBenchmarksThunk.pending]: (state, action) => {
      state.status = "loading";
      state.projectId = action.meta.arg.projectId;
    },
    [getBenchmarksThunk.fulfilled]: (state, action) => {
      state.status = "succeeded";
      state.val = action.payload;
      state.val.sort((a, b) => new Date(b.created) - new Date(a.created));
      state.projectId = action.meta.arg.projectId;
      state.error = null;
    },
    [getBenchmarksThunk.rejected]: (state, action) => {
      state.status = "failed";
      state.error = action.error.message;
      state.projectId = action.meta.arg.projectId;
    },
  },
});

export const { updateBenchmarkList } = benchmarksSlice.actions;

export const selectBenchmarks = (state) => {
  return state.benchmarks;
};

const getAxisRanges = (values) => {
  const minValue = Math.min(0, ...values);
  const maxValue = Math.max(...values);
  return [
    minValue,
    minValue + 0.35 * (maxValue - minValue),
    minValue + 0.7 * (maxValue - minValue),
    minValue + 1.05 * (maxValue - minValue),
  ];
};

const benchmarkToBaseline = (benchmark, optimizationsToName) => {
  const benchmarkData = _.get(benchmark, "result.benchmarks", []);

  const coreBatchGroups = {};

  benchmarkData.forEach((result) => {
    const batchSize = result.batch_size;
    const coreCount = result.core_count;
    const inferenceEngine = result.inference_engine;
    const inferenceOptimization = result.inference_model_optimization;
    const inferenceOptimizationName = _.get(
      optimizationsToName,
      inferenceOptimization,
      inferenceOptimization
    );
    const measurements = _.get(result, "measurements", []);
    if (measurements.length === 0) {
      return {};
    }
    const secPerBatch = measurements.reduce(
      (accum, curr) => accum + curr / measurements.length,
      0
    );

    if (!(coreCount in coreBatchGroups)) {
      coreBatchGroups[coreCount] = {};
    }

    if (!(batchSize in coreBatchGroups[coreCount])) {
      coreBatchGroups[coreCount][batchSize] = {
        results: [],
        ranges: [],
        rangesX: [],
        coreCount,
        batchSize,
      };
    }

    const measurementsTransform = measurements.map((measurement, index) => ({
      x: index,
      y: measurement * 1000,
      type: "baseline",
      batchSize,
      coreCount,
      inferenceEngine: inferenceEngineToName(inferenceEngine),
      inferenceOptimization: inferenceOptimizationName,
    }));

    const ranges = getAxisRanges(
      measurementsTransform.map((measurement) => measurement.y)
    );

    coreBatchGroups[coreCount][batchSize].results.push({
      ...result,
      coreCount: result.core_count,
      batchSize: result.batch_size,
      inferenceEngine: result.inference_engine,
      inferenceModelOptimization: result.inference_model_optimization,
      measurements: {
        data: measurementsTransform,
        id: getBenchmarkDataId(inferenceEngine, inferenceOptimizationName),
      },
      rangesX: [0, measurementsTransform.length - 1],
      ranges,
      msPerItem: (1000 * secPerBatch) / result.batch_size,
      msPerBatch: 1000 * secPerBatch,
      itemsPerSecond: result.batch_size / secPerBatch,
    });

    const combinedMeasurements = coreBatchGroups[coreCount][batchSize].results.reduce(
      (accum, curr) => accum.concat(curr.measurements.data),
      []
    );

    coreBatchGroups[coreCount][batchSize].ranges = getAxisRanges(
      combinedMeasurements.map((measurement) => measurement.y)
    );

    coreBatchGroups[coreCount][batchSize].rangesX = [
      0,
      measurementsTransform.length - 1,
    ];
  });

  const coreReducer = (accum, coreCount) => {
    if (benchmark.batch_sizes.length === 1) {
      return accum.concat([coreBatchGroups[coreCount][benchmark.batch_sizes[0]]]);
    } else {
      return accum.concat(
        benchmark.batch_sizes.reduce((accumBatch, batchSize) => {
          accumBatch.push(coreBatchGroups[coreCount][batchSize]);
          return accumBatch;
        }, [])
      );
    }
  };

  if (benchmark.core_counts.length === 1) {
    return coreReducer([], benchmark.core_counts[0]);
  } else {
    return benchmark.core_counts.reduce(coreReducer, []);
  }
};

const createScalingDefault = (rangesX) => ({
  msPerItem: {
    measurements: [],
    rangesX,
  },
});

const getBenchmarkDataId = (inferenceEngine, optimization) => {
  if (optimization.length === 0) {
    return inferenceEngineToName(inferenceEngine);
  } else {
    return `${inferenceEngineToName(inferenceEngine)}, optim version: ${optimization}`;
  }
};

const groupByCoreAndBatch = (scalingData, accum, batchSize, coreCount) => {
  if (accum.length === 0) {
    return scalingData[coreCount][batchSize].results.map((result) => [result]);
  } else {
    for (let i = 0; i < accum.length; i++) {
      accum[i].push(scalingData[coreCount][batchSize].results[i]);
    }
    return accum;
  }
};

const createBatchScalingReducer = (benchmark, scalingData, optimizationsToName) => (
  scaling,
  coreCount
) => {
  const batchSizes = [...benchmark.batch_sizes];
  batchSizes.sort((a, b) => Number(a) - Number(b));

  const batchData = createScalingDefault(batchSizes);

  let measurements;
  if (batchSizes.length > 1) {
    measurements = batchSizes.reduce((accum, batchSize) => {
      return groupByCoreAndBatch(scalingData, accum, batchSize, coreCount);
    }, []);
  } else {
    measurements = groupByCoreAndBatch(scalingData, [], batchSizes[0], coreCount);
  }

  measurements.forEach((measurement) => {
    Object.keys(batchData).forEach((key) => {
      const optimName = _.get(
        optimizationsToName,
        measurement[0].inferenceModelOptimization,
        measurement[0].inferenceModelOptimization
      );
      batchData[key].measurements.push({
        data: measurement.map((data) => ({
          y: data[key],
          x: data.batchSize,
          type: "scaling",
          batchSize: data.batchSize,
          coreCount: data.coreCount,
          inferenceEngine: inferenceEngineToName(data.inferenceEngine),
          inferenceModelOptimization: _.get(
            optimizationsToName,
            data.inferenceModelOptimization,
            data.inferenceModelOptimization
          ),
        })),
        id: getBenchmarkDataId(measurement[0].inferenceEngine, optimName),
      });

      const combinedData = batchData[key].measurements.reduce(
        (accum, curr) => accum.concat(curr.data),
        []
      );
      batchData[key].ranges = getAxisRanges(combinedData.map((data) => data.y));
    });
  });

  scaling[coreCount] = batchData;
  return scaling;
};

const createCoreScalingReducer = (benchmark, scalingData, optimizationsToName) => (
  scaling,
  batchSize
) => {
  const coreCounts = [...benchmark.core_counts];
  coreCounts.sort((a, b) => Number(a) - Number(b));

  const batchData = createScalingDefault(coreCounts);

  let measurements = [];
  if (coreCounts.length > 1) {
    measurements = coreCounts.reduce((accum, coreCount) => {
      return groupByCoreAndBatch(scalingData, accum, batchSize, coreCount);
    }, []);
  } else {
    measurements = groupByCoreAndBatch(scalingData, [], batchSize, coreCounts[0]);
  }

  measurements.forEach((measurement) => {
    Object.keys(batchData).forEach((key) => {
      const optimName = _.get(
        optimizationsToName,
        measurement[0].inferenceModelOptimization,
        measurement[0].inferenceModelOptimization
      );
      batchData[key].measurements.push({
        data: measurement.map((data) => ({
          y: data[key],
          x: data.coreCount,
          type: "scaling",
          batchSize: data.batchSize,
          coreCount: data.coreCount,
          inferenceEngine: inferenceEngineToName(data.inferenceEngine),
          inferenceModelOptimization: _.get(
            optimizationsToName,
            data.inferenceModelOptimization,
            data.inferenceModelOptimization
          ),
        })),
        id: getBenchmarkDataId(measurement[0].inferenceEngine, optimName),
      });

      const combinedData = batchData[key].measurements.reduce(
        (accum, curr) => accum.concat(curr.data),
        []
      );
      batchData[key].ranges = getAxisRanges(combinedData.map((data) => data.y));
    });
  });

  scaling[batchSize] = batchData;
  return scaling;
};

export const selectBenchmarkResultsById = (benchmarkId) => {
  return (state) => {
    const benchmark = state.benchmarks.val.find(
      (bench) => bench.benchmark_id === benchmarkId
    );
    const optimizations = _.get(state, "selectedOptims.val", []);
    const optimizationsToName = optimizations.reduce((accum, curr) => {
      accum[curr.optim_id] = curr.name || dateUtcToLocalString(curr.created);
      return accum;
    }, {});

    if (
      benchmark.source === "uploaded" ||
      _.get(benchmark, "job.status") === "completed"
    ) {
      const baseline = benchmarkToBaseline(benchmark, optimizationsToName);

      let scaling = {};
      if (benchmark.core_counts.length > 1 || benchmark.batch_sizes.length > 1) {
        const scalingData = baseline.reduce((scalingData, data) => {
          if (!(data.coreCount in scalingData)) {
            scalingData[data.coreCount] = {};
          }
          scalingData[data.coreCount][data.batchSize] = data;
          return scalingData;
        }, {});

        const batchScaling = benchmark.core_counts.reduce(
          createBatchScalingReducer(benchmark, scalingData, optimizationsToName),
          {}
        );

        const coreScaling = benchmark.batch_sizes.reduce(
          createCoreScalingReducer(benchmark, scalingData, optimizationsToName),
          {}
        );

        scaling = {
          coreScaling,
          batchScaling,
        };
      }
      return { baseline, scaling };
    } else {
      return {};
    }
  };
};

export default benchmarksSlice.reducer;
