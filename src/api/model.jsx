import axios from "axios";

import { API_ROOT, validateAPIResponseJSON } from "./utils";

export function requestUploadProjectModel(
  projectId,
  modelFile,
  progressCallback
) {
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
