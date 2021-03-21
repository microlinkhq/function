<div align="center">
  <img src="https://i.imgur.com/1TiZk37.png">
</div>

**Microlink Function** runs remote JavaScript functions, with no compromises.

It has been designed for zero user friction: just write the function, and Microlink will do the rest.

Every time you run a **Microlink Function**, the code function will be compiled and ran in a safe V8 sandbox.

During the function execution, you own the request lifecycle. This means you can require a safe list of common NPM packages, and also you can interact with a built-in [browserless](https://browserless.js.org) instance associated with the request. Every request is unique and not shared between others.

Nothing to deploy or maintain. Just write and execute old fashioned functions.

## Highlights

- Run remote Javascript functions.
- Require most common NPM packages.
- Remote browser access in the same request cycle.
- No servers to maintain, no hidden cost or infrastructure complexity.

## Install

```bash
$ npm install @microlink/function --save
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
