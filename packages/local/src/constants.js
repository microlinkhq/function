'use strict'

const VM_OPTS = {
  require: {
    external: {
      builtin: ['path', 'url'],
      modules: [
        '@aws-sdk/client-s3',
        '@metascraper',
        'async',
        'browserless',
        'got',
        'ioredis',
        'lodash',
        'metascraper-',
        'metascraper',
        'p-reflect',
        'p-retry',
        'p-timeout'
      ]
    }
  }
}

module.exports = { VM_OPTS }
