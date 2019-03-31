import {ipcRenderer} from 'electron'
import EVENTS from './events'

const ipc = {
  send: (args) => {
    const {
      type,
      data,
    } = args

    console.log("send type data", type ,data)
    
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
  responseOnce: (type, callback) => {
    ipcRenderer.once(`response_${type}`, callback)
  },
}

export default ipc
