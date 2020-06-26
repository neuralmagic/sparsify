import { uuid } from 'uuidv4'

export const selectProfile = profile => dispatch =>
  dispatch({ type: 'SELECT_PROFILE', profile })

export const addProfile = profile => dispatch =>
  dispatch({ type: 'ADD_PROFILE', profile: profile || { name: 'Custom Profile', id: uuid() } })
