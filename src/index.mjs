import { createRequire } from 'module'

const require = createRequire(import.meta.url)
const fn = require('./index.js')

export const compress = fn.compress
export const mql = fn.mql
export const version = fn.version

export default fn
