import { combineReducers } from 'redux'
import redis from './redis'
import global from './global'
import { connectRouter } from 'connected-react-router'

export default history => combineReducers({
  global,
  redis,
  router: connectRouter(history),
})
