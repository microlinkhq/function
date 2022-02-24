(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('url')) :
	typeof define === 'function' && define.amd ? define(['url'], factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.microlink = factory(global.require$$0$1));
})(this, (function (require$$0$1) { 'use strict';

	function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

	var require$$0__default = /*#__PURE__*/_interopDefaultLegacy(require$$0$1);

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function getAugmentedNamespace(n) {
		if (n.__esModule) return n;
		var a = Object.defineProperty({}, '__esModule', {value: true});
		Object.keys(n).forEach(function (k) {
			var d = Object.getOwnPropertyDescriptor(n, k);
			Object.defineProperty(a, k, d.get ? d : {
				enumerable: true,
				get: function () {
					return n[k];
				}
			});
		});
		return a;
	}

	const factory$2 = ({ mql, VERSION, toCompress }) => {
	  const microlink = (code, mqlOpts, gotOpts) => {
	    const compress = toCompress(code);

	    return async (url, opts) => {
	      const { data } = await mql(
	        url,
	        {
	          function: await compress,
	          meta: false,
	          ...mqlOpts,
	          ...opts
	        },
	        gotOpts
	      );

	      return data.function
	    }
	  };

	  microlink.version = VERSION;
	  microlink.mql = mql;

	  return microlink
	};

	var factory_1$1 = factory$2;

	const URL$1 = commonjsGlobal.window ? window.URL : require$$0__default["default"].URL;
	const REGEX_HTTP_PROTOCOL = /^https?:\/\//i;

	var lightweight = url => {
	  try {
	    return REGEX_HTTP_PROTOCOL.test(new URL$1(url).href)
	  } catch (err) {
	    return false
	  }
	};

	var dist = {};

	function iter(output, nullish, sep, val, key) {
		var k, pfx = key ? (key + sep) : key;

		if (val == null) {
			if (nullish) output[key] = val;
		} else if (typeof val != 'object') {
			output[key] = val;
		} else if (Array.isArray(val)) {
			for (k=0; k < val.length; k++) {
				iter(output, nullish, sep, val[k], pfx + k);
			}
		} else {
			for (k in val) {
				iter(output, nullish, sep, val[k], pfx + k);
			}
		}
	}

	function flattie(input, glue, toNull) {
		var output = {};
		if (typeof input == 'object') {
			iter(output, !!toNull, glue || '.', input, '');
		}
		return output;
	}

	dist.flattie = flattie;

	function encode(obj, pfx) {
		var k, i, tmp, str='';

		for (k in obj) {
			if ((tmp = obj[k]) !== void 0) {
				if (Array.isArray(tmp)) {
					for (i=0; i < tmp.length; i++) {
						str && (str += '&');
						str += encodeURIComponent(k) + '=' + encodeURIComponent(tmp[i]);
					}
				} else {
					str && (str += '&');
					str += encodeURIComponent(k) + '=' + encodeURIComponent(tmp);
				}
			}
		}

		return (pfx || '') + str;
	}

	function toValue(mix) {
		if (!mix) return '';
		var str = decodeURIComponent(mix);
		if (str === 'false') return false;
		if (str === 'true') return true;
		return (+str * 0 === 0) ? (+str) : str;
	}

	function decode(str) {
		var tmp, k, out={}, arr=str.split('&');

		while (tmp = arr.shift()) {
			tmp = tmp.split('=');
			k = tmp.shift();
			if (out[k] !== void 0) {
				out[k] = [].concat(out[k], toValue(tmp.shift()));
			} else {
				out[k] = toValue(tmp.shift());
			}
		}

		return out;
	}

	var qss_m = /*#__PURE__*/Object.freeze({
		__proto__: null,
		encode: encode,
		decode: decode
	});

	var require$$2 = /*@__PURE__*/getAugmentedNamespace(qss_m);

	var lib = {exports: {}};

	var _nodeResolve_empty = {};

	var _nodeResolve_empty$1 = /*#__PURE__*/Object.freeze({
		__proto__: null,
		'default': _nodeResolve_empty
	});

	var require$$0 = /*@__PURE__*/getAugmentedNamespace(_nodeResolve_empty$1);

	const os = require$$0;

	const extractPathRegex = /\s+at.*(?:\(|\s)(.*)\)?/;
	const pathRegex = /^(?:(?:(?:node|(?:internal\/[\w/]*|.*node_modules\/(?:babel-polyfill|pirates)\/.*)?\w+)\.js:\d+:\d+)|native)/;
	const homeDir = typeof os.homedir === 'undefined' ? '' : os.homedir();

	var cleanStack$1 = (stack, options) => {
		options = Object.assign({pretty: false}, options);

		return stack.replace(/\\/g, '/')
			.split('\n')
			.filter(line => {
				const pathMatches = line.match(extractPathRegex);
				if (pathMatches === null || !pathMatches[1]) {
					return true;
				}

				const match = pathMatches[1];

				// Electron
				if (
					match.includes('.app/Contents/Resources/electron.asar') ||
					match.includes('.app/Contents/Resources/default_app.asar')
				) {
					return false;
				}

				return !pathRegex.test(match);
			})
			.filter(line => line.trim() !== '')
			.map(line => {
				if (options.pretty) {
					return line.replace(extractPathRegex, (m, p1) => m.replace(p1, p1.replace(homeDir, '~')));
				}

				return line;
			})
			.join('\n');
	};

	const copyProperty = (to, from, property, ignoreNonConfigurable) => {
		// `Function#length` should reflect the parameters of `to` not `from` since we keep its body.
		// `Function#prototype` is non-writable and non-configurable so can never be modified.
		if (property === 'length' || property === 'prototype') {
			return;
		}

		const toDescriptor = Object.getOwnPropertyDescriptor(to, property);
		const fromDescriptor = Object.getOwnPropertyDescriptor(from, property);

		if (!canCopyProperty(toDescriptor, fromDescriptor) && ignoreNonConfigurable) {
			return;
		}

		Object.defineProperty(to, property, fromDescriptor);
	};

	// `Object.defineProperty()` throws if the property exists, is not configurable and either:
	//  - one its descriptors is changed
	//  - it is non-writable and its value is changed
	const canCopyProperty = function (toDescriptor, fromDescriptor) {
		return toDescriptor === undefined || toDescriptor.configurable || (
			toDescriptor.writable === fromDescriptor.writable &&
			toDescriptor.enumerable === fromDescriptor.enumerable &&
			toDescriptor.configurable === fromDescriptor.configurable &&
			(toDescriptor.writable || toDescriptor.value === fromDescriptor.value)
		);
	};

	const changePrototype = (to, from) => {
		const fromPrototype = Object.getPrototypeOf(from);
		if (fromPrototype === Object.getPrototypeOf(to)) {
			return;
		}

		Object.setPrototypeOf(to, fromPrototype);
	};

	const wrappedToString = (withName, fromBody) => `/* Wrapped ${withName}*/\n${fromBody}`;

	const toStringDescriptor = Object.getOwnPropertyDescriptor(Function.prototype, 'toString');
	const toStringName = Object.getOwnPropertyDescriptor(Function.prototype.toString, 'name');

	// We call `from.toString()` early (not lazily) to ensure `from` can be garbage collected.
	// We use `bind()` instead of a closure for the same reason.
	// Calling `from.toString()` early also allows caching it in case `to.toString()` is called several times.
	const changeToString = (to, from, name) => {
		const withName = name === '' ? '' : `with ${name.trim()}() `;
		const newToString = wrappedToString.bind(null, withName, from.toString());
		// Ensure `to.toString.toString` is non-enumerable and has the same `same`
		Object.defineProperty(newToString, 'name', toStringName);
		Object.defineProperty(to, 'toString', {...toStringDescriptor, value: newToString});
	};

	const mimicFn$2 = (to, from, {ignoreNonConfigurable = false} = {}) => {
		const {name} = to;

		for (const property of Reflect.ownKeys(from)) {
			copyProperty(to, from, property, ignoreNonConfigurable);
		}

		changePrototype(to, from);
		changeToString(to, from, name);

		return to;
	};

	var mimicFn_1 = mimicFn$2;

	var helpers = {
	  isFunction: obj => typeof obj === 'function',
	  isString: obj => typeof obj === 'string',
	  composeErrorMessage: (code, description) => `${code}, ${description}`,
	  inherits: (ctor, superCtor) => {
	    ctor.super_ = superCtor;
	    ctor.prototype = Object.create(superCtor.prototype, {
	      constructor: {
	        value: ctor,
	        enumerable: false,
	        writable: true,
	        configurable: true
	      }
	    });
	  }
	};

	const {isFunction, composeErrorMessage} = helpers;

	function interfaceObject (error, ...props) {
	  Object.assign(error, ...props);

	  error.description = isFunction(error.message) ? error.message(error) : error.message;

	  error.message = error.code
	   ? composeErrorMessage(error.code, error.description)
	   : error.description;
	}

	var addErrorProps$1 = interfaceObject;

	const cleanStack = cleanStack$1;
	const mimicFn$1 = mimicFn_1;

	const addErrorProps = addErrorProps$1;
	const {isString} = helpers;

	function createExtendError$1 (ErrorClass, classProps) {
	  function ExtendError (props) {
	    const error = new ErrorClass();
	    const errorProps = isString(props) ? {message: props} : props;
	    addErrorProps(error, classProps, errorProps);

	    error.stack = cleanStack(error.stack);
	    return error
	  }

	  ExtendError.prototype = ErrorClass.prototype;
	  mimicFn$1(ExtendError, ErrorClass);

	  return ExtendError
	}

	var createExtendError_1 = createExtendError$1;

	const {inherits} = helpers;
	const mimicFn = mimicFn_1;

	const REGEX_CLASS_NAME = /[^0-9a-zA-Z_$]/;

	function createError$1 (className) {
	  if (typeof className !== 'string') {
	    throw new TypeError('Expected className to be a string')
	  }

	  if (REGEX_CLASS_NAME.test(className)) {
	    throw new Error('className contains invalid characters')
	  }

	  function ErrorClass () {
	    Object.defineProperty(this, 'name', {
	      configurable: true,
	      value: className,
	      writable: true
	    });

	    Error.captureStackTrace(this, this.constructor);
	  }

	  inherits(ErrorClass, Error);
	  mimicFn(ErrorClass, Error);
	  return ErrorClass
	}

	var createError_1 = createError$1;

	const createExtendError = createExtendError_1;
	const createError = createError_1;

	const createErrorClass = ErrorClass => (className, props) => {
	  const errorClass = createError(className || ErrorClass.name);
	  return createExtendError(errorClass, props)
	};

	lib.exports = createErrorClass(Error);
	lib.exports.type = createErrorClass(TypeError);
	lib.exports.range = createErrorClass(RangeError);
	lib.exports.eval = createErrorClass(EvalError);
	lib.exports.syntax = createErrorClass(SyntaxError);
	lib.exports.reference = createErrorClass(ReferenceError);
	lib.exports.uri = createErrorClass(URIError);

	const ENDPOINT = {
	  FREE: 'https://api.microlink.io',
	  PRO: 'https://pro.microlink.io'
	};

	const isObject = input => input !== null && typeof input === 'object';

	const parseBody = (input, error, url) => {
	  try {
	    return JSON.parse(input)
	  } catch (_) {
	    const message = input || error.message;

	    return {
	      status: 'error',
	      data: { url: message },
	      more: 'https://microlink.io/efatalclient',
	      code: 'EFATALCLIENT',
	      message,
	      url
	    }
	  }
	};

	const factory$1 = ({
	  VERSION,
	  MicrolinkError,
	  isUrlHttp,
	  stringify,
	  got,
	  flatten
	}) => {
	  const assertUrl = (url = '') => {
	    if (!isUrlHttp(url)) {
	      const message = `The \`url\` as \`${url}\` is not valid. Ensure it has protocol (http or https) and hostname.`;
	      throw new MicrolinkError({
	        status: 'fail',
	        data: { url: message },
	        more: 'https://microlink.io/docs/api/api-parameters/url',
	        code: 'EINVALURLCLIENT',
	        message,
	        url
	      })
	    }
	  };

	  const mapRules = rules => {
	    if (!isObject(rules)) return
	    const flatRules = flatten(rules);
	    return Object.keys(flatRules).reduce((acc, key) => {
	      acc[`data.${key}`] = flatRules[key].toString();
	      return acc
	    }, {})
	  };

	  const fetchFromApi = async (apiUrl, opts = {}, retryCount = 0) => {
	    try {
	      const response = await got(apiUrl, opts);
	      return opts.responseType === 'buffer'
	        ? { body: response.body, response }
	        : { ...response.body, response }
	    } catch (err) {
	      const { response = {} } = err;
	      const { statusCode, body: rawBody, headers, url: uri = apiUrl } = response;
	      const isBuffer = Buffer.isBuffer(rawBody);

	      const body =
	        isObject(rawBody) && !isBuffer
	          ? rawBody
	          : parseBody(isBuffer ? rawBody.toString() : rawBody, err, uri);

	      if (body.code === 'EFATALCLIENT' && retryCount++ < 2) {
	        return fetchFromApi(apiUrl, opts, retryCount)
	      }

	      throw MicrolinkError({
	        ...body,
	        message: body.message,
	        url: uri,
	        statusCode,
	        headers
	      })
	    }
	  };

	  const getApiUrl = (
	    url,
	    { data, apiKey, endpoint, retry, cache, ...opts } = {},
	    { responseType = 'json', headers: gotHeaders, ...gotOpts } = {}
	  ) => {
	    const isPro = !!apiKey;
	    const apiEndpoint = endpoint || ENDPOINT[isPro ? 'PRO' : 'FREE'];

	    const apiUrl = `${apiEndpoint}?${stringify({
      url,
      ...mapRules(data),
      ...flatten(opts)
    })}`;

	    const headers = isPro
	      ? { ...gotHeaders, 'x-api-key': apiKey }
	      : { ...gotHeaders };
	    return [apiUrl, { ...gotOpts, responseType, cache, retry, headers }]
	  };

	  const createMql = defaultOpts => async (url, opts, gotOpts) => {
	    assertUrl(url);
	    const [apiUrl, fetchOpts] = getApiUrl(url, opts, {
	      ...defaultOpts,
	      ...gotOpts
	    });
	    return fetchFromApi(apiUrl, fetchOpts)
	  };

	  const mql = createMql();
	  mql.MicrolinkError = MicrolinkError;
	  mql.getApiUrl = getApiUrl;
	  mql.fetchFromApi = fetchFromApi;
	  mql.mapRules = mapRules;
	  mql.version = VERSION;
	  mql.stream = got.stream;
	  mql.buffer = createMql({ responseType: 'buffer' });

	  return mql
	};

	var factory_1 = factory$1;

	var ky$1 = {exports: {}};

	(function (module, exports) {
	(function (global, factory) {
	    factory(exports) ;
	})(commonjsGlobal, (function (exports) {
	    // eslint-lint-disable-next-line @typescript-eslint/naming-convention
	    class HTTPError extends Error {
	        constructor(response, request, options) {
	            const code = (response.status || response.status === 0) ? response.status : '';
	            const title = response.statusText || '';
	            const status = `${code} ${title}`.trim();
	            const reason = status ? `status code ${status}` : 'an unknown error';
	            super(`Request failed with ${reason}`);
	            this.name = 'HTTPError';
	            this.response = response;
	            this.request = request;
	            this.options = options;
	        }
	    }

	    class TimeoutError extends Error {
	        constructor(request) {
	            super('Request timed out');
	            this.name = 'TimeoutError';
	            this.request = request;
	        }
	    }

	    // eslint-disable-next-line @typescript-eslint/ban-types
	    const isObject = (value) => value !== null && typeof value === 'object';

	    const validateAndMerge = (...sources) => {
	        for (const source of sources) {
	            if ((!isObject(source) || Array.isArray(source)) && typeof source !== 'undefined') {
	                throw new TypeError('The `options` argument must be an object');
	            }
	        }
	        return deepMerge({}, ...sources);
	    };
	    const mergeHeaders = (source1 = {}, source2 = {}) => {
	        const result = new globalThis.Headers(source1);
	        const isHeadersInstance = source2 instanceof globalThis.Headers;
	        const source = new globalThis.Headers(source2);
	        for (const [key, value] of source.entries()) {
	            if ((isHeadersInstance && value === 'undefined') || value === undefined) {
	                result.delete(key);
	            }
	            else {
	                result.set(key, value);
	            }
	        }
	        return result;
	    };
	    // TODO: Make this strongly-typed (no `any`).
	    const deepMerge = (...sources) => {
	        let returnValue = {};
	        let headers = {};
	        for (const source of sources) {
	            if (Array.isArray(source)) {
	                if (!Array.isArray(returnValue)) {
	                    returnValue = [];
	                }
	                returnValue = [...returnValue, ...source];
	            }
	            else if (isObject(source)) {
	                for (let [key, value] of Object.entries(source)) {
	                    if (isObject(value) && key in returnValue) {
	                        value = deepMerge(returnValue[key], value);
	                    }
	                    returnValue = { ...returnValue, [key]: value };
	                }
	                if (isObject(source.headers)) {
	                    headers = mergeHeaders(headers, source.headers);
	                    returnValue.headers = headers;
	                }
	            }
	        }
	        return returnValue;
	    };

	    const supportsAbortController = typeof globalThis.AbortController === 'function';
	    const supportsStreams = typeof globalThis.ReadableStream === 'function';
	    const supportsFormData = typeof globalThis.FormData === 'function';
	    const requestMethods = ['get', 'post', 'put', 'patch', 'head', 'delete'];
	    const responseTypes = {
	        json: 'application/json',
	        text: 'text/*',
	        formData: 'multipart/form-data',
	        arrayBuffer: '*/*',
	        blob: '*/*',
	    };
	    // The maximum value of a 32bit int (see issue #117)
	    const maxSafeTimeout = 2147483647;
	    const stop = Symbol('stop');

	    const normalizeRequestMethod = (input) => requestMethods.includes(input) ? input.toUpperCase() : input;
	    const retryMethods = ['get', 'put', 'head', 'delete', 'options', 'trace'];
	    const retryStatusCodes = [408, 413, 429, 500, 502, 503, 504];
	    const retryAfterStatusCodes = [413, 429, 503];
	    const defaultRetryOptions = {
	        limit: 2,
	        methods: retryMethods,
	        statusCodes: retryStatusCodes,
	        afterStatusCodes: retryAfterStatusCodes,
	        maxRetryAfter: Number.POSITIVE_INFINITY,
	    };
	    const normalizeRetryOptions = (retry = {}) => {
	        if (typeof retry === 'number') {
	            return {
	                ...defaultRetryOptions,
	                limit: retry,
	            };
	        }
	        if (retry.methods && !Array.isArray(retry.methods)) {
	            throw new Error('retry.methods must be an array');
	        }
	        if (retry.statusCodes && !Array.isArray(retry.statusCodes)) {
	            throw new Error('retry.statusCodes must be an array');
	        }
	        return {
	            ...defaultRetryOptions,
	            ...retry,
	            afterStatusCodes: retryAfterStatusCodes,
	        };
	    };

	    // `Promise.race()` workaround (#91)
	    const timeout = async (request, abortController, options) => new Promise((resolve, reject) => {
	        const timeoutId = setTimeout(() => {
	            if (abortController) {
	                abortController.abort();
	            }
	            reject(new TimeoutError(request));
	        }, options.timeout);
	        /* eslint-disable promise/prefer-await-to-then */
	        void options
	            .fetch(request)
	            .then(resolve)
	            .catch(reject)
	            .then(() => {
	            clearTimeout(timeoutId);
	        });
	        /* eslint-enable promise/prefer-await-to-then */
	    });
	    const delay = async (ms) => new Promise(resolve => {
	        setTimeout(resolve, ms);
	    });

	    class Ky {
	        // eslint-disable-next-line complexity
	        constructor(input, options = {}) {
	            var _a, _b;
	            this._retryCount = 0;
	            this._input = input;
	            this._options = {
	                // TODO: credentials can be removed when the spec change is implemented in all browsers. Context: https://www.chromestatus.com/feature/4539473312350208
	                credentials: this._input.credentials || 'same-origin',
	                ...options,
	                headers: mergeHeaders(this._input.headers, options.headers),
	                hooks: deepMerge({
	                    beforeRequest: [],
	                    beforeRetry: [],
	                    afterResponse: [],
	                }, options.hooks),
	                method: normalizeRequestMethod((_a = options.method) !== null && _a !== void 0 ? _a : this._input.method),
	                // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
	                prefixUrl: String(options.prefixUrl || ''),
	                retry: normalizeRetryOptions(options.retry),
	                throwHttpErrors: options.throwHttpErrors !== false,
	                timeout: typeof options.timeout === 'undefined' ? 10000 : options.timeout,
	                fetch: (_b = options.fetch) !== null && _b !== void 0 ? _b : globalThis.fetch.bind(globalThis),
	            };
	            if (typeof this._input !== 'string' && !(this._input instanceof URL || this._input instanceof globalThis.Request)) {
	                throw new TypeError('`input` must be a string, URL, or Request');
	            }
	            if (this._options.prefixUrl && typeof this._input === 'string') {
	                if (this._input.startsWith('/')) {
	                    throw new Error('`input` must not begin with a slash when using `prefixUrl`');
	                }
	                if (!this._options.prefixUrl.endsWith('/')) {
	                    this._options.prefixUrl += '/';
	                }
	                this._input = this._options.prefixUrl + this._input;
	            }
	            if (supportsAbortController) {
	                this.abortController = new globalThis.AbortController();
	                if (this._options.signal) {
	                    this._options.signal.addEventListener('abort', () => {
	                        this.abortController.abort();
	                    });
	                }
	                this._options.signal = this.abortController.signal;
	            }
	            this.request = new globalThis.Request(this._input, this._options);
	            if (this._options.searchParams) {
	                // eslint-disable-next-line unicorn/prevent-abbreviations
	                const textSearchParams = typeof this._options.searchParams === 'string'
	                    ? this._options.searchParams.replace(/^\?/, '')
	                    : new URLSearchParams(this._options.searchParams).toString();
	                // eslint-disable-next-line unicorn/prevent-abbreviations
	                const searchParams = '?' + textSearchParams;
	                const url = this.request.url.replace(/(?:\?.*?)?(?=#|$)/, searchParams);
	                // To provide correct form boundary, Content-Type header should be deleted each time when new Request instantiated from another one
	                if (((supportsFormData && this._options.body instanceof globalThis.FormData)
	                    || this._options.body instanceof URLSearchParams) && !(this._options.headers && this._options.headers['content-type'])) {
	                    this.request.headers.delete('content-type');
	                }
	                this.request = new globalThis.Request(new globalThis.Request(url, this.request), this._options);
	            }
	            if (this._options.json !== undefined) {
	                this._options.body = JSON.stringify(this._options.json);
	                this.request.headers.set('content-type', 'application/json');
	                this.request = new globalThis.Request(this.request, { body: this._options.body });
	            }
	        }
	        // eslint-disable-next-line @typescript-eslint/promise-function-async
	        static create(input, options) {
	            const ky = new Ky(input, options);
	            const fn = async () => {
	                if (ky._options.timeout > maxSafeTimeout) {
	                    throw new RangeError(`The \`timeout\` option cannot be greater than ${maxSafeTimeout}`);
	                }
	                // Delay the fetch so that body method shortcuts can set the Accept header
	                await Promise.resolve();
	                let response = await ky._fetch();
	                for (const hook of ky._options.hooks.afterResponse) {
	                    // eslint-disable-next-line no-await-in-loop
	                    const modifiedResponse = await hook(ky.request, ky._options, ky._decorateResponse(response.clone()));
	                    if (modifiedResponse instanceof globalThis.Response) {
	                        response = modifiedResponse;
	                    }
	                }
	                ky._decorateResponse(response);
	                if (!response.ok && ky._options.throwHttpErrors) {
	                    throw new HTTPError(response, ky.request, ky._options);
	                }
	                // If `onDownloadProgress` is passed, it uses the stream API internally
	                /* istanbul ignore next */
	                if (ky._options.onDownloadProgress) {
	                    if (typeof ky._options.onDownloadProgress !== 'function') {
	                        throw new TypeError('The `onDownloadProgress` option must be a function');
	                    }
	                    if (!supportsStreams) {
	                        throw new Error('Streams are not supported in your environment. `ReadableStream` is missing.');
	                    }
	                    return ky._stream(response.clone(), ky._options.onDownloadProgress);
	                }
	                return response;
	            };
	            const isRetriableMethod = ky._options.retry.methods.includes(ky.request.method.toLowerCase());
	            const result = (isRetriableMethod ? ky._retry(fn) : fn());
	            for (const [type, mimeType] of Object.entries(responseTypes)) {
	                result[type] = async () => {
	                    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
	                    ky.request.headers.set('accept', ky.request.headers.get('accept') || mimeType);
	                    const response = (await result).clone();
	                    if (type === 'json') {
	                        if (response.status === 204) {
	                            return '';
	                        }
	                        if (options.parseJson) {
	                            return options.parseJson(await response.text());
	                        }
	                    }
	                    return response[type]();
	                };
	            }
	            return result;
	        }
	        _calculateRetryDelay(error) {
	            this._retryCount++;
	            if (this._retryCount < this._options.retry.limit && !(error instanceof TimeoutError)) {
	                if (error instanceof HTTPError) {
	                    if (!this._options.retry.statusCodes.includes(error.response.status)) {
	                        return 0;
	                    }
	                    const retryAfter = error.response.headers.get('Retry-After');
	                    if (retryAfter && this._options.retry.afterStatusCodes.includes(error.response.status)) {
	                        let after = Number(retryAfter);
	                        if (Number.isNaN(after)) {
	                            after = Date.parse(retryAfter) - Date.now();
	                        }
	                        else {
	                            after *= 1000;
	                        }
	                        if (typeof this._options.retry.maxRetryAfter !== 'undefined' && after > this._options.retry.maxRetryAfter) {
	                            return 0;
	                        }
	                        return after;
	                    }
	                    if (error.response.status === 413) {
	                        return 0;
	                    }
	                }
	                const BACKOFF_FACTOR = 0.3;
	                return BACKOFF_FACTOR * (2 ** (this._retryCount - 1)) * 1000;
	            }
	            return 0;
	        }
	        _decorateResponse(response) {
	            if (this._options.parseJson) {
	                response.json = async () => this._options.parseJson(await response.text());
	            }
	            return response;
	        }
	        async _retry(fn) {
	            try {
	                return await fn();
	                // eslint-disable-next-line @typescript-eslint/no-implicit-any-catch
	            }
	            catch (error) {
	                const ms = Math.min(this._calculateRetryDelay(error), maxSafeTimeout);
	                if (ms !== 0 && this._retryCount > 0) {
	                    await delay(ms);
	                    for (const hook of this._options.hooks.beforeRetry) {
	                        // eslint-disable-next-line no-await-in-loop
	                        const hookResult = await hook({
	                            request: this.request,
	                            options: this._options,
	                            error: error,
	                            retryCount: this._retryCount,
	                        });
	                        // If `stop` is returned from the hook, the retry process is stopped
	                        if (hookResult === stop) {
	                            return;
	                        }
	                    }
	                    return this._retry(fn);
	                }
	                throw error;
	            }
	        }
	        async _fetch() {
	            for (const hook of this._options.hooks.beforeRequest) {
	                // eslint-disable-next-line no-await-in-loop
	                const result = await hook(this.request, this._options);
	                if (result instanceof Request) {
	                    this.request = result;
	                    break;
	                }
	                if (result instanceof Response) {
	                    return result;
	                }
	            }
	            if (this._options.timeout === false) {
	                return this._options.fetch(this.request.clone());
	            }
	            return timeout(this.request.clone(), this.abortController, this._options);
	        }
	        /* istanbul ignore next */
	        _stream(response, onDownloadProgress) {
	            const totalBytes = Number(response.headers.get('content-length')) || 0;
	            let transferredBytes = 0;
	            return new globalThis.Response(new globalThis.ReadableStream({
	                async start(controller) {
	                    const reader = response.body.getReader();
	                    if (onDownloadProgress) {
	                        onDownloadProgress({ percent: 0, transferredBytes: 0, totalBytes }, new Uint8Array());
	                    }
	                    async function read() {
	                        const { done, value } = await reader.read();
	                        if (done) {
	                            controller.close();
	                            return;
	                        }
	                        if (onDownloadProgress) {
	                            transferredBytes += value.byteLength;
	                            const percent = totalBytes === 0 ? 0 : transferredBytes / totalBytes;
	                            onDownloadProgress({ percent, transferredBytes, totalBytes }, value);
	                        }
	                        controller.enqueue(value);
	                        await read();
	                    }
	                    await read();
	                },
	            }));
	        }
	    }

	    /*! MIT License © Sindre Sorhus */
	    const createInstance = (defaults) => {
	        // eslint-disable-next-line @typescript-eslint/promise-function-async
	        const ky = (input, options) => Ky.create(input, validateAndMerge(defaults, options));
	        for (const method of requestMethods) {
	            // eslint-disable-next-line @typescript-eslint/promise-function-async
	            ky[method] = (input, options) => Ky.create(input, validateAndMerge(defaults, options, { method }));
	        }
	        ky.create = (newDefaults) => createInstance(validateAndMerge(newDefaults));
	        ky.extend = (newDefaults) => createInstance(validateAndMerge(defaults, newDefaults));
	        ky.stop = stop;
	        return ky;
	    };
	    const ky = createInstance();

	    exports.HTTPError = HTTPError;
	    exports.TimeoutError = TimeoutError;
	    exports["default"] = ky;

	    Object.defineProperty(exports, '__esModule', { value: true });

	}));
	}(ky$1, ky$1.exports));

	const isUrlHttp = lightweight;
	const { flattie: flatten } = dist;
	const { encode: stringify } = require$$2;
	const whoops = lib.exports;

	const factory = factory_1;
	const { default: ky } = ky$1.exports;

	const MicrolinkError = whoops('MicrolinkError');

	const got = async (url, opts) => {
	  try {
	    if (opts.timeout === undefined) opts.timeout = false;
	    const response = await ky(url, opts);
	    const body = await response.json();
	    const { headers, status: statusCode, statusText: statusMessage } = response;
	    return { url: response.url, body, headers, statusCode, statusMessage }
	  } catch (err) {
	    if (err.response) {
	      const { response } = err;
	      err.response = {
	        ...response,
	        headers: Array.from(response.headers.entries()).reduce(
	          (acc, [key, value]) => {
	            acc[key] = value;
	            return acc
	          },
	          {}
	        ),
	        statusCode: response.status,
	        body: await response.text()
	      };
	    }
	    throw err
	  }
	};

	var browser$1 = factory({
	  MicrolinkError,
	  isUrlHttp,
	  stringify,
	  got,
	  flatten,
	  VERSION: '0.10.15'
	});

	var browser = factory_1$1({
	  mql: browser$1,
	  toCompress: code => code.toString(),
	  VERSION: '0.1.2'
	});

	return browser;

}));
//# sourceMappingURL=microlink-function.js.map
