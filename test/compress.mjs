import { brotliDecompress } from 'zlib'
import { createRequire } from 'module'
import { promisify } from 'util'
import test from 'ava'

const require = createRequire(import.meta.url)
const { decompressFromURI, compressToURI } = require('lz-ts')
const fn = require('../src/index.js')

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

test('lz roundtrip produces original code', t => {
  const compressed = `lz#${compressToURI(code)}`
  t.true(compressed.startsWith('lz#'))
  const payload = compressed.slice(3)
  t.is(decompressFromURI(payload), code)
})
