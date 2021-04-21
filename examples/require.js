'use strict'

const microlink = require('..')

const ping = microlink(({ query, response }) => {
  const { result } = require('lodash')
  const { statusCode } = query
  return result(response, statusCode ? 'status' : 'statusText')
})

ping('https://example.com', { statusCode: true }).then(result =>
  console.log(result)
)
