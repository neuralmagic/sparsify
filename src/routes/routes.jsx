import Home from "./home";
import NotFound from "./not-found";
import Project from "./project";
import ProjectBenchmark from "./project-benchmark";
import ProjectOptim from "./project-optim";
import ProjectPerf from "./project-perf";
import ProjectSettings from "./project-settings";

import HomeSideNav from "./home/sidenav";
import NotFoundSideNav from "./not-found/sidenav";
import ProjectSideNav from "./project/sidenav";

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

export const ROUTE_HOME = "/";
export const ROUTE_PROJECT = "/project/:projectId";
export const ROUTE_PROJECT_ACTION = `${ROUTE_PROJECT}/:action?/:actionId?`;
export const ROUTE_PROJECT_BENCHMARK = `${ROUTE_PROJECT}/benchmark`;
export const ROUTE_PROJECT_OPTIM = `${ROUTE_PROJECT}/optim/:optimId?`;
export const ROUTE_PROJECT_PERF = `${ROUTE_PROJECT}/perf/:perfId?`;
export const ROUTE_PROJECT_LOSS = `${ROUTE_PROJECT}/loss/:lossId?`;
export const ROUTE_PROJECT_SETTINGS = `${ROUTE_PROJECT}/settings`;
export const ROUTE_NOT_FOUND = "*";

export function makeContentRoutes() {
  return [
    {
      path: ROUTE_HOME,
      exact: true,
      component: Home,
    },
    {
      path: ROUTE_PROJECT,
      exact: true,
      component: Project,
    },
    {
      path: ROUTE_PROJECT_BENCHMARK,
      exact: true,
      component: ProjectBenchmark,
    },
    {
      path: ROUTE_PROJECT_OPTIM,
      exact: true,
      component: ProjectOptim,
    },
    {
      path: ROUTE_PROJECT_PERF,
      exact: true,
      component: ProjectPerf,
    },
    {
      path: ROUTE_PROJECT_SETTINGS,
      exact: true,
      component: ProjectSettings,
    },
    {
      path: ROUTE_NOT_FOUND,
      exact: false,
      component: NotFound,
    },
  ];
}

export function makeSideNavRoutes() {
  return [
    {
      path: ROUTE_HOME,
      exact: true,
      component: HomeSideNav,
    },
    {
      path: ROUTE_PROJECT_ACTION,
      exact: false,
      component: ProjectSideNav,
    },
    {
      path: ROUTE_NOT_FOUND,
      exact: false,
      component: NotFoundSideNav,
    },
  ];
}
