import { combineReducers } from 'redux'
import { createReducer } from './util'

const all = createReducer(null, {
  'UPDATE_PROJECTS': (state, { projects }) => projects
})

const selectedProject = createReducer(null, {
  'SELECT_PROJECT': (state, { id }) => id
})

export default combineReducers({
  all,
  selectedProject
})
