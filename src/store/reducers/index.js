import { combineReducers } from 'redux'
import themeReducer from './theme'
import projectsReducer from './projects'

export default combineReducers({
    theme: themeReducer,
    projects: projectsReducer
})
