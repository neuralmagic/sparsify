import { selectedProject } from '../selectors/projects'

export const navigateToSelectedProject = () => (dispatch, getState) => {
  const { projectId } = selectedProject(getState())

  window.location.hash = `#/project/${projectId}/optimization`
}

export const navigateToProjectSection = section => (dispatch, getState) => {
  const { projectId } = selectedProject(getState())

  window.location.hash = `#/project/${projectId}/${section}`
}
