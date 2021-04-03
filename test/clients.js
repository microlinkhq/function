require('./browser-globals')

const mqlBrowser = require('../src/browser')
const mqlNode = require('../src/node')

module.exports = [
  { constructor: mqlNode, target: 'node' },
  { constructor: mqlBrowser, target: 'browser' }
]
