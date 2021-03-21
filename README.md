<div align="center">
  <img src="https://cdn.microlink.io/logo/banner.png">
  <p style="max-width: 400px;"><b>Microlink Function</b> allows you to run JavaScript Serverless functions with <a target="_blank" href="https://browserless.js.org">Headless Chromium</a> access.</p>
</div>

<div align="center">
  <img src="https://i.imgur.com/4PWrzx2.png" width="700px">
</div>

## Highlights

- Starts from $0/mo.
- Run Serverless Javascript functions.
- Safe code isolation with NPM package support.
- Headless Chromium browser access in the same request cycle.
- No servers to maintain, no hidden cost or infrastructure complexity.

## How it works

Every time you call a **Microlink Function**, the code function will be compiled and executed remotely in a safe V8 sandbox.

It's pretty similar to AWS Lambda, but rather than bundle your code, all the code will be executed remotely, giving the result of the execution back to you.

**Microlink Function** can be invoked in frontend or backend side. There is nothing to deploy or hidden infrastructure cost associated.

## Install

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

## Usage

### Interact with the page

```js
const microlink = require('@microlink/function')

const fn = microlink(({ page }) => page.title())

fn('https://google.com').then(result => console.log(result))

// {
//   isFulfilled: true,
//   isRejected: false,
//   value: 'Google'
// }
```

### Interact with the response

```js
const microlink = require('@microlink/function')

const fn = microlink(({ page }) => response.status())

fn('https://google.com').then(result => console.log(result))

// {
//   isFulfilled: true,
//   isRejected: false,
//   value: 200
// }
```

### Interact with the query

```js
const microlink = require('@microlink/function')

const fn = microlink(({ query }) => query.greetings)

fn('https://google.com', { greetings: 'hello world' }).then(result => console.log(result))

// {
//   isFulfilled: true,
//   isRejected: false,
//   value: 'hello world'
// }
```

## Pricing

**Microlink Function** has been designed to be cheap and affordable.

The first 50 [uncached](https://microlink.io/blog/edge-cdn/) requests of every day are **free**. If you need more, you should to buy a [pro plan](https://microlink.io/#pricing).

For [authenticating](https://microlink.io/docs/api/basics/authentication) your requests, you should to provide your API key:

```js
const microlink = require('@microlink/function')

const fn = microlink(({ query }) => query.greetings, {
  apiKey: process.env.MICROLINK_API_KEY
})
```

## API

### microlink(fn, [mqlOpts], [gotoOpts])

#### fn

*Required*<br>
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

**microlink-function** © [](), released under the [MIT](https://github.com/microlink/microlink-function/blob/master/LICENSE.md) License.<br>
Authored and maintained by []() with help from [contributors](https://github.com/microlink/microlink-function/contributors).

> []() · GitHub [](https://github.com/microlink) · Twitter [@microlink](https://twitter.com/microlink)
