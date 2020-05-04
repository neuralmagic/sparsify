import { combineReducers } from 'redux'
import { createReducer } from './util'

const defaultProfiles = [{
  id: 0,
  name: 'Performance Optimized',
  speedupFactor: 12.5,
  recoverabilityScore: 0.023
}, {
  id: 1,
  name: 'Loss Optimized',
  speedupFactor: 10.5,
  recoverabilityScore: 0.018
}, {
  id: 2,
  name: 'Uniform',
  speedupFactor: 11.4,
  recoverabilityScore: 0.02
}]

const all = createReducer(defaultProfiles, {
  'ADD_PROFILE': (state, { profile }) => [...state, profile],
})

const selected = createReducer(0, {
  'ADD_PROFILE': (state, { profile }) => profile.id,
  'SELECT_PROFILE': (state, { profile }) => profile.id
})

export default combineReducers({
  all,
  selected
})
