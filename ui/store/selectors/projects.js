import { find, propEq, compose, defaultTo } from "ramda";

export const selectedProject = (state) =>
  compose(
    find(propEq("projectId", state.projects.selectedProject)),
    defaultTo([])
  )(state.projects.all);
export const allProjects = (state) => state.projects.all;
