import { combineReducers } from 'redux'
import { createReducer } from './util'

const lossData = createReducer(null, {
  'LOSS_DATA': (state, { data }) => data
})

const perfData = createReducer(null, {
  'PERF_DATA': (state, { data }) => data
})

export default combineReducers({
  lossData,
  perfData
})
