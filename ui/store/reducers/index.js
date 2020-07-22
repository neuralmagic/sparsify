import { combineReducers } from 'redux'
import projects from './projects'
import pruning from './pruning'

export default combineReducers({
  projects,
  pruning
})
