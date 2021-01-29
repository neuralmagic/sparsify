/*
Copyright (c) 2021 - present / Neuralmagic, Inc. All Rights Reserved.

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

import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";

import { all } from "redux-saga/effects";

import modalsReducer from "./modal-slice";
import benchmarksReducer from "./benchmarks-slice";
import createBenchmarksReducer from "./benchmarks-create-slice";
import projectsReducer from "./projects-slice";
import selectedProjectReducer from "./project-slice";
import selectedOptims from "./optims-slice";
import selectedOptimsBestEstimated from "./optims-estimated-slice";
import selectedProfilesLoss from "./profiles-loss-slice";
import createLossProfile from "./profiles-loss-create-slice";
import selectedProfilesPerf from "./profiles-perf-slice";
import createPerfProfile from "./profiles-perf-create-slice";
import selectedConfig from "./config-slice";
import createProject from "./project-create-slice";
import adjustableSettings, {
  sagas as adjustableSettingsSagas,
} from "./adjustable-settings-slice";
import createdOptims from "./optims-create-slice";
import system from "./system-slice";
import serverStatus from "./server-slice";

const sagaMiddleware = createSagaMiddleware();

export default configureStore({
  reducer: {
    benchmarks: benchmarksReducer,
    createdBenchmarks: createBenchmarksReducer,
    projects: projectsReducer,
    createdOptims: createdOptims,
    selectedProject: selectedProjectReducer,
    selectedOptims: selectedOptims,
    selectedOptimsBestEstimated: selectedOptimsBestEstimated,
    selectedProfilesLoss: selectedProfilesLoss,
    selectedProfilesPerf: selectedProfilesPerf,
    selectedConfig: selectedConfig,
    createProject: createProject,
    adjustableSettings,
    system: system,
    serverStatus: serverStatus,
    modals: modalsReducer,
    createPerfProfile: createPerfProfile,
    createLossProfile: createLossProfile,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(sagaMiddleware),
});

function* rootSaga() {
  yield all([adjustableSettingsSagas()]);
}

sagaMiddleware.run(rootSaga);

export * from "./adjustable-settings-slice";
export * from "./benchmarks-slice";
export * from "./benchmarks-create-slice";
export * from "./projects-slice";
export * from "./project-slice";
export * from "./optims-slice";
export * from "./optims-create-slice";
export * from "./optims-estimated-slice";
export * from "./profiles-loss-slice";
export * from "./profiles-loss-create-slice";
export * from "./profiles-perf-slice";
export * from "./profiles-perf-create-slice";
export * from "./config-slice";
export * from "./project-create-slice";
export * from "./system-slice";
export * from "./server-slice";
export * from "./modal-slice";

export * from "./utils";
