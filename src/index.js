'use strict'

const mql = require('@microlink/mql')

module.exports = (code, mqlOpts, gotOpts) => async (url, opts) => {
  const { data } = await mql(
    url,
    {
      function: code.toString(),
      meta: false,
      ...mqlOpts,
      ...opts
    },
    gotOpts
  )

  return data.function
}
