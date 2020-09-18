import { API_ROOT, objToQueryString, validateAPIResponseJSON } from "./utils";

/**
 * Request to get the requested project's loss profiles
 * with project_id from the neuralmagicML.server.
 *
 * @param {string} projectId - The id of the project to get
 * @param {number} page - The page number for the profiles to load
 * @param {number} pageLength - The number of profiles to load for the given page
 * @returns {Promise<any>}
 */
export function requestGetProjectProfilesLoss(projectId, page = 1, pageLength = 100) {
  const queryParams = objToQueryString({
    page,
    page_length: pageLength,
  });
  const url = `${API_ROOT}/projects/${projectId}/profiles/loss?${queryParams}`;

  return validateAPIResponseJSON(
    fetch(url, {
      method: "GET",
      cache: "no-cache",
    })
  );
}

/**
 * Request to get the requested project's performance profiles
 * with project_id from the neuralmagicML.server.
 *
 * @param {string} projectId - The id of the project to get
 * @param {number} page - The page number for the profiles to load
 * @param {number} pageLength - The number of profiles to load for the given page
 * @returns {Promise<any>}
 */
export function requestGetProjectProfilesPerf(projectId, page = 1, pageLength = 100) {
  const queryParams = objToQueryString({
    page,
    page_length: pageLength,
  });
  const url = `${API_ROOT}/projects/${projectId}/profiles/perf?${queryParams}`;

  return validateAPIResponseJSON(
    fetch(url, {
      method: "GET",
      cache: "no-cache",
    })
  );
}
