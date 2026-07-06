<div align="center">
  <img src="https://github.com/microlinkhq/cdn/raw/master/dist/logo/banner.png#gh-light-mode-only" alt="microlink logo">
  <img src="https://github.com/microlinkhq/cdn/raw/master/dist/logo/banner-dark.png#gh-dark-mode-only" alt="microlink logo">
  <br>
  <br>
  <br>
  <p style="max-width: 400px;"><b>@microlink/function</b> lets you write normal JavaScript functions and run them remotely with the <a href="https://microlink.io/docs/api/parameters/function">Microlink function</a> parameter — full Puppeteer access, npm packages, and zero infrastructure.</p>
</div>

## Highlights

- Starts from \$0/mo.
- Run JavaScript remotely with no servers, bundles, or browser fleet to manage.
- Full Puppeteer access when your function references `page`.
- `require()` any npm package — dependencies are detected and installed on-the-fly.
- Automatic serialization and compression of function bodies.
- Execution metrics at `result.profiling`.

## Documentation

The full guides live on [microlink.io](https://microlink.io/docs/guides/function):

- [Function](https://microlink.io/docs/guides/function) — overview and when to use it.
- [Writing functions](https://microlink.io/docs/guides/function/writing-functions) — return values, custom parameters, and npm packages.
- [Browser interaction](https://microlink.io/docs/guides/function/browser-interaction) — Puppeteer helpers and page automation.
- [Profiling and performance](https://microlink.io/docs/guides/function/profiling-and-performance) — execution phases, plan limits, and optimization.
- [Troubleshooting](https://microlink.io/docs/guides/function/troubleshooting) — error handling and common failure modes.

## Installation

```bash
npm install @microlink/function
```

Load directly in the browser from a CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/@microlink/function/dist/microlink-function.min.js"></script>
```

## Your first function

Pass a JavaScript function and a target URL. The library handles serialization, compression, and the API call:

```js
const microlink = require('@microlink/function')

const fn = microlink(() => 40 + 2)

const result = await fn('https://example.com')

console.log(result.isFulfilled) // true
console.log(result.value)       // 42
console.log(result.profiling)   // { phases: { ... }, cpu, memory, size }
```

When your function references `page`, Microlink starts a headless browser and gives you full Puppeteer access:

```js
const microlink = require('@microlink/function')

const getTitle = ({ page }) => page.title()

const fn = microlink(getTitle)

const result = await fn('https://example.com')

console.log(result.value) // 'Example Domain'
```

When your function does **not** reference `page`, no browser is started — execution is faster and cheaper.

## Writing functions

### Return any value

Functions can return strings, numbers, booleans, arrays, or plain objects:

```js
const microlink = require('@microlink/function')

const fn = microlink(() => ({
  greeting: 'Hello',
  items: [1, 2, 3],
  nested: { works: true }
}))

const result = await fn('https://example.com')

console.log(result.value)
// { greeting: 'Hello', items: [1, 2, 3], nested: { works: true } }
```

The return value is always at `result.value`. If the function throws, `result.isFulfilled` is `false` and `result.value` contains the error details.

### Custom parameters

Any extra option you pass to the returned function is forwarded to your code:

```js
const microlink = require('@microlink/function')

const greet = ({ name, greeting }) => `${greeting}, ${name}!`

const fn = microlink(greet)

const result = await fn('https://example.com', {
  name: 'Kiko',
  greeting: 'Hello'
})

console.log(result.value) // 'Hello, Kiko!'
```

### npm packages

You can `require()` any npm package inside your function. Dependencies are detected automatically and installed on-the-fly:

```js
const microlink = require('@microlink/function')

const fn = microlink(() => {
  const { kebabCase } = require('lodash')
  return kebabCase('Hello World')
})

const result = await fn('https://example.com')

console.log(result.value) // 'hello-world'
```

Pin a version by appending it to the package name:

```js
const cheerio = require('cheerio@1.0.0')
```

When no version is specified, the latest version is installed. Check `result.profiling.phases` — a high `install` value on the first run is normal and drops to zero once cached.

### Security restrictions

The runtime restricts certain system capabilities. Operations such as spawning child processes or writing to the filesystem outside the sandbox are not permitted:

```json
{
  "isFulfilled": false,
  "value": {
    "name": "Error",
    "code": "ERR_ACCESS_DENIED",
    "permission": "ChildProcess",
    "message": "Access to this API has been restricted."
  }
}
```

## Browser interaction

When your function references `page`, you get the full Puppeteer `Page` object:

```js
const microlink = require('@microlink/function')

const scrape = ({ page }) =>
  page.$eval('h1', el => el.textContent.trim())

const fn = microlink(scrape)

const result = await fn('https://example.com')

console.log(result.value) // 'Example Domain'
```

Start with the high-level helpers before reaching for lower-level APIs:

- `page.title()` — document title.
- `page.$eval()` — run a function on the first matching element.
- `page.$$eval()` — run a function on all matching elements.
- `page.url()` — current URL.
- `page.content()` — full page HTML.

Any [Puppeteer Page method](https://pptr.dev/api/puppeteer.page) is available.

### What your function receives

| Property | Description |
| --- | --- |
| `page` | Full Puppeteer access. Microlink navigates to the URL before calling your function. |
| `response` | The HTTP response from the implicit navigation. Only available when the function uses `page`. |
| `headers` | Request headers used to fetch the target URL. |
| any extra parameter | Custom inputs forwarded from the request options. |

### Click, wait, and navigate

```js
const microlink = require('@microlink/function')

const scrapeAfterClick = ({ page }) =>
  page.click('button.load-more')
    .then(() => page.waitForSelector('.results'))
    .then(() => page.$$eval('.results li', items =>
      items.map(el => el.textContent.trim())
    ))

const fn = microlink(scrapeAfterClick)

const result = await fn('https://example.com')
```

Replace fixed waits like `page.waitForTimeout(3000)` with `page.waitForSelector()` or `page.waitForNavigation()` whenever possible.

### Combine with other parameters

Because `function` is just another Microlink parameter, you can prepare the page before your function runs using `scripts`, `modules`, `click`, or `waitForSelector`:

```js
const microlink = require('@microlink/function')

const fn = microlink(
  ({ page }) => page.evaluate('jQuery.fn.jquery'),
  { meta: false }
)

const result = await fn('https://microlink.io', {
  scripts: ['https://code.jquery.com/jquery-3.5.0.min.js']
})

console.log(result.value) // jQuery version string
```

## Profiling and performance

Every function response includes profiling data:

```js
const result = await fn('https://example.com')

console.log(result.profiling)
// {
//   phases: { install: 0, build: 120, spawn: 45, run: 890, total: 1055 },
//   cpu: 234,
//   memory: 8,
//   size: 156
// }
```

| Field | Description |
| --- | --- |
| `phases.install` | Time spent installing npm dependencies (0 when none are used). |
| `phases.build` | Time spent bundling the function code. |
| `phases.spawn` | Time spent starting the isolated process. |
| `phases.run` | Time spent executing the function. |
| `phases.total` | Wall-clock time from start to finish. |
| `cpu` | Peak CPU time in milliseconds. |
| `memory` | Peak memory usage in MB. |
| `size` | Bundled code size in bytes. |

### Plan limits

| | Free | Pro |
| --- | --- | --- |
| Timeout | 5 seconds | Up to 28 seconds |
| Memory | 16 MB | 32 MB |
| Code size | 1024 bytes | Unlimited |
| Concurrency | 1 per IP | Unlimited |

The free plan is enough to prototype workflows. For production workloads that need more time, memory, or parameters such as `headers`, `proxy`, `ttl`, or `staleTtl`, use a [pro plan](https://microlink.io/#pricing).

### Skip metadata

Most function-only workflows do not need normalized metadata. Set `meta: false` to skip it — this is usually the biggest speedup:

```js
const fn = microlink(({ page }) => page.title(), { meta: false })
```

If you still need the rendered markup, call `page.content()` inside the function.

### Compression

`@microlink/function` compresses function bodies automatically before sending them to the API. You can also compress manually via `microlink.compress()` — useful when calling MQL directly:

```js
const compressed = await microlink.compress(({ page }) => page.title())
// 'br#...' on Node.js (brotli), 'lz#...' as fallback
```

Supported prefixes: `lz#` (lz-string), `br#` (brotli), `gz#` (gzip).

### Optimization checklist

1. Set `meta: false` unless you need normalized metadata.
2. Use `page.title()` and `page.$eval()` instead of `page.evaluate()` when possible.
3. Replace fixed waits with `page.waitForSelector()`.
4. Check `result.profiling.phases` to find the bottleneck.
5. Minimize dependencies — each `require()` adds install and build time.

## Troubleshooting

### Error handling

When a function throws, the result comes back with `isFulfilled: false` and the error details at `result.value`:

```js
const failing = ({ name }) => name()

const fn = microlink(failing)

const result = await fn('https://example.com', { name: 'Kiko' })

console.log(result.isFulfilled)    // false
console.log(result.value.name)     // 'TypeError'
console.log(result.value.message)  // 'name is not a function'
```

Non-Error throws (like `throw 'oh no'`) are normalized into a `NonError` with the thrown value as the message.

### Resource errors

When a function exceeds its plan limits, the API returns a descriptive error:

| Error | Trigger |
| --- | --- |
| `TimeoutError` | Wall-clock time exceeded the plan limit. |
| `CpuTimeError` | CPU time exceeded the plan limit. |
| `MemoryError` | Memory usage exceeded the plan limit. |
| `CodeSizeError` | Code exceeds the 1024 bytes free plan limit. |
| `ConcurrencyError` | Too many concurrent executions for the free plan (1 per IP). |
| `OutgoingRequestError` | Cross-origin network request on the free plan. |

### Function-specific errors

- **EINVALFUNCTION** — invalid JavaScript syntax in the function string.
- **EINVALEVAL** — the function executed but threw at runtime.

### Debugging tips

1. Start simple — reduce the function to `({ page }) => page.title()` to isolate the problem.
2. Set `meta: false` unless metadata is required.
3. Inspect `result.profiling` to see where time is spent.
4. Keep orchestration in the outer function and DOM-only code inside `page.evaluate()`.
5. Watch for null — DOM queries return null when the element does not exist.

See the [troubleshooting guide](https://microlink.io/docs/guides/function/troubleshooting) for detailed remediation steps.

## Choose the lightest tool

Use `function` when the built-in parameters stop being expressive enough, not as the default for every workflow.

| If you need | Best option | Why |
| --- | --- | --- |
| Simple field extraction from the DOM | `data` | Declarative rules are shorter and easier to maintain. |
| Inject CSS or JavaScript before another workflow | `styles`, `modules`, or `scripts` | Lighter than full browser automation. |
| Click, wait, compute, reshape, or orchestrate custom logic | `function` | Puppeteer access plus any npm package. |

## Authentication

Pass your API key via the third argument (`gotOpts`):

```js
const microlink = require('@microlink/function')

const fn = microlink(
  ({ page }) => page.title(),
  {},
  { headers: { 'x-api-key': process.env.MICROLINK_API_KEY } }
)

const result = await fn('https://example.com')
```

See [authentication](https://microlink.io/docs/api/basics/authentication) for endpoint and quota details.

## Examples

See [examples](/examples).

## API

### `microlink(fn, [mqlOpts], [gotOpts])`

Returns an async function `(url, [mqlOpts], [gotOpts]) => Promise<FunctionResponse>`.

#### `fn`

_Required_
Type: `function`

The function to execute remotely.

#### `mqlOpts`

Type: `object`

Default options forwarded to [@microlink/mql](https://github.com/microlinkhq/mql). Per-call options merge on top.

#### `gotOpts`

Type: `object`

HTTP client options forwarded to `got` inside MQL — use this for authentication headers and other request settings.

### Response shape

```ts
type FunctionResponse =
  | {
      isFulfilled: true
      value: any
      profiling: FunctionProfiling
      logging: Record<string, unknown>
    }
  | {
      isFulfilled: false
      value: { name: string; message: string; [key: string]: unknown }
      profiling: FunctionProfiling
      logging: Record<string, unknown>
    }
```

### Static properties

- `microlink.compress(code)` — compress a function body for manual MQL usage.
- `microlink.mql` — the underlying [@microlink/mql](https://github.com/microlinkhq/mql) client.
- `microlink.version` — package version string.

## License

**@microlink/function** © [Microlink](https://microlink.io), released under the [MIT](https://github.com/microlinkhq/function/blob/master/LICENSE.md) License.<br>
Authored and maintained by [Kiko Beats](https://kikobeats.com) with help from [contributors](https://github.com/microlinkhq/function/contributors).

> [microlink.io](https://microlink.io) · GitHub [@MicrolinkHQ](https://github.com/microlinkhq) · X [@microlinkhq](https://x.com/microlinkhq)
