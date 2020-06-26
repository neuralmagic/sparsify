import { uuid } from 'uuidv4'
import { always, without } from 'ramda'
import { combineReducers } from 'redux'
import { createReducer } from './util'

const defaultModifiers = [
  { id: uuid(), label: 'Learning Rate', shortLabel: 'LR', min: 0, max: 100, range: [{ start: 20, end: 55 }] },
  { id: uuid(), label: 'Trainable Layers', shortLabel: 'TL', min: 0, max: 100, range: [{ start: 34, end: 55 }, { start: 10, end: 25 }, { start: 80, end: 90 }] },
  { id: uuid(), label: 'Quantization', shortLabel: 'Q', min: 0, max: 100, range: [{ start: 20, end: 55 }] }]

const all = createReducer(defaultModifiers, {
  'CREATE_PROJECT': always(defaultModifiers),
  'ADD_MODIFIER': (state, { modifier }) => [...state, modifier],
  'REMOVE_MODIFIER': (state, { modifier }) => without([modifier], state)
})

const selected = createReducer(0, {
  'CREATE_PROJECT': always(null),
  'ADD_MODIFIER': (state, { modifier }) => modifier.id,
  'SELECT_MODIFIER': (state, { modifier }) => modifier.id,
  'REMOVE_MODIFIER': always(null)
})

export default combineReducers({
  all,
  selected
})
