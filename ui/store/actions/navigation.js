import { selectedProject } from '../selectors/projects'

export const navigateToProjectSection = section => (dispatch, getState) => {
  const { projectId } = selectedProject(getState())

  dispatch({ type: 'SELECT_PROJECT_SECTION', section })

  window.location.hash = `#/project/${projectId}/${section}`
}
