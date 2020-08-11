import { combineReducers } from 'redux'
import { createReducer } from './util'

const selectedProjectSection = createReducer(null, {
  'SELECT_PROJECT_SECTION': (state, { section }) => section
})

export default combineReducers({
  selectedProjectSection
})
