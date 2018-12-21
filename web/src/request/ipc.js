import {ipcRenderer} from 'electron'
import EVENTS from './events'

const ipc = {
  send: (args) => {
    const {
      type,
      data,
    } = args  
    
    return new Promise((resolve, reject) => {
      ipc.responseOnce(type, (e, response) => {
        if (!response.error) {
          resolve(response.data)
        } else {
          reject(response.error)
        }
      })

      ipcRenderer.send(`request_${type}`, data)
    })  
  },
  redisExec: async (client, cmd, params) => {
    if (!cmd) {
      return
    }
    try {
      const data = await ipc.send({
        type: EVENTS.COMMAND,
        data: {
          cmd,
          params,
          client,
        },
      })

      return data
    } catch (error) {
      return error
    }
  },
  responseOnce: (type, callback) => {
    ipcRenderer.once(`response_${type}`, callback)
  },
}

export default ipc
