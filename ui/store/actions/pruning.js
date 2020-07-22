import { prop, compose, andThen, defaultTo } from 'ramda'
import { takeLatest, call, put, all } from 'redux-saga/effects'

const loadSensitivityData = compose(
  andThen(compose(defaultTo([]), prop('layerSensitivities'))),
  andThen(r => r.json()),
  fetch)

function* selectProjectSaga({ id }) {
  yield put({ type: 'LOSS_DATA', data: [] })
  yield put({ type: 'PERF_DATA', data: [] })

  const [lossData, perfData] = yield all([
    call(() => loadSensitivityData(`/api/projects/${id}/sparse-analysis/loss`)),
    call(() => loadSensitivityData(`/api/projects/${id}/sparse-analysis/perf`))
  ])

  yield put({ type: 'LOSS_DATA', data: lossData })
  yield put({ type: 'PERF_DATA', data: perfData })
}

export function* sagas() {
  yield takeLatest('SELECT_PROJECT', selectProjectSaga)
}
