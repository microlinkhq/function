'use strict'

const microlink = require('..')

const ping = microlink(({ statusCode, response }) =>
  statusCode ? response.status() : response.statusText()
)

ping('https://example.com', { statusCode: true }).then(result =>
  console.log(result)
)
