const redis = require('redis')
const config = require('../config')
let clientList = []
let client = null

const Connect = function(clientName, callback) {
  let obj = config.Get('connect.' + clientName)
  
  obj.no_ready_check = true
  obj.password = obj.auth
  client = redis.createClient(obj)
  client.ping(callback)
  clientList[clientName] = client
  client.on("error", function (err) {
    console.log("Error " + err);
  });
}

const GetClient = function(key) {
  return clientList[key]
}

const Command = function(obj, callback) {
  let client = clientList[obj.client]
  const params = obj.params

  if (!client) {
    Connect(obj.client, function() {
      client = clientList[obj.client]
      client[obj.cmd](...params, callback)
    })
  } else {
    client[obj.cmd](...params, callback)
  }
}

module.exports = {
  Connect,
  Command,
  GetClient,
}
