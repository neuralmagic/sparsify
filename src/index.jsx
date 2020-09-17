import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import App from "./app";
import store, { getProjectsThunk } from "./store";

// get off initial get projects so their available for all routes
store.dispatch(getProjectsThunk());

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
