'use strict'

const microlink = require('..')

const ping = microlink(({ query, response }) =>
  query.statusCode ? response.status() : response.statusText()
)

ping('https://example.com', { statusCode: true }).then(result =>
  console.log(result)
)
