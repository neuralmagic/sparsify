export const API_ROOT = process.env.REACT_APP_API_ROOT || "/api";

/***
 * Utility function to convert an object into a query params string.
 *
 * @param {any} obj - The object with key value pairs to map into a query params string
 * @returns {string}
 */
export function objToQueryString(obj) {
  const keyValuePairs = [];

  for (const key in obj) {
    keyValuePairs.push(encodeURIComponent(key) + "=" + encodeURIComponent(obj[key]));
  }

  return keyValuePairs.join("&");
}

/***
 * Utility function to validate and format a JSON response
 * from the sparsify APIs.
 *
 * @param {Promise<any>} responsePromise
 * @returns {Promise<any>}
 */
export function validateAPIResponseJSON(responsePromise) {
  return responsePromise
    .then((response) => {
      if (response.data) {
        // axios response
        return Promise.resolve({
          statusOk: response.statusText === "OK",
          status: response.status,
          body: response.data,
        });
      } else {
        // fetch response
        return response.json().then((data) => {
          return {
            statusOk: response.ok,
            status: response.status,
            body: data,
          };
        });
      }
    })
    .then((data) => {
      if (!data.statusOk) {
        return Promise.reject(Error(data.body.error_message));
      }

      return data.body;
    })
    .catch((err) => {
      return Promise.reject(err);
    });
}

/***
 * Utility function to validate and format a text response
 * from the sparsify APIs.
 *
 * @param {Promise<any>} responsePromise
 * @returns {Promise<any>}
 */
export function validateAPIResponseText(responsePromise) {
  return responsePromise
    .then((response) => {
      return response.text().then((data) => {
        return {
          statusOk: response.ok,
          status: response.status,
          body: data,
        };
      });
    })
    .then((data) => {
      if (!data.statusOk) {
        const body = JSON.parse(data.body);
        return Promise.reject(Error(body.error_message));
      }
      return data.body;
    })
    .catch((err) => {
      return Promise.reject(err);
    });
}
