const { ipcMain } = require('electron')
const EVENTS = require('./events')
const redis = require('../redis')

module.exports = function() {
  ipcMain.on(`request_${EVENTS.COMMAND}`, (e, params) => {
    redis.Command(params, function(error, data) {
      console.log(params, data)
      e.sender.send(`response_${EVENTS.COMMAND}`, {
        data,
        error,
        type: EVENTS.COMMAND + '_' + params.cmd,
      })
    })
  })
}
            
