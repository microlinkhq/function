'use strict'

const mql = require('@microlink/mql')

const { escape } = require('base64-url')
const { promisify } = require('util')
const zlib = require('zlib')

const brotliCompress = promisify(zlib.brotliCompress)

const microlink = (code, { compress, ...mqlOpts }, gotOpts) => {
  const codeFn = compress
    ? brotliCompress(code.toString()).then(
        data => `br#${escape(data.toString('base64'))}`
      )
    : Promise.resolve(code.toString())

  return async (url, opts) => {
    const { data } = await mql(
      url,
      {
        function: await codeFn,
        meta: false,
        ...mqlOpts,
        ...opts
      },
      gotOpts
    )

    return data.function
  }
}

microlink.version = '__VERSION__'
microlink.mql = mql

module.exports = microlink
