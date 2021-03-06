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
export const REDIS_KEY_DETAIL = 'REDIS_KEY_DETAIL'
export const REDIS_EDIT_KEY = 'REDIS_EDIT_KEY'

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
    const pipeline = redis.pipeline()
    const keys = []
    stream.on('data', async resultKeys => {
      stream.pause();

      for (var i = 0; i < resultKeys.length; i++) {
        keys.push({
          key: resultKeys[i],
          type: '',
        })

        pipeline.type(resultKeys[i])
      }
      
      stream.resume(); 
    });

    stream.on('end', async () => {
      const typeList = await pipeline.exec()

      for (var i = 0; i < keys.length; i++) {
        keys[i]['type'] = typeList[i][1]
      }
      
      dispatch({
        type: REDIS_SCAN,
        redisID: currentConnInfo.id,
        keys,
      })
      resolve(true)
    })
  })
}

export const SearchKeyDetail = async (idx, item, field) => {
  const dispatch = store.dispatch
  const {
    key,
    type
  } = item
  const connInfo = store.getState().redis.connInfo[idx]
  const redisID = connInfo.id
  const redis = connInfo.redis
  let keyValue = []
  let selectField = ''
  let selectValue = ''
  
  switch(type) {
    case "string":
      keyValue = await redis.get(key)
      selectValue = keyValue
      
      break
    case "hash":
      keyValue = await redis.hgetall(key)
      
      for (let k in keyValue) {
        selectField = field || k
        selectValue = keyValue[k]

        break
      }
      
      break
    case "list":
      keyValue = await redis.lrange(key, 0, -1)

      if (keyValue.length > 0) {
        selectField = field || 0
        selectValue = keyValue[0]
      }
      
      break
    case "set":
      keyValue = await redis.smembers(key)
      if (keyValue.length > 0) {
        selectField = 0
        selectValue = keyValue[0]
      }
      
      break
    case "zset":
      keyValue = await redis.zrange(key, 0, -1, "WITHSCORES")

      if (keyValue.length >= 2) {
        selectField = field || 0
        selectValue = keyValue[selectField*2]
      }
      
      break
    default:
      return
  }

  dispatch({
    type: REDIS_KEY_DETAIL,
    redisID,
    key,
    keyValue,
    keyType: type,
    selectField,
    selectValue,
  })
} 

export const RedisSelectKeyField = (idx, selectField) => {
  const dispatch = store.dispatch
  const connInfo = store.getState().redis.connInfo[idx]
  const redisID = connInfo.id
  const select = store.getState().redis.select[redisID]

  select.selectField = selectField
  switch(select.keyType) {
    case 'string':
      select.selectValue = select.keyValue
      break
    case 'hash':
      select.selectValue = select.keyValue[selectField]
      break
    case 'zset':
      select.selectValue = select.keyValue[selectField*2]
      break
    case 'set':
      select.selectValue = select.keyValue[selectField]
      break
    case 'list':
      select.selectValue = select.keyValue[selectField]
      break
  }
  
  dispatch({
    type: REDIS_KEY_DETAIL,
    redisID,
    ...select,
  })
}

export const RedisSelectValueChange = (idx, selectValue) => {
  const dispatch = store.dispatch
  const connInfo = store.getState().redis.connInfo[idx]
  const redisID = connInfo.id
  const select = store.getState().redis.select[redisID]

  select.selectValue = selectValue
  
  dispatch({
    type: REDIS_KEY_DETAIL,
    redisID,
    ...select,
  })
}

export const RedisSaveSelectKey = idx => {
  const dispatch = store.dispatch
  const connInfo = store.getState().redis.connInfo[idx]
  const redisID = connInfo.id
  const redis = connInfo.redis
  const select = store.getState().redis.select[redisID]
  const {
    key,
    keyType,
    keyValue,
    selectField,
    selectValue,
  } = select
  
  switch(keyType) {
    case 'string':
      redis.set(key, selectValue)
      break
    case 'list':
      redis.lset(key, selectField, selectValue)
      break
    case 'hash':
      redis.hset(key, selectField, selectValue)
      break
    case 'zset':
      redis.multi()
        .zrem(key, keyValue[selectField*2])
        .zadd(key, keyValue[selectField*2+1], selectValue)
        .exec()
      break
    case 'set':
      redis.multi()
        .srem(key, keyValue[selectField])
        .sadd(key, selectValue)
        .exec()
      break
  }

  SearchKeyDetail(idx, {
    key,
    type: keyType,
  }, selectField)

  return true
}
