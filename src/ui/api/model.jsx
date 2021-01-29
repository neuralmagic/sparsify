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

import axios from "axios";

import { API_ROOT, validateAPIResponseJSON } from "./utils";

export function requestUploadProjectModel(projectId, modelFile, progressCallback) {
  const path = `/projects/${projectId}/model/upload`;
  const formPayload = new FormData();
  formPayload.append("model_file", modelFile);

  return validateAPIResponseJSON(
    axios({
      baseURL: API_ROOT,
      url: path,
      method: "post",
      data: formPayload,
      onUploadProgress: (progress) => {
        if (progressCallback) {
          progressCallback(progress);
        }
      },
    })
  );
}

export function requestUploadProjectModelFromPath(projectId, uri) {
  const url = `${API_ROOT}/projects/${projectId}/model/upload-from-path`;

  return validateAPIResponseJSON(
    fetch(url, {
      method: "POST",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ uri }),
    })
  );
}

export function requestCreateProjectModelAnalysis(projectId) {
  const url = `${API_ROOT}/projects/${projectId}/model/analysis`;

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
