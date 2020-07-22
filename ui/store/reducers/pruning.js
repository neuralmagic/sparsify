import { always, append, when, propEq, mergeLeft, map } from 'ramda'
import { combineReducers } from 'redux'
import { createReducer } from './util'
import { uuid } from 'uuidv4'

const lossData = createReducer(null, {
  'LOSS_DATA': (state, { data }) => data,
  'RESET_DATA': always(null)
})

const lossApproxData = createReducer(null, {
  'LOSS_APPROX_DATA': (state, { data }) => data,
  'RESET_DATA': always(null)
})

const perfData = createReducer(null, {
  'PERF_DATA': (state, { data }) => data,
  'RESET_DATA': always(null)
})

const modifiers = createReducer([{ id: uuid(), sparsityLevel: 0.50 }, { id: uuid(), sparsityLevel: 0.20 }], {
  'ADD_MODIFIER': (state, { modifier }) => append(modifier, state),
  'CHANGE_SPARSITY_LEVEL': (state, { sparsityLevel, modifier }) => map(
    when(propEq('id', modifier.id), mergeLeft({ sparsityLevel })))(
    state)
})

export default combineReducers({
  lossData,
  lossApproxData,
  perfData,
  modifiers
})
