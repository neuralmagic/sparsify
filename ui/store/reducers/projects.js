import { combineReducers } from 'redux'
import { createReducer } from './util'

const selectedProject = createReducer({}, {
  'SELECT_PROJECT': (state, { id }) => id
})

export default combineReducers({
  selectedProject
})
