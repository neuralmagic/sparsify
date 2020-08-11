import { find, propEq, compose, defaultTo } from 'ramda'

export const selectedProfile = state => compose(
  find(propEq('id', state.profiles.selectedProfile)),
  defaultTo([]))(
  state.profiles.all)

export const allProfiles = state => state.profiles.all
