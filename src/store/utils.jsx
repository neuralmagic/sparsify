import { createAsyncThunk } from "@reduxjs/toolkit";
import { serverOnline, serverOffline, serverLoading } from "./server-slice";
import { scientificNumber, formattedNumber, readableNumber } from "../components";
import { sum } from "ramda";

export const STATUS_IDLE = "idle";
export const STATUS_LOADING = "loading";
export const STATUS_SUCCEEDED = "succeeded";
export const STATUS_FAILED = "failed";

export function createAsyncThunkWrapper(typePrefix, payloadCreator) {
  return createAsyncThunk(typePrefix, async (args, thunkApi) => {
    thunkApi.dispatch(serverLoading());
    return payloadCreator(args, thunkApi)
      .then((body) => {
        thunkApi.dispatch(serverOnline());
        return body;
      })
      .catch((error) => {
        if (String(error) === "TypeError: Failed to fetch") {
          thunkApi.dispatch(serverOffline());
        }
        throw error;
      });
  });
}

export function summarizeObjValuesArray(
  objValues,
  labelFn,
  valueFn,
  extrasFn = null,
  combine = true
) {
  const labelIndices = {};
  const summary = {
    values: {
      objects: [],
      ranges: [],
      max: 0,
      min: 0,
      total: 0,
    },
    valuesLog: {
      objects: [],
      ranges: [],
      max: 0,
      min: 0,
      total: 0,
    },
    valuesPercent: {
      objects: [],
      ranges: [],
      max: 0,
      min: 0,
      total: 0,
    },
  };

  objValues.forEach((obj, objIndex) => {
    const label = labelFn(obj, objIndex);
    const value = valueFn(obj, objIndex);
    const extras = extrasFn ? extrasFn(obj, objIndex) : {};

    if (
      value === null ||
      value === undefined ||
      label === null ||
      label === undefined
    ) {
      return;
    }

    let index;
    let push;

    if (combine && !labelIndices.hasOwnProperty(label)) {
      index = summary.values.objects.length;
      push = true;
      labelIndices[label] = summary.values.objects.length;
    } else if (combine) {
      index = labelIndices[label];
      push = false;
    } else {
      index = summary.values.objects.length;
      push = true;
    }

    if (push) {
      summary.values.objects.push({
        label,
        value: 0,
        x: label,
        y: 0,
      });
    }

    summary.values.objects[index].value += value;
    summary.values.objects[index].y += value;
    summary.values.total += value;

    if (extras) {
      summary.values.objects[index] = { ...summary.values.objects[index], ...extras };
    }
  });
  summary.values.objects.forEach((obj) => {
    const valueLog = obj.value && obj.value > 0 ? Math.log(obj.value) : obj.value;
    const valuePercent = summary.values.total
      ? (obj.value / summary.values.total) * 100
      : 0;

    summary.valuesLog.objects.push({
      ...obj,
      ...{ value: valueLog, y: valueLog },
    });
    summary.valuesLog.total += valueLog;

    summary.valuesPercent.objects.push({
      ...obj,
      ...{ value: valuePercent, y: valuePercent },
    });
    summary.valuesPercent.total += valuePercent;
  });

  if (summary.values.objects.length) {
    summary.values.max = Math.max(...summary.values.objects.map((sum) => sum.value));
    summary.valuesLog.max = Math.max(
      ...summary.valuesLog.objects.map((sum) => sum.value)
    );
    summary.valuesPercent.max = Math.max(
      ...summary.valuesPercent.objects.map((sum) => sum.value)
    );

    summary.values.min = Math.min(...summary.values.objects.map((sum) => sum.value));
    if (summary.values.min > 0) {
      summary.values.min = 0;
    }
    summary.valuesLog.min = Math.min(
      ...summary.valuesLog.objects.map((sum) => sum.value)
    );
    if (summary.valuesLog.min > 0) {
      summary.valuesLog.min = 0;
    }
    summary.valuesPercent.min = Math.min(
      ...summary.valuesPercent.objects.map((sum) => sum.value)
    );
    if (summary.valuesPercent.min > 0) {
      summary.valuesPercent.min = 0;
    }

    const valueRange = summary.values.max - summary.values.min;
    summary.values.ranges = [
      summary.values.min,
      summary.values.min + 0.35 * valueRange,
      summary.values.min + 0.7 * valueRange,
      summary.values.min + 1.05 * valueRange,
    ];
    const valueLogRange = summary.valuesLog.max - summary.valuesLog.min;
    summary.valuesLog.ranges = [
      summary.valuesLog.min,
      summary.valuesLog.min + 0.35 * valueLogRange,
      summary.valuesLog.min + 0.7 * valueLogRange,
      summary.valuesLog.min + 1.05 * valueLogRange,
    ];
    const valuePercentRange = summary.valuesPercent.max - summary.valuesPercent.min;
    summary.valuesPercent.ranges = [
      summary.valuesPercent.min,
      summary.valuesPercent.min + 0.35 * valuePercentRange,
      summary.valuesPercent.min + 0.7 * valuePercentRange,
      summary.valuesPercent.min + 1.05 * valuePercentRange,
    ];
  }

  return summary;
}

export function summarizeLRModifier(modifier, globalStartEpoch, globalEndEpoch) {
  const startEpoch = Math.round(
    modifier.start_epoch > -1 ? modifier.start_epoch : globalStartEpoch
  );
  const endEpoch = Math.round(
    modifier.end_epoch > -1 ? modifier.end_epoch : globalEndEpoch
  );
  const values = [];
  const lrMods = modifier.lr_mods
    ? [...modifier.lr_mods].sort((a, b) => a.start_epoch - b.start_epoch)
    : [];

  function getLRModAtEpoch(epoch) {
    let mod = null;

    lrMods.forEach((check) => {
      if (
        epoch >= check.start_epoch &&
        (epoch <= check.end_epoch || check.end_epoch < 0)
      ) {
        mod = check;
      }
    });

    return mod;
  }

  function getLRValueFromMod(mod, epoch) {
    if (!mod) {
      return null;
    }

    if (mod.clazz === "step" || mod.clazz === "exponential") {
      const epochsPassed = mod.start_epoch > -1 ? epoch - mod.start_epoch : epoch;
      const stepSize = mod.clazz === "step" ? mod.args.step_size : 1.0;
      const numSteps = Math.floor(epochsPassed / stepSize);
      const gamma = mod.args.gamma;

      return mod.init_lr * Math.pow(gamma, numSteps);
    }

    if (mod.clazz === "multi_step") {
      let numSteps = 0;
      mod.args.milestones.forEach((mile) => {
        if (mile >= epoch) {
          numSteps += 1;
        }
      });
      const gamma = mod.args.gamma;

      return mod.init_lr * Math.pow(gamma, numSteps);
    }

    return mod.init_lr;
  }

  for (let epoch = startEpoch; epoch <= endEpoch; epoch++) {
    const mod = getLRModAtEpoch(epoch);
    const lr = getLRValueFromMod(mod, epoch);
    values.push({
      epoch,
      lr,
      mod,
    });
  }

  const summaries = summarizeObjValuesArray(
    values,
    (val) => val.epoch,
    (val) => val.lr,
    (val) => val.mod
  );

  const initLR = summaries ? summaries.values.objects[0].value : null;
  const finalLR = summaries
    ? summaries.values.objects[summaries.values.objects.length - 1].value
    : null;

  return {
    startEpoch: modifier.start_epoch > -1 ? modifier.start_epoch : globalStartEpoch,
    endEpoch: modifier.end_epoch > -1 ? modifier.end_epoch : globalEndEpoch,
    summaries,
    metricsGroups: [
      {
        title: "Summary",
        metrics: [
          { title: "Initial LR", value: scientificNumber(initLR) },
          { title: "Final LR", value: scientificNumber(finalLR) },
        ],
      },
    ],
  };
}

export function summarizePruningModifier(modifier, modelAnalysis) {
  const nodeLookup = {};

  if (modelAnalysis && modelAnalysis.nodes) {
    modelAnalysis.nodes.forEach((node) => {
      nodeLookup[node.id] = node;
    });
  }
  const perfGainTitle = modifier.est_time_gain
    ? "Estimated Speedup"
    : "FLOPS Reduction";
  const perfGain = modifier.est_time_gain
    ? modifier.est_time_gain
    : modifier.flops_gain;
  const summaries = summarizeObjValuesArray(
    modifier.nodes,
    (node, index) => index,
    (node) => (node.sparsity ? node.sparsity * 100 : 0.0),
    (node) =>
      nodeLookup.hasOwnProperty(node.node_id) ? nodeLookup[node.node_id] : null
  );
  summaries.values.ranges = [0.0, 33.33, 66.67, 100.0];
  summaries.values.min = 0;
  summaries.values.max = 100.0;

  return {
    startEpoch: modifier.start_epoch,
    endEpoch: modifier.end_epoch,
    summaries,
    metricsGroups: [
      {
        title: "Summary",
        metrics: [
          { title: perfGainTitle, value: formattedNumber(perfGain, 2, "x") },
          {
            title: "Estimated Compression",
            value: formattedNumber(modifier.compression, 2, "x"),
          },
          {
            title: "Recovery Confidence",
            value: formattedNumber(modifier.est_recovery, 2),
          },
        ],
      },
      {
        title: "Performance",
        metrics: [
          {
            title: "Estimated Time",
            value: formattedNumber(
              modifier.est_time ? modifier.est_time * 1000 : null,
              2,
              " ms"
            ),
          },
          {
            title: "Baseline Time",
            value: formattedNumber(
              modifier.est_time_baseline ? modifier.est_time_baseline * 1000 : null,
              2,
              " ms"
            ),
          },
          {
            title: "Estimated Speedup",
            value: formattedNumber(modifier.est_time_gain, 2, "x"),
          },
        ],
      },
      {
        title: "FLOPS",
        metrics: [
          {
            title: "Estimated FLOPS",
            value: readableNumber(modifier.flops, 1),
          },
          {
            title: "Baseline FLOPS",
            value: readableNumber(modifier.flops_baseline, 1),
          },
          {
            title: "FLOPS Reduction",
            value: formattedNumber(modifier.flops_gain, 2, "x"),
          },
        ],
      },
      {
        title: "Params",
        metrics: [
          {
            title: "Estimated Params",
            value: readableNumber(modifier.params, 1),
          },
          {
            title: "Baseline Params",
            value: readableNumber(modifier.params_baseline, 1),
          },
          {
            title: "Estimated Compression",
            value: formattedNumber(modifier.compression, 2, "x"),
          },
        ],
      },
    ],
  };
}
