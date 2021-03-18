<div align="center">
  <img src="https://cdn.microlink.io/logo/banner.png"">
</div>

> JavaScript runtime functions made simple.

## Install

```bash
$ npm install @microlink/function --save
```

## Usage

### Interact with the page

```js
const microlinkFunction = require('@microlink/function')

const fn = microlinkFunction(({ page }) => page.title())

const result = await fn('https://google.com')

console.log(result)
// {
//   isFulfilled: true,
//   isRejected: false,
//   value: 'Google'
// }
```

### Interact with the response

```js
const microlinkFunction = require('@microlink/function')

const fn = microlinkFunction(({ page }) => response.status())

const result = await fn('https://google.com')

console.log(result)
// {
//   isFulfilled: true,
//   isRejected: false,
//   value: 200
// }
```

### Interact with the query

```js
const microlinkFunction = require('@microlink/function')

const fn = microlinkFunction(({ query }) => query.greetings)

const result = await fn('https://google.com', { greetings: 'hello world' })

console.log(result)
// {
//   isFulfilled: true,
//   isRejected: false,
//   value: 'hello world'
// }
```

## API

### microlinkFunction(fn, [mqlOpts], [gotoOpts])

#### fn

*Required*<br>
Type: `string`

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
