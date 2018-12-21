const redis = require("./redis")
const config = require("./config")

module.exports = function() {
  config()
  redis()
}
