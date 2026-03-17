'use strict'

import microlink from '@microlink/function'
import test from 'ava'

const ENDPOINT = 'http://localhost:3000'

test('interact with the page', async t => {
  const getTitle = ({ page }) => page.title()

  const myFn = microlink(getTitle, { endpoint: ENDPOINT })

  const result = await myFn('https://example.com', { force: true })

  t.true(result.isFulfilled)
  t.is(result.value, 'Example Domain')
})

test.only('interact with the response', async t => {
  const getTitle = ({ response }) => response.status()

  const myFn = microlink(getTitle, { endpoint: ENDPOINT })

  const result = await myFn('https://example.com', { force: true })

  t.true(result.isFulfilled)
  t.is(result.value, 200)
})

test('interact with user specific parameters', async t => {
  const getTitle = ({ greetings }) => greetings

  const myFn = microlink(getTitle, { endpoint: ENDPOINT })

  const result = await myFn('https://example.com', {
    greetings: 'hello world',
    force: true
  })

  t.true(result.isFulfilled)
  t.is(result.value, 'hello world')
})
