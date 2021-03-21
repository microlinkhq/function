import nodeResolve from '@rollup/plugin-node-resolve'
import visualizer from 'rollup-plugin-visualizer'
import commonjs from '@rollup/plugin-commonjs'
import replace from '@rollup/plugin-replace'
import { terser } from 'rollup-plugin-terser'
import filesize from 'rollup-plugin-filesize'

const build = ({ format, exports, input } = {}) => {
  const base = ({ file, compress = false }) => ({
    input,
    output: {
      exports,
      name: 'microlink',
      format,
      file,
      sourcemap: true
    },
    plugins: [
      nodeResolve({
        mainFields: ['browser', 'module', 'main']
      }),
      replace({
        __VERSION__: require('./package.json').version,
        __MQL_VERSION__: require('@microlink/mql').version
      }),
      commonjs(),
      compress && terser(),
      filesize(),
      visualizer()
    ]
  })

  return [
    base({ file: 'dist/microlink-function.js', compress: false }),
    base({ file: 'dist/microlink-function.min.js', compress: true })
  ]
}

export default build({
  format: 'umd',
  input: './src/index.js'
})
