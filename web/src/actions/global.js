import store from '../store'
import ipc from '../request/ipc'
import EVENTS from '../request/events'

export const GET_APP_CONFIG = 'GET_APP_CONFIG'
export const GET_CONNECT_CONFIG = 'GET_CONNECT_CONFIG'
export const UPDATE_CONNECT_CONFIG = 'UPDATE_CONNECT_CONFIG'

export const GetAppConfig = async () => {
  const dispatch = store.dispatch

  const appConfig = await ipc.send({
    type: EVENTS.GET_APP_CONFIG,
  })

  dispatch({
    type: GET_APP_CONFIG,
    appConfig,
  })
}

export const UpdateConnectConfig = (connectConfig) => {
  const dispatch = store.dispatch
  
  dispatch({
    type: UPDATE_CONNECT_CONFIG,
    connectConfig,
  })
}

export const GetConnectConfig = async () => {
  const connectConfig = await ipc.send({
    type: EVENTS.GET_CONNECT_CONFIG,
  })
  
  UpdateConnectConfig(connectConfig)
} 

export const AddConnectConfig = async (newConfig) => {
  const connectConfig = await ipc.send({
    type: EVENTS.ADD_CONNECT_CONFIG,
    data: newConfig,
  })
  
  UpdateConnectConfig(connectConfig)
}

export const DelConnectConfig = async(alias) => {
  const connectConfig = await ipc.send({
    type: EVENTS.DEL_CONNECT_CONFIG,
    data: alias,
  })

  UpdateConnectConfig(connectConfig)
}
