/*
Copyright (c) 2021 - present / Neuralmagic, Inc. All Rights Reserved.

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

import { API_ROOT, validateAPIResponseJSON } from "./utils";
import _ from "lodash";
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

export const requestDeleteAndCancelProjectBenchmark = async (
  projectId,
  benchmarkId
) => {
  const getBody = await requestGetProjectBenchmark(projectId, benchmarkId);
  const jobStatus = _.get(getBody, "benchmark.job.status");
  const jobId = _.get(getBody, "benchmark.job.job_id");

  try {
    if (
      jobId &&
      !(
        jobStatus === JOB_COMPLETED ||
        jobStatus === JOB_CANCELED ||
        jobStatus === JOB_ERROR
      )
    ) {
      await requestCancelJob(jobId);
    }
  } catch {}
  return requestDeleteProjectBenchmark(projectId, benchmarkId);
};
