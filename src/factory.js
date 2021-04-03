'use strict'

const factory = ({ mql, VERSION, toCompress }) => {
  const microlink = (code, mqlOpts, gotOpts) => {
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

  microlink.version = VERSION
  microlink.mql = mql

  return microlink
}

module.exports = factory
