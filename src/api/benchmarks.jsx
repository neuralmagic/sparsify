import { API_ROOT, validateAPIResponseJSON } from "./utils";
import _ from "lodash"
import { JOB_CANCELED, JOB_COMPLETED, JOB_ERROR, requestCancelJob } from "./jobs";
export function requestGetProjectBenchmarks(projectId) {
  const url = `${API_ROOT}/projects/${projectId}/benchmarks/`;

  return validateAPIResponseJSON(
    fetch(url, {
      method: "GET",
      cache: "no-cache",
    })
  );
}

export function requestCreateProjectBenchmarks(
  projectId,
  inferenceModels,
  coreCounts,
  batchSizes,
  name = undefined,
  iterationsPerCheck = undefined,
  warmupIterationsPerCheck = undefined
) {
  const url = `${API_ROOT}/projects/${projectId}/benchmarks/`;

  const body = {
    core_counts: coreCounts,
    batch_sizes: batchSizes,
    inference_models: inferenceModels,
  };
  if (name !== undefined) {
    body["name"] = name;
  }

  if (iterationsPerCheck !== undefined) {
    body["iterations_per_check"] = iterationsPerCheck;
  }

  if (warmupIterationsPerCheck !== undefined) {
    body["warmup_iterations_per_check"] = warmupIterationsPerCheck;
  }

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

export function requestDeleteProjectBenchmark(projectId, benchmarkId) {
  const url = `${API_ROOT}/projects/${projectId}/benchmarks/${benchmarkId}`;

  return validateAPIResponseJSON(
    fetch(url, {
      method: "DELETE",
      cache: "no-cache",
    })
  );
}

export function requestGetProjectBenchmark(projectId, benchmarkId) {
  const url = `${API_ROOT}/projects/${projectId}/benchmarks/${benchmarkId}`;

  return validateAPIResponseJSON(
    fetch(url, {
      method: "GET",
      cache: "no-cache",
    })
  );
}

export const requestDeleteAndCancelProjectBenchmark = async (projectId, benchmarkId) => {
  const getBody = await requestGetProjectBenchmark(projectId, benchmarkId);
  const jobStatus = _.get(getBody, 'benchmark.job.status')
  const jobId = _.get(getBody, 'benchmark.job.job_id')

  try {
    if (jobId &&
      !(
        jobStatus === JOB_COMPLETED ||
        jobStatus === JOB_CANCELED ||
        jobStatus === JOB_ERROR
      )
    ) {
      await requestCancelJob(jobId);
    }
  } catch {}
  return requestDeleteProjectBenchmark(projectId, benchmarkId)
}