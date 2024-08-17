import { createRequire } from 'module'
import $ from 'tinyspawn'
import test from 'ava'

const pkg = createRequire(import.meta.url)('../package.json')

const evalScript = (code, flags = []) => $('node', ['--eval', code, ...flags]).then(({ stdout }) => stdout)
evalScript.esm = code => evalScript(code, ['--input-type', 'module'])

test('cjs', async t => {
  // eslint-disable-next-line no-template-curly-in-string
  const code = "console.log(`ƒ v${require('@microlink/function').version}`)"
  const { stdout } = await evalScript(code)
  t.is(stdout, `ƒ v${pkg.version}`)
})

test('esm', async t => {
  // eslint-disable-next-line no-template-curly-in-string
  const code = "import f from '@microlink/function'; console.log(`ƒ v${f.version}`)"
  const { stdout } = await evalScript.esm(code)
  t.is(stdout, `ƒ v${pkg.version}`)
})
