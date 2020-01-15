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

    console.log(dispatch)
    
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
})

export const SearchKeyDetail = async (connInfo, item) => {
  const {
    key,
    type,
  } = item
  const redis = connInfo.redis
  let value = []
  
  switch(type) {
    case 'string':
      value = await redis.get(key)
      
      break
    case 'hash':
      value = await redis.hgetall(key)          
      
      break
    case 'list':
      value = await redis.lrange(key, 0, -1)    
      
      break
    case 'set':
      value = await redis.smembers(key)     
      
      break
    case 'zset':
      value = await redis.zrange(key, 0, -1, 'WITHSCORES')      

      const nextValue = {}
      for (let i=0;i<value.length;i+=2) {
        nextValue[value[i]] = Number(value[i+1])
      }
      
      value=nextValue
      
      break
    default:
      return {}
  }

  return {
    key,
    value,
    type,
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

export const RedisSaveSelectKey = (rdsIDX, connInfo, select) => dispatch => {
  const redis = connInfo.redis
  
  const {
    key,
    type,
    value,
    field,
    selectValue,
  } = select
  
  switch(type) {
    case 'string':
      redis.set(key, selectValue)
      break
    case 'list':
      redis.lset(key, field, selectValue)
      break
    case 'hash':
      redis.hset(key, field, selectValue)
      break
    case 'zset':
      redis.multi()
        .zrem(key, value[field*2])
        .zadd(key, value[field*2+1], selectValue)
        .exec()
      break
    case 'set':
      redis.multi()
        .srem(key, value[field])
        .sadd(key, selectValue)
        .exec()
      break
    default:
      console.error(`NO KEY TYPE ----- ${select.type}`)
  }

  dispatch(SearchKeyDetail(rdsIDX, {
    key,
    type: type,
  }, field))
}
