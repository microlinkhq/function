<div align="center">
  <img src="https://github.com/microlinkhq/cdn/raw/master/dist/logo/banner.png#gh-light-mode-only" alt="microlink logo">
  <img src="https://github.com/microlinkhq/cdn/raw/master/dist/logo/banner-dark.png#gh-dark-mode-only" alt="microlink logo">
  <br>
  <br>
  <br>
  <p style="max-width: 400px;"><b>Microlink Function</b> allows you to run JavaScript Serverless functions with <a target="_blank" href="https://browserless.js.org">Headless Chromium</a> programmatic access.</p>
</div>

<div align="center">
  <img src="https://i.imgur.com/4PWrzx2.png" width="700px">
</div>

## Highlights

- Starts from \$0/mo.
- Run Serverless Javascript functions (also [locally](https://github.com/microlinkhq/local)).
- Ability to require to require any of the [allowed](#npm-packages) NPM packages.
- Headless Chromium browser access in the same request cycle.
- No servers to maintain, no hidden cost or infrastructure complexity.

## Contents

- [How it works](#how-it-works)
- [Installation](#installation)
  - [from NPM](#from-npm)
  - [from CDN](#from-cdn)
- [Get Started](#get-started)
  - [Input](#input)
    - [NPM packages](#npm-packages)
  - [Output](#output)
- [Examples](#examples)
- [Pricing](#pricing)
- [API](#api)
- [License](#license)

## How it works

Every time you call a **Microlink Function**, the code function will be compiled and executed remotely in a safe V8 sandbox.

It's pretty similar to AWS Lambda, but rather than bundle your code, all the code will be executed remotely, giving the result of the execution back to you.

**Microlink Function** can be invoked in frontend or backend side. There is nothing to deploy or hidden infrastructure cost associated.

## Installation

### from NPM

It's available as [npm package](https://www.npmjs.com/package/@microlink/function):

```bash
$ npm install @microlink/function --save
```

### from CDN

Load directly in the browser from your favorite CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/@microlink/function/dist/microlink-function.min.js"></script>
```

## Get Started

### Input

Let say you have a JavaScript like this:

```js
const ping = ({ statusCode, response }) =>
  statusCode ? response.status() : response.statusText()
```

To run the previous code as **Microlink Function**, all you need to do is wrap the function with the `microlink` decorator:

```js
const microlink = require('@microlink/function')

const ping = microlink(({ response }) =>
  statusCode ? response.status() : response.statusText()
)
```

Then, just call the function as you would normally:

```js
const result = await ping('https://example.com', { statusCode: true })

console.log(result)

// {
//   isFullfilled: true,
//   isRejected: false,
//   value: 200
// }
```

When a function is wrapped by **Microlink Function** the function execution is done remotely, giving back the result.

Any **Microlink Function** will receive the following parameters:

- `html`: When [meta](https://microlink.io/docs/api/parameters/meta) is enabled, the HTML markup of the website is provided.
- `page`: The [`puppeteer#page`](https://github.com/puppeteer/puppeteer/blob/main/docs/api.md#class-page) instance to interact with the headless browser.
- `response`: The [`puppeteer#response`](https://github.com/puppeteer/puppeteer/blob/main/docs/api.md#class-httpresponse) as result of the implicit [`page.goto`](https://github.com/puppeteer/puppeteer/blob/main/docs/api.md#pagegotourl-options).

#### NPM packages

Additionally, you can require a allowed list of common NPM packages inside your code blocks:

```js
const microlink = require('@microlink/function')

const ping = microlink(({ statusCode, response }) => {
  const { result } = require('lodash')
  return result(response, statusCode ? 'status' : 'statusText')
})
```

The list of allowed NPM packages are:

- [`path`](https://nodejs.org/api/path.html)
- [`url`](https://nodejs.org/api/url.html)
- [`@aws-sdk/client-s3`](https://npm.im/@aws-sdk/client-s3)
- [`@metascraper`](https://npm.im/@metascraper)
- [`@mozilla/readability`](https://npm.im/@mozilla/readability)
- [`async`](https://npm.im/async)
- [`cheerio`](https://npm.im/cheerio)
- [`extract-email-address`](https://npm.im/extract-email-address)
- [`got`](https://npm.im/got)
- [`ioredis`](https://npm.im/ioredis)
- [`jsdom`](https://npm.im/jsdom)
- [`lodash`](https://npm.im/lodash)
- [`metascraper`](https://npm.im/metascraper)
- [`p-reflect`](https://npm.im/p-reflect)
- [`p-retry`](https://npm.im/p-retry)
- [`p-timeout`](https://npm.im/p-timeout)

Do you miss any NPM modules there? open a [new issue](/issues/new) and we make it available.

### Output

When a **Microlink Function** is executed, the result response object has the following interface:

- `isFulfilled`
- `isRejected`
- `value` or `reason`, depending on whether the promise fulfilled or rejected.

## Testing

Check [`@microlink/local`](https://github.com/microlinkhq/local) for executing your Microlink Functions locally.

## Examples

Check [examples](/examples).

## Pricing

**Microlink Function** has been designed to be cheap and affordable.

The first 50 [uncached](https://microlink.io/blog/edge-cdn/) requests of every day are **free**. If you need more, you should to buy a [pro plan](https://microlink.io/#pricing).

For [authenticating](https://microlink.io/docs/api/basics/authentication) your requests, you should to provide your API key:

```js
const microlink = require('@microlink/function')

const code = ({ statusCode, response }) => {
  const { result } = require('lodash')
  return result(response, statusCode ? 'status' : 'statusText')
}

const ping = microlink(code, { apiKey: process.env.MICROLINK_API_KEY })
```

## API

### microlink(fn, [mqlOpts], [gotoOpts])

#### fn

_Required_<br>
Type: `function`

The function that be executed inside Microlink API browser.

#### mqlOpts

Type: `object`

The function that be executed inside Microlink API browser.

Any option passed here will bypass to [mql](https://github.com/microlinkhq/mql).

#### gotoOpts

Type: `object`

Any option passed here will bypass to [browserless#goto](https://browserless.js.org/#/?id=options-5).

## License

**microlink-function** © [Microlink](https://microlink.io), released under the [MIT](https://github.com/microlink/microlink-function/blob/master/LICENSE.md) License.<br>
Authored and maintained by [Kiko Beats](https://kikobeats.com) with help from [contributors](https://github.com/microlink/microlink-function/contributors).

> [microlink.io](https://microlink.io) · GitHub [@MicrolinkHQ](https://github.com/microlinkhq) · X [@microlinkhq](https://x.com/microlinkhq)
