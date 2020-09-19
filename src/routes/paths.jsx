import { objToQueryString } from "../api";

export const PATH_HOME = "/";
export const PATH_PROJECT = "/project/:projectId";
export const PATH_PROJECT_ACTION = `${PATH_PROJECT}/:action?/:actionId?`;
export const PATH_PROJECT_BENCHMARK = `${PATH_PROJECT}/bench`;
export const PATH_PROJECT_OPTIM = `${PATH_PROJECT}/optim/:optimId?`;
export const PATH_PROJECT_EXPORT = `${PATH_PROJECT_OPTIM}/export`;
export const PATH_PROJECT_PERF = `${PATH_PROJECT}/perf/:perfId?`;
export const PATH_PROJECT_LOSS = `${PATH_PROJECT}/loss/:lossId?`;
export const PATH_PROJECT_SETTINGS = `${PATH_PROJECT}/settings`;
export const PATH_NOT_FOUND = "*";

export function createHomePath() {
  return "/";
}

export function createProjectPath(projectId) {
  return `/project/${projectId}`;
}

export function createProjectPerfPath(projectId, profileId) {
  if (!profileId) {
    return `${createProjectPath(projectId)}/perf`;
  }

  return `${createProjectPath(projectId)}/perf/${profileId}`;
}

export function createProjectLossPath(projectId, profileId) {
  if (!profileId) {
    return `${createProjectPath(projectId)}/loss`;
  }

  return `${createProjectPath(projectId)}/loss/${profileId}`;
}

export function createProjectOptimPath(
  projectId,
  optimId,
  profilePerfId,
  profileLossId
) {
  if (!optimId) {
    return `${createProjectPath(projectId)}/optim`;
  }

  const queryMap = {};
  if (profilePerfId) {
    queryMap["perf"] = profilePerfId;
  }
  if (profileLossId) {
    queryMap["loss"] = profileLossId;
  }
  const queryString =
    Object.keys(queryMap).length > 0 ? `?${objToQueryString(queryMap)}` : "";

  return `${createProjectPath(projectId)}/optim/${optimId}${queryString}`;
}

export function createProjectBenchmarksPath(projectId) {
  return `${createProjectPath(projectId)}/bench`;
}

export function createProjectSettingsPath(projectId) {
  return `${createProjectPath(projectId)}/settings`;
}
