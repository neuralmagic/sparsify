import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import createSagaMiddleware from 'redux-saga'
import { all } from 'redux-saga/effects'
import rootReducer from './reducers'
import { sagas as projectSagas } from './actions/projects'
import { sagas as profileSagas } from './actions/profiles'
import { sagas as layerSagas } from './actions/layers'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const sagaMiddleware = createSagaMiddleware()

function* rootSaga() {
  yield all([ projectSagas(), profileSagas(), layerSagas() ])
}

export default createStore(rootReducer, composeEnhancers(
  applyMiddleware(sagaMiddleware, thunk)))

sagaMiddleware.run(rootSaga)
