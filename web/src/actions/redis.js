import store from '../store'
import ipc from '../request/ipc'

export const REDIS_CONNECT = 'REDIS_CONNECT'
export const REDIS_DISCONNECT = 'REDIS_DISCONNECT'

export const ConnectToRedis = async (newConnInfo) => {
  const dispatch = store.dispatch
  const connInfo = store.getState().redis.connInfo
  newConnInfo.auth = newConnInfo.auth || ''
  newConnInfo.id = `${newConnInfo.host}_${newConnInfo.port}_${new Date().getTime()}`
  
  const pong = await ipc.redisExec(newConnInfo, 'ping', [])

  if (pong === 'PONG')  {
    connInfo.push(newConnInfo)
    
    dispatch({
      type: REDIS_CONNECT,
      connInfo,
    })     
  }
}

export const DisconnectRedis = async (id) => {
  const dispatch = store.dispatch
  const connInfo = store.getState().redis.connInfo
  let idx = -1
  const filterList = connInfo.filter((info, i) => {
    if (info.id === id) {
      idx = i
    }
    
    return info.id === id
  })

  if (filterList.length) {
    const isOK = await ipc.redisExec(filterList[0], 'quit', [])
 
    if (isOK === "OK") {
      connInfo.splice(idx, 1)
      dispatch({
        type: REDIS_DISCONNECT,
        connInfo,
      })
    }
  }
}
