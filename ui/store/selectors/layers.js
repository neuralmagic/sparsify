import { map, always } from 'ramda'
import { createSelector } from 'reselect'
import { sparsityLevel } from './settings'

export const lossData = state => state.layers.lossData
export const perfData = state => state.layers.perfData
export const sparsity = createSelector(
  lossData,
  perfData,
  sparsityLevel,
  (loss, perf, sparsityLevel) => {
    if (!loss || !perf)
      return []

    return map(always(sparsityLevel), loss)
  })
