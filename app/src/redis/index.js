const redis = require('redis')
const config = require('../config')
let clientList = []
let connInfo = null

const Connect = function(connInfo, callback) {
  const obj = {
    host: connInfo.host,
    no_ready_check: true,
  }

  if (connInfo.auth) {
    obj.password = connInfo.auth
  }
  
  client = redis.createClient(obj)

  client.ping(() => callback(client))
  clientList[connInfo.id] = client
  client.on("error", function (err) {
    console.log("Error " + err);
  });
}

const GetClient = function(key) {
  return clientList[key]
}

const Command = function(obj, callback) {
  let client = clientList[obj.connInfo.id]
  const params = obj.params

  if (!client) {
    Connect(obj.connInfo, function(client) {
      execCmd(client, obj, callback)
    })
  } else {
    execCmd(client, obj, callback)
  }
}

const execCmd = function(client, obj, callback) {
  client[obj.cmd](...obj.params, function(error, data) {
    if (!error && obj.cmd == "quit") {
      const id = obj.connInfo.id
      
      clientList[id] = null
      delete clientList[id]
    }

    callback(error, data)
  })

}

module.exports = {
  Connect,
  Command,
  GetClient,
}
