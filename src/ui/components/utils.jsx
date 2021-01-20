import { curry } from "ramda";
import moment from "moment";
/**
 * Converts a long string of bytes into a readable format e.g KB, MB, GB, TB, YB
 *
 * @param {number} bytes - The number of bytes.
 */
export function readableBytes(bytes) {
  if (!bytes || bytes < 1) {
    return "";
  }

  const index = Math.floor(Math.log(bytes) / Math.log(1024));
  const sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  if (index >= sizes.length) {
    return "NaN B";
  }

  return (bytes / Math.pow(1024, index)).toFixed(2) * 1 + " " + sizes[index];
}

export function readableNumber(num, digits = 2) {
  if (!num && num !== 0) {
    return "";
  }

  const lookup = [
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "k" },
    { value: 1e6, symbol: "M" },
    { value: 1e9, symbol: "G" },
    { value: 1e12, symbol: "T" },
    { value: 1e15, symbol: "P" },
    { value: 1e18, symbol: "E" },
  ];

  let index = -1;
  for (index = lookup.length - 1; index > 0; index--) {
    if (num >= lookup[index].value) {
      break;
    }
  }

  if (index === -1 || !lookup[index].symbol) {
    return num.toFixed(digits);
  }

  const shiftedNum = num / lookup[index].value;

  return `${shiftedNum.toFixed(digits)} ${lookup[index].symbol}`;
}

export function formattedNumber(num, digits = 2, suffix = null) {
  if (!num && num !== 0) {
    return "--";
  }

  let formatted = `${num.toFixed(digits)}`;

  if (suffix) {
    formatted += `${suffix}`;
  }

  return formatted;
}

export function scientificNumber(num, digits = 2) {
  if (!num && num !== 0) {
    return "";
  }

  let coefficient;
  let exponent;
  [coefficient, exponent] = num
    .toExponential()
    .split("e")
    .map((item) => Number(item));

  return `${parseFloat(coefficient).toFixed(digits)}e${exponent}`;
}

export function adjustColorOpacity(color, opacity) {
  let red;
  let green;
  let blue;

  if (color.startsWith("rgb")) {
    const pattern = /rgb.?\(([0-9]+)[^0-9]+([0-9]+)[^0-9]+([0-9]+)/;
    const res = color.match(pattern);
    red = res[1];
    green = res[2];
    blue = res[3];
  } else {
    red = parseInt(color.slice(1, 3), 16);
    green = parseInt(color.slice(3, 5), 16);
    blue = parseInt(color.slice(5, 7), 16);
  }

  return `rgba(${red}, ${green}, ${blue}, ${opacity})`;
}

export function combineStatuses(statuses) {
  if (statuses.includes("failed")) {
    return "failed";
  }

  if (statuses.includes("loading")) {
    return "loading";
  }

  if (statuses.includes("succeeded")) {
    return "succeeded";
  }

  return "idle";
}

export function localStorageAvailable() {
  const test = "test";

  try {
    localStorage.setItem(test, test);
    localStorage.removeItem(test);

    return true;
  } catch (e) {
    return false;
  }
}

export function sessionStorageAvailable() {
  const test = "test";

  try {
    sessionStorage.setItem(test, test);
    sessionStorage.removeItem(test);

    return true;
  } catch (e) {
    return false;
  }
}

export const trainingOptimizers = [
  {
    value: "",
    label: "Unselected",
  },
  {
    value: "SGD",
    label: "SGD",
  },
  {
    value: "Adam",
    label: "Adam",
  },
  {
    value: "RMSProp",
    label: "RMSProp",
  },
  {
    value: "Adadelta",
    label: "Adadelta",
  },
  {
    value: "Adagrad",
    label: "Adagrad",
  },
  {
    value: "Other",
    label: "Other",
  },
];

export const lrModsTypes = [
  {
    value: "set",
    label: "Set LR",
  },
  {
    value: "step",
    label: "Step LR",
  },
  {
    value: "multi_step",
    label: "Multi Step LR",
  },
  {
    value: "exponential",
    label: "Exponential LR",
  },
];

export const formatMetricValue = curry(({ mantissaLength }, value) =>
  value ? value.toFixed(mantissaLength) : "-"
);

export const formatWithMantissa = (length, value) =>
  formatMetricValue({ mantissaLength: length }, value);

export const dateUtcToLocal = (date) => moment.utc(date).local();

export const dateUtcToLocalString = (date) =>
  dateUtcToLocal(date).format("MM/DD/YYYY h:mma");

export const inferenceEngineToName = (engine) => {
  if (engine === "ort_cpu") {
    return "ONNX Runtime CPU";
  } else if (engine === "deepsparse") {
    return "Deepsparse";
  } else if (engine === "ort_gpu") {
    return "ONNX Runtime GPU";
  }
};
