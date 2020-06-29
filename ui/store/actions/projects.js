import { takeLatest, put } from 'redux-saga/effects'
import { selectedProject } from '../selectors/projects'
import { allProfiles } from '../selectors/profiles'

export const createProject = ({ name }) => dispatch => {
  const id = 'test'

  dispatch({ type: 'CREATE_PROJECT', project: { name, id } })

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

export const selectProject = id => dispatch =>
  dispatch({ type: 'SELECT_PROJECT', id })

function* createProjectSaga({ project }) {
  yield put(selectProject(project.id))
}

export function* sagas() {
  yield takeLatest('CREATE_PROJECT', createProjectSaga)
}
