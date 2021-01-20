import { API_ROOT, objToQueryString, validateAPIResponseJSON } from "./utils";

function projectCreateUpdateBody(
  name,
  description,
  trainingOptimizer,
  trainingEpochs,
  trainingLRInit,
  trainingLRFinal
) {
  const body = {};

  if (name !== undefined) {
    body["name"] = name;
  }

  if (description !== undefined) {
    body["description"] = description;
  }

  if (trainingOptimizer !== undefined) {
    body["training_optimizer"] = trainingOptimizer;
  }

  if (trainingEpochs !== undefined) {
    body["training_epochs"] = trainingEpochs;
  }

  if (trainingLRInit !== undefined) {
    body["training_lr_init"] = trainingLRInit;
  }

  if (trainingLRFinal !== undefined) {
    body["training_lr_final"] = trainingLRFinal;
  }

  return body;
}

/**
 * Request to get a list of projects currently available from the sparsify.
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
 * Request to create a project with the
 * given params in the sparsify
 *
 * @param name - name of the project to use
 * @param description - description of the project to use
 * @param trainingOptimizer - training optimizer used for the project
 * @param trainingEpochs - number of training epochs used for the project
 * @param trainingLRInit - training initial learning rate used for the project
 * @param trainingLRFinal - training final learning rate used for the project
 * @returns {Promise<any>}
 */
export function requestCreateProject(
  name = undefined,
  description = undefined,
  trainingOptimizer = undefined,
  trainingEpochs = undefined,
  trainingLRInit = undefined,
  trainingLRFinal = undefined
) {
  const url = `${API_ROOT}/projects/`;
  const body = projectCreateUpdateBody(
    name,
    description,
    trainingOptimizer,
    trainingEpochs,
    trainingLRInit,
    trainingLRFinal
  );

  return validateAPIResponseJSON(
    fetch(url, {
      method: "POST",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
  );
}

/**
 * Request to get the requested project with projectId from the sparsify.
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

/**
 * Request to update the requested project with projectId and
 * given params in the sparsify
 *
 * @param projectId - id of the project to update
 * @param name - name of the project to use
 * @param description - description of the project to use
 * @param trainingOptimizer - training optimizer used for the project
 * @param trainingEpochs - number of training epochs used for the project
 * @param trainingLRInit - training initial learning rate used for the project
 * @param trainingLRFinal - training final learning rate used for the project
 * @returns {Promise<any>}
 */
export function requestUpdateProject(
  projectId,
  name = undefined,
  description = undefined,
  trainingOptimizer = undefined,
  trainingEpochs = undefined,
  trainingLRInit = undefined,
  trainingLRFinal = undefined
) {
  const url = `${API_ROOT}/projects/${projectId}`;
  const body = projectCreateUpdateBody(
    name,
    description,
    trainingOptimizer,
    trainingEpochs,
    trainingLRInit,
    trainingLRFinal
  );

  return validateAPIResponseJSON(
    fetch(url, {
      method: "PUT",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
  );
}

/**
 * Request to delete the requested project with projectId from the sparsify.
 *
 * @param {string} projectId - The id of the project to delete
 * @param {boolean} force - True to force the project deletion and ignore any errors
 * @returns {Promise<any>}
 */
export function requestDeleteProject(projectId, force = true) {
  let url = `${API_ROOT}/projects/${projectId}`;

  if (force) {
    url += "?force=true";
  }

  return validateAPIResponseJSON(
    fetch(url, {
      method: "DELETE",
      cache: "no-cache",
    })
  );
}
