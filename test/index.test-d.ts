import microlinkFn from '@microlink/function'

/** response shape */

{
  const fn = microlinkFn(({ page }) => page.title())
  const data = await fn('https://microlink.io', { meta: false })
  console.log(data.value)
  console.log(data.isFulfilled)
  console.log(data.profiling)
  console.log(data.logging)
}

/** discriminated union */

{
  const fn = microlinkFn(({ page }) => page.title())
  const data = await fn('https://microlink.io')
  if (data.isFulfilled) {
    const value: any = data.value
    console.log(value)
  } else {
    const name: string = data.value.name
    const message: string = data.value.message
    console.log(name, message)
  }
}

/** definition */

microlinkFn(() => document.getElementsByTagName('*').length)
microlinkFn(({ page }) => page.title())
microlinkFn(() => 420)
microlinkFn(({ response }) => response.ok())
microlinkFn(({ name }) => `Greetings, ${name}`)
