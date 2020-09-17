import { API_ROOT, validateAPIResponseJSON } from "./utils";

export function requestGetProjects(page = 1, pageLength = 100) {
  const url = `${API_ROOT}/projects?page=${page}&page_length=${pageLength}`;

  return validateAPIResponseJSON(
    fetch(url, {
      method: "GET",
      cache: "no-cache",
    })
  );
}
