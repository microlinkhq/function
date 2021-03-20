'use strict'

const mql = require('@microlink/mql')

module.exports = (code, mqlOpts, gotOpts) => (url, opts) =>
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
