import { MqlOptions } from '@microlink/mql'
import { Page, HTTPResponse } from 'puppeteer-core'

export type FunctionResponse = {
  isFulfilled: true,
  isRejected: false,
  value: any
}

export type FunctionArgs = {
  page: object;
  response: object;
  url: string;
}

export type FunctionInput = (args: {
  page: Page;
  response: HTTPResponse;
  [key: string]: any;
}) => any;


declare function microlinkFunction(
  fn: FunctionInput,
  mqlOpts?: MqlOptions,
  gotOpts?: object
): (
  url: string,
  mqlOpts?: MqlOptions,
  gotOpts?: object
) => Promise<FunctionResponse>;

export default microlinkFunction;
