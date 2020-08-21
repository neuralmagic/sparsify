import { combineReducers } from 'redux'
import projects from './projects'
import pruning from './pruning'
import profiles from './profiles'
import navigation from './navigation'
import settings from './settings'

export default combineReducers({
  projects,
  pruning,
  profiles,
  navigation,
  settings
})
