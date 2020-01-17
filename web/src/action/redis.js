import Redis from 'ioredis'
import CryptoJS from 'crypto-js'
import { SwitchRedis } from './global'

export const REDIS_CONNECT = 'REDIS_CONNECT'
export const REDIS_DISCONNECT = 'REDIS_DISCONNECT'
export const REDIS_KEYS = 'REDIS_KEYS'
export const REDIS_SCAN = 'REDIS_SCAN'
export const REDIS_KEY_DETAIL = 'REDIS_KEY_DETAIL'
export const REDIS_EDIT_KEY = 'REDIS_EDIT_KEY'

export const ConnectToRedis = async (connInfo, dispatch) => {
  const redisOption = {
    host: connInfo.host,
    password: connInfo.auth,
    port: connInfo.port,
    enableReadyCheck: false,
  }
  const redis = new Redis(redisOption)
  const pong = await redis.ping()

  if (pong === 'PONG') {
    connInfo.id = CryptoJS.MD5(`${JSON.stringify(connInfo)}_${new Date().getTime()}`).toString()
    connInfo.redis = redis

    dispatch({
      type: REDIS_CONNECT,
      connInfo,
    })

    dispatch(SwitchRedis(connInfo.alias))
  }
}

export const DisconnectRedis = idx => dispatch => {
  dispatch({
    type: REDIS_DISCONNECT,
    rdsIdx: idx,
  })
}

export const SearchKeys = async (connInfo, searchKey, dispatch) => new Promise(resolve => {
  try {
    const redis = connInfo.redis
    const stream = redis.scanStream({
      match: searchKey,
      count: 10000,
    })
    const pipeline = redis.pipeline()
    const keys = []
    stream.on('data', async resultKeys => {
      stream.pause()

      for (var i = 0; i < resultKeys.length; i++) {
        keys.push({
          key: resultKeys[i],
          type: '',
        })

        pipeline.type(resultKeys[i])
      }

      stream.resume()
    })

    stream.on('end', async () => {
      const typeList = await pipeline.exec()

      for (var i = 0; i < keys.length; i++) {
        keys[i]['type'] = typeList[i][1]
      }

      dispatch({
        type: REDIS_SCAN,
        redisID: connInfo.id,
        keys,
      })

      resolve(true)
    })
  } catch(err) {
    window.window.alertError(err)
  }
})

export const SearchKeyDetail = async (connInfo, item) => {
  try {
    const { key, type } = item
    const redis = connInfo.redis
    let values = []
    const nextValue = {}
    switch(type) {
      case 'string':
        values = await redis.get(key)
        break
      case 'hash':
        values = await redis.hgetall(key)
        break
      case 'list':
        values = await redis.lrange(key, 0, -1)
        break
      case 'set':
        values = await redis.smembers(key)
        break
      case 'zset':
        values = await redis.zrange(key, 0, -1, 'WITHSCORES')

        for (let i = 0; i < values.length; i += 2) {
          nextValue[values[i]] = Number(values[i+1])
        }

        values = nextValue
        break
      default:
        return {}
    }

    const ttl = await redis.ttl(key)

    return {
      key,
      values,
      type,
      ttl,
    }
  } catch(err) {
    window.alertError(err)

    return {}
  }
}

export const RedisSelectKeyField = (select, rdsID, field) => dispatch => {
  select.field = field
  switch(select.type) {
    case 'string':
      select.selectValue = select.value
      break
    case 'hash':
      select.selectValue = select.value[field]
      break
    case 'zset':
      select.selectValue = select.value[field*2]
      break
    case 'set':
      select.selectValue = select.value[field]
      break
    case 'list':
      select.selectValue = select.value[field]
      break
    default:
      console.error(`NO KEY TYPE ----- ${select.type}`)
  }

  dispatch({
    type: REDIS_KEY_DETAIL,
    redisID: rdsID,
    ...select,
  })
}

export const RedisSelectValueChange = (select, rdsID, selectValue) => dispatch => {
  select.selectValue = selectValue

  dispatch({
    type: REDIS_KEY_DETAIL,
    redisID: rdsID,
    ...select,
  })
}

export const RedisSetValue = async (connInfo, data, _data) => {
  try {
    const redis = connInfo.redis

    const {
      key,
      type,
      value,
      field,
      member,
      score,
    } = data

    const _member = _data.member
    
    let response = null

    switch(type) {
      case 'string':
        response = await redis.set(key, value)
        break
      case 'list':
        response = await redis.lset(key, field, value)
        break
      case 'hash':
        response = await redis.hset(key, field, value)
        break
      case 'zset':
        response = await redis.multi()
          .zrem(key, _member)
          .zadd(key, score, member)
          .exec()
        break
      case 'set':
        response = await redis.multi()
          .srem(key, _member)
          .sadd(key, member)
          .exec()
        break
      default:
        console.error(`NO KEY TYPE ----- ${value.type}`)
    }

    if (response) {
      window.alertSuccess()
      return true
    }

    window.alertError(response)
  } catch(err) {
    window.alertError(err)
  }

  return false
}

export const RedisDeleteKey = async (connInfo, data, _data) => {
  
}

export const RedisDeleteField = async (connInfo, data, _data) => {
  try {
    const redis = connInfo.redis

    const {
      key,
      type,
      value,      
      field,
      fieldList,
    } = data

    const _member = _data.member    
    let response = null
    
    switch(type) {
      case 'list':       
        response = await redis.lrem(key, fieldList.indexOf(field), field)
        break
      case 'hash':
        response = await redis.hdel(key, field)
        break
      case 'zset':
        response = await redis.zrem(key, _member)
        break
      case 'set':
        response = await redis.srem(key, _member)
        break
      default:
        console.error(`NO KEY TYPE ----- ${value.type}`)
    }

    if (response) {
      window.alertSuccess()
      return true
    }

    window.alertError(response)
  } catch(err) {
    window.alertError(err)
  }

  return false
}
