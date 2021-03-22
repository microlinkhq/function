'use strict'

const microlink = require('..')

const fn = microlink(({ response }) => response.status())

fn('https://example.com').then(result => console.log(result))
