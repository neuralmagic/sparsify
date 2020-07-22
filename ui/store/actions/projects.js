import { compose, andThen, prop, identity } from 'ramda'
import { takeLatest, put, call, all, select } from 'redux-saga/effects'
import { navigateToSelectedProject } from './navigation'
import { selectedProject } from '../selectors/projects'
import { allProfiles } from '../selectors/profiles'
import { lossApproxData } from '../selectors/pruning'

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

export const loadProjects = () => dispatch =>
  dispatch({ type: 'LOAD_PROJECTS' })

export const updateProjects = projects => dispatch =>
  dispatch({ type: 'UPDATE_PROJECTS', projects })

export const exportCurrentProject = () => dispatch =>
  dispatch({ type: 'EXPORT_CURRENT_PROJECT' })

function* createProjectSaga({ project }) {
  yield put(selectProject(project.id))
}

function* loadProjectsSaga() {
  const projects = yield call(() => compose(
    andThen(prop('projects')),
    andThen(r => r.json()))(
    fetch('/api/projects')))

  yield put(updateProjects(projects))
}

function* exportCurrentProjectSaga() {
  const data = yield select(lossApproxData)
  const { projectId } = yield select(selectedProject)

  yield call(() => fetch(`/api/projects/${projectId}/sparse-analysis/loss/sample`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ loss: data }) }))

  const settings = {
    config_fields: {
      sparsities: [0.8, 0.85, 0.90],
      pruning_profile: 'loss',
      loss_analysis: 'sample',
      pruning_update_frequency: 1,
      training_epochs: 100,
      init_training_lr: 0.001,
      final_training_lr: 0.00001
    }
  }

  const exportResult = yield call(() => compose(
    andThen(identity),
    andThen(r => r.text()))(
    fetch(`/api/projects/${projectId}/config/export`,
      { method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings) })))

  saveFile(exportResult, `config.yaml`, 'text/yaml')
}

export function* sagas() {
  yield all([
    takeLatest('CREATE_PROJECT', createProjectSaga),
    takeLatest('LOAD_PROJECTS', loadProjectsSaga),
    takeLatest('EXPORT_CURRENT_PROJECT', exportCurrentProjectSaga)
  ])
}
