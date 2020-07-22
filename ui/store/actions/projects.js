import { compose, andThen, prop } from 'ramda'
import { takeLatest, put, call, all } from 'redux-saga/effects'
import { navigateToSelectedProject } from './navigation'
import { selectedProject } from '../selectors/projects'
import { allProfiles } from '../selectors/profiles'

export const createProject = ({ name }) => dispatch => {
  const id = 'default'

  dispatch({ type: 'CREATE_PROJECT', project: { name, id } })
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
  const file = new Blob([data], { type })

  if (window.navigator.msSaveOrOpenBlob) // IE10+
    window.navigator.msSaveOrOpenBlob(file, filename)
  else {
    const a = document.createElement('a')
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

export const selectProject = id => dispatch => {
  dispatch({ type: 'SELECT_PROJECT', id })
  dispatch(navigateToSelectedProject())
}

function* createProjectSaga({ project }) {
  yield put(selectProject(project.id))
}

export const loadProjects = () => dispatch =>
  dispatch({ type: 'LOAD_PROJECTS' })

export const updateProjects = projects => dispatch =>
  dispatch({ type: 'UPDATE_PROJECTS', projects })

function* loadProjectsSaga() {
  const projects = yield call(() => compose(
    andThen(prop('projects')),
    andThen(r => r.json()))(
    fetch('/api/projects')))

  yield put(updateProjects(projects))
}

export function* sagas() {
  yield all([
    takeLatest('CREATE_PROJECT', createProjectSaga),
    takeLatest('LOAD_PROJECTS', loadProjectsSaga)
  ])
}
