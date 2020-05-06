import { uuid } from 'uuidv4'
import { compose, head, tap, map, defaultTo } from 'ramda'
import { selectedProject } from '../selectors/projects'
import { allProfiles } from '../selectors/profiles'
import { addProfile, selectProfile } from './profiles'

export const createProject = ({ name, profiles }) => dispatch => {
  const id = uuid()

  dispatch({ type: 'CREATE_PROJECT', project: { name, id } })

  const defaultProfiles = [{
    id: uuid(),
    name: 'Performance Optimized',
    speedupFactor: 12.5,
    recoverabilityScore: 0.023
  }, {
    id: uuid(),
    name: 'Loss Optimized',
    speedupFactor: 10.5,
    recoverabilityScore: 0.018
  }, {
    id: uuid(),
    name: 'Uniform',
    speedupFactor: 11.4,
    recoverabilityScore: 0.02
  }]

  compose(
    compose(dispatch, selectProfile),
    head,
    tap(map(compose(dispatch, addProfile))),
    defaultTo(defaultProfiles))(
    profiles)

  window.location.hash = `#/project/${id}`
}

export const createProjectFromFile = file => dispatch => {
  const reader = new FileReader()
  reader.addEventListener('load', () => {
    const { name, profiles } = JSON.parse(reader.result)

    dispatch(createProject({ name, profiles }))
  })
  reader.readAsText(file)
}

const saveFile = (data, filename, type) => {
  const file = new Blob([data], {type: type})

  if (window.navigator.msSaveOrOpenBlob) // IE10+
    window.navigator.msSaveOrOpenBlob(file, filename)
  else {
    const a = document.createElement("a")
    const url = URL.createObjectURL(file)

    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    setTimeout(() => {
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    }, 0)
  }
}

export const saveProjectToLocal = () => (dispatch, getState) => {
  const state = getState()
  const { name } = selectedProject(state)
  const profiles = allProfiles(state)

  const content = JSON.stringify({
    name,
    profiles
  })

  saveFile(content, `${name}.nmprj`, 'application/json')
}