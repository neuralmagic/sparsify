import { uuid } from 'uuidv4'
import { always, without } from 'ramda'
import { combineReducers } from 'redux'
import { createReducer } from './util'

const defaultModifiers = [
  {id: uuid(), label: "LRM", min: 0, max: 100, range: [{ start: 20, end: 55 }]},
  {id: uuid(), label: "LM1", min: 0, max: 100, range: [{ start: 34, end: 55 }, { start: 10, end: 25 }, { start: 80, end: 90 }]}]

const all = createReducer(defaultModifiers, {
  'CREATE_PROJECT': always(defaultModifiers),
  'ADD_MODIFIER': (state, { modifier }) => [...state, modifier],
  'REMOVE_MODIFIER': (state, { modifier }) => {
    console.log('before', state)
    console.log('modifier', modifier)
    console.log('after', without([modifier], state))
    return without([modifier], state)
  }
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
