import { combineReducers } from 'redux'
import redis from './redis'
import global from './global'

export default combineReducers({
  global,
  redis,
})
