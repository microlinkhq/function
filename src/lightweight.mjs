import mql from '@microlink/mql'

const fn = (code, mqlOpts, gotOpts) => async (url, opts) => {
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

fn.mql = mql
fn.render = mql.render
fn.version = require('../package.json').version

export default fn
