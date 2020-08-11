import { map, always, path, compose, flatten, lt, prop,
  gt, head, last, curry, propEq, __, T, median,
  ifElse, evolve, take, add, takeLast, reject, isEmpty, length,
  splitWhen, subtract, cond, defaultTo, reduceRight, reverse } from 'ramda'
import { createSelector } from 'reselect'

export const pruningModifiers = state => state.pruning.modifiers
export const metrics = state => [
  { label: 'Est. Speedup', value: '12.64' },
  { label: 'Est. Time', value: 5.46 },
  { label: 'Recoverability', value: 0.0954 }]

const areAllSparsitiesBiggerThan = value => compose(
  lt(value),
  prop('sparsity'),
  head)

const areAllSparsitiesLessThan = value => compose(
  gt(value),
  prop('sparsity'),
  last)

export const lossData = state => state.pruning.lossData
export const lossApproxData = state => state.pruning.lossApproxData
export const perfData = state => state.pruning.perfData

export const sparsity = modifier => createSelector(
  lossData,
  perfData,
  (loss, perf) => {
    if (!loss || !perf)
      return []

    return map(always(modifier.sparsity/100), loss)
  })

export const denseExecutionTimeData = createSelector(
  lossData,
  compose(map(path(['baseline', 'timing'])), defaultTo([])))

const calculateTimingBasedOnSparsity = curry((sparsity, values) => {
  const found = find(propEq('sparsity', sparsity), values)

  if (found) {
    // return timing found for the given sparsity, if present
    return found.timing
  } else {
    const times = map(prop('timing'))
    const difference = compose(reduceRight(subtract, 0), reverse, times)(values)
    const computedTime = cond([
      // extrapolate by subtracting the time difference
      //between the two entries, if selected sparsity is less
      [areAllSparsitiesBiggerThan(sparsity), compose(subtract(__, difference), head, times)],
      // extrapolate by adding the time difference
      // between the two entries, if selected spasity is bigger
      [areAllSparsitiesLessThan(sparsity), compose(add(difference), last, times)],
      // interpolate timing as a median between the two entries,
      // if selected spasity falls in the interval
      [T, compose(median, times)]
    ])

    return computedTime(values)
  }
})

export const sparseExecutionTimeData = modifier => createSelector(
  perfData,
  perfData => map(compose(
      calculateTimingBasedOnSparsity(modifier.sparsity),
      flatten,
      ifElse(
        compose(lt(1), length),
        // if we have two arrays it means current sparsity found a spot in,
        // taking last of the first array and first of the second to get neighbours
        evolve({ 0: takeLast(1), 1: take(1) }),
        // otherwise, we have first two or last two, depending on whether current
        // sparsity is less or greater than any sparsities in the layer
        compose(
          ifElse(areAllSparsitiesBiggerThan(modifier.sparsity), take(2), takeLast(2)),
          flatten)),
      // if current sparsity is out of range, we get an empty
      // array on one side, which we ignore
      reject(isEmpty),
      // find the spot where current sparsity fits in, separate
      // into two arrays to get neighbours.
      splitWhen(compose(lt(modifier.sparsity), prop('sparsity'))),
      prop('sparse')))(
      defaultTo([], perfData)))
