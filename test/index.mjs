'use strict'

import microlink from '@microlink/function'
import test from 'ava'

const ENDPOINT = 'https://api.microlink.io'
const TARGET_URL = 'https://edge-ping.vercel.app'

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
