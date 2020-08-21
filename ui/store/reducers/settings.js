import { combineReducers } from 'redux'
import { createReducer } from './util'

const selectedProject = createReducer(null, {
  'UPDATE_PROJECT_SETTINGS': (state, { settings }) => settings
})

const optimizationSettingsDiscarded = createReducer(false, {
  'UPDATE_PROJECT_SETTINGS_DISCARDED': (state, { discarded }) => discarded
})

export default combineReducers({
  selectedProject,
  optimizationSettingsDiscarded
})
