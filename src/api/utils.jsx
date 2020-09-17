export const API_ROOT = "http://0.0.0.0:5543/api";

export function validateAPIResponseJSON(responsePromise) {
    return responsePromise.then((response) => {
        return response.json().then((data) => {
            return {
                statusOk: response.ok,
                status: response.status,
                body: data
            };
        });
    }).then((data) => {
        if (!data.statusOk) {
            return Promise.reject(Error(data.body.error_message));
        }

        return data.body;
    }).catch((err) => {
        return Promise.reject(err);
    });
}
