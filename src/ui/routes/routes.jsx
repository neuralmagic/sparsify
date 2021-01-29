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

import Home from "./home";
import NotFound from "./not-found";
import Project from "./project";
import ProjectBenchmark from "./project-benchmark";
import ProjectOptim from "./project-optim";
import ProjectOptimSelected from "./project-optim-selected";
import ProjectPerf from "./project-perf";
import ProjectLoss from "./project-loss";
import ProjectSettings from "./project-settings";

import HomeSideNav from "./home-sidenav";
import NotFoundSideNav from "./not-found-sidenav";
import ProjectSideNav from "./project-sidenav";

import {
  PATH_HOME,
  PATH_PROJECT,
  PATH_PROJECT_ACTION,
  PATH_PROJECT_BENCHMARK,
  PATH_PROJECT_PERF,
  PATH_PROJECT_LOSS,
  PATH_PROJECT_OPTIM,
  PATH_PROJECT_OPTIM_SELECTED,
  PATH_PROJECT_SETTINGS,
  PATH_NOT_FOUND,
} from "./paths";

/**
 * Create a route transition for use with the react-route-transition library.
 * Controls the opacity of the route such that it fades from 0 -> 1 on enter and 1 -> 0 on leave.
 *
 * @returns {
 *   {
 *      atActive: {opacity: number},
 *      mapStyles: (function(*): {opacity: *}),
 *      atLeave: {opacity: number},
 *      atEnter: {opacity: number}
 *    }
 *  }
 */
export function makeRouteTransitionOpacity() {
  return {
    atEnter: {
      opacity: 0,
    },
    atLeave: {
      opacity: 0,
    },
    atActive: {
      opacity: 1,
    },
    mapStyles: (styles) => ({
      opacity: styles.opacity,
    }),
  };
}

export function makeContentRoutes() {
  return [
    {
      path: PATH_HOME,
      exact: true,
      component: Home,
    },
    {
      path: PATH_PROJECT,
      exact: true,
      component: Project,
    },
    {
      path: PATH_PROJECT_BENCHMARK,
      exact: true,
      component: ProjectBenchmark,
    },
    {
      path: PATH_PROJECT_OPTIM,
      exact: true,
      component: ProjectOptim,
    },
    {
      path: PATH_PROJECT_OPTIM_SELECTED,
      exact: true,
      component: ProjectOptimSelected,
    },
    {
      path: PATH_PROJECT_PERF,
      exact: true,
      component: ProjectPerf,
    },
    {
      path: PATH_PROJECT_LOSS,
      exact: true,
      component: ProjectLoss,
    },
    {
      path: PATH_PROJECT_SETTINGS,
      exact: true,
      component: ProjectSettings,
    },
    {
      path: PATH_NOT_FOUND,
      exact: false,
      component: NotFound,
    },
  ];
}

export function makeSideNavRoutes() {
  return [
    {
      path: PATH_HOME,
      exact: true,
      component: HomeSideNav,
    },
    {
      path: PATH_PROJECT_ACTION,
      exact: false,
      component: ProjectSideNav,
    },
    {
      path: PATH_NOT_FOUND,
      exact: false,
      component: NotFoundSideNav,
    },
  ];
}
