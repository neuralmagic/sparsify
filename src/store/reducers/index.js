import { combineReducers } from 'redux'
import themeReducer from './theme'

export default combineReducers({
    theme: themeReducer
})
