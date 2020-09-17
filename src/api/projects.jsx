import { API_ROOT, objToQueryString, validateAPIResponseJSON } from "./utils";

/**
 * Request to get a list of projects currently available from the neuralmagicML.server.
 *
 * @param {number} page - The page number for the projects to load
 * @param {number} pageLength - The number of projects to load for the given page
 * @param {string} orderBy - Which field to order the results by
 * @param {boolean} orderDesc - true to order descending, false to order ascending
 * @returns {Promise<any>}
 */
export function requestGetProjects(
  page = 1,
  pageLength = 100,
  orderBy = "modified",
  orderDesc = true
) {
  const queryParams = objToQueryString({
    order_by: orderBy,
    order_desc: orderDesc,
    page,
    page_length: pageLength,
  });
  const url = `${API_ROOT}/projects?${queryParams}`;

  return validateAPIResponseJSON(
    fetch(url, {
      method: "GET",
      cache: "no-cache",
    })
  );
}


/**
 * Request to get the requested project with project_id from the neuralmagicML.server.
 *
 * @param {string} projectId - The id of the project to get
 * @returns {Promise<any>}
 */
export function requestGetProject(projectId) {
  const url = `${API_ROOT}/projects/${projectId}`;

  return validateAPIResponseJSON(
      fetch(url, {
        method: "GET",
        cache: "no-cache",
      })
  );
}

