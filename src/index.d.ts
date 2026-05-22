import { MqlOptions } from '@microlink/mql'
import { Page, HTTPResponse } from 'puppeteer-core'

export type FunctionProfiling = {
  phases?: {
    install?: number
    build?: number
    spawn?: number
    run?: number
    total?: number
  }
  cpu?: number
  memory?: number
  size?: number
}

export type FunctionFulfilled = {
  isFulfilled: true
  value: any
  profiling: FunctionProfiling
  logging: Record<string, unknown>
}

export type FunctionRejected = {
  isFulfilled: false
  value: {
    name: string
    message: string
    [key: string]: unknown
  }
  profiling: FunctionProfiling
  logging: Record<string, unknown>
}

export type FunctionResponse = FunctionFulfilled | FunctionRejected

export type FunctionInput = (args: {
  page: Page
  response: HTTPResponse
  [key: string]: any
}) => any

declare function microlinkFunction(
  fn: FunctionInput,
  mqlOpts?: MqlOptions,
  gotOpts?: object
): (
  url: string,
  mqlOpts?: MqlOptions,
  gotOpts?: object
) => Promise<FunctionResponse>

export default microlinkFunction
