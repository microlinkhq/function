'use strict'

module.exports = require('./factory')({
  mql: require('@microlink/mql'),
  toCompress: code => code.toString(),
  VERSION: '__VERSION__'
})
