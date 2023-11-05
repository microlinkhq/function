import nodeResolve from '@rollup/plugin-node-resolve'
import { visualizer } from 'rollup-plugin-visualizer'
import commonjs from '@rollup/plugin-commonjs'
import filesize from 'rollup-plugin-filesize'
import replace from '@rollup/plugin-replace'
import terser from '@rollup/plugin-terser'

const build = ({ input, output, plugins = [], compress }) => {
  return {
    input,
    output,
    plugins: [
      replace({
        values: {
          "require('../package.json').version": "'__MFN_VERSION__'",
          __MFN_VERSION__: require('./package.json').version
        }
      }),
      ...plugins,
      compress &&
        terser({
          format: {
            comments: false
          }
        }),
      filesize(),
      visualizer()
    ]
  }
}

const builds = [
  /* This build is just for testing using ESM interface */
  build({
    input: './src/node.js',
    output: { file: 'src/node.mjs', format: 'es' },
    plugins: [commonjs()]
  }),
  build({
    compress: true,
    input: 'src/lightweight.mjs',
    output: { file: 'lightweight/index.js', format: 'es' },
    plugins: [nodeResolve()]
  })
]

export default builds
