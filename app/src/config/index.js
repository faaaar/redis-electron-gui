const electron = require('electron')
const fs = require('fs')
const ini = require('ini')

let config = {
  connect: {
    default: {
      host: '127.0.0.1',
      port: '6379',
      auth: '',
    },
  },
}

const Set = function(key, value) {
  if (!key) {
    return false
  }

  eval('config.'+key+'='+value)

  return true
}

const Get = function(key) {
  if (!key) {
    return config
  }
  
  return eval('config.'+key)
}

const Init = function(callback) {
  const userHome = electron.app.getPath('userData')
  const configFile = userHome + '/redis_config.ini'

  if (fs.existsSync(configFile)) {
    config = ini.parse(fs.readFileSync(configFile, 'utf-8'))    
  } else {
    fs.writeFileSync(configFile, ini.stringify(config, {section: ''}))
  }
  
  callback(null, config) 
}

module.exports = {
  Init,
  Get,
  Set,
}
