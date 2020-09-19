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
