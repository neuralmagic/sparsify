import { uuid } from 'uuidv4'

export const selectProfile = profile => dispatch =>
  dispatch({ type: 'SELECT_PROFILE', profile })

export const addProfile = () => dispatch =>
  dispatch({ type: 'ADD_PROFILE', profile: { name: 'Custom Profile', id: uuid() } })