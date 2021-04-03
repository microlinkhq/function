'use strict'

const mql = require('@microlink/mql')
const { escape } = require('base64-url')
const { promisify } = require('util')
const zlib = require('zlib')

const brotliCompress = promisify(zlib.brotliCompress)

const toCompress = code =>
  brotliCompress(code.toString()).then(
    data => `br#${escape(data.toString('base64'))}`
  )

module.exports = require('./factory')({
  mql,
  toCompress,
  VERSION: require('../package.json').version
})
