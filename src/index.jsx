import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import App from "./app";
import store, {getProjectsThunk, getSystemInfoThunk} from "./store";
import { BrowserRouter as Router } from "react-router-dom";

// get off initial get projects and system info
// so they're available for all routes
store.dispatch(getProjectsThunk());
store.dispatch(getSystemInfoThunk());

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <App />
    </Router>
  </Provider>,
  document.getElementById("root")
);
