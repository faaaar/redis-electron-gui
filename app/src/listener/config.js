const { ipcMain } = require('electron')
const EVENTS = require('./events')
const config = require('../config')

module.exports = function() {
  ipcMain.on(`request_${EVENTS.GET_CONNECT_CONFIG}`, e => {
    config.GetRedisConnectConfig(function(error, data) {
      e.sender.send(`response_${EVENTS.GET_CONNECT_CONFIG}`, {
        data,
        error, 
        type: EVENTS.GET_CONNECT_CONFIG,
      })
    }) 
  })

  ipcMain.on(`request_${EVENTS.ADD_CONNECT_CONFIG}`, (e, params) => {
    config.AddRedisConnectConfig(params, function(error, data) {
      e.sender.send(`response_${EVENTS.ADD_CONNECT_CONFIG}`, {
        data,
        error,
        type: EVENTS.ADD_CONNECT_CONFIG,
      })
    }) 
  })

  ipcMain.on(`request_${EVENTS.DEL_CONNECT_CONFIG}`, (e, alias) => {
    config.DelRedisConnectConfig(alias, function(error, data) {
      e.sender.send(`response_${EVENTS.DEL_CONNECT_CONFIG}`, {
        data,
        error,
        type: EVENTS.DEL_CONNECT_CONFIG,
      })
    }) 
  })
}
           
