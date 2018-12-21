const { ipcMain } = require('electron')
const EVENTS = require('./events')
const config = require('../config')

module.exports = function() {
  ipcMain.on(`request_${EVENTS.CONFIG}`, e => {
    config.Init(function(error, data) {
      e.sender.send(`response_${EVENTS.CONFIG}`, {
        data,
        error,
        type: EVENTS.CONFIG,
      })
    }) 
  })
}
            
