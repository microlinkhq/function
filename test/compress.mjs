import { brotliDecompress } from 'zlib'
import { createRequire } from 'module'
import { promisify } from 'util'
import test from 'ava'

const require = createRequire(import.meta.url)
const { decompressFromURI, compressToURI } = require('lz-ts')
const fn = require('@microlink/function')

const decompress = promisify(brotliDecompress)
const code = '({ page }) => page.title()'

test('compress is exported', t => {
  t.is(typeof fn.compress, 'function')
})

test('node.js selects brotli compression', async t => {
  const compressed = await fn.compress(code)
  t.true(compressed.startsWith('br#'))
})

test('brotli roundtrip produces original code', async t => {
  const compressed = await fn.compress(code)
  const payload = compressed.slice(3)
  const decompressed = (await decompress(Buffer.from(payload, 'base64url'))).toString()
  t.is(decompressed, code)
})

test('falls back to lz-string when zlib is unavailable', async t => {
  const { execFileSync } = await import('child_process')
  const result = execFileSync(process.execPath, ['-e', `
    const Module = require('module')
    const originalLoad = Module._load
    Module._load = function (id, parent, isMain) {
      if (id === 'zlib') throw new Error('not available')
      return originalLoad(id, parent, isMain)
    }
    const fn = require(${JSON.stringify(require.resolve('@microlink/function'))})
    fn.compress('({ page }) => page.title()').then(r => process.stdout.write(r))
  `], { encoding: 'utf8' })
  t.true(result.startsWith('lz#'))
})

test('lz roundtrip produces original code', t => {
  const compressed = `lz#${compressToURI(code)}`
  t.true(compressed.startsWith('lz#'))
  const payload = compressed.slice(3)
  t.is(decompressFromURI(payload), code)
})
