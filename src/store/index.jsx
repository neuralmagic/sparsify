import { configureStore } from "@reduxjs/toolkit";

import projectsReducer from "./projects-slice";

export default configureStore({
  reducer: {
    projects: projectsReducer,
  },
});
