import { combineReducers } from 'redux'
import { createReducer } from './util'
import { uuid } from 'uuidv4'

const defaultProfiles = [{
  id: uuid(),
  name: 'ip-172-31-18-186',
  model: 'resnet-50',
  batchSize: 32,
  cores: 4,
  instructionSet: 'AVX 512, VNNI'
}]

const all = createReducer(defaultProfiles, {
  'UPDATE_PROFILES': (state, { profiles }) => profiles
})

const selectedProfile = createReducer(defaultProfiles[0].id, {
  'SELECT_PPROFILE': (state, { id }) => id
})

export default combineReducers({
  all,
  selectedProfile
})
