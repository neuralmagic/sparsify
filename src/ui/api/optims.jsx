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

import { API_ROOT, objToQueryString, validateAPIResponseJSON } from "./utils";

/**
 * Request to create an optimization for project
 * with project_id from the sparsify.
 *
 * @param {string} projectId - The id of the project to get
 * @param {string} name - The name of the created optimizer
 * @param {boolean} add_pruning - Using pruning in created optimizer
 * @param {boolean} add_quantization - Using quantization in created optimizer
 * @param {boolean} add_lr_schedule - Using lr schedule in created optimizer
 * @param {boolean} add_trainable - Using trainable in created optimizer
 * @param {AbortController} abortController - Optional control to control whether to cancel
 */
export function requestCreateProjectOptimizer(
  projectId,
  name = undefined,
  add_pruning = undefined,
  add_quantization = undefined,
  add_lr_schedule = undefined,
  add_trainable = undefined,
  abortController = undefined
) {
  const url = `${API_ROOT}/projects/${projectId}/optim/`;
  const body = {};
  if (name !== undefined) {
    body["name"] = name;
  }

  if (add_pruning !== undefined) {
    body["add_pruning"] = add_pruning;
  }

  if (add_quantization !== undefined) {
    body["add_quantization"] = add_quantization;
  }

  if (add_lr_schedule !== undefined) {
    body["add_lr_schedule"] = add_lr_schedule;
  }

  if (add_trainable !== undefined) {
    body["add_trainable"] = add_trainable;
  }

  let signalOptions = {};
  if (abortController) {
    signalOptions = {
      signal: abortController.signal,
    };
  }

  return validateAPIResponseJSON(
    fetch(url, {
      method: "POST",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      ...signalOptions,
    })
  );
}

/**
 * Request to get the requested project's optimizations
 * with project_id from the sparsify.
 *
 * @param {string} projectId - The id of the project to get
 * @param {number} page - The page number for the profiles to load
 * @param {number} pageLength - The number of profiles to load for the given page
 * @returns {Promise<any>}
 */
export function requestGetProjectOptims(projectId, page = 1, pageLength = 100) {
  const queryParams = objToQueryString({
    page,
    page_length: pageLength,
  });
  const url = `${API_ROOT}/projects/${projectId}/optim?${queryParams}`;

  return validateAPIResponseJSON(
    fetch(url, {
      method: "GET",
      cache: "no-cache",
    })
  );
}

export function requestUpdateOptim(
  projectId,
  optimId,
  name,
  profilePerfId,
  profileLossId,
  startEpoch,
  endEpoch
) {
  const url = `${API_ROOT}/projects/${projectId}/optim/${optimId}`;
  const body = {};
  if (name !== undefined) {
    body.name = name;
  }
  if (profilePerfId !== undefined) {
    body.profile_perf_id = profilePerfId;
  }
  if (profileLossId !== undefined) {
    body.profile_loss_id = profileLossId;
  }
  if (startEpoch !== undefined) {
    body.start_epoch = startEpoch;
  }
  if (endEpoch !== undefined) {
    body.end_epoch = endEpoch;
  }

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

export function requestUpdateOptimModifierPruning(
  projectId,
  optimId,
  modifierId,
  properties
) {
  const url = `${API_ROOT}/projects/${projectId}/optim/${optimId}/modifiers/${modifierId}/pruning`;

  return validateAPIResponseJSON(
    fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(properties),
    })
  );
}

export function requestUpdateOptimModifierLRSchedule(
  projectId,
  optimId,
  modifierId,
  properties
) {
  const url = `${API_ROOT}/projects/${projectId}/optim/${optimId}/modifiers/${modifierId}/lr-schedule`;

  return validateAPIResponseJSON(
    fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(properties),
    })
  );
}

/**
 * Request to get the requested project's best estimated optimization meta data
 * based on optional loss and performance profiles
 *
 * @param projectId - The id of the project to get best estimated for
 * @param profilePerfId - The performance profile to use to calculate the best estimated, if any
 * @param profileLossId - The loss profile to use to calculate the best estimated, if any
 * @returns {Promise<any>}
 */
export function requestGetProjectOptimBestEstimated(
  projectId,
  profilePerfId,
  profileLossId
) {
  const queryParamsDict = {};
  if (profilePerfId) {
    queryParamsDict["profile_perf_id"] = profilePerfId;
  }
  if (profileLossId) {
    queryParamsDict["profile_loss_id"] = profileLossId;
  }
  const queryParams = objToQueryString(queryParamsDict);
  const url = `${API_ROOT}/projects/${projectId}/optim/modifiers/best-estimated?${queryParams}`;

  return validateAPIResponseJSON(
    fetch(url, {
      method: "GET",
      cache: "no-cache",
    })
  );
}

/**
 * Request to create a new optimization version
 *
 * @param {string} projectId - The id of the project to get
 * @param {string} optimId - The id of the optimization to get
 * @param {string} name - The name of the created optimizer
 * @param {string} notes - The notes of the created optimizer
 * @param {AbortController} abortController - Optional control to control whether to cancel
 */
export function requestCreateProjectOptimVersion(
  projectId,
  optimId,
  name = undefined,
  notes = undefined,
  abortController = undefined
) {
  const url = `${API_ROOT}/projects/${projectId}/optim/${optimId}/version`;
  const body = {};

  if (name !== undefined) {
    body.name = name;
  }

  if (notes !== undefined) {
    body.notes = notes;
  }

  let signalOptions = {};
  if (abortController) {
    signalOptions = {
      signal: abortController.signal,
    };
  }

  return validateAPIResponseJSON(
    fetch(url, {
      method: "POST",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      ...signalOptions,
    })
  );
}
