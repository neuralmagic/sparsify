import { combineReducers } from 'redux'
import { createReducer } from './util'

const selectedProject = createReducer(null, {
  'SELECT_PROJECT': (state, { id }) => id
})

export default combineReducers({
  selectedProject
})
