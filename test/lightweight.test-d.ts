import microlinkFn from '../lightweight'

/** definition */

{
  const fn = microlinkFn(({ page }) => page.title())
  const data = await fn('https://microlink.io', { meta: false })
  console.log(data.value)
  console.log(data.isFulfilled)
  console.log(data.isRejected)
}

/** interaction  */

microlinkFn(() => document.getElementsByTagName('*').length)
microlinkFn(({ page }) => page.title())
microlinkFn(() => 420)
microlinkFn(({ response }) => response.ok())
microlinkFn(({ name }) => `Greetings, ${name}`)
