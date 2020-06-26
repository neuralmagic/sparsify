import { uuid } from 'uuidv4'
import { allModifiers, selectedModifier } from '../selectors/modifiers'

export const addModifier = () => (dispatch, getState) => {
  const numModifiers = allModifiers(getState()).length

  dispatch({ type: 'ADD_MODIFIER', modifier: {
    id: uuid(),
    label: `LM${numModifiers}`,
    shortLabel: `LM${numModifiers}`,
    min: 0,
    max: 100,
    range: [{ start: 1, end: 44 }] } })
}

export const selectModifier = modifier => dispatch =>
  dispatch({ type: 'SELECT_MODIFIER', modifier })

export const removeSelectedModifier = () => (dispatch, getState) =>
  dispatch({ type: 'REMOVE_MODIFIER', modifier: selectedModifier(getState()) })
