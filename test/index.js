'use strict'

const test = require('ava')

const clients = require('./clients')

clients.forEach(({ constructor: microlink, target }) => {
  test(`${target} » interact with the page`, async t => {
    const getTitle = ({ page }) => page.title()

    const myFn = microlink(getTitle)

    const result = await myFn('https://google.com')

    t.deepEqual(result, {
      isFulfilled: true,
      isRejected: false,
      value: 'Google'
    })
  })

  test(`${target} » interact with the response`, async t => {
    const getTitle = ({ response }) => response.status()

    const myFn = microlink(getTitle)

    const result = await myFn('https://google.com')

    t.deepEqual(result, {
      isFulfilled: true,
      isRejected: false,
      value: 200
    })
  })

  test(`${target} » interact with user specific parameters`, async t => {
    const getTitle = ({ greetings }) => greetings

    const myFn = microlink(getTitle)

    const result = await myFn('https://google.com', {
      greetings: 'hello world'
    })

    t.deepEqual(result, {
      isFulfilled: true,
      isRejected: false,
      value: 'hello world'
    })
  })
})
