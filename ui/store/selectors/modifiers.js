import { propEq, flatten, map, merge, pick, compose, path } from 'ramda'

export const allModifiers = state => state.modifiers.all
export const allModifiersExpanded = compose(
  flatten,
  map(m => {
    const mProps = pick(['label', 'shortLabel', 'min', 'max', 'id'], m)

    return m.range.map(merge(mProps))
  }),
  path(['modifiers', 'all']))

export const selectedModifier = state => state.modifiers.all.find(propEq('id', state.modifiers.selected))
