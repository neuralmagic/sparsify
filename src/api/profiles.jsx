import { JOB_COMPLETED, JOB_CANCELED, JOB_ERROR, requestCancelJob } from "./jobs";
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
 * Request to get the requested loss profile with profile_id from
 * the neuralmagicML.server
 *
 * @param {string} projectId - The project id of the profile to get
 * @param {string} profileId - The profile id of the profile to get
 */
export function requestGetProjectProfileLoss(projectId, profileId) {
  const url = `${API_ROOT}/projects/${projectId}/profiles/loss/${profileId}`;

  return validateAPIResponseJSON(
    fetch(url, {
      method: "GET",
      cache: "no-cache",
    })
  );
}

/**
 * Request to delete the requested loss profile with profile_id from
 * the neuralmagicML.server
 *
 * @param {string} projectId - The project id of the profile to get
 * @param {string} profileId - The profile id of the profile to get
 */
export function requestDeleteProjectProfileLoss(projectId, profileId) {
  const url = `${API_ROOT}/projects/${projectId}/profiles/loss/${profileId}`;

  return validateAPIResponseJSON(
    fetch(url, {
      method: "DELETE",
      cache: "no-cache",
    })
  );
}

/**
 * Request to cancel and delete the requested loss profile
 * with profile_id from the neuralmagicML.server
 *
 * @param {string} projectId - The project id of the profile to get
 * @param {string} profileId - The profile id of the profile to get
 */
export const requestDeleteAndCancelProjectProfileLoss = async (
  projectId,
  profileId
) => {
  const getBody = await requestGetProjectProfileLoss(projectId, profileId);
  const profile = getBody.profile;
  const jobStatus = profile.job.status;
  try {
    if (
      !(
        jobStatus === JOB_COMPLETED ||
        jobStatus === JOB_CANCELED ||
        jobStatus === JOB_ERROR
      )
    ) {
      await requestCancelJob(profile.job.job_id);
    }
  } catch {}
  return requestDeleteProjectProfileLoss(projectId, profileId);
};

export function requestCreateProfileLoss(
  projectId,
  name,
  pruningEstimations = true,
  pruningEstimationType = "weight_magnitude",
  pruningStructure = "unstructured",
  quantizedEstimations = false
) {
  const url = `${API_ROOT}/projects/${projectId}/profiles/loss`;

  return validateAPIResponseJSON(
    fetch(url, {
      method: "POST",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        pruning_estimations: pruningEstimations,
        pruning_estimation_type: pruningEstimationType,
        pruning_structure: pruningStructure,
        quantized_estimations: quantizedEstimations,
      }),
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

/**
 * Request to get the requested perf profile with profile_id from
 * the neuralmagicML.server
 *
 * @param {string} projectId - The project id of the profile to get
 * @param {string} profileId - The profile id of the profile to get
 */
export function requestGetProjectProfilePerf(projectId, profileId) {
  const url = `${API_ROOT}/projects/${projectId}/profiles/perf/${profileId}`;

  return validateAPIResponseJSON(
    fetch(url, {
      method: "GET",
      cache: "no-cache",
    })
  );
}

/**
 * Request to get the requested perf profile with profile_id from
 * the neuralmagicML.server
 *
 * @param {string} projectId - The project id of the profile to get
 * @param {string} profileId - The profile id of the profile to get
 */
export function requestDeleteProjectProfilePerf(projectId, profileId) {
  const url = `${API_ROOT}/projects/${projectId}/profiles/perf/${profileId}`;

  return validateAPIResponseJSON(
    fetch(url, {
      method: "DELETE",
      cache: "no-cache",
    })
  );
}

export const requestDeleteAndCancelProjectProfilePerf = async (
  projectId,
  profileId
) => {
  const getBody = await requestGetProjectProfilePerf(projectId, profileId);
  const profile = getBody.profile;
  const jobStatus = profile.job.status;
  try {
    if (
      !(
        jobStatus === JOB_COMPLETED ||
        jobStatus === JOB_CANCELED ||
        jobStatus === JOB_ERROR
      )
    ) {
      await requestCancelJob(profile.job.job_id);
    }
  } catch {}
  return requestDeleteProjectProfilePerf(projectId, profileId);
};

export function requestCreateProfilePerf(
  projectId,
  name,
  batchSize,
  coreCount,
  warmupIterations = 5,
  iterations = 10,
  pruningEstimations = true,
  quantizedEstimations = false
) {
  const url = `${API_ROOT}/projects/${projectId}/profiles/perf`;

  return validateAPIResponseJSON(
    fetch(url, {
      method: "POST",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        batch_size: batchSize,
        core_count: coreCount,
        iterations_per_check: iterations,
        warmup_iterations_per_check: warmupIterations,
        pruning_estimations: pruningEstimations,
        quantized_estimations: quantizedEstimations,
      }),
    })
  );
}
