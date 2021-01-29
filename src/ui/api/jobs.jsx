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

export const JOB_PENDING = "pending";
export const JOB_STARTED = "started";
export const JOB_CANCELING = "canceling";
export const JOB_COMPLETED = "completed";
export const JOB_CANCELED = "canceled";
export const JOB_ERROR = "error";

export function jobProgressValue(progress) {
  if (!progress || progress.iter_indefinite) {
    return null;
  }

  if (!progress.num_steps || progress.num_steps < 2) {
    return progress.iter_val ? progress.iter_val * 100.0 : 0.0;
  }

  const stepProgress =
    ((progress.step_index ? progress.step_index : 0.0) / progress.num_steps) * 100;
  const iterValue = progress.iter_val
    ? (progress.iter_val / progress.num_steps) * 100.0
    : 0.0;

  return stepProgress + iterValue;
}

export function requestGetJob(jobId) {
  const url = `${API_ROOT}/jobs/${jobId}`;

  return validateAPIResponseJSON(
    fetch(url, {
      method: "GET",
      cache: "no-cache",
    })
  );
}

export function requestCancelJob(jobId) {
  const url = `${API_ROOT}/jobs/${jobId}/cancel`;

  return validateAPIResponseJSON(
    fetch(url, {
      method: "POST",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
    })
  );
}

export function requestGetJobTerminal(jobId, progressCallback, shouldCancelCallback) {
  return requestGetJob(jobId).then((data) => {
    const job = data.job;

    if (job.status === JOB_ERROR) {
      return Promise.reject(Error(job.error));
    }

    if (job.status === JOB_COMPLETED || job.status === JOB_CANCELED) {
      return Promise.resolve(data);
    }

    if (progressCallback) {
      progressCallback(job.progress);
    }

    // job not completed yet, need to make another request
    // wait 100 ms before making the next request to not hammer server
    return new Promise((resolve) => setTimeout(resolve, 100)).then(() => {
      return shouldCancelCallback && shouldCancelCallback()
        ? requestCancelJob(job.job_id)
        : requestGetJobTerminal(job.job_id, progressCallback, shouldCancelCallback);
    });
  });
}
