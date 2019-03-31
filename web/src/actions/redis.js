import Redis from 'ioredis'
import CryptoJS from 'crypto-js'
import store from '../store'
import {
  SwitchTabs,
} from './global'

export const REDIS_CONNECT = 'REDIS_CONNECT'
export const REDIS_DISCONNECT = 'REDIS_DISCONNECT'
export const REDIS_KEYS = 'REDIS_KEYS'
export const REDIS_FILTER_KEYS = 'REDIS_FILTER_KEYS'

const getConnInfoById = (id) => {
  const ret = {
    connInfo: null,
    idx: -1,
  }
  
  const allConnInfo = store.getState().redis.connInfo || []
  let idx = -1
  const connInfos = allConnInfo.filter((v, i) => {
    if (v.id === id) {
      ret.idx = i
    }

    return v.id === id
  }) || []

  if (connInfos.length) {
    ret.connInfo = connInfos[0]
  }

  return ret
}

export const ConnectToRedis = async (newConnInfo, callback) => {
  const dispatch = store.dispatch 
  const redis = new Redis(newConnInfo)
  const pong = await redis.ping()
  newConnInfo.id = CryptoJS.MD5(`${JSON.stringify(newConnInfo)}_${new Date().getTime()}`).toString()
  newConnInfo.redis = redis
  
  if (pong === 'PONG') {
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

export const SearchRedisKeyByFilter = async filter => {
  const dispatch = store.dispatch
  const connInfo = GetAllConnInfo()
  const currentConnInfo = GetCurrentConnInfo()
  const redis = currentConnInfo.redis
  const stream = redis.scanStream({
    match: filter,
    count: 100
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
    console.log('done migration');
    dispatch({
      type: REDIS_FILTER_KEYS,
      redisID: currentConnInfo.id,
      keys,
    })
  })

  console.log(redis)
  // const dispatch = store.dispatch
  // const keys = await ExecRedisCmd(id, 'keys', filter)

  // if (Array.isArray(keys)) {
  //   dispatch({
  //     type: REDIS_KEYS,
  //     keys: keys,
  //   })
  // }
}


