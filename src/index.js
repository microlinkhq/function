'use strict'

const mql = require('@microlink/mql')

const microlink = (code, mqlOpts, gotOpts) => (url, opts) =>
  mql(
    url,
    {
      function: code.toString(),
      meta: false,
      ...mqlOpts,
      ...opts
    },
    gotOpts
  ).then(({ data }) => data.function)

microlink.version = '__VERSION__'
microlink.mql = mql

module.exports = microlink
