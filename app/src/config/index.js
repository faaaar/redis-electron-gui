const electron = require('electron')
const fs = require('fs')
const ini = require('ini')

let connectConfig = {}
let appConfig = {}

const AppConfigFilePath  = () => electron.app.getPath('userData') + "/redis_config.ini"
const ConnectConfigFilePath  = () => electron.app.getPath('userData') + "/redis_connect.ini"

const GetRedisConnectConfig = function(callback) {
  const filePath = ConnectConfigFilePath()
  
  if (fs.existsSync(filePath)) {
    connectConfig = ini.parse(fs.readFileSync(filePath, 'utf-8'))    
  } else {
    fs.writeFileSync(filePath, ini.stringify(connectConfig, {section: ''}))
  }
  
  callback(null, connectConfig) 
}

const AddRedisConnectConfig = function(newConfig, callback) {
  const filePath = ConnectConfigFilePath()
  const alias = newConfig.alias
  
  delete newConfig.alias
  connectConfig[alias] = newConfig
  fs.writeFileSync(filePath, ini.stringify(connectConfig, { section: '' }))
  
  callback(null, connectConfig)
}

const DelRedisConnectConfig = function(alias, callback) {
  const filePath = ConnectConfigFilePath()
  
  delete connectConfig[alias]
  fs.writeFileSync(filePath, ini.stringify(connectConfig, { section: '' }))
  
  callback(null, connectConfig)
}

module.exports = {
  GetRedisConnectConfig,
  AddRedisConnectConfig,
  DelRedisConnectConfig,
}
