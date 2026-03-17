'use strict'

const mql = require('@microlink/mql')

let toCompress

try {
  const { promisify } = require('util')
  const { brotliCompress } = require('zlib')
  const compress = promisify(brotliCompress)
  toCompress = async code =>
    `br#${(await compress(code.toString())).toString('base64url')}`
} catch {
  const { compressToURI } = require('lz-ts')
  toCompress = code => Promise.resolve(`lz#${compressToURI(code.toString())}`)
}

const fn = (code, mqlOpts, gotOpts) => {
  const compressed = toCompress(code)

  return async (url, opts) => {
    const { data } = await mql(
      url,
      {
        function: await compressed,
        meta: false,
        ...mqlOpts,
        ...opts
      },
      gotOpts
    )

    return data.function
  }
}

fn.compress = toCompress
fn.mql = mql
fn.version = require('../package.json').version

module.exports = fn
