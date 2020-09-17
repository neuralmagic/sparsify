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
export function createRouteTransitionOpacity() {
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

export function createRouteTransitionSlideRight() {
  return {
    atEnter: {
      offset: -100,
      opacity: 0,
    },
    atLeave: {
      offset: -100,
      opacity: 0,
    },
    atActive: {
      offset: 0,
      opacity: 1,
    },
    mapStyles: (styles) => ({
      transform: `translateX(${styles.offset}%)`,
      opacity: styles.opacity,
    }),
  };
}

export function createRouteTransitionSlideLeft() {
  return {
    atEnter: {
      offset: 100,
      opacity: 0,
    },
    atLeave: {
      offset: 100,
      opacity: 0,
    },
    atActive: {
      offset: 0,
      opacity: 1,
    },
    mapStyles: (styles) => ({
      transform: `translateX(${styles.offset}%)`,
      opacity: styles.opacity,
    }),
  };
}

export function createContentRoutes() {
  return [
    {
      path: "/",
      exact: true,
      component: Home,
      transition: createRouteTransitionOpacity(),
    },
    {
      path: "/project/:projectId",
      exact: true,
      component: Project,
      transition: createRouteTransitionOpacity(),
    },
    {
      path: "/project/:projectId/benchmark",
      exact: true,
      component: ProjectBenchmark,
      transition: createRouteTransitionOpacity(),
    },
    {
      path: "/project/:projectId/optim",
      exact: true,
      component: ProjectOptim,
      transition: createRouteTransitionOpacity(),
    },
    {
      path: "/project/:projectId/perf",
      exact: true,
      component: ProjectPerf,
      transition: createRouteTransitionOpacity(),
    },
    {
      path: "/project/:projectId/settings",
      exact: true,
      component: ProjectSettings,
      transition: createRouteTransitionOpacity(),
    },
    {
      path: "*",
      exact: false,
      component: NotFound,
      transition: createRouteTransitionOpacity(),
    },
  ];
}

export function createSideNavRoutes() {
  return [
    {
      path: "/",
      exact: true,
      component: HomeSideNav,
      transition: createRouteTransitionSlideLeft(),
    },
    {
      path: "/project/:projectId",
      exact: false,
      component: ProjectSideNav,
      transition: createRouteTransitionSlideRight(),
    },
    {
      path: "*",
      exact: false,
      component: NotFoundSideNav,
      transition: createRouteTransitionSlideRight(),
    },
  ];
}
