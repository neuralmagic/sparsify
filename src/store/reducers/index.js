import { combineReducers } from 'redux'
import themeReducer from './theme'
import projectsReducer from './projects'
import profilesReducer from './profiles'

export default combineReducers({
    theme: themeReducer,
    projects: projectsReducer,
    profiles: profilesReducer
})
