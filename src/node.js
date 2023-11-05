'use strict'

const { escape } = require('base64-url')
const { promisify } = require('util')
const mql = require('@microlink/mql')
const zlib = require('zlib')

const brotliCompress = promisify(zlib.brotliCompress)

const toCompress = code =>
  brotliCompress(code.toString()).then(
    data => `br#${escape(data.toString('base64'))}`
  )

const fn = (code, mqlOpts, gotOpts) => {
  const compress = toCompress(code)

  return async (url, opts) => {
    const { data } = await mql(
      url,
      {
        function: await compress,
        meta: false,
        ...mqlOpts,
        ...opts
      },
      gotOpts
    )

    return data.function
  }
}

fn.mql = mql
fn.render = mql.render
fn.version = require('../package.json').version

module.exports = fn
