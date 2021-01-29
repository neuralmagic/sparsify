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
