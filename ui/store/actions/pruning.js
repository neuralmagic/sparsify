import { prop, compose, andThen, defaultTo } from 'ramda'
import { takeLatest, call, put, all } from 'redux-saga/effects'

const loadSensitivityData = compose(
  andThen(compose(defaultTo([]), prop('layerSensitivities'))),
  andThen(r => r.json()),
  fetch)

function* selectProjectSaga({ id }) {
  yield put({ type: 'RESET_DATA' })

  const [lossData, lossApproxData, perfData] = yield all([
    call(() => loadSensitivityData(`/api/projects/${id}/sparse-analysis/loss`)),
    call(() => loadSensitivityData(`/api/projects/${id}/sparse-analysis/loss/approx`)),
    call(() => loadSensitivityData(`/api/projects/${id}/sparse-analysis/perf`))
  ])

  yield put({ type: 'LOSS_DATA', data: lossData })
  yield put({ type: 'LOSS_APPROX_DATA', data: lossApproxData })
  yield put({ type: 'PERF_DATA', data: perfData })
}

export function* sagas() {
  yield takeLatest('SELECT_PROJECT', selectProjectSaga)
}
