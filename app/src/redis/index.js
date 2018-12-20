const redis = require('redis')

let client = null
const Connect = function(obj, callback) {
  client = redis.createClient(obj)

  client.ping(callback)
}

const Command = function(obj, callback) {
  client[obj.cmd](...obj.params, callback)
}

module.exports = {
  Connect,
  Command,
}
