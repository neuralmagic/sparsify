import { combineReducers } from 'redux'
import { createReducer } from './util'

const sparsityLevel = createReducer(25, {
  'CHANGE_SPARSITY_LEVEL': (state, { sparsityLevel }) => sparsityLevel
})

export default combineReducers({
  sparsityLevel
})
