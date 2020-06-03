import { combineReducers } from 'redux'
import { createReducer } from './util'

const overall = createReducer([
  { name: 'totalSparsity', label: 'Total Sparsity', value: 0.5, format: '0.0%' },
  { name: 'estimatedSpeedupFactor', label: 'Est. Speedup Factor', value: 12.5, format: '.1f' },
  { name: 'recoverabilityScore', label: 'Recoverability Score', value: 0.023, format: '0' }], {
})

const time = createReducer([
  { name: 'current', label: 'Est. Current Time', value: 0.003, format: '0' },
  { name: 'baseline', label: 'Est. Baseline Time', value: 0.981, format: '0' }], {})

const parameters = createReducer([
  { name: 'current', label: 'Current Parameters', value: 21800000, format: '~s' },
  { name: 'baseline', label: 'Baseline Parameters', value: 25600000, format: '~s' }], {})

const flops = createReducer([
  { name: 'current', label: 'Current FLOPS', value: 25600000, format: '~s' },
  { name: 'baseline', label: 'Baseline FLOPS', value: 25600000, format: '~s' }], {})

export default combineReducers({
  overall,
  time,
  parameters,
  flops
})
