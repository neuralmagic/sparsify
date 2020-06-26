import { propOr, identity } from 'ramda'

export const createReducer =
  (initialState, handlers) =>
    (state = initialState, action) =>
      propOr(identity, action.type, handlers)(state, action)
