import { sum } from "ramda";

export const STATUS_IDLE = "idle";
export const STATUS_LOADING = "loading";
export const STATUS_SUCCEEDED = "succeeded";
export const STATUS_FAILED = "failed";

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
