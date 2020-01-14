import ipc from '@request/ipc'
import EVENTS from '@request/events'

export const GET_APP_CONFIG = 'GET_APP_CONFIG'
export const GET_CONNECT_CONFIG = 'GET_CONNECT_CONFIG'
export const UPDATE_CONNECT_CONFIG = 'UPDATE_CONNECT_CONFIG'
export const SWITCH_TABS = 'SWITCH_TABS'

console.log(UPDATE_CONNECT_CONFIG)

export const SwitchTabs = activeTabKey => dispatch => {  
  dispatch({
    type: SWITCH_TABS,
    activeTabKey,
  })
}

export const GetAppConfig = () => async dispatch => {
  const appConfig = await ipc.send({
    type: EVENTS.GET_APP_CONFIG,
  })

  dispatch({
    type: GET_APP_CONFIG,
    appConfig,
  })
}

export const UpdateConnectConfig = connectConfig => dispatch => {
  dispatch({
    type: UPDATE_CONNECT_CONFIG,
    connectConfig,
  })
}

export const GetConnectConfig = () => async dispatch => {
  const connectConfig = await ipc.send({
    type: EVENTS.GET_CONNECT_CONFIG,
  })
  
  dispatch(UpdateConnectConfig(connectConfig))
} 

export const AddConnectConfig = newConfig => async dispatch => {
  const connectConfig = await ipc.send({
    type: EVENTS.ADD_CONNECT_CONFIG,
    data: newConfig,
  })

  console.log(connectConfig)
  dispatch(UpdateConnectConfig(connectConfig))
}

export const DelConnectConfig = alias => async dispatch =>{
  const connectConfig = await ipc.send({
    type: EVENTS.DEL_CONNECT_CONFIG,
    data: alias,
  })

  dispatch(UpdateConnectConfig(connectConfig))
}
