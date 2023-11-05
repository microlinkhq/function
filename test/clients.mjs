import ligtweight from '../lightweight/index.js'
import node from '../src/node.mjs'

export default [
  { constructor: node, target: 'node' },
  { constructor: ligtweight, target: 'lightweight' }
]
