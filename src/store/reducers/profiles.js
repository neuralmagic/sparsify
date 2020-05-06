import { always } from 'ramda'
import { combineReducers } from 'redux'
import { createReducer } from './util'

const all = createReducer([], {
  'CREATE_PROJECT': always([]),
  'ADD_PROFILE': (state, { profile }) => [...state, profile]
})

const selected = createReducer(0, {
  'CREATE_PROJECT': always(null),
  'ADD_PROFILE': (state, { profile }) => profile.id,
  'SELECT_PROFILE': (state, { profile }) => profile.id
})

export default combineReducers({
  all,
  selected
})
