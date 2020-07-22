import { combineReducers } from 'redux'
import { createReducer } from './util'

const selectedTheme = createReducer('light', {
  'CHANGE_THEME': (state, { theme }) => theme
})

export default combineReducers({
  selectedTheme
})
