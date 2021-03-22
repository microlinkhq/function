'use strict'

const microlink = require('..')

const fn = microlink(({ page }) => page.title())

fn('https://example.com').then(result => console.log(result))
