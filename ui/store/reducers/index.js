import { combineReducers } from 'redux'
import theme from './theme'
import projects from './projects'
import profiles from './profiles'
import modifiers from './modifiers'
import metrics from './metrics'
import layers from './layers'
import settings from './settings'

export default combineReducers({
  theme,
  projects,
  profiles,
  modifiers,
  metrics,
  layers,
  settings
})
