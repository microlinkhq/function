'use strict'

const test = require('ava')

const microlink = require('..')

test('interact with the page', async t => {
  const getTitle = ({ page }) => page.title()

  const myFn = microlink(getTitle)

  const result = await myFn('https://google.com')

  t.deepEqual(result, {
    isFulfilled: true,
    isRejected: false,
    value: 'Google'
  })
})

test('interact with the response', async t => {
  const getTitle = ({ response }) => response.status()

  const myFn = microlink(getTitle)

  const result = await myFn('https://google.com')

  t.deepEqual(result, {
    isFulfilled: true,
    isRejected: false,
    value: 200
  })
})

test('interact with the query', async t => {
  const getTitle = ({ query }) => query.greetings

  const myFn = microlink(getTitle)

  const result = await myFn('https://google.com', { greetings: 'hello world' })

  t.deepEqual(result, {
    isFulfilled: true,
    isRejected: false,
    value: 'hello world'
  })
})
