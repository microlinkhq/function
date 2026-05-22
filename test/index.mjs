'use strict'

import microlink from '@microlink/function'
import test from 'ava'

const ENDPOINT = 'https://api.microlink.io'
const PRO_ENDPOINT = 'https://pro.microlink.io'
const TARGET_URL = 'https://edge-ping.vercel.app'

const API_KEY = process.env.MICROLINK_API_KEY
const PRO_GOT_OPTS = API_KEY ? { headers: { 'x-api-key': API_KEY } } : undefined
const proTest = API_KEY ? test : test.skip

test('return a computed value', async t => {
  const fn = () => 40 + 2

  const myFn = microlink(fn, { endpoint: ENDPOINT })

  const result = await myFn(TARGET_URL, { force: true })

  t.true(result.isFulfilled)
  t.is(result.value, 42)
  t.truthy(result.profiling)
})

test('return a complex value', async t => {
  const fn = () => ({ title: 'hello', count: 42 })

  const myFn = microlink(fn, { endpoint: ENDPOINT })

  const result = await myFn(TARGET_URL, { force: true })

  t.true(result.isFulfilled)
  t.deepEqual(result.value, { title: 'hello', count: 42 })
  t.truthy(result.profiling)
})

test('interact with user specific parameters', async t => {
  const getGreetings = ({ greetings }) => greetings

  const myFn = microlink(getGreetings, { endpoint: ENDPOINT })

  const result = await myFn(TARGET_URL, {
    greetings: 'hello world',
    force: true
  })

  t.true(result.isFulfilled)
  t.is(result.value, 'hello world')
  t.truthy(result.profiling)
})

test('async function execution', async t => {
  const fn = async () => {
    const value = await Promise.resolve(42)
    return value * 2
  }

  const myFn = microlink(fn, { endpoint: ENDPOINT })

  const result = await myFn(TARGET_URL, { force: true })

  t.true(result.isFulfilled)
  t.is(result.value, 84)
  t.truthy(result.profiling)
})

test('profiling includes phase timings', async t => {
  const fn = () => 420

  const myFn = microlink(fn, { endpoint: ENDPOINT })

  const result = await myFn(TARGET_URL, { force: true })

  t.true(result.isFulfilled)
  t.truthy(result.profiling)
  t.truthy(result.profiling.phases)
  t.is(typeof result.profiling.phases.total, 'number')
})

test('handle execution errors', async t => {
  const fn = () => { throw new Error('test error') }

  const myFn = microlink(fn, { endpoint: ENDPOINT })

  const result = await myFn(TARGET_URL, { force: true })

  t.false(result.isFulfilled)
  t.is(result.value.name, 'Error')
  t.is(result.value.message, 'test error')
  t.truthy(result.profiling)
})

test('turn non-Error throws into errors', async t => {
  const fn = () => { throw 'oh no' } // eslint-disable-line

  const myFn = microlink(fn, { endpoint: ENDPOINT })

  const result = await myFn(TARGET_URL, { force: true })

  t.false(result.isFulfilled)
  t.is(result.value.name, 'NonError')
  t.truthy(result.profiling)
})

proTest('interact with a page', async t => {
  const fn = ({ page }) => page.title()

  const myFn = microlink(fn, { endpoint: PRO_ENDPOINT }, PRO_GOT_OPTS)

  const result = await myFn(TARGET_URL, { force: true })

  t.true(result.isFulfilled)
  t.is(typeof result.value, 'string')
  t.truthy(result.profiling)
})

proTest('evaluate javascript on the page', async t => {
  const fn = ({ page }) => page.evaluate("performance.getEntriesByType('resource').length")

  const myFn = microlink(fn, { endpoint: PRO_ENDPOINT }, PRO_GOT_OPTS)

  const result = await myFn(TARGET_URL, { force: true })

  t.true(result.isFulfilled)
  t.is(typeof result.value, 'number')
  t.truthy(result.profiling)
})

proTest('require an external dependency', async t => {
  const fn = () => {
    const cheerio = require('cheerio')
    const $ = cheerio.load('<h1>Hello</h1>')
    return $('h1').text()
  }

  const myFn = microlink(fn, { endpoint: PRO_ENDPOINT }, PRO_GOT_OPTS)

  const result = await myFn(TARGET_URL, { force: true })

  t.true(result.isFulfilled)
  t.is(result.value, 'Hello')
  t.truthy(result.profiling)
})
