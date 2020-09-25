import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from 'redux-saga'

import { all } from 'redux-saga/effects'

import projectsReducer from "./projects-slice";
import selectedProjectReducer from "./project-slice";
import selectedOptims from "./optims-slice";
import selectedOptimsBestEstimated from "./optims-estimated-slice";
import selectedProfilesLoss from "./profiles-loss-slice";
import selectedProfilesPerf from "./profiles-perf-slice";
import selectedConfig from "./config-slice";
import adjustableSettings, { sagas as adjustableSettingsSagas } from "./adjustable-settings-slice";

const sagaMiddleware = createSagaMiddleware()

export default configureStore({
  reducer: {
    projects: projectsReducer,
    selectedProject: selectedProjectReducer,
    selectedOptims: selectedOptims,
    selectedOptimsBestEstimated: selectedOptimsBestEstimated,
    selectedProfilesLoss: selectedProfilesLoss,
    selectedProfilesPerf: selectedProfilesPerf,
    selectedConfig: selectedConfig,
    adjustableSettings
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(sagaMiddleware)
});

function* rootSaga() {
  yield all([adjustableSettingsSagas()])
}

sagaMiddleware.run(rootSaga)

export * from "./adjustable-settings-slice";
export * from "./projects-slice";
export * from "./project-slice";
export * from "./optims-slice";
export * from "./optims-estimated-slice";
export * from "./profiles-loss-slice";
export * from "./profiles-perf-slice";
export * from "./config-slice";

export * from "./utils";
