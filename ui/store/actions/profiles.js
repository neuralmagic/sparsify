import { uuid } from 'uuidv4'
import { takeLatest, put, all } from 'redux-saga/effects'

export const selectProfile = profile => dispatch =>
  dispatch({ type: 'SELECT_PROFILE', profile })

export const addProfile = profile => dispatch =>
  dispatch({ type: 'ADD_PROFILE', profile: profile || { name: 'Custom Profile', id: uuid() } })

function* selectProjectSaga() {
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

  yield all(defaultProfiles.map(profile => put(addProfile(profile))))
  yield put(selectProfile(defaultProfiles[0]))
}

export function* sagas() {
  yield takeLatest('SELECT_PROJECT', selectProjectSaga)
}
