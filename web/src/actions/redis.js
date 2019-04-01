import Redis from 'ioredis'
import CryptoJS from 'crypto-js'
import store from '../store'
import {
  SwitchTabs,
} from './global'

export const REDIS_CONNECT = 'REDIS_CONNECT'
export const REDIS_DISCONNECT = 'REDIS_DISCONNECT'
export const REDIS_KEYS = 'REDIS_KEYS'
export const REDIS_SCAN = 'REDIS_SCAN'
export const REDIS_SEARCH_KEY_SET = 'REDIS_SEARCH_KEY_SET'
export const REDIS_FILTER_KEY_SET = 'REDIS_FILTER_KEY_SET'

export const SetFilterKey = (redisID, key) => {
  const dispatch = store.dispatch

  dispatch({
    type: REDIS_FILTER_KEY_SET,
    key,
    redisID,
  })
}

export const SetSearchKey = (redisID, key) => {
  const dispatch = store.dispatch

  dispatch({
    type: REDIS_SEARCH_KEY_SET,
    key,
    redisID,
  })
}

export const ConnectToRedis = async (newConnInfo, callback) => {
  const dispatch = store.dispatch

  const redisOption = {
    host: newConnInfo.host,
    password: newConnInfo.auth,
    port: newConnInfo.port,
    enableReadyCheck: false,
    
  }
  const redis = new Redis(redisOption)
  const pong = await redis.ping()
  
  if (pong === 'PONG') {
    newConnInfo.id = CryptoJS.MD5(`${JSON.stringify(newConnInfo)}_${new Date().getTime()}`).toString()
    newConnInfo.redis = redis

    const connInfo = store.getState().redis.connInfo
    connInfo.push(newConnInfo)

    dispatch({ 
      type: REDIS_CONNECT,
      connInfo,
    })

    const idx = `${connInfo.length - 1}`
    SwitchTabs(idx)
    callback(idx)
  }
}

export const DisconnectRedis = async (idx, callback) => {
  const dispatch = store.dispatch
  const connInfo = store.getState().redis.connInfo

  connInfo.splice(idx, 1)
  dispatch({
    type: REDIS_DISCONNECT,
    connInfo,
  })
}

export const GetCurrentConnInfo = () => {
  const idx = store.getState().global.activeTabKey
  const connInfo = GetAllConnInfo()[idx] || {}

  return connInfo
}

export const GetAllConnInfo = () => {
  return store.getState().redis.connInfo
}

export const GetKeysById = id => {
  return store.getState().redis.keys[id]
}

export const SearchKeys = async searchKey => {
  return new Promise(resolve => {
    const dispatch = store.dispatch
    const currentConnInfo = GetCurrentConnInfo()
    const redis = currentConnInfo.redis
    const stream = redis.scanStream({
      match: searchKey,
      count: 10000
    });

    const keys = []
    stream.on('data', function (resultKeys) {
      stream.pause();

      for (var i = 0; i < resultKeys.length; i++) {
        keys.push(resultKeys[i])
      }
      
      stream.resume(); 
    });

    stream.on('end', function () {
      dispatch({
        type: REDIS_SCAN,
        redisID: currentConnInfo.id,
        keys: Array.from(new Set(keys)),
      })
      resolve(true)
    })
  })
}


