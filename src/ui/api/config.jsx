import { API_ROOT, validateAPIResponseText, validateAPIResponseJSON } from "./utils";

/**
 * Request to get the requested project's config based on provided optimizer from
 * sparsify
 * @param {string} projectId - The id of the project used to create the config
 * @param {string} optimId - The id of the optimizer used to create the config
 * @param {string} framework - The framework used to create the config. One of pytorch or tensorflow
 * @returns {Promise<any>}
 */
export function requestGetProjectConfig(projectId, optimId, framework) {
  const url = `${API_ROOT}/projects/${projectId}/optim/${optimId}/frameworks/${framework}/config`;

  return validateAPIResponseText(
    fetch(url, {
      method: "GET",
      cache: "no-cache",
    })
  );
}

/**
 * Request to get the available frameworks for the requested project from sparsify
 *
 * @param {string} projectId - The id of the project
 * @returns {Promise<any>}
 */
export function requestGetAvailableFrameworks(projectId) {
  const url = `${API_ROOT}/projects/${projectId}/optim/frameworks`;

  return validateAPIResponseJSON(
    fetch(url, {
      method: "GET",
      cache: "no-cache",
    })
  );
}

/**
 * Request to get the available code samples in the provided framework for the requested project from
 * sparsify
 * @param {string} projectId - The id of the project
 * @param {string} framework - The framework of the project
 * @returns {Promise<any>}
 */
export function requestGetAvailableCodeSamples(projectId, framework) {
  const url = `${API_ROOT}/projects/${projectId}/optim/frameworks/${framework}/samples`;

  return validateAPIResponseJSON(
    fetch(url, {
      method: "GET",
      cache: "no-cache",
    })
  );
}

/**
 * Request to get the requested project's sample code for the given framework to sparsify server
 *
 * @param {string} projectId - The id of the project used to create the code sample
 * @param {string} framework - The framework used to create the code sample. One of pytorch or tensorflow
 * @param {string} sampleType - The type of code sample to get.
 * @returns {Promise<any>}
 */
export function requestGetCodeSample(projectId, framework, sampleType) {
  const url = `${API_ROOT}/projects/${projectId}/optim/frameworks/${framework}/samples/${sampleType}`;

  return validateAPIResponseText(
    fetch(url, {
      method: "GET",
      cache: "no-cache",
    })
  );
}
