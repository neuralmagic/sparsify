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

export function makeContentRoutes() {
  return [
    {
      path: "/",
      exact: true,
      component: Home,
    },
    {
      path: "/project/:projectId",
      exact: true,
      component: Project,
    },
    {
      path: "/project/:projectId/benchmark",
      exact: true,
      component: ProjectBenchmark,
    },
    {
      path: "/project/:projectId/optim",
      exact: true,
      component: ProjectOptim,
    },
    {
      path: "/project/:projectId/perf",
      exact: true,
      component: ProjectPerf,
    },
    {
      path: "/project/:projectId/settings",
      exact: true,
      component: ProjectSettings,
    },
    {
      path: "*",
      exact: false,
      component: NotFound,
    },
  ];
}

export function makeSideNavRoutes() {
  return [
    {
      path: "/",
      exact: true,
      component: HomeSideNav,
    },
    {
      path: "/project/:projectId",
      exact: false,
      component: ProjectSideNav,
    },
    {
      path: "*",
      exact: false,
      component: NotFoundSideNav,
    },
  ];
}
