import { uuid } from 'uuidv4'

export const createProject = name => dispatch => {
  const id = uuid()

  dispatch({ type: 'CREATE_PROJECT', project: { name, id } })
  window.location.hash = `#/project/${id}`
}
