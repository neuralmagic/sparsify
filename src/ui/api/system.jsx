import { API_ROOT, validateAPIResponseJSON } from "./utils";

/**
 * Request to get the system info from sparsify
 * @returns {Promise<any>}
 */
export function requestGetSystemInfo() {
  const url = `${API_ROOT}/system/info`;

  return validateAPIResponseJSON(
    fetch(url, {
      method: "GET",
      cache: "no-cache",
    })
  );
}
