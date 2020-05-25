import { combineReducers } from 'redux'
import { createReducer } from './util'

const selectedTheme = createReducer('dark', {
  'CHANGE_THEME': (state, { theme }) => theme
})

export default combineReducers({
  selectedTheme
})
