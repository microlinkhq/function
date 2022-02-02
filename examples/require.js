'use strict'

const microlink = require('..')

const ping = microlink(({ statusCode, response }) => {
  const { result } = require('lodash')
  return result(response, statusCode ? 'status' : 'statusText')
})

ping('https://example.com', { statusCode: true }).then(result =>
  console.log(result)
)
