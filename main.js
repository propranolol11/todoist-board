'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var obsidian = require('obsidian');

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function getAugmentedNamespace(n) {
  if (Object.prototype.hasOwnProperty.call(n, '__esModule')) return n;
  var f = n.default;
	if (typeof f == "function") {
		var a = function a () {
			var isInstance = false;
      try {
        isInstance = this instanceof a;
      } catch {}
			if (isInstance) {
        return Reflect.construct(f, arguments, this.constructor);
			}
			return f.apply(this, arguments);
		};
		a.prototype = f.prototype;
  } else a = {};
  Object.defineProperty(a, '__esModule', {value: true});
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

var dist = {};

var TodoistApi = {};

var restClient = {};

/*! Axios v1.10.0 Copyright (c) 2025 Matt Zabriskie and contributors */

var axios_1;
var hasRequiredAxios;

function requireAxios () {
	if (hasRequiredAxios) return axios_1;
	hasRequiredAxios = 1;

	function bind(fn, thisArg) {
	  return function wrap() {
	    return fn.apply(thisArg, arguments);
	  };
	}

	// utils is a library of generic helper functions non-specific to axios

	const {toString} = Object.prototype;
	const {getPrototypeOf} = Object;
	const {iterator, toStringTag} = Symbol;

	const kindOf = (cache => thing => {
	    const str = toString.call(thing);
	    return cache[str] || (cache[str] = str.slice(8, -1).toLowerCase());
	})(Object.create(null));

	const kindOfTest = (type) => {
	  type = type.toLowerCase();
	  return (thing) => kindOf(thing) === type
	};

	const typeOfTest = type => thing => typeof thing === type;

	/**
	 * Determine if a value is an Array
	 *
	 * @param {Object} val The value to test
	 *
	 * @returns {boolean} True if value is an Array, otherwise false
	 */
	const {isArray} = Array;

	/**
	 * Determine if a value is undefined
	 *
	 * @param {*} val The value to test
	 *
	 * @returns {boolean} True if the value is undefined, otherwise false
	 */
	const isUndefined = typeOfTest('undefined');

	/**
	 * Determine if a value is a Buffer
	 *
	 * @param {*} val The value to test
	 *
	 * @returns {boolean} True if value is a Buffer, otherwise false
	 */
	function isBuffer(val) {
	  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
	    && isFunction(val.constructor.isBuffer) && val.constructor.isBuffer(val);
	}

	/**
	 * Determine if a value is an ArrayBuffer
	 *
	 * @param {*} val The value to test
	 *
	 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
	 */
	const isArrayBuffer = kindOfTest('ArrayBuffer');


	/**
	 * Determine if a value is a view on an ArrayBuffer
	 *
	 * @param {*} val The value to test
	 *
	 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
	 */
	function isArrayBufferView(val) {
	  let result;
	  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
	    result = ArrayBuffer.isView(val);
	  } else {
	    result = (val) && (val.buffer) && (isArrayBuffer(val.buffer));
	  }
	  return result;
	}

	/**
	 * Determine if a value is a String
	 *
	 * @param {*} val The value to test
	 *
	 * @returns {boolean} True if value is a String, otherwise false
	 */
	const isString = typeOfTest('string');

	/**
	 * Determine if a value is a Function
	 *
	 * @param {*} val The value to test
	 * @returns {boolean} True if value is a Function, otherwise false
	 */
	const isFunction = typeOfTest('function');

	/**
	 * Determine if a value is a Number
	 *
	 * @param {*} val The value to test
	 *
	 * @returns {boolean} True if value is a Number, otherwise false
	 */
	const isNumber = typeOfTest('number');

	/**
	 * Determine if a value is an Object
	 *
	 * @param {*} thing The value to test
	 *
	 * @returns {boolean} True if value is an Object, otherwise false
	 */
	const isObject = (thing) => thing !== null && typeof thing === 'object';

	/**
	 * Determine if a value is a Boolean
	 *
	 * @param {*} thing The value to test
	 * @returns {boolean} True if value is a Boolean, otherwise false
	 */
	const isBoolean = thing => thing === true || thing === false;

	/**
	 * Determine if a value is a plain Object
	 *
	 * @param {*} val The value to test
	 *
	 * @returns {boolean} True if value is a plain Object, otherwise false
	 */
	const isPlainObject = (val) => {
	  if (kindOf(val) !== 'object') {
	    return false;
	  }

	  const prototype = getPrototypeOf(val);
	  return (prototype === null || prototype === Object.prototype || Object.getPrototypeOf(prototype) === null) && !(toStringTag in val) && !(iterator in val);
	};

	/**
	 * Determine if a value is a Date
	 *
	 * @param {*} val The value to test
	 *
	 * @returns {boolean} True if value is a Date, otherwise false
	 */
	const isDate = kindOfTest('Date');

	/**
	 * Determine if a value is a File
	 *
	 * @param {*} val The value to test
	 *
	 * @returns {boolean} True if value is a File, otherwise false
	 */
	const isFile = kindOfTest('File');

	/**
	 * Determine if a value is a Blob
	 *
	 * @param {*} val The value to test
	 *
	 * @returns {boolean} True if value is a Blob, otherwise false
	 */
	const isBlob = kindOfTest('Blob');

	/**
	 * Determine if a value is a FileList
	 *
	 * @param {*} val The value to test
	 *
	 * @returns {boolean} True if value is a File, otherwise false
	 */
	const isFileList = kindOfTest('FileList');

	/**
	 * Determine if a value is a Stream
	 *
	 * @param {*} val The value to test
	 *
	 * @returns {boolean} True if value is a Stream, otherwise false
	 */
	const isStream = (val) => isObject(val) && isFunction(val.pipe);

	/**
	 * Determine if a value is a FormData
	 *
	 * @param {*} thing The value to test
	 *
	 * @returns {boolean} True if value is an FormData, otherwise false
	 */
	const isFormData = (thing) => {
	  let kind;
	  return thing && (
	    (typeof FormData === 'function' && thing instanceof FormData) || (
	      isFunction(thing.append) && (
	        (kind = kindOf(thing)) === 'formdata' ||
	        // detect form-data instance
	        (kind === 'object' && isFunction(thing.toString) && thing.toString() === '[object FormData]')
	      )
	    )
	  )
	};

	/**
	 * Determine if a value is a URLSearchParams object
	 *
	 * @param {*} val The value to test
	 *
	 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
	 */
	const isURLSearchParams = kindOfTest('URLSearchParams');

	const [isReadableStream, isRequest, isResponse, isHeaders] = ['ReadableStream', 'Request', 'Response', 'Headers'].map(kindOfTest);

	/**
	 * Trim excess whitespace off the beginning and end of a string
	 *
	 * @param {String} str The String to trim
	 *
	 * @returns {String} The String freed of excess whitespace
	 */
	const trim = (str) => str.trim ?
	  str.trim() : str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');

	/**
	 * Iterate over an Array or an Object invoking a function for each item.
	 *
	 * If `obj` is an Array callback will be called passing
	 * the value, index, and complete array for each item.
	 *
	 * If 'obj' is an Object callback will be called passing
	 * the value, key, and complete object for each property.
	 *
	 * @param {Object|Array} obj The object to iterate
	 * @param {Function} fn The callback to invoke for each item
	 *
	 * @param {Boolean} [allOwnKeys = false]
	 * @returns {any}
	 */
	function forEach(obj, fn, {allOwnKeys = false} = {}) {
	  // Don't bother if no value provided
	  if (obj === null || typeof obj === 'undefined') {
	    return;
	  }

	  let i;
	  let l;

	  // Force an array if not already something iterable
	  if (typeof obj !== 'object') {
	    /*eslint no-param-reassign:0*/
	    obj = [obj];
	  }

	  if (isArray(obj)) {
	    // Iterate over array values
	    for (i = 0, l = obj.length; i < l; i++) {
	      fn.call(null, obj[i], i, obj);
	    }
	  } else {
	    // Iterate over object keys
	    const keys = allOwnKeys ? Object.getOwnPropertyNames(obj) : Object.keys(obj);
	    const len = keys.length;
	    let key;

	    for (i = 0; i < len; i++) {
	      key = keys[i];
	      fn.call(null, obj[key], key, obj);
	    }
	  }
	}

	function findKey(obj, key) {
	  key = key.toLowerCase();
	  const keys = Object.keys(obj);
	  let i = keys.length;
	  let _key;
	  while (i-- > 0) {
	    _key = keys[i];
	    if (key === _key.toLowerCase()) {
	      return _key;
	    }
	  }
	  return null;
	}

	const _global = (() => {
	  /*eslint no-undef:0*/
	  if (typeof globalThis !== "undefined") return globalThis;
	  return typeof self !== "undefined" ? self : (typeof window !== 'undefined' ? window : commonjsGlobal)
	})();

	const isContextDefined = (context) => !isUndefined(context) && context !== _global;

	/**
	 * Accepts varargs expecting each argument to be an object, then
	 * immutably merges the properties of each object and returns result.
	 *
	 * When multiple objects contain the same key the later object in
	 * the arguments list will take precedence.
	 *
	 * Example:
	 *
	 * ```js
	 * var result = merge({foo: 123}, {foo: 456});
	 * console.log(result.foo); // outputs 456
	 * ```
	 *
	 * @param {Object} obj1 Object to merge
	 *
	 * @returns {Object} Result of all merge properties
	 */
	function merge(/* obj1, obj2, obj3, ... */) {
	  const {caseless} = isContextDefined(this) && this || {};
	  const result = {};
	  const assignValue = (val, key) => {
	    const targetKey = caseless && findKey(result, key) || key;
	    if (isPlainObject(result[targetKey]) && isPlainObject(val)) {
	      result[targetKey] = merge(result[targetKey], val);
	    } else if (isPlainObject(val)) {
	      result[targetKey] = merge({}, val);
	    } else if (isArray(val)) {
	      result[targetKey] = val.slice();
	    } else {
	      result[targetKey] = val;
	    }
	  };

	  for (let i = 0, l = arguments.length; i < l; i++) {
	    arguments[i] && forEach(arguments[i], assignValue);
	  }
	  return result;
	}

	/**
	 * Extends object a by mutably adding to it the properties of object b.
	 *
	 * @param {Object} a The object to be extended
	 * @param {Object} b The object to copy properties from
	 * @param {Object} thisArg The object to bind function to
	 *
	 * @param {Boolean} [allOwnKeys]
	 * @returns {Object} The resulting value of object a
	 */
	const extend = (a, b, thisArg, {allOwnKeys}= {}) => {
	  forEach(b, (val, key) => {
	    if (thisArg && isFunction(val)) {
	      a[key] = bind(val, thisArg);
	    } else {
	      a[key] = val;
	    }
	  }, {allOwnKeys});
	  return a;
	};

	/**
	 * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
	 *
	 * @param {string} content with BOM
	 *
	 * @returns {string} content value without BOM
	 */
	const stripBOM = (content) => {
	  if (content.charCodeAt(0) === 0xFEFF) {
	    content = content.slice(1);
	  }
	  return content;
	};

	/**
	 * Inherit the prototype methods from one constructor into another
	 * @param {function} constructor
	 * @param {function} superConstructor
	 * @param {object} [props]
	 * @param {object} [descriptors]
	 *
	 * @returns {void}
	 */
	const inherits = (constructor, superConstructor, props, descriptors) => {
	  constructor.prototype = Object.create(superConstructor.prototype, descriptors);
	  constructor.prototype.constructor = constructor;
	  Object.defineProperty(constructor, 'super', {
	    value: superConstructor.prototype
	  });
	  props && Object.assign(constructor.prototype, props);
	};

	/**
	 * Resolve object with deep prototype chain to a flat object
	 * @param {Object} sourceObj source object
	 * @param {Object} [destObj]
	 * @param {Function|Boolean} [filter]
	 * @param {Function} [propFilter]
	 *
	 * @returns {Object}
	 */
	const toFlatObject = (sourceObj, destObj, filter, propFilter) => {
	  let props;
	  let i;
	  let prop;
	  const merged = {};

	  destObj = destObj || {};
	  // eslint-disable-next-line no-eq-null,eqeqeq
	  if (sourceObj == null) return destObj;

	  do {
	    props = Object.getOwnPropertyNames(sourceObj);
	    i = props.length;
	    while (i-- > 0) {
	      prop = props[i];
	      if ((!propFilter || propFilter(prop, sourceObj, destObj)) && !merged[prop]) {
	        destObj[prop] = sourceObj[prop];
	        merged[prop] = true;
	      }
	    }
	    sourceObj = filter !== false && getPrototypeOf(sourceObj);
	  } while (sourceObj && (!filter || filter(sourceObj, destObj)) && sourceObj !== Object.prototype);

	  return destObj;
	};

	/**
	 * Determines whether a string ends with the characters of a specified string
	 *
	 * @param {String} str
	 * @param {String} searchString
	 * @param {Number} [position= 0]
	 *
	 * @returns {boolean}
	 */
	const endsWith = (str, searchString, position) => {
	  str = String(str);
	  if (position === undefined || position > str.length) {
	    position = str.length;
	  }
	  position -= searchString.length;
	  const lastIndex = str.indexOf(searchString, position);
	  return lastIndex !== -1 && lastIndex === position;
	};


	/**
	 * Returns new array from array like object or null if failed
	 *
	 * @param {*} [thing]
	 *
	 * @returns {?Array}
	 */
	const toArray = (thing) => {
	  if (!thing) return null;
	  if (isArray(thing)) return thing;
	  let i = thing.length;
	  if (!isNumber(i)) return null;
	  const arr = new Array(i);
	  while (i-- > 0) {
	    arr[i] = thing[i];
	  }
	  return arr;
	};

	/**
	 * Checking if the Uint8Array exists and if it does, it returns a function that checks if the
	 * thing passed in is an instance of Uint8Array
	 *
	 * @param {TypedArray}
	 *
	 * @returns {Array}
	 */
	// eslint-disable-next-line func-names
	const isTypedArray = (TypedArray => {
	  // eslint-disable-next-line func-names
	  return thing => {
	    return TypedArray && thing instanceof TypedArray;
	  };
	})(typeof Uint8Array !== 'undefined' && getPrototypeOf(Uint8Array));

	/**
	 * For each entry in the object, call the function with the key and value.
	 *
	 * @param {Object<any, any>} obj - The object to iterate over.
	 * @param {Function} fn - The function to call for each entry.
	 *
	 * @returns {void}
	 */
	const forEachEntry = (obj, fn) => {
	  const generator = obj && obj[iterator];

	  const _iterator = generator.call(obj);

	  let result;

	  while ((result = _iterator.next()) && !result.done) {
	    const pair = result.value;
	    fn.call(obj, pair[0], pair[1]);
	  }
	};

	/**
	 * It takes a regular expression and a string, and returns an array of all the matches
	 *
	 * @param {string} regExp - The regular expression to match against.
	 * @param {string} str - The string to search.
	 *
	 * @returns {Array<boolean>}
	 */
	const matchAll = (regExp, str) => {
	  let matches;
	  const arr = [];

	  while ((matches = regExp.exec(str)) !== null) {
	    arr.push(matches);
	  }

	  return arr;
	};

	/* Checking if the kindOfTest function returns true when passed an HTMLFormElement. */
	const isHTMLForm = kindOfTest('HTMLFormElement');

	const toCamelCase = str => {
	  return str.toLowerCase().replace(/[-_\s]([a-z\d])(\w*)/g,
	    function replacer(m, p1, p2) {
	      return p1.toUpperCase() + p2;
	    }
	  );
	};

	/* Creating a function that will check if an object has a property. */
	const hasOwnProperty = (({hasOwnProperty}) => (obj, prop) => hasOwnProperty.call(obj, prop))(Object.prototype);

	/**
	 * Determine if a value is a RegExp object
	 *
	 * @param {*} val The value to test
	 *
	 * @returns {boolean} True if value is a RegExp object, otherwise false
	 */
	const isRegExp = kindOfTest('RegExp');

	const reduceDescriptors = (obj, reducer) => {
	  const descriptors = Object.getOwnPropertyDescriptors(obj);
	  const reducedDescriptors = {};

	  forEach(descriptors, (descriptor, name) => {
	    let ret;
	    if ((ret = reducer(descriptor, name, obj)) !== false) {
	      reducedDescriptors[name] = ret || descriptor;
	    }
	  });

	  Object.defineProperties(obj, reducedDescriptors);
	};

	/**
	 * Makes all methods read-only
	 * @param {Object} obj
	 */

	const freezeMethods = (obj) => {
	  reduceDescriptors(obj, (descriptor, name) => {
	    // skip restricted props in strict mode
	    if (isFunction(obj) && ['arguments', 'caller', 'callee'].indexOf(name) !== -1) {
	      return false;
	    }

	    const value = obj[name];

	    if (!isFunction(value)) return;

	    descriptor.enumerable = false;

	    if ('writable' in descriptor) {
	      descriptor.writable = false;
	      return;
	    }

	    if (!descriptor.set) {
	      descriptor.set = () => {
	        throw Error('Can not rewrite read-only method \'' + name + '\'');
	      };
	    }
	  });
	};

	const toObjectSet = (arrayOrString, delimiter) => {
	  const obj = {};

	  const define = (arr) => {
	    arr.forEach(value => {
	      obj[value] = true;
	    });
	  };

	  isArray(arrayOrString) ? define(arrayOrString) : define(String(arrayOrString).split(delimiter));

	  return obj;
	};

	const noop = () => {};

	const toFiniteNumber = (value, defaultValue) => {
	  return value != null && Number.isFinite(value = +value) ? value : defaultValue;
	};

	/**
	 * If the thing is a FormData object, return true, otherwise return false.
	 *
	 * @param {unknown} thing - The thing to check.
	 *
	 * @returns {boolean}
	 */
	function isSpecCompliantForm(thing) {
	  return !!(thing && isFunction(thing.append) && thing[toStringTag] === 'FormData' && thing[iterator]);
	}

	const toJSONObject = (obj) => {
	  const stack = new Array(10);

	  const visit = (source, i) => {

	    if (isObject(source)) {
	      if (stack.indexOf(source) >= 0) {
	        return;
	      }

	      if(!('toJSON' in source)) {
	        stack[i] = source;
	        const target = isArray(source) ? [] : {};

	        forEach(source, (value, key) => {
	          const reducedValue = visit(value, i + 1);
	          !isUndefined(reducedValue) && (target[key] = reducedValue);
	        });

	        stack[i] = undefined;

	        return target;
	      }
	    }

	    return source;
	  };

	  return visit(obj, 0);
	};

	const isAsyncFn = kindOfTest('AsyncFunction');

	const isThenable = (thing) =>
	  thing && (isObject(thing) || isFunction(thing)) && isFunction(thing.then) && isFunction(thing.catch);

	// original code
	// https://github.com/DigitalBrainJS/AxiosPromise/blob/16deab13710ec09779922131f3fa5954320f83ab/lib/utils.js#L11-L34

	const _setImmediate = ((setImmediateSupported, postMessageSupported) => {
	  if (setImmediateSupported) {
	    return setImmediate;
	  }

	  return postMessageSupported ? ((token, callbacks) => {
	    _global.addEventListener("message", ({source, data}) => {
	      if (source === _global && data === token) {
	        callbacks.length && callbacks.shift()();
	      }
	    }, false);

	    return (cb) => {
	      callbacks.push(cb);
	      _global.postMessage(token, "*");
	    }
	  })(`axios@${Math.random()}`, []) : (cb) => setTimeout(cb);
	})(
	  typeof setImmediate === 'function',
	  isFunction(_global.postMessage)
	);

	const asap = typeof queueMicrotask !== 'undefined' ?
	  queueMicrotask.bind(_global) : ( typeof process !== 'undefined' && process.nextTick || _setImmediate);

	// *********************


	const isIterable = (thing) => thing != null && isFunction(thing[iterator]);


	var utils$1 = {
	  isArray,
	  isArrayBuffer,
	  isBuffer,
	  isFormData,
	  isArrayBufferView,
	  isString,
	  isNumber,
	  isBoolean,
	  isObject,
	  isPlainObject,
	  isReadableStream,
	  isRequest,
	  isResponse,
	  isHeaders,
	  isUndefined,
	  isDate,
	  isFile,
	  isBlob,
	  isRegExp,
	  isFunction,
	  isStream,
	  isURLSearchParams,
	  isTypedArray,
	  isFileList,
	  forEach,
	  merge,
	  extend,
	  trim,
	  stripBOM,
	  inherits,
	  toFlatObject,
	  kindOf,
	  kindOfTest,
	  endsWith,
	  toArray,
	  forEachEntry,
	  matchAll,
	  isHTMLForm,
	  hasOwnProperty,
	  hasOwnProp: hasOwnProperty, // an alias to avoid ESLint no-prototype-builtins detection
	  reduceDescriptors,
	  freezeMethods,
	  toObjectSet,
	  toCamelCase,
	  noop,
	  toFiniteNumber,
	  findKey,
	  global: _global,
	  isContextDefined,
	  isSpecCompliantForm,
	  toJSONObject,
	  isAsyncFn,
	  isThenable,
	  setImmediate: _setImmediate,
	  asap,
	  isIterable
	};

	/**
	 * Create an Error with the specified message, config, error code, request and response.
	 *
	 * @param {string} message The error message.
	 * @param {string} [code] The error code (for example, 'ECONNABORTED').
	 * @param {Object} [config] The config.
	 * @param {Object} [request] The request.
	 * @param {Object} [response] The response.
	 *
	 * @returns {Error} The created error.
	 */
	function AxiosError(message, code, config, request, response) {
	  Error.call(this);

	  if (Error.captureStackTrace) {
	    Error.captureStackTrace(this, this.constructor);
	  } else {
	    this.stack = (new Error()).stack;
	  }

	  this.message = message;
	  this.name = 'AxiosError';
	  code && (this.code = code);
	  config && (this.config = config);
	  request && (this.request = request);
	  if (response) {
	    this.response = response;
	    this.status = response.status ? response.status : null;
	  }
	}

	utils$1.inherits(AxiosError, Error, {
	  toJSON: function toJSON() {
	    return {
	      // Standard
	      message: this.message,
	      name: this.name,
	      // Microsoft
	      description: this.description,
	      number: this.number,
	      // Mozilla
	      fileName: this.fileName,
	      lineNumber: this.lineNumber,
	      columnNumber: this.columnNumber,
	      stack: this.stack,
	      // Axios
	      config: utils$1.toJSONObject(this.config),
	      code: this.code,
	      status: this.status
	    };
	  }
	});

	const prototype$1 = AxiosError.prototype;
	const descriptors = {};

	[
	  'ERR_BAD_OPTION_VALUE',
	  'ERR_BAD_OPTION',
	  'ECONNABORTED',
	  'ETIMEDOUT',
	  'ERR_NETWORK',
	  'ERR_FR_TOO_MANY_REDIRECTS',
	  'ERR_DEPRECATED',
	  'ERR_BAD_RESPONSE',
	  'ERR_BAD_REQUEST',
	  'ERR_CANCELED',
	  'ERR_NOT_SUPPORT',
	  'ERR_INVALID_URL'
	// eslint-disable-next-line func-names
	].forEach(code => {
	  descriptors[code] = {value: code};
	});

	Object.defineProperties(AxiosError, descriptors);
	Object.defineProperty(prototype$1, 'isAxiosError', {value: true});

	// eslint-disable-next-line func-names
	AxiosError.from = (error, code, config, request, response, customProps) => {
	  const axiosError = Object.create(prototype$1);

	  utils$1.toFlatObject(error, axiosError, function filter(obj) {
	    return obj !== Error.prototype;
	  }, prop => {
	    return prop !== 'isAxiosError';
	  });

	  AxiosError.call(axiosError, error.message, code, config, request, response);

	  axiosError.cause = error;

	  axiosError.name = error.name;

	  customProps && Object.assign(axiosError, customProps);

	  return axiosError;
	};

	// eslint-disable-next-line strict
	var httpAdapter = null;

	/**
	 * Determines if the given thing is a array or js object.
	 *
	 * @param {string} thing - The object or array to be visited.
	 *
	 * @returns {boolean}
	 */
	function isVisitable(thing) {
	  return utils$1.isPlainObject(thing) || utils$1.isArray(thing);
	}

	/**
	 * It removes the brackets from the end of a string
	 *
	 * @param {string} key - The key of the parameter.
	 *
	 * @returns {string} the key without the brackets.
	 */
	function removeBrackets(key) {
	  return utils$1.endsWith(key, '[]') ? key.slice(0, -2) : key;
	}

	/**
	 * It takes a path, a key, and a boolean, and returns a string
	 *
	 * @param {string} path - The path to the current key.
	 * @param {string} key - The key of the current object being iterated over.
	 * @param {string} dots - If true, the key will be rendered with dots instead of brackets.
	 *
	 * @returns {string} The path to the current key.
	 */
	function renderKey(path, key, dots) {
	  if (!path) return key;
	  return path.concat(key).map(function each(token, i) {
	    // eslint-disable-next-line no-param-reassign
	    token = removeBrackets(token);
	    return !dots && i ? '[' + token + ']' : token;
	  }).join(dots ? '.' : '');
	}

	/**
	 * If the array is an array and none of its elements are visitable, then it's a flat array.
	 *
	 * @param {Array<any>} arr - The array to check
	 *
	 * @returns {boolean}
	 */
	function isFlatArray(arr) {
	  return utils$1.isArray(arr) && !arr.some(isVisitable);
	}

	const predicates = utils$1.toFlatObject(utils$1, {}, null, function filter(prop) {
	  return /^is[A-Z]/.test(prop);
	});

	/**
	 * Convert a data object to FormData
	 *
	 * @param {Object} obj
	 * @param {?Object} [formData]
	 * @param {?Object} [options]
	 * @param {Function} [options.visitor]
	 * @param {Boolean} [options.metaTokens = true]
	 * @param {Boolean} [options.dots = false]
	 * @param {?Boolean} [options.indexes = false]
	 *
	 * @returns {Object}
	 **/

	/**
	 * It converts an object into a FormData object
	 *
	 * @param {Object<any, any>} obj - The object to convert to form data.
	 * @param {string} formData - The FormData object to append to.
	 * @param {Object<string, any>} options
	 *
	 * @returns
	 */
	function toFormData(obj, formData, options) {
	  if (!utils$1.isObject(obj)) {
	    throw new TypeError('target must be an object');
	  }

	  // eslint-disable-next-line no-param-reassign
	  formData = formData || new (FormData)();

	  // eslint-disable-next-line no-param-reassign
	  options = utils$1.toFlatObject(options, {
	    metaTokens: true,
	    dots: false,
	    indexes: false
	  }, false, function defined(option, source) {
	    // eslint-disable-next-line no-eq-null,eqeqeq
	    return !utils$1.isUndefined(source[option]);
	  });

	  const metaTokens = options.metaTokens;
	  // eslint-disable-next-line no-use-before-define
	  const visitor = options.visitor || defaultVisitor;
	  const dots = options.dots;
	  const indexes = options.indexes;
	  const _Blob = options.Blob || typeof Blob !== 'undefined' && Blob;
	  const useBlob = _Blob && utils$1.isSpecCompliantForm(formData);

	  if (!utils$1.isFunction(visitor)) {
	    throw new TypeError('visitor must be a function');
	  }

	  function convertValue(value) {
	    if (value === null) return '';

	    if (utils$1.isDate(value)) {
	      return value.toISOString();
	    }

	    if (utils$1.isBoolean(value)) {
	      return value.toString();
	    }

	    if (!useBlob && utils$1.isBlob(value)) {
	      throw new AxiosError('Blob is not supported. Use a Buffer instead.');
	    }

	    if (utils$1.isArrayBuffer(value) || utils$1.isTypedArray(value)) {
	      return useBlob && typeof Blob === 'function' ? new Blob([value]) : Buffer.from(value);
	    }

	    return value;
	  }

	  /**
	   * Default visitor.
	   *
	   * @param {*} value
	   * @param {String|Number} key
	   * @param {Array<String|Number>} path
	   * @this {FormData}
	   *
	   * @returns {boolean} return true to visit the each prop of the value recursively
	   */
	  function defaultVisitor(value, key, path) {
	    let arr = value;

	    if (value && !path && typeof value === 'object') {
	      if (utils$1.endsWith(key, '{}')) {
	        // eslint-disable-next-line no-param-reassign
	        key = metaTokens ? key : key.slice(0, -2);
	        // eslint-disable-next-line no-param-reassign
	        value = JSON.stringify(value);
	      } else if (
	        (utils$1.isArray(value) && isFlatArray(value)) ||
	        ((utils$1.isFileList(value) || utils$1.endsWith(key, '[]')) && (arr = utils$1.toArray(value))
	        )) {
	        // eslint-disable-next-line no-param-reassign
	        key = removeBrackets(key);

	        arr.forEach(function each(el, index) {
	          !(utils$1.isUndefined(el) || el === null) && formData.append(
	            // eslint-disable-next-line no-nested-ternary
	            indexes === true ? renderKey([key], index, dots) : (indexes === null ? key : key + '[]'),
	            convertValue(el)
	          );
	        });
	        return false;
	      }
	    }

	    if (isVisitable(value)) {
	      return true;
	    }

	    formData.append(renderKey(path, key, dots), convertValue(value));

	    return false;
	  }

	  const stack = [];

	  const exposedHelpers = Object.assign(predicates, {
	    defaultVisitor,
	    convertValue,
	    isVisitable
	  });

	  function build(value, path) {
	    if (utils$1.isUndefined(value)) return;

	    if (stack.indexOf(value) !== -1) {
	      throw Error('Circular reference detected in ' + path.join('.'));
	    }

	    stack.push(value);

	    utils$1.forEach(value, function each(el, key) {
	      const result = !(utils$1.isUndefined(el) || el === null) && visitor.call(
	        formData, el, utils$1.isString(key) ? key.trim() : key, path, exposedHelpers
	      );

	      if (result === true) {
	        build(el, path ? path.concat(key) : [key]);
	      }
	    });

	    stack.pop();
	  }

	  if (!utils$1.isObject(obj)) {
	    throw new TypeError('data must be an object');
	  }

	  build(obj);

	  return formData;
	}

	/**
	 * It encodes a string by replacing all characters that are not in the unreserved set with
	 * their percent-encoded equivalents
	 *
	 * @param {string} str - The string to encode.
	 *
	 * @returns {string} The encoded string.
	 */
	function encode$1(str) {
	  const charMap = {
	    '!': '%21',
	    "'": '%27',
	    '(': '%28',
	    ')': '%29',
	    '~': '%7E',
	    '%20': '+',
	    '%00': '\x00'
	  };
	  return encodeURIComponent(str).replace(/[!'()~]|%20|%00/g, function replacer(match) {
	    return charMap[match];
	  });
	}

	/**
	 * It takes a params object and converts it to a FormData object
	 *
	 * @param {Object<string, any>} params - The parameters to be converted to a FormData object.
	 * @param {Object<string, any>} options - The options object passed to the Axios constructor.
	 *
	 * @returns {void}
	 */
	function AxiosURLSearchParams(params, options) {
	  this._pairs = [];

	  params && toFormData(params, this, options);
	}

	const prototype = AxiosURLSearchParams.prototype;

	prototype.append = function append(name, value) {
	  this._pairs.push([name, value]);
	};

	prototype.toString = function toString(encoder) {
	  const _encode = encoder ? function(value) {
	    return encoder.call(this, value, encode$1);
	  } : encode$1;

	  return this._pairs.map(function each(pair) {
	    return _encode(pair[0]) + '=' + _encode(pair[1]);
	  }, '').join('&');
	};

	/**
	 * It replaces all instances of the characters `:`, `$`, `,`, `+`, `[`, and `]` with their
	 * URI encoded counterparts
	 *
	 * @param {string} val The value to be encoded.
	 *
	 * @returns {string} The encoded value.
	 */
	function encode(val) {
	  return encodeURIComponent(val).
	    replace(/%3A/gi, ':').
	    replace(/%24/g, '$').
	    replace(/%2C/gi, ',').
	    replace(/%20/g, '+').
	    replace(/%5B/gi, '[').
	    replace(/%5D/gi, ']');
	}

	/**
	 * Build a URL by appending params to the end
	 *
	 * @param {string} url The base of the url (e.g., http://www.google.com)
	 * @param {object} [params] The params to be appended
	 * @param {?(object|Function)} options
	 *
	 * @returns {string} The formatted url
	 */
	function buildURL(url, params, options) {
	  /*eslint no-param-reassign:0*/
	  if (!params) {
	    return url;
	  }
	  
	  const _encode = options && options.encode || encode;

	  if (utils$1.isFunction(options)) {
	    options = {
	      serialize: options
	    };
	  } 

	  const serializeFn = options && options.serialize;

	  let serializedParams;

	  if (serializeFn) {
	    serializedParams = serializeFn(params, options);
	  } else {
	    serializedParams = utils$1.isURLSearchParams(params) ?
	      params.toString() :
	      new AxiosURLSearchParams(params, options).toString(_encode);
	  }

	  if (serializedParams) {
	    const hashmarkIndex = url.indexOf("#");

	    if (hashmarkIndex !== -1) {
	      url = url.slice(0, hashmarkIndex);
	    }
	    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
	  }

	  return url;
	}

	class InterceptorManager {
	  constructor() {
	    this.handlers = [];
	  }

	  /**
	   * Add a new interceptor to the stack
	   *
	   * @param {Function} fulfilled The function to handle `then` for a `Promise`
	   * @param {Function} rejected The function to handle `reject` for a `Promise`
	   *
	   * @return {Number} An ID used to remove interceptor later
	   */
	  use(fulfilled, rejected, options) {
	    this.handlers.push({
	      fulfilled,
	      rejected,
	      synchronous: options ? options.synchronous : false,
	      runWhen: options ? options.runWhen : null
	    });
	    return this.handlers.length - 1;
	  }

	  /**
	   * Remove an interceptor from the stack
	   *
	   * @param {Number} id The ID that was returned by `use`
	   *
	   * @returns {Boolean} `true` if the interceptor was removed, `false` otherwise
	   */
	  eject(id) {
	    if (this.handlers[id]) {
	      this.handlers[id] = null;
	    }
	  }

	  /**
	   * Clear all interceptors from the stack
	   *
	   * @returns {void}
	   */
	  clear() {
	    if (this.handlers) {
	      this.handlers = [];
	    }
	  }

	  /**
	   * Iterate over all the registered interceptors
	   *
	   * This method is particularly useful for skipping over any
	   * interceptors that may have become `null` calling `eject`.
	   *
	   * @param {Function} fn The function to call for each interceptor
	   *
	   * @returns {void}
	   */
	  forEach(fn) {
	    utils$1.forEach(this.handlers, function forEachHandler(h) {
	      if (h !== null) {
	        fn(h);
	      }
	    });
	  }
	}

	var InterceptorManager$1 = InterceptorManager;

	var transitionalDefaults = {
	  silentJSONParsing: true,
	  forcedJSONParsing: true,
	  clarifyTimeoutError: false
	};

	var URLSearchParams$1 = typeof URLSearchParams !== 'undefined' ? URLSearchParams : AxiosURLSearchParams;

	var FormData$1 = typeof FormData !== 'undefined' ? FormData : null;

	var Blob$1 = typeof Blob !== 'undefined' ? Blob : null;

	var platform$1 = {
	  isBrowser: true,
	  classes: {
	    URLSearchParams: URLSearchParams$1,
	    FormData: FormData$1,
	    Blob: Blob$1
	  },
	  protocols: ['http', 'https', 'file', 'blob', 'url', 'data']
	};

	const hasBrowserEnv = typeof window !== 'undefined' && typeof document !== 'undefined';

	const _navigator = typeof navigator === 'object' && navigator || undefined;

	/**
	 * Determine if we're running in a standard browser environment
	 *
	 * This allows axios to run in a web worker, and react-native.
	 * Both environments support XMLHttpRequest, but not fully standard globals.
	 *
	 * web workers:
	 *  typeof window -> undefined
	 *  typeof document -> undefined
	 *
	 * react-native:
	 *  navigator.product -> 'ReactNative'
	 * nativescript
	 *  navigator.product -> 'NativeScript' or 'NS'
	 *
	 * @returns {boolean}
	 */
	const hasStandardBrowserEnv = hasBrowserEnv &&
	  (!_navigator || ['ReactNative', 'NativeScript', 'NS'].indexOf(_navigator.product) < 0);

	/**
	 * Determine if we're running in a standard browser webWorker environment
	 *
	 * Although the `isStandardBrowserEnv` method indicates that
	 * `allows axios to run in a web worker`, the WebWorker will still be
	 * filtered out due to its judgment standard
	 * `typeof window !== 'undefined' && typeof document !== 'undefined'`.
	 * This leads to a problem when axios post `FormData` in webWorker
	 */
	const hasStandardBrowserWebWorkerEnv = (() => {
	  return (
	    typeof WorkerGlobalScope !== 'undefined' &&
	    // eslint-disable-next-line no-undef
	    self instanceof WorkerGlobalScope &&
	    typeof self.importScripts === 'function'
	  );
	})();

	const origin = hasBrowserEnv && window.location.href || 'http://localhost';

	var utils = /*#__PURE__*/Object.freeze({
	  __proto__: null,
	  hasBrowserEnv: hasBrowserEnv,
	  hasStandardBrowserWebWorkerEnv: hasStandardBrowserWebWorkerEnv,
	  hasStandardBrowserEnv: hasStandardBrowserEnv,
	  navigator: _navigator,
	  origin: origin
	});

	var platform = {
	  ...utils,
	  ...platform$1
	};

	function toURLEncodedForm(data, options) {
	  return toFormData(data, new platform.classes.URLSearchParams(), Object.assign({
	    visitor: function(value, key, path, helpers) {
	      if (platform.isNode && utils$1.isBuffer(value)) {
	        this.append(key, value.toString('base64'));
	        return false;
	      }

	      return helpers.defaultVisitor.apply(this, arguments);
	    }
	  }, options));
	}

	/**
	 * It takes a string like `foo[x][y][z]` and returns an array like `['foo', 'x', 'y', 'z']
	 *
	 * @param {string} name - The name of the property to get.
	 *
	 * @returns An array of strings.
	 */
	function parsePropPath(name) {
	  // foo[x][y][z]
	  // foo.x.y.z
	  // foo-x-y-z
	  // foo x y z
	  return utils$1.matchAll(/\w+|\[(\w*)]/g, name).map(match => {
	    return match[0] === '[]' ? '' : match[1] || match[0];
	  });
	}

	/**
	 * Convert an array to an object.
	 *
	 * @param {Array<any>} arr - The array to convert to an object.
	 *
	 * @returns An object with the same keys and values as the array.
	 */
	function arrayToObject(arr) {
	  const obj = {};
	  const keys = Object.keys(arr);
	  let i;
	  const len = keys.length;
	  let key;
	  for (i = 0; i < len; i++) {
	    key = keys[i];
	    obj[key] = arr[key];
	  }
	  return obj;
	}

	/**
	 * It takes a FormData object and returns a JavaScript object
	 *
	 * @param {string} formData The FormData object to convert to JSON.
	 *
	 * @returns {Object<string, any> | null} The converted object.
	 */
	function formDataToJSON(formData) {
	  function buildPath(path, value, target, index) {
	    let name = path[index++];

	    if (name === '__proto__') return true;

	    const isNumericKey = Number.isFinite(+name);
	    const isLast = index >= path.length;
	    name = !name && utils$1.isArray(target) ? target.length : name;

	    if (isLast) {
	      if (utils$1.hasOwnProp(target, name)) {
	        target[name] = [target[name], value];
	      } else {
	        target[name] = value;
	      }

	      return !isNumericKey;
	    }

	    if (!target[name] || !utils$1.isObject(target[name])) {
	      target[name] = [];
	    }

	    const result = buildPath(path, value, target[name], index);

	    if (result && utils$1.isArray(target[name])) {
	      target[name] = arrayToObject(target[name]);
	    }

	    return !isNumericKey;
	  }

	  if (utils$1.isFormData(formData) && utils$1.isFunction(formData.entries)) {
	    const obj = {};

	    utils$1.forEachEntry(formData, (name, value) => {
	      buildPath(parsePropPath(name), value, obj, 0);
	    });

	    return obj;
	  }

	  return null;
	}

	/**
	 * It takes a string, tries to parse it, and if it fails, it returns the stringified version
	 * of the input
	 *
	 * @param {any} rawValue - The value to be stringified.
	 * @param {Function} parser - A function that parses a string into a JavaScript object.
	 * @param {Function} encoder - A function that takes a value and returns a string.
	 *
	 * @returns {string} A stringified version of the rawValue.
	 */
	function stringifySafely(rawValue, parser, encoder) {
	  if (utils$1.isString(rawValue)) {
	    try {
	      (parser || JSON.parse)(rawValue);
	      return utils$1.trim(rawValue);
	    } catch (e) {
	      if (e.name !== 'SyntaxError') {
	        throw e;
	      }
	    }
	  }

	  return (encoder || JSON.stringify)(rawValue);
	}

	const defaults = {

	  transitional: transitionalDefaults,

	  adapter: ['xhr', 'http', 'fetch'],

	  transformRequest: [function transformRequest(data, headers) {
	    const contentType = headers.getContentType() || '';
	    const hasJSONContentType = contentType.indexOf('application/json') > -1;
	    const isObjectPayload = utils$1.isObject(data);

	    if (isObjectPayload && utils$1.isHTMLForm(data)) {
	      data = new FormData(data);
	    }

	    const isFormData = utils$1.isFormData(data);

	    if (isFormData) {
	      return hasJSONContentType ? JSON.stringify(formDataToJSON(data)) : data;
	    }

	    if (utils$1.isArrayBuffer(data) ||
	      utils$1.isBuffer(data) ||
	      utils$1.isStream(data) ||
	      utils$1.isFile(data) ||
	      utils$1.isBlob(data) ||
	      utils$1.isReadableStream(data)
	    ) {
	      return data;
	    }
	    if (utils$1.isArrayBufferView(data)) {
	      return data.buffer;
	    }
	    if (utils$1.isURLSearchParams(data)) {
	      headers.setContentType('application/x-www-form-urlencoded;charset=utf-8', false);
	      return data.toString();
	    }

	    let isFileList;

	    if (isObjectPayload) {
	      if (contentType.indexOf('application/x-www-form-urlencoded') > -1) {
	        return toURLEncodedForm(data, this.formSerializer).toString();
	      }

	      if ((isFileList = utils$1.isFileList(data)) || contentType.indexOf('multipart/form-data') > -1) {
	        const _FormData = this.env && this.env.FormData;

	        return toFormData(
	          isFileList ? {'files[]': data} : data,
	          _FormData && new _FormData(),
	          this.formSerializer
	        );
	      }
	    }

	    if (isObjectPayload || hasJSONContentType ) {
	      headers.setContentType('application/json', false);
	      return stringifySafely(data);
	    }

	    return data;
	  }],

	  transformResponse: [function transformResponse(data) {
	    const transitional = this.transitional || defaults.transitional;
	    const forcedJSONParsing = transitional && transitional.forcedJSONParsing;
	    const JSONRequested = this.responseType === 'json';

	    if (utils$1.isResponse(data) || utils$1.isReadableStream(data)) {
	      return data;
	    }

	    if (data && utils$1.isString(data) && ((forcedJSONParsing && !this.responseType) || JSONRequested)) {
	      const silentJSONParsing = transitional && transitional.silentJSONParsing;
	      const strictJSONParsing = !silentJSONParsing && JSONRequested;

	      try {
	        return JSON.parse(data);
	      } catch (e) {
	        if (strictJSONParsing) {
	          if (e.name === 'SyntaxError') {
	            throw AxiosError.from(e, AxiosError.ERR_BAD_RESPONSE, this, null, this.response);
	          }
	          throw e;
	        }
	      }
	    }

	    return data;
	  }],

	  /**
	   * A timeout in milliseconds to abort a request. If set to 0 (default) a
	   * timeout is not created.
	   */
	  timeout: 0,

	  xsrfCookieName: 'XSRF-TOKEN',
	  xsrfHeaderName: 'X-XSRF-TOKEN',

	  maxContentLength: -1,
	  maxBodyLength: -1,

	  env: {
	    FormData: platform.classes.FormData,
	    Blob: platform.classes.Blob
	  },

	  validateStatus: function validateStatus(status) {
	    return status >= 200 && status < 300;
	  },

	  headers: {
	    common: {
	      'Accept': 'application/json, text/plain, */*',
	      'Content-Type': undefined
	    }
	  }
	};

	utils$1.forEach(['delete', 'get', 'head', 'post', 'put', 'patch'], (method) => {
	  defaults.headers[method] = {};
	});

	var defaults$1 = defaults;

	// RawAxiosHeaders whose duplicates are ignored by node
	// c.f. https://nodejs.org/api/http.html#http_message_headers
	const ignoreDuplicateOf = utils$1.toObjectSet([
	  'age', 'authorization', 'content-length', 'content-type', 'etag',
	  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
	  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
	  'referer', 'retry-after', 'user-agent'
	]);

	/**
	 * Parse headers into an object
	 *
	 * ```
	 * Date: Wed, 27 Aug 2014 08:58:49 GMT
	 * Content-Type: application/json
	 * Connection: keep-alive
	 * Transfer-Encoding: chunked
	 * ```
	 *
	 * @param {String} rawHeaders Headers needing to be parsed
	 *
	 * @returns {Object} Headers parsed into an object
	 */
	var parseHeaders = rawHeaders => {
	  const parsed = {};
	  let key;
	  let val;
	  let i;

	  rawHeaders && rawHeaders.split('\n').forEach(function parser(line) {
	    i = line.indexOf(':');
	    key = line.substring(0, i).trim().toLowerCase();
	    val = line.substring(i + 1).trim();

	    if (!key || (parsed[key] && ignoreDuplicateOf[key])) {
	      return;
	    }

	    if (key === 'set-cookie') {
	      if (parsed[key]) {
	        parsed[key].push(val);
	      } else {
	        parsed[key] = [val];
	      }
	    } else {
	      parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
	    }
	  });

	  return parsed;
	};

	const $internals = Symbol('internals');

	function normalizeHeader(header) {
	  return header && String(header).trim().toLowerCase();
	}

	function normalizeValue(value) {
	  if (value === false || value == null) {
	    return value;
	  }

	  return utils$1.isArray(value) ? value.map(normalizeValue) : String(value);
	}

	function parseTokens(str) {
	  const tokens = Object.create(null);
	  const tokensRE = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
	  let match;

	  while ((match = tokensRE.exec(str))) {
	    tokens[match[1]] = match[2];
	  }

	  return tokens;
	}

	const isValidHeaderName = (str) => /^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(str.trim());

	function matchHeaderValue(context, value, header, filter, isHeaderNameFilter) {
	  if (utils$1.isFunction(filter)) {
	    return filter.call(this, value, header);
	  }

	  if (isHeaderNameFilter) {
	    value = header;
	  }

	  if (!utils$1.isString(value)) return;

	  if (utils$1.isString(filter)) {
	    return value.indexOf(filter) !== -1;
	  }

	  if (utils$1.isRegExp(filter)) {
	    return filter.test(value);
	  }
	}

	function formatHeader(header) {
	  return header.trim()
	    .toLowerCase().replace(/([a-z\d])(\w*)/g, (w, char, str) => {
	      return char.toUpperCase() + str;
	    });
	}

	function buildAccessors(obj, header) {
	  const accessorName = utils$1.toCamelCase(' ' + header);

	  ['get', 'set', 'has'].forEach(methodName => {
	    Object.defineProperty(obj, methodName + accessorName, {
	      value: function(arg1, arg2, arg3) {
	        return this[methodName].call(this, header, arg1, arg2, arg3);
	      },
	      configurable: true
	    });
	  });
	}

	class AxiosHeaders {
	  constructor(headers) {
	    headers && this.set(headers);
	  }

	  set(header, valueOrRewrite, rewrite) {
	    const self = this;

	    function setHeader(_value, _header, _rewrite) {
	      const lHeader = normalizeHeader(_header);

	      if (!lHeader) {
	        throw new Error('header name must be a non-empty string');
	      }

	      const key = utils$1.findKey(self, lHeader);

	      if(!key || self[key] === undefined || _rewrite === true || (_rewrite === undefined && self[key] !== false)) {
	        self[key || _header] = normalizeValue(_value);
	      }
	    }

	    const setHeaders = (headers, _rewrite) =>
	      utils$1.forEach(headers, (_value, _header) => setHeader(_value, _header, _rewrite));

	    if (utils$1.isPlainObject(header) || header instanceof this.constructor) {
	      setHeaders(header, valueOrRewrite);
	    } else if(utils$1.isString(header) && (header = header.trim()) && !isValidHeaderName(header)) {
	      setHeaders(parseHeaders(header), valueOrRewrite);
	    } else if (utils$1.isObject(header) && utils$1.isIterable(header)) {
	      let obj = {}, dest, key;
	      for (const entry of header) {
	        if (!utils$1.isArray(entry)) {
	          throw TypeError('Object iterator must return a key-value pair');
	        }

	        obj[key = entry[0]] = (dest = obj[key]) ?
	          (utils$1.isArray(dest) ? [...dest, entry[1]] : [dest, entry[1]]) : entry[1];
	      }

	      setHeaders(obj, valueOrRewrite);
	    } else {
	      header != null && setHeader(valueOrRewrite, header, rewrite);
	    }

	    return this;
	  }

	  get(header, parser) {
	    header = normalizeHeader(header);

	    if (header) {
	      const key = utils$1.findKey(this, header);

	      if (key) {
	        const value = this[key];

	        if (!parser) {
	          return value;
	        }

	        if (parser === true) {
	          return parseTokens(value);
	        }

	        if (utils$1.isFunction(parser)) {
	          return parser.call(this, value, key);
	        }

	        if (utils$1.isRegExp(parser)) {
	          return parser.exec(value);
	        }

	        throw new TypeError('parser must be boolean|regexp|function');
	      }
	    }
	  }

	  has(header, matcher) {
	    header = normalizeHeader(header);

	    if (header) {
	      const key = utils$1.findKey(this, header);

	      return !!(key && this[key] !== undefined && (!matcher || matchHeaderValue(this, this[key], key, matcher)));
	    }

	    return false;
	  }

	  delete(header, matcher) {
	    const self = this;
	    let deleted = false;

	    function deleteHeader(_header) {
	      _header = normalizeHeader(_header);

	      if (_header) {
	        const key = utils$1.findKey(self, _header);

	        if (key && (!matcher || matchHeaderValue(self, self[key], key, matcher))) {
	          delete self[key];

	          deleted = true;
	        }
	      }
	    }

	    if (utils$1.isArray(header)) {
	      header.forEach(deleteHeader);
	    } else {
	      deleteHeader(header);
	    }

	    return deleted;
	  }

	  clear(matcher) {
	    const keys = Object.keys(this);
	    let i = keys.length;
	    let deleted = false;

	    while (i--) {
	      const key = keys[i];
	      if(!matcher || matchHeaderValue(this, this[key], key, matcher, true)) {
	        delete this[key];
	        deleted = true;
	      }
	    }

	    return deleted;
	  }

	  normalize(format) {
	    const self = this;
	    const headers = {};

	    utils$1.forEach(this, (value, header) => {
	      const key = utils$1.findKey(headers, header);

	      if (key) {
	        self[key] = normalizeValue(value);
	        delete self[header];
	        return;
	      }

	      const normalized = format ? formatHeader(header) : String(header).trim();

	      if (normalized !== header) {
	        delete self[header];
	      }

	      self[normalized] = normalizeValue(value);

	      headers[normalized] = true;
	    });

	    return this;
	  }

	  concat(...targets) {
	    return this.constructor.concat(this, ...targets);
	  }

	  toJSON(asStrings) {
	    const obj = Object.create(null);

	    utils$1.forEach(this, (value, header) => {
	      value != null && value !== false && (obj[header] = asStrings && utils$1.isArray(value) ? value.join(', ') : value);
	    });

	    return obj;
	  }

	  [Symbol.iterator]() {
	    return Object.entries(this.toJSON())[Symbol.iterator]();
	  }

	  toString() {
	    return Object.entries(this.toJSON()).map(([header, value]) => header + ': ' + value).join('\n');
	  }

	  getSetCookie() {
	    return this.get("set-cookie") || [];
	  }

	  get [Symbol.toStringTag]() {
	    return 'AxiosHeaders';
	  }

	  static from(thing) {
	    return thing instanceof this ? thing : new this(thing);
	  }

	  static concat(first, ...targets) {
	    const computed = new this(first);

	    targets.forEach((target) => computed.set(target));

	    return computed;
	  }

	  static accessor(header) {
	    const internals = this[$internals] = (this[$internals] = {
	      accessors: {}
	    });

	    const accessors = internals.accessors;
	    const prototype = this.prototype;

	    function defineAccessor(_header) {
	      const lHeader = normalizeHeader(_header);

	      if (!accessors[lHeader]) {
	        buildAccessors(prototype, _header);
	        accessors[lHeader] = true;
	      }
	    }

	    utils$1.isArray(header) ? header.forEach(defineAccessor) : defineAccessor(header);

	    return this;
	  }
	}

	AxiosHeaders.accessor(['Content-Type', 'Content-Length', 'Accept', 'Accept-Encoding', 'User-Agent', 'Authorization']);

	// reserved names hotfix
	utils$1.reduceDescriptors(AxiosHeaders.prototype, ({value}, key) => {
	  let mapped = key[0].toUpperCase() + key.slice(1); // map `set` => `Set`
	  return {
	    get: () => value,
	    set(headerValue) {
	      this[mapped] = headerValue;
	    }
	  }
	});

	utils$1.freezeMethods(AxiosHeaders);

	var AxiosHeaders$1 = AxiosHeaders;

	/**
	 * Transform the data for a request or a response
	 *
	 * @param {Array|Function} fns A single function or Array of functions
	 * @param {?Object} response The response object
	 *
	 * @returns {*} The resulting transformed data
	 */
	function transformData(fns, response) {
	  const config = this || defaults$1;
	  const context = response || config;
	  const headers = AxiosHeaders$1.from(context.headers);
	  let data = context.data;

	  utils$1.forEach(fns, function transform(fn) {
	    data = fn.call(config, data, headers.normalize(), response ? response.status : undefined);
	  });

	  headers.normalize();

	  return data;
	}

	function isCancel(value) {
	  return !!(value && value.__CANCEL__);
	}

	/**
	 * A `CanceledError` is an object that is thrown when an operation is canceled.
	 *
	 * @param {string=} message The message.
	 * @param {Object=} config The config.
	 * @param {Object=} request The request.
	 *
	 * @returns {CanceledError} The created error.
	 */
	function CanceledError(message, config, request) {
	  // eslint-disable-next-line no-eq-null,eqeqeq
	  AxiosError.call(this, message == null ? 'canceled' : message, AxiosError.ERR_CANCELED, config, request);
	  this.name = 'CanceledError';
	}

	utils$1.inherits(CanceledError, AxiosError, {
	  __CANCEL__: true
	});

	/**
	 * Resolve or reject a Promise based on response status.
	 *
	 * @param {Function} resolve A function that resolves the promise.
	 * @param {Function} reject A function that rejects the promise.
	 * @param {object} response The response.
	 *
	 * @returns {object} The response.
	 */
	function settle(resolve, reject, response) {
	  const validateStatus = response.config.validateStatus;
	  if (!response.status || !validateStatus || validateStatus(response.status)) {
	    resolve(response);
	  } else {
	    reject(new AxiosError(
	      'Request failed with status code ' + response.status,
	      [AxiosError.ERR_BAD_REQUEST, AxiosError.ERR_BAD_RESPONSE][Math.floor(response.status / 100) - 4],
	      response.config,
	      response.request,
	      response
	    ));
	  }
	}

	function parseProtocol(url) {
	  const match = /^([-+\w]{1,25})(:?\/\/|:)/.exec(url);
	  return match && match[1] || '';
	}

	/**
	 * Calculate data maxRate
	 * @param {Number} [samplesCount= 10]
	 * @param {Number} [min= 1000]
	 * @returns {Function}
	 */
	function speedometer(samplesCount, min) {
	  samplesCount = samplesCount || 10;
	  const bytes = new Array(samplesCount);
	  const timestamps = new Array(samplesCount);
	  let head = 0;
	  let tail = 0;
	  let firstSampleTS;

	  min = min !== undefined ? min : 1000;

	  return function push(chunkLength) {
	    const now = Date.now();

	    const startedAt = timestamps[tail];

	    if (!firstSampleTS) {
	      firstSampleTS = now;
	    }

	    bytes[head] = chunkLength;
	    timestamps[head] = now;

	    let i = tail;
	    let bytesCount = 0;

	    while (i !== head) {
	      bytesCount += bytes[i++];
	      i = i % samplesCount;
	    }

	    head = (head + 1) % samplesCount;

	    if (head === tail) {
	      tail = (tail + 1) % samplesCount;
	    }

	    if (now - firstSampleTS < min) {
	      return;
	    }

	    const passed = startedAt && now - startedAt;

	    return passed ? Math.round(bytesCount * 1000 / passed) : undefined;
	  };
	}

	/**
	 * Throttle decorator
	 * @param {Function} fn
	 * @param {Number} freq
	 * @return {Function}
	 */
	function throttle(fn, freq) {
	  let timestamp = 0;
	  let threshold = 1000 / freq;
	  let lastArgs;
	  let timer;

	  const invoke = (args, now = Date.now()) => {
	    timestamp = now;
	    lastArgs = null;
	    if (timer) {
	      clearTimeout(timer);
	      timer = null;
	    }
	    fn.apply(null, args);
	  };

	  const throttled = (...args) => {
	    const now = Date.now();
	    const passed = now - timestamp;
	    if ( passed >= threshold) {
	      invoke(args, now);
	    } else {
	      lastArgs = args;
	      if (!timer) {
	        timer = setTimeout(() => {
	          timer = null;
	          invoke(lastArgs);
	        }, threshold - passed);
	      }
	    }
	  };

	  const flush = () => lastArgs && invoke(lastArgs);

	  return [throttled, flush];
	}

	const progressEventReducer = (listener, isDownloadStream, freq = 3) => {
	  let bytesNotified = 0;
	  const _speedometer = speedometer(50, 250);

	  return throttle(e => {
	    const loaded = e.loaded;
	    const total = e.lengthComputable ? e.total : undefined;
	    const progressBytes = loaded - bytesNotified;
	    const rate = _speedometer(progressBytes);
	    const inRange = loaded <= total;

	    bytesNotified = loaded;

	    const data = {
	      loaded,
	      total,
	      progress: total ? (loaded / total) : undefined,
	      bytes: progressBytes,
	      rate: rate ? rate : undefined,
	      estimated: rate && total && inRange ? (total - loaded) / rate : undefined,
	      event: e,
	      lengthComputable: total != null,
	      [isDownloadStream ? 'download' : 'upload']: true
	    };

	    listener(data);
	  }, freq);
	};

	const progressEventDecorator = (total, throttled) => {
	  const lengthComputable = total != null;

	  return [(loaded) => throttled[0]({
	    lengthComputable,
	    total,
	    loaded
	  }), throttled[1]];
	};

	const asyncDecorator = (fn) => (...args) => utils$1.asap(() => fn(...args));

	var isURLSameOrigin = platform.hasStandardBrowserEnv ? ((origin, isMSIE) => (url) => {
	  url = new URL(url, platform.origin);

	  return (
	    origin.protocol === url.protocol &&
	    origin.host === url.host &&
	    (isMSIE || origin.port === url.port)
	  );
	})(
	  new URL(platform.origin),
	  platform.navigator && /(msie|trident)/i.test(platform.navigator.userAgent)
	) : () => true;

	var cookies = platform.hasStandardBrowserEnv ?

	  // Standard browser envs support document.cookie
	  {
	    write(name, value, expires, path, domain, secure) {
	      const cookie = [name + '=' + encodeURIComponent(value)];

	      utils$1.isNumber(expires) && cookie.push('expires=' + new Date(expires).toGMTString());

	      utils$1.isString(path) && cookie.push('path=' + path);

	      utils$1.isString(domain) && cookie.push('domain=' + domain);

	      secure === true && cookie.push('secure');

	      document.cookie = cookie.join('; ');
	    },

	    read(name) {
	      const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
	      return (match ? decodeURIComponent(match[3]) : null);
	    },

	    remove(name) {
	      this.write(name, '', Date.now() - 86400000);
	    }
	  }

	  :

	  // Non-standard browser env (web workers, react-native) lack needed support.
	  {
	    write() {},
	    read() {
	      return null;
	    },
	    remove() {}
	  };

	/**
	 * Determines whether the specified URL is absolute
	 *
	 * @param {string} url The URL to test
	 *
	 * @returns {boolean} True if the specified URL is absolute, otherwise false
	 */
	function isAbsoluteURL(url) {
	  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
	  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
	  // by any combination of letters, digits, plus, period, or hyphen.
	  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
	}

	/**
	 * Creates a new URL by combining the specified URLs
	 *
	 * @param {string} baseURL The base URL
	 * @param {string} relativeURL The relative URL
	 *
	 * @returns {string} The combined URL
	 */
	function combineURLs(baseURL, relativeURL) {
	  return relativeURL
	    ? baseURL.replace(/\/?\/$/, '') + '/' + relativeURL.replace(/^\/+/, '')
	    : baseURL;
	}

	/**
	 * Creates a new URL by combining the baseURL with the requestedURL,
	 * only when the requestedURL is not already an absolute URL.
	 * If the requestURL is absolute, this function returns the requestedURL untouched.
	 *
	 * @param {string} baseURL The base URL
	 * @param {string} requestedURL Absolute or relative URL to combine
	 *
	 * @returns {string} The combined full path
	 */
	function buildFullPath(baseURL, requestedURL, allowAbsoluteUrls) {
	  let isRelativeUrl = !isAbsoluteURL(requestedURL);
	  if (baseURL && (isRelativeUrl || allowAbsoluteUrls == false)) {
	    return combineURLs(baseURL, requestedURL);
	  }
	  return requestedURL;
	}

	const headersToObject = (thing) => thing instanceof AxiosHeaders$1 ? { ...thing } : thing;

	/**
	 * Config-specific merge-function which creates a new config-object
	 * by merging two configuration objects together.
	 *
	 * @param {Object} config1
	 * @param {Object} config2
	 *
	 * @returns {Object} New object resulting from merging config2 to config1
	 */
	function mergeConfig(config1, config2) {
	  // eslint-disable-next-line no-param-reassign
	  config2 = config2 || {};
	  const config = {};

	  function getMergedValue(target, source, prop, caseless) {
	    if (utils$1.isPlainObject(target) && utils$1.isPlainObject(source)) {
	      return utils$1.merge.call({caseless}, target, source);
	    } else if (utils$1.isPlainObject(source)) {
	      return utils$1.merge({}, source);
	    } else if (utils$1.isArray(source)) {
	      return source.slice();
	    }
	    return source;
	  }

	  // eslint-disable-next-line consistent-return
	  function mergeDeepProperties(a, b, prop , caseless) {
	    if (!utils$1.isUndefined(b)) {
	      return getMergedValue(a, b, prop , caseless);
	    } else if (!utils$1.isUndefined(a)) {
	      return getMergedValue(undefined, a, prop , caseless);
	    }
	  }

	  // eslint-disable-next-line consistent-return
	  function valueFromConfig2(a, b) {
	    if (!utils$1.isUndefined(b)) {
	      return getMergedValue(undefined, b);
	    }
	  }

	  // eslint-disable-next-line consistent-return
	  function defaultToConfig2(a, b) {
	    if (!utils$1.isUndefined(b)) {
	      return getMergedValue(undefined, b);
	    } else if (!utils$1.isUndefined(a)) {
	      return getMergedValue(undefined, a);
	    }
	  }

	  // eslint-disable-next-line consistent-return
	  function mergeDirectKeys(a, b, prop) {
	    if (prop in config2) {
	      return getMergedValue(a, b);
	    } else if (prop in config1) {
	      return getMergedValue(undefined, a);
	    }
	  }

	  const mergeMap = {
	    url: valueFromConfig2,
	    method: valueFromConfig2,
	    data: valueFromConfig2,
	    baseURL: defaultToConfig2,
	    transformRequest: defaultToConfig2,
	    transformResponse: defaultToConfig2,
	    paramsSerializer: defaultToConfig2,
	    timeout: defaultToConfig2,
	    timeoutMessage: defaultToConfig2,
	    withCredentials: defaultToConfig2,
	    withXSRFToken: defaultToConfig2,
	    adapter: defaultToConfig2,
	    responseType: defaultToConfig2,
	    xsrfCookieName: defaultToConfig2,
	    xsrfHeaderName: defaultToConfig2,
	    onUploadProgress: defaultToConfig2,
	    onDownloadProgress: defaultToConfig2,
	    decompress: defaultToConfig2,
	    maxContentLength: defaultToConfig2,
	    maxBodyLength: defaultToConfig2,
	    beforeRedirect: defaultToConfig2,
	    transport: defaultToConfig2,
	    httpAgent: defaultToConfig2,
	    httpsAgent: defaultToConfig2,
	    cancelToken: defaultToConfig2,
	    socketPath: defaultToConfig2,
	    responseEncoding: defaultToConfig2,
	    validateStatus: mergeDirectKeys,
	    headers: (a, b , prop) => mergeDeepProperties(headersToObject(a), headersToObject(b),prop, true)
	  };

	  utils$1.forEach(Object.keys(Object.assign({}, config1, config2)), function computeConfigValue(prop) {
	    const merge = mergeMap[prop] || mergeDeepProperties;
	    const configValue = merge(config1[prop], config2[prop], prop);
	    (utils$1.isUndefined(configValue) && merge !== mergeDirectKeys) || (config[prop] = configValue);
	  });

	  return config;
	}

	var resolveConfig = (config) => {
	  const newConfig = mergeConfig({}, config);

	  let {data, withXSRFToken, xsrfHeaderName, xsrfCookieName, headers, auth} = newConfig;

	  newConfig.headers = headers = AxiosHeaders$1.from(headers);

	  newConfig.url = buildURL(buildFullPath(newConfig.baseURL, newConfig.url, newConfig.allowAbsoluteUrls), config.params, config.paramsSerializer);

	  // HTTP basic authentication
	  if (auth) {
	    headers.set('Authorization', 'Basic ' +
	      btoa((auth.username || '') + ':' + (auth.password ? unescape(encodeURIComponent(auth.password)) : ''))
	    );
	  }

	  let contentType;

	  if (utils$1.isFormData(data)) {
	    if (platform.hasStandardBrowserEnv || platform.hasStandardBrowserWebWorkerEnv) {
	      headers.setContentType(undefined); // Let the browser set it
	    } else if ((contentType = headers.getContentType()) !== false) {
	      // fix semicolon duplication issue for ReactNative FormData implementation
	      const [type, ...tokens] = contentType ? contentType.split(';').map(token => token.trim()).filter(Boolean) : [];
	      headers.setContentType([type || 'multipart/form-data', ...tokens].join('; '));
	    }
	  }

	  // Add xsrf header
	  // This is only done if running in a standard browser environment.
	  // Specifically not if we're in a web worker, or react-native.

	  if (platform.hasStandardBrowserEnv) {
	    withXSRFToken && utils$1.isFunction(withXSRFToken) && (withXSRFToken = withXSRFToken(newConfig));

	    if (withXSRFToken || (withXSRFToken !== false && isURLSameOrigin(newConfig.url))) {
	      // Add xsrf header
	      const xsrfValue = xsrfHeaderName && xsrfCookieName && cookies.read(xsrfCookieName);

	      if (xsrfValue) {
	        headers.set(xsrfHeaderName, xsrfValue);
	      }
	    }
	  }

	  return newConfig;
	};

	const isXHRAdapterSupported = typeof XMLHttpRequest !== 'undefined';

	var xhrAdapter = isXHRAdapterSupported && function (config) {
	  return new Promise(function dispatchXhrRequest(resolve, reject) {
	    const _config = resolveConfig(config);
	    let requestData = _config.data;
	    const requestHeaders = AxiosHeaders$1.from(_config.headers).normalize();
	    let {responseType, onUploadProgress, onDownloadProgress} = _config;
	    let onCanceled;
	    let uploadThrottled, downloadThrottled;
	    let flushUpload, flushDownload;

	    function done() {
	      flushUpload && flushUpload(); // flush events
	      flushDownload && flushDownload(); // flush events

	      _config.cancelToken && _config.cancelToken.unsubscribe(onCanceled);

	      _config.signal && _config.signal.removeEventListener('abort', onCanceled);
	    }

	    let request = new XMLHttpRequest();

	    request.open(_config.method.toUpperCase(), _config.url, true);

	    // Set the request timeout in MS
	    request.timeout = _config.timeout;

	    function onloadend() {
	      if (!request) {
	        return;
	      }
	      // Prepare the response
	      const responseHeaders = AxiosHeaders$1.from(
	        'getAllResponseHeaders' in request && request.getAllResponseHeaders()
	      );
	      const responseData = !responseType || responseType === 'text' || responseType === 'json' ?
	        request.responseText : request.response;
	      const response = {
	        data: responseData,
	        status: request.status,
	        statusText: request.statusText,
	        headers: responseHeaders,
	        config,
	        request
	      };

	      settle(function _resolve(value) {
	        resolve(value);
	        done();
	      }, function _reject(err) {
	        reject(err);
	        done();
	      }, response);

	      // Clean up request
	      request = null;
	    }

	    if ('onloadend' in request) {
	      // Use onloadend if available
	      request.onloadend = onloadend;
	    } else {
	      // Listen for ready state to emulate onloadend
	      request.onreadystatechange = function handleLoad() {
	        if (!request || request.readyState !== 4) {
	          return;
	        }

	        // The request errored out and we didn't get a response, this will be
	        // handled by onerror instead
	        // With one exception: request that using file: protocol, most browsers
	        // will return status as 0 even though it's a successful request
	        if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
	          return;
	        }
	        // readystate handler is calling before onerror or ontimeout handlers,
	        // so we should call onloadend on the next 'tick'
	        setTimeout(onloadend);
	      };
	    }

	    // Handle browser request cancellation (as opposed to a manual cancellation)
	    request.onabort = function handleAbort() {
	      if (!request) {
	        return;
	      }

	      reject(new AxiosError('Request aborted', AxiosError.ECONNABORTED, config, request));

	      // Clean up request
	      request = null;
	    };

	    // Handle low level network errors
	    request.onerror = function handleError() {
	      // Real errors are hidden from us by the browser
	      // onerror should only fire if it's a network error
	      reject(new AxiosError('Network Error', AxiosError.ERR_NETWORK, config, request));

	      // Clean up request
	      request = null;
	    };

	    // Handle timeout
	    request.ontimeout = function handleTimeout() {
	      let timeoutErrorMessage = _config.timeout ? 'timeout of ' + _config.timeout + 'ms exceeded' : 'timeout exceeded';
	      const transitional = _config.transitional || transitionalDefaults;
	      if (_config.timeoutErrorMessage) {
	        timeoutErrorMessage = _config.timeoutErrorMessage;
	      }
	      reject(new AxiosError(
	        timeoutErrorMessage,
	        transitional.clarifyTimeoutError ? AxiosError.ETIMEDOUT : AxiosError.ECONNABORTED,
	        config,
	        request));

	      // Clean up request
	      request = null;
	    };

	    // Remove Content-Type if data is undefined
	    requestData === undefined && requestHeaders.setContentType(null);

	    // Add headers to the request
	    if ('setRequestHeader' in request) {
	      utils$1.forEach(requestHeaders.toJSON(), function setRequestHeader(val, key) {
	        request.setRequestHeader(key, val);
	      });
	    }

	    // Add withCredentials to request if needed
	    if (!utils$1.isUndefined(_config.withCredentials)) {
	      request.withCredentials = !!_config.withCredentials;
	    }

	    // Add responseType to request if needed
	    if (responseType && responseType !== 'json') {
	      request.responseType = _config.responseType;
	    }

	    // Handle progress if needed
	    if (onDownloadProgress) {
	      ([downloadThrottled, flushDownload] = progressEventReducer(onDownloadProgress, true));
	      request.addEventListener('progress', downloadThrottled);
	    }

	    // Not all browsers support upload events
	    if (onUploadProgress && request.upload) {
	      ([uploadThrottled, flushUpload] = progressEventReducer(onUploadProgress));

	      request.upload.addEventListener('progress', uploadThrottled);

	      request.upload.addEventListener('loadend', flushUpload);
	    }

	    if (_config.cancelToken || _config.signal) {
	      // Handle cancellation
	      // eslint-disable-next-line func-names
	      onCanceled = cancel => {
	        if (!request) {
	          return;
	        }
	        reject(!cancel || cancel.type ? new CanceledError(null, config, request) : cancel);
	        request.abort();
	        request = null;
	      };

	      _config.cancelToken && _config.cancelToken.subscribe(onCanceled);
	      if (_config.signal) {
	        _config.signal.aborted ? onCanceled() : _config.signal.addEventListener('abort', onCanceled);
	      }
	    }

	    const protocol = parseProtocol(_config.url);

	    if (protocol && platform.protocols.indexOf(protocol) === -1) {
	      reject(new AxiosError('Unsupported protocol ' + protocol + ':', AxiosError.ERR_BAD_REQUEST, config));
	      return;
	    }


	    // Send the request
	    request.send(requestData || null);
	  });
	};

	const composeSignals = (signals, timeout) => {
	  const {length} = (signals = signals ? signals.filter(Boolean) : []);

	  if (timeout || length) {
	    let controller = new AbortController();

	    let aborted;

	    const onabort = function (reason) {
	      if (!aborted) {
	        aborted = true;
	        unsubscribe();
	        const err = reason instanceof Error ? reason : this.reason;
	        controller.abort(err instanceof AxiosError ? err : new CanceledError(err instanceof Error ? err.message : err));
	      }
	    };

	    let timer = timeout && setTimeout(() => {
	      timer = null;
	      onabort(new AxiosError(`timeout ${timeout} of ms exceeded`, AxiosError.ETIMEDOUT));
	    }, timeout);

	    const unsubscribe = () => {
	      if (signals) {
	        timer && clearTimeout(timer);
	        timer = null;
	        signals.forEach(signal => {
	          signal.unsubscribe ? signal.unsubscribe(onabort) : signal.removeEventListener('abort', onabort);
	        });
	        signals = null;
	      }
	    };

	    signals.forEach((signal) => signal.addEventListener('abort', onabort));

	    const {signal} = controller;

	    signal.unsubscribe = () => utils$1.asap(unsubscribe);

	    return signal;
	  }
	};

	var composeSignals$1 = composeSignals;

	const streamChunk = function* (chunk, chunkSize) {
	  let len = chunk.byteLength;

	  if (len < chunkSize) {
	    yield chunk;
	    return;
	  }

	  let pos = 0;
	  let end;

	  while (pos < len) {
	    end = pos + chunkSize;
	    yield chunk.slice(pos, end);
	    pos = end;
	  }
	};

	const readBytes = async function* (iterable, chunkSize) {
	  for await (const chunk of readStream(iterable)) {
	    yield* streamChunk(chunk, chunkSize);
	  }
	};

	const readStream = async function* (stream) {
	  if (stream[Symbol.asyncIterator]) {
	    yield* stream;
	    return;
	  }

	  const reader = stream.getReader();
	  try {
	    for (;;) {
	      const {done, value} = await reader.read();
	      if (done) {
	        break;
	      }
	      yield value;
	    }
	  } finally {
	    await reader.cancel();
	  }
	};

	const trackStream = (stream, chunkSize, onProgress, onFinish) => {
	  const iterator = readBytes(stream, chunkSize);

	  let bytes = 0;
	  let done;
	  let _onFinish = (e) => {
	    if (!done) {
	      done = true;
	      onFinish && onFinish(e);
	    }
	  };

	  return new ReadableStream({
	    async pull(controller) {
	      try {
	        const {done, value} = await iterator.next();

	        if (done) {
	         _onFinish();
	          controller.close();
	          return;
	        }

	        let len = value.byteLength;
	        if (onProgress) {
	          let loadedBytes = bytes += len;
	          onProgress(loadedBytes);
	        }
	        controller.enqueue(new Uint8Array(value));
	      } catch (err) {
	        _onFinish(err);
	        throw err;
	      }
	    },
	    cancel(reason) {
	      _onFinish(reason);
	      return iterator.return();
	    }
	  }, {
	    highWaterMark: 2
	  })
	};

	const isFetchSupported = typeof fetch === 'function' && typeof Request === 'function' && typeof Response === 'function';
	const isReadableStreamSupported = isFetchSupported && typeof ReadableStream === 'function';

	// used only inside the fetch adapter
	const encodeText = isFetchSupported && (typeof TextEncoder === 'function' ?
	    ((encoder) => (str) => encoder.encode(str))(new TextEncoder()) :
	    async (str) => new Uint8Array(await new Response(str).arrayBuffer())
	);

	const test = (fn, ...args) => {
	  try {
	    return !!fn(...args);
	  } catch (e) {
	    return false
	  }
	};

	const supportsRequestStream = isReadableStreamSupported && test(() => {
	  let duplexAccessed = false;

	  const hasContentType = new Request(platform.origin, {
	    body: new ReadableStream(),
	    method: 'POST',
	    get duplex() {
	      duplexAccessed = true;
	      return 'half';
	    },
	  }).headers.has('Content-Type');

	  return duplexAccessed && !hasContentType;
	});

	const DEFAULT_CHUNK_SIZE = 64 * 1024;

	const supportsResponseStream = isReadableStreamSupported &&
	  test(() => utils$1.isReadableStream(new Response('').body));


	const resolvers = {
	  stream: supportsResponseStream && ((res) => res.body)
	};

	isFetchSupported && (((res) => {
	  ['text', 'arrayBuffer', 'blob', 'formData', 'stream'].forEach(type => {
	    !resolvers[type] && (resolvers[type] = utils$1.isFunction(res[type]) ? (res) => res[type]() :
	      (_, config) => {
	        throw new AxiosError(`Response type '${type}' is not supported`, AxiosError.ERR_NOT_SUPPORT, config);
	      });
	  });
	})(new Response));

	const getBodyLength = async (body) => {
	  if (body == null) {
	    return 0;
	  }

	  if(utils$1.isBlob(body)) {
	    return body.size;
	  }

	  if(utils$1.isSpecCompliantForm(body)) {
	    const _request = new Request(platform.origin, {
	      method: 'POST',
	      body,
	    });
	    return (await _request.arrayBuffer()).byteLength;
	  }

	  if(utils$1.isArrayBufferView(body) || utils$1.isArrayBuffer(body)) {
	    return body.byteLength;
	  }

	  if(utils$1.isURLSearchParams(body)) {
	    body = body + '';
	  }

	  if(utils$1.isString(body)) {
	    return (await encodeText(body)).byteLength;
	  }
	};

	const resolveBodyLength = async (headers, body) => {
	  const length = utils$1.toFiniteNumber(headers.getContentLength());

	  return length == null ? getBodyLength(body) : length;
	};

	var fetchAdapter = isFetchSupported && (async (config) => {
	  let {
	    url,
	    method,
	    data,
	    signal,
	    cancelToken,
	    timeout,
	    onDownloadProgress,
	    onUploadProgress,
	    responseType,
	    headers,
	    withCredentials = 'same-origin',
	    fetchOptions
	  } = resolveConfig(config);

	  responseType = responseType ? (responseType + '').toLowerCase() : 'text';

	  let composedSignal = composeSignals$1([signal, cancelToken && cancelToken.toAbortSignal()], timeout);

	  let request;

	  const unsubscribe = composedSignal && composedSignal.unsubscribe && (() => {
	      composedSignal.unsubscribe();
	  });

	  let requestContentLength;

	  try {
	    if (
	      onUploadProgress && supportsRequestStream && method !== 'get' && method !== 'head' &&
	      (requestContentLength = await resolveBodyLength(headers, data)) !== 0
	    ) {
	      let _request = new Request(url, {
	        method: 'POST',
	        body: data,
	        duplex: "half"
	      });

	      let contentTypeHeader;

	      if (utils$1.isFormData(data) && (contentTypeHeader = _request.headers.get('content-type'))) {
	        headers.setContentType(contentTypeHeader);
	      }

	      if (_request.body) {
	        const [onProgress, flush] = progressEventDecorator(
	          requestContentLength,
	          progressEventReducer(asyncDecorator(onUploadProgress))
	        );

	        data = trackStream(_request.body, DEFAULT_CHUNK_SIZE, onProgress, flush);
	      }
	    }

	    if (!utils$1.isString(withCredentials)) {
	      withCredentials = withCredentials ? 'include' : 'omit';
	    }

	    // Cloudflare Workers throws when credentials are defined
	    // see https://github.com/cloudflare/workerd/issues/902
	    const isCredentialsSupported = "credentials" in Request.prototype;
	    request = new Request(url, {
	      ...fetchOptions,
	      signal: composedSignal,
	      method: method.toUpperCase(),
	      headers: headers.normalize().toJSON(),
	      body: data,
	      duplex: "half",
	      credentials: isCredentialsSupported ? withCredentials : undefined
	    });

	    let response = await fetch(request, fetchOptions);

	    const isStreamResponse = supportsResponseStream && (responseType === 'stream' || responseType === 'response');

	    if (supportsResponseStream && (onDownloadProgress || (isStreamResponse && unsubscribe))) {
	      const options = {};

	      ['status', 'statusText', 'headers'].forEach(prop => {
	        options[prop] = response[prop];
	      });

	      const responseContentLength = utils$1.toFiniteNumber(response.headers.get('content-length'));

	      const [onProgress, flush] = onDownloadProgress && progressEventDecorator(
	        responseContentLength,
	        progressEventReducer(asyncDecorator(onDownloadProgress), true)
	      ) || [];

	      response = new Response(
	        trackStream(response.body, DEFAULT_CHUNK_SIZE, onProgress, () => {
	          flush && flush();
	          unsubscribe && unsubscribe();
	        }),
	        options
	      );
	    }

	    responseType = responseType || 'text';

	    let responseData = await resolvers[utils$1.findKey(resolvers, responseType) || 'text'](response, config);

	    !isStreamResponse && unsubscribe && unsubscribe();

	    return await new Promise((resolve, reject) => {
	      settle(resolve, reject, {
	        data: responseData,
	        headers: AxiosHeaders$1.from(response.headers),
	        status: response.status,
	        statusText: response.statusText,
	        config,
	        request
	      });
	    })
	  } catch (err) {
	    unsubscribe && unsubscribe();

	    if (err && err.name === 'TypeError' && /Load failed|fetch/i.test(err.message)) {
	      throw Object.assign(
	        new AxiosError('Network Error', AxiosError.ERR_NETWORK, config, request),
	        {
	          cause: err.cause || err
	        }
	      )
	    }

	    throw AxiosError.from(err, err && err.code, config, request);
	  }
	});

	const knownAdapters = {
	  http: httpAdapter,
	  xhr: xhrAdapter,
	  fetch: fetchAdapter
	};

	utils$1.forEach(knownAdapters, (fn, value) => {
	  if (fn) {
	    try {
	      Object.defineProperty(fn, 'name', {value});
	    } catch (e) {
	      // eslint-disable-next-line no-empty
	    }
	    Object.defineProperty(fn, 'adapterName', {value});
	  }
	});

	const renderReason = (reason) => `- ${reason}`;

	const isResolvedHandle = (adapter) => utils$1.isFunction(adapter) || adapter === null || adapter === false;

	var adapters = {
	  getAdapter: (adapters) => {
	    adapters = utils$1.isArray(adapters) ? adapters : [adapters];

	    const {length} = adapters;
	    let nameOrAdapter;
	    let adapter;

	    const rejectedReasons = {};

	    for (let i = 0; i < length; i++) {
	      nameOrAdapter = adapters[i];
	      let id;

	      adapter = nameOrAdapter;

	      if (!isResolvedHandle(nameOrAdapter)) {
	        adapter = knownAdapters[(id = String(nameOrAdapter)).toLowerCase()];

	        if (adapter === undefined) {
	          throw new AxiosError(`Unknown adapter '${id}'`);
	        }
	      }

	      if (adapter) {
	        break;
	      }

	      rejectedReasons[id || '#' + i] = adapter;
	    }

	    if (!adapter) {

	      const reasons = Object.entries(rejectedReasons)
	        .map(([id, state]) => `adapter ${id} ` +
	          (state === false ? 'is not supported by the environment' : 'is not available in the build')
	        );

	      let s = length ?
	        (reasons.length > 1 ? 'since :\n' + reasons.map(renderReason).join('\n') : ' ' + renderReason(reasons[0])) :
	        'as no adapter specified';

	      throw new AxiosError(
	        `There is no suitable adapter to dispatch the request ` + s,
	        'ERR_NOT_SUPPORT'
	      );
	    }

	    return adapter;
	  },
	  adapters: knownAdapters
	};

	/**
	 * Throws a `CanceledError` if cancellation has been requested.
	 *
	 * @param {Object} config The config that is to be used for the request
	 *
	 * @returns {void}
	 */
	function throwIfCancellationRequested(config) {
	  if (config.cancelToken) {
	    config.cancelToken.throwIfRequested();
	  }

	  if (config.signal && config.signal.aborted) {
	    throw new CanceledError(null, config);
	  }
	}

	/**
	 * Dispatch a request to the server using the configured adapter.
	 *
	 * @param {object} config The config that is to be used for the request
	 *
	 * @returns {Promise} The Promise to be fulfilled
	 */
	function dispatchRequest(config) {
	  throwIfCancellationRequested(config);

	  config.headers = AxiosHeaders$1.from(config.headers);

	  // Transform request data
	  config.data = transformData.call(
	    config,
	    config.transformRequest
	  );

	  if (['post', 'put', 'patch'].indexOf(config.method) !== -1) {
	    config.headers.setContentType('application/x-www-form-urlencoded', false);
	  }

	  const adapter = adapters.getAdapter(config.adapter || defaults$1.adapter);

	  return adapter(config).then(function onAdapterResolution(response) {
	    throwIfCancellationRequested(config);

	    // Transform response data
	    response.data = transformData.call(
	      config,
	      config.transformResponse,
	      response
	    );

	    response.headers = AxiosHeaders$1.from(response.headers);

	    return response;
	  }, function onAdapterRejection(reason) {
	    if (!isCancel(reason)) {
	      throwIfCancellationRequested(config);

	      // Transform response data
	      if (reason && reason.response) {
	        reason.response.data = transformData.call(
	          config,
	          config.transformResponse,
	          reason.response
	        );
	        reason.response.headers = AxiosHeaders$1.from(reason.response.headers);
	      }
	    }

	    return Promise.reject(reason);
	  });
	}

	const VERSION = "1.10.0";

	const validators$1 = {};

	// eslint-disable-next-line func-names
	['object', 'boolean', 'number', 'function', 'string', 'symbol'].forEach((type, i) => {
	  validators$1[type] = function validator(thing) {
	    return typeof thing === type || 'a' + (i < 1 ? 'n ' : ' ') + type;
	  };
	});

	const deprecatedWarnings = {};

	/**
	 * Transitional option validator
	 *
	 * @param {function|boolean?} validator - set to false if the transitional option has been removed
	 * @param {string?} version - deprecated version / removed since version
	 * @param {string?} message - some message with additional info
	 *
	 * @returns {function}
	 */
	validators$1.transitional = function transitional(validator, version, message) {
	  function formatMessage(opt, desc) {
	    return '[Axios v' + VERSION + '] Transitional option \'' + opt + '\'' + desc + (message ? '. ' + message : '');
	  }

	  // eslint-disable-next-line func-names
	  return (value, opt, opts) => {
	    if (validator === false) {
	      throw new AxiosError(
	        formatMessage(opt, ' has been removed' + (version ? ' in ' + version : '')),
	        AxiosError.ERR_DEPRECATED
	      );
	    }

	    if (version && !deprecatedWarnings[opt]) {
	      deprecatedWarnings[opt] = true;
	      // eslint-disable-next-line no-console
	      console.warn(
	        formatMessage(
	          opt,
	          ' has been deprecated since v' + version + ' and will be removed in the near future'
	        )
	      );
	    }

	    return validator ? validator(value, opt, opts) : true;
	  };
	};

	validators$1.spelling = function spelling(correctSpelling) {
	  return (value, opt) => {
	    // eslint-disable-next-line no-console
	    console.warn(`${opt} is likely a misspelling of ${correctSpelling}`);
	    return true;
	  }
	};

	/**
	 * Assert object's properties type
	 *
	 * @param {object} options
	 * @param {object} schema
	 * @param {boolean?} allowUnknown
	 *
	 * @returns {object}
	 */

	function assertOptions(options, schema, allowUnknown) {
	  if (typeof options !== 'object') {
	    throw new AxiosError('options must be an object', AxiosError.ERR_BAD_OPTION_VALUE);
	  }
	  const keys = Object.keys(options);
	  let i = keys.length;
	  while (i-- > 0) {
	    const opt = keys[i];
	    const validator = schema[opt];
	    if (validator) {
	      const value = options[opt];
	      const result = value === undefined || validator(value, opt, options);
	      if (result !== true) {
	        throw new AxiosError('option ' + opt + ' must be ' + result, AxiosError.ERR_BAD_OPTION_VALUE);
	      }
	      continue;
	    }
	    if (allowUnknown !== true) {
	      throw new AxiosError('Unknown option ' + opt, AxiosError.ERR_BAD_OPTION);
	    }
	  }
	}

	var validator = {
	  assertOptions,
	  validators: validators$1
	};

	const validators = validator.validators;

	/**
	 * Create a new instance of Axios
	 *
	 * @param {Object} instanceConfig The default config for the instance
	 *
	 * @return {Axios} A new instance of Axios
	 */
	class Axios {
	  constructor(instanceConfig) {
	    this.defaults = instanceConfig || {};
	    this.interceptors = {
	      request: new InterceptorManager$1(),
	      response: new InterceptorManager$1()
	    };
	  }

	  /**
	   * Dispatch a request
	   *
	   * @param {String|Object} configOrUrl The config specific for this request (merged with this.defaults)
	   * @param {?Object} config
	   *
	   * @returns {Promise} The Promise to be fulfilled
	   */
	  async request(configOrUrl, config) {
	    try {
	      return await this._request(configOrUrl, config);
	    } catch (err) {
	      if (err instanceof Error) {
	        let dummy = {};

	        Error.captureStackTrace ? Error.captureStackTrace(dummy) : (dummy = new Error());

	        // slice off the Error: ... line
	        const stack = dummy.stack ? dummy.stack.replace(/^.+\n/, '') : '';
	        try {
	          if (!err.stack) {
	            err.stack = stack;
	            // match without the 2 top stack lines
	          } else if (stack && !String(err.stack).endsWith(stack.replace(/^.+\n.+\n/, ''))) {
	            err.stack += '\n' + stack;
	          }
	        } catch (e) {
	          // ignore the case where "stack" is an un-writable property
	        }
	      }

	      throw err;
	    }
	  }

	  _request(configOrUrl, config) {
	    /*eslint no-param-reassign:0*/
	    // Allow for axios('example/url'[, config]) a la fetch API
	    if (typeof configOrUrl === 'string') {
	      config = config || {};
	      config.url = configOrUrl;
	    } else {
	      config = configOrUrl || {};
	    }

	    config = mergeConfig(this.defaults, config);

	    const {transitional, paramsSerializer, headers} = config;

	    if (transitional !== undefined) {
	      validator.assertOptions(transitional, {
	        silentJSONParsing: validators.transitional(validators.boolean),
	        forcedJSONParsing: validators.transitional(validators.boolean),
	        clarifyTimeoutError: validators.transitional(validators.boolean)
	      }, false);
	    }

	    if (paramsSerializer != null) {
	      if (utils$1.isFunction(paramsSerializer)) {
	        config.paramsSerializer = {
	          serialize: paramsSerializer
	        };
	      } else {
	        validator.assertOptions(paramsSerializer, {
	          encode: validators.function,
	          serialize: validators.function
	        }, true);
	      }
	    }

	    // Set config.allowAbsoluteUrls
	    if (config.allowAbsoluteUrls !== undefined) ; else if (this.defaults.allowAbsoluteUrls !== undefined) {
	      config.allowAbsoluteUrls = this.defaults.allowAbsoluteUrls;
	    } else {
	      config.allowAbsoluteUrls = true;
	    }

	    validator.assertOptions(config, {
	      baseUrl: validators.spelling('baseURL'),
	      withXsrfToken: validators.spelling('withXSRFToken')
	    }, true);

	    // Set config.method
	    config.method = (config.method || this.defaults.method || 'get').toLowerCase();

	    // Flatten headers
	    let contextHeaders = headers && utils$1.merge(
	      headers.common,
	      headers[config.method]
	    );

	    headers && utils$1.forEach(
	      ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
	      (method) => {
	        delete headers[method];
	      }
	    );

	    config.headers = AxiosHeaders$1.concat(contextHeaders, headers);

	    // filter out skipped interceptors
	    const requestInterceptorChain = [];
	    let synchronousRequestInterceptors = true;
	    this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
	      if (typeof interceptor.runWhen === 'function' && interceptor.runWhen(config) === false) {
	        return;
	      }

	      synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;

	      requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
	    });

	    const responseInterceptorChain = [];
	    this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
	      responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
	    });

	    let promise;
	    let i = 0;
	    let len;

	    if (!synchronousRequestInterceptors) {
	      const chain = [dispatchRequest.bind(this), undefined];
	      chain.unshift.apply(chain, requestInterceptorChain);
	      chain.push.apply(chain, responseInterceptorChain);
	      len = chain.length;

	      promise = Promise.resolve(config);

	      while (i < len) {
	        promise = promise.then(chain[i++], chain[i++]);
	      }

	      return promise;
	    }

	    len = requestInterceptorChain.length;

	    let newConfig = config;

	    i = 0;

	    while (i < len) {
	      const onFulfilled = requestInterceptorChain[i++];
	      const onRejected = requestInterceptorChain[i++];
	      try {
	        newConfig = onFulfilled(newConfig);
	      } catch (error) {
	        onRejected.call(this, error);
	        break;
	      }
	    }

	    try {
	      promise = dispatchRequest.call(this, newConfig);
	    } catch (error) {
	      return Promise.reject(error);
	    }

	    i = 0;
	    len = responseInterceptorChain.length;

	    while (i < len) {
	      promise = promise.then(responseInterceptorChain[i++], responseInterceptorChain[i++]);
	    }

	    return promise;
	  }

	  getUri(config) {
	    config = mergeConfig(this.defaults, config);
	    const fullPath = buildFullPath(config.baseURL, config.url, config.allowAbsoluteUrls);
	    return buildURL(fullPath, config.params, config.paramsSerializer);
	  }
	}

	// Provide aliases for supported request methods
	utils$1.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
	  /*eslint func-names:0*/
	  Axios.prototype[method] = function(url, config) {
	    return this.request(mergeConfig(config || {}, {
	      method,
	      url,
	      data: (config || {}).data
	    }));
	  };
	});

	utils$1.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
	  /*eslint func-names:0*/

	  function generateHTTPMethod(isForm) {
	    return function httpMethod(url, data, config) {
	      return this.request(mergeConfig(config || {}, {
	        method,
	        headers: isForm ? {
	          'Content-Type': 'multipart/form-data'
	        } : {},
	        url,
	        data
	      }));
	    };
	  }

	  Axios.prototype[method] = generateHTTPMethod();

	  Axios.prototype[method + 'Form'] = generateHTTPMethod(true);
	});

	var Axios$1 = Axios;

	/**
	 * A `CancelToken` is an object that can be used to request cancellation of an operation.
	 *
	 * @param {Function} executor The executor function.
	 *
	 * @returns {CancelToken}
	 */
	class CancelToken {
	  constructor(executor) {
	    if (typeof executor !== 'function') {
	      throw new TypeError('executor must be a function.');
	    }

	    let resolvePromise;

	    this.promise = new Promise(function promiseExecutor(resolve) {
	      resolvePromise = resolve;
	    });

	    const token = this;

	    // eslint-disable-next-line func-names
	    this.promise.then(cancel => {
	      if (!token._listeners) return;

	      let i = token._listeners.length;

	      while (i-- > 0) {
	        token._listeners[i](cancel);
	      }
	      token._listeners = null;
	    });

	    // eslint-disable-next-line func-names
	    this.promise.then = onfulfilled => {
	      let _resolve;
	      // eslint-disable-next-line func-names
	      const promise = new Promise(resolve => {
	        token.subscribe(resolve);
	        _resolve = resolve;
	      }).then(onfulfilled);

	      promise.cancel = function reject() {
	        token.unsubscribe(_resolve);
	      };

	      return promise;
	    };

	    executor(function cancel(message, config, request) {
	      if (token.reason) {
	        // Cancellation has already been requested
	        return;
	      }

	      token.reason = new CanceledError(message, config, request);
	      resolvePromise(token.reason);
	    });
	  }

	  /**
	   * Throws a `CanceledError` if cancellation has been requested.
	   */
	  throwIfRequested() {
	    if (this.reason) {
	      throw this.reason;
	    }
	  }

	  /**
	   * Subscribe to the cancel signal
	   */

	  subscribe(listener) {
	    if (this.reason) {
	      listener(this.reason);
	      return;
	    }

	    if (this._listeners) {
	      this._listeners.push(listener);
	    } else {
	      this._listeners = [listener];
	    }
	  }

	  /**
	   * Unsubscribe from the cancel signal
	   */

	  unsubscribe(listener) {
	    if (!this._listeners) {
	      return;
	    }
	    const index = this._listeners.indexOf(listener);
	    if (index !== -1) {
	      this._listeners.splice(index, 1);
	    }
	  }

	  toAbortSignal() {
	    const controller = new AbortController();

	    const abort = (err) => {
	      controller.abort(err);
	    };

	    this.subscribe(abort);

	    controller.signal.unsubscribe = () => this.unsubscribe(abort);

	    return controller.signal;
	  }

	  /**
	   * Returns an object that contains a new `CancelToken` and a function that, when called,
	   * cancels the `CancelToken`.
	   */
	  static source() {
	    let cancel;
	    const token = new CancelToken(function executor(c) {
	      cancel = c;
	    });
	    return {
	      token,
	      cancel
	    };
	  }
	}

	var CancelToken$1 = CancelToken;

	/**
	 * Syntactic sugar for invoking a function and expanding an array for arguments.
	 *
	 * Common use case would be to use `Function.prototype.apply`.
	 *
	 *  ```js
	 *  function f(x, y, z) {}
	 *  var args = [1, 2, 3];
	 *  f.apply(null, args);
	 *  ```
	 *
	 * With `spread` this example can be re-written.
	 *
	 *  ```js
	 *  spread(function(x, y, z) {})([1, 2, 3]);
	 *  ```
	 *
	 * @param {Function} callback
	 *
	 * @returns {Function}
	 */
	function spread(callback) {
	  return function wrap(arr) {
	    return callback.apply(null, arr);
	  };
	}

	/**
	 * Determines whether the payload is an error thrown by Axios
	 *
	 * @param {*} payload The value to test
	 *
	 * @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
	 */
	function isAxiosError(payload) {
	  return utils$1.isObject(payload) && (payload.isAxiosError === true);
	}

	const HttpStatusCode = {
	  Continue: 100,
	  SwitchingProtocols: 101,
	  Processing: 102,
	  EarlyHints: 103,
	  Ok: 200,
	  Created: 201,
	  Accepted: 202,
	  NonAuthoritativeInformation: 203,
	  NoContent: 204,
	  ResetContent: 205,
	  PartialContent: 206,
	  MultiStatus: 207,
	  AlreadyReported: 208,
	  ImUsed: 226,
	  MultipleChoices: 300,
	  MovedPermanently: 301,
	  Found: 302,
	  SeeOther: 303,
	  NotModified: 304,
	  UseProxy: 305,
	  Unused: 306,
	  TemporaryRedirect: 307,
	  PermanentRedirect: 308,
	  BadRequest: 400,
	  Unauthorized: 401,
	  PaymentRequired: 402,
	  Forbidden: 403,
	  NotFound: 404,
	  MethodNotAllowed: 405,
	  NotAcceptable: 406,
	  ProxyAuthenticationRequired: 407,
	  RequestTimeout: 408,
	  Conflict: 409,
	  Gone: 410,
	  LengthRequired: 411,
	  PreconditionFailed: 412,
	  PayloadTooLarge: 413,
	  UriTooLong: 414,
	  UnsupportedMediaType: 415,
	  RangeNotSatisfiable: 416,
	  ExpectationFailed: 417,
	  ImATeapot: 418,
	  MisdirectedRequest: 421,
	  UnprocessableEntity: 422,
	  Locked: 423,
	  FailedDependency: 424,
	  TooEarly: 425,
	  UpgradeRequired: 426,
	  PreconditionRequired: 428,
	  TooManyRequests: 429,
	  RequestHeaderFieldsTooLarge: 431,
	  UnavailableForLegalReasons: 451,
	  InternalServerError: 500,
	  NotImplemented: 501,
	  BadGateway: 502,
	  ServiceUnavailable: 503,
	  GatewayTimeout: 504,
	  HttpVersionNotSupported: 505,
	  VariantAlsoNegotiates: 506,
	  InsufficientStorage: 507,
	  LoopDetected: 508,
	  NotExtended: 510,
	  NetworkAuthenticationRequired: 511,
	};

	Object.entries(HttpStatusCode).forEach(([key, value]) => {
	  HttpStatusCode[value] = key;
	});

	var HttpStatusCode$1 = HttpStatusCode;

	/**
	 * Create an instance of Axios
	 *
	 * @param {Object} defaultConfig The default config for the instance
	 *
	 * @returns {Axios} A new instance of Axios
	 */
	function createInstance(defaultConfig) {
	  const context = new Axios$1(defaultConfig);
	  const instance = bind(Axios$1.prototype.request, context);

	  // Copy axios.prototype to instance
	  utils$1.extend(instance, Axios$1.prototype, context, {allOwnKeys: true});

	  // Copy context to instance
	  utils$1.extend(instance, context, null, {allOwnKeys: true});

	  // Factory for creating new instances
	  instance.create = function create(instanceConfig) {
	    return createInstance(mergeConfig(defaultConfig, instanceConfig));
	  };

	  return instance;
	}

	// Create the default instance to be exported
	const axios = createInstance(defaults$1);

	// Expose Axios class to allow class inheritance
	axios.Axios = Axios$1;

	// Expose Cancel & CancelToken
	axios.CanceledError = CanceledError;
	axios.CancelToken = CancelToken$1;
	axios.isCancel = isCancel;
	axios.VERSION = VERSION;
	axios.toFormData = toFormData;

	// Expose AxiosError class
	axios.AxiosError = AxiosError;

	// alias for CanceledError for backward compatibility
	axios.Cancel = axios.CanceledError;

	// Expose all/spread
	axios.all = function all(promises) {
	  return Promise.all(promises);
	};

	axios.spread = spread;

	// Expose isAxiosError
	axios.isAxiosError = isAxiosError;

	// Expose mergeConfig
	axios.mergeConfig = mergeConfig;

	axios.AxiosHeaders = AxiosHeaders$1;

	axios.formToJSON = thing => formDataToJSON(utils$1.isHTMLForm(thing) ? new FormData(thing) : thing);

	axios.getAdapter = adapters.getAdapter;

	axios.HttpStatusCode = HttpStatusCode$1;

	axios.default = axios;

	axios_1 = axios;
	
	return axios_1;
}

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */


var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __values(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

function __spreadArray$1(to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

/**
 * Source: ftp://ftp.unicode.org/Public/UCD/latest/ucd/SpecialCasing.txt
 */
/**
 * Lower case as a function.
 */
function lowerCase(str) {
    return str.toLowerCase();
}

// Support camel case ("camelCase" -> "camel Case" and "CAMELCase" -> "CAMEL Case").
var DEFAULT_SPLIT_REGEXP = [/([a-z0-9])([A-Z])/g, /([A-Z])([A-Z][a-z])/g];
// Remove all non-word characters.
var DEFAULT_STRIP_REGEXP = /[^A-Z0-9]+/gi;
/**
 * Normalize the string into something other libraries can manipulate easier.
 */
function noCase(input, options) {
    if (options === void 0) { options = {}; }
    var _a = options.splitRegexp, splitRegexp = _a === void 0 ? DEFAULT_SPLIT_REGEXP : _a, _b = options.stripRegexp, stripRegexp = _b === void 0 ? DEFAULT_STRIP_REGEXP : _b, _c = options.transform, transform = _c === void 0 ? lowerCase : _c, _d = options.delimiter, delimiter = _d === void 0 ? " " : _d;
    var result = replace(replace(input, splitRegexp, "$1\0$2"), stripRegexp, "\0");
    var start = 0;
    var end = result.length;
    // Trim the delimiter from around the output string.
    while (result.charAt(start) === "\0")
        start++;
    while (result.charAt(end - 1) === "\0")
        end--;
    // Transform each token independently.
    return result.slice(start, end).split("\0").map(transform).join(delimiter);
}
/**
 * Replace `re` in the input string with the replacement value.
 */
function replace(input, re, value) {
    if (re instanceof RegExp)
        return input.replace(re, value);
    return re.reduce(function (input, re) { return input.replace(re, value); }, input);
}

function pascalCaseTransform(input, index) {
    var firstChar = input.charAt(0);
    var lowerChars = input.substr(1).toLowerCase();
    if (index > 0 && firstChar >= "0" && firstChar <= "9") {
        return "_" + firstChar + lowerChars;
    }
    return "" + firstChar.toUpperCase() + lowerChars;
}
function pascalCase(input, options) {
    if (options === void 0) { options = {}; }
    return noCase(input, __assign({ delimiter: "", transform: pascalCaseTransform }, options));
}

function camelCaseTransform(input, index) {
    if (index === 0)
        return input.toLowerCase();
    return pascalCaseTransform(input, index);
}
function camelCase(input, options) {
    if (options === void 0) { options = {}; }
    return pascalCase(input, __assign({ transform: camelCaseTransform }, options));
}

function dotCase(input, options) {
    if (options === void 0) { options = {}; }
    return noCase(input, __assign({ delimiter: "." }, options));
}

function snakeCase(input, options) {
    if (options === void 0) { options = {}; }
    return dotCase(input, __assign({ delimiter: "_" }, options));
}

/**
 * Upper case the first character of an input string.
 */
function upperCaseFirst(input) {
    return input.charAt(0).toUpperCase() + input.substr(1);
}

function capitalCaseTransform(input) {
    return upperCaseFirst(input.toLowerCase());
}
function capitalCase(input, options) {
    if (options === void 0) { options = {}; }
    return noCase(input, __assign({ delimiter: " ", transform: capitalCaseTransform }, options));
}

function headerCase(input, options) {
    if (options === void 0) { options = {}; }
    return capitalCase(input, __assign({ delimiter: "-" }, options));
}

var applyCaseOptions = function (fn, defaultOptions) {
    return function (input, options) {
        return fn(input, __assign(__assign({}, defaultOptions), options));
    };
};
var preserveSpecificKeys = function (fn, keys) {
    var condition = typeof keys === 'function'
        ? keys
        : function (input) { return keys.includes(input); };
    return function (input, options) {
        return condition(input, options) ? input : fn(input, options);
    };
};

function bind(fn, thisArg) {
  return function wrap() {
    return fn.apply(thisArg, arguments);
  };
}

// utils is a library of generic helper functions non-specific to axios

const {toString} = Object.prototype;
const {getPrototypeOf} = Object;
const {iterator, toStringTag} = Symbol;

const kindOf = (cache => thing => {
    const str = toString.call(thing);
    return cache[str] || (cache[str] = str.slice(8, -1).toLowerCase());
})(Object.create(null));

const kindOfTest = (type) => {
  type = type.toLowerCase();
  return (thing) => kindOf(thing) === type
};

const typeOfTest = type => thing => typeof thing === type;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 *
 * @returns {boolean} True if value is an Array, otherwise false
 */
const {isArray} = Array;

/**
 * Determine if a value is undefined
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if the value is undefined, otherwise false
 */
const isUndefined = typeOfTest('undefined');

/**
 * Determine if a value is a Buffer
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Buffer, otherwise false
 */
function isBuffer(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
    && isFunction(val.constructor.isBuffer) && val.constructor.isBuffer(val);
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
const isArrayBuffer = kindOfTest('ArrayBuffer');


/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  let result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (isArrayBuffer(val.buffer));
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a String, otherwise false
 */
const isString = typeOfTest('string');

/**
 * Determine if a value is a Function
 *
 * @param {*} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
const isFunction = typeOfTest('function');

/**
 * Determine if a value is a Number
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Number, otherwise false
 */
const isNumber = typeOfTest('number');

/**
 * Determine if a value is an Object
 *
 * @param {*} thing The value to test
 *
 * @returns {boolean} True if value is an Object, otherwise false
 */
const isObject = (thing) => thing !== null && typeof thing === 'object';

/**
 * Determine if a value is a Boolean
 *
 * @param {*} thing The value to test
 * @returns {boolean} True if value is a Boolean, otherwise false
 */
const isBoolean = thing => thing === true || thing === false;

/**
 * Determine if a value is a plain Object
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a plain Object, otherwise false
 */
const isPlainObject$1 = (val) => {
  if (kindOf(val) !== 'object') {
    return false;
  }

  const prototype = getPrototypeOf(val);
  return (prototype === null || prototype === Object.prototype || Object.getPrototypeOf(prototype) === null) && !(toStringTag in val) && !(iterator in val);
};

/**
 * Determine if a value is a Date
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Date, otherwise false
 */
const isDate = kindOfTest('Date');

/**
 * Determine if a value is a File
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a File, otherwise false
 */
const isFile = kindOfTest('File');

/**
 * Determine if a value is a Blob
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Blob, otherwise false
 */
const isBlob = kindOfTest('Blob');

/**
 * Determine if a value is a FileList
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a File, otherwise false
 */
const isFileList = kindOfTest('FileList');

/**
 * Determine if a value is a Stream
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Stream, otherwise false
 */
const isStream = (val) => isObject(val) && isFunction(val.pipe);

/**
 * Determine if a value is a FormData
 *
 * @param {*} thing The value to test
 *
 * @returns {boolean} True if value is an FormData, otherwise false
 */
const isFormData$1 = (thing) => {
  let kind;
  return thing && (
    (typeof FormData === 'function' && thing instanceof FormData) || (
      isFunction(thing.append) && (
        (kind = kindOf(thing)) === 'formdata' ||
        // detect form-data instance
        (kind === 'object' && isFunction(thing.toString) && thing.toString() === '[object FormData]')
      )
    )
  )
};

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
const isURLSearchParams$1 = kindOfTest('URLSearchParams');

const [isReadableStream, isRequest, isResponse, isHeaders] = ['ReadableStream', 'Request', 'Response', 'Headers'].map(kindOfTest);

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 *
 * @returns {String} The String freed of excess whitespace
 */
const trim = (str) => str.trim ?
  str.trim() : str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 *
 * @param {Boolean} [allOwnKeys = false]
 * @returns {any}
 */
function forEach(obj, fn, {allOwnKeys = false} = {}) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  let i;
  let l;

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    const keys = allOwnKeys ? Object.getOwnPropertyNames(obj) : Object.keys(obj);
    const len = keys.length;
    let key;

    for (i = 0; i < len; i++) {
      key = keys[i];
      fn.call(null, obj[key], key, obj);
    }
  }
}

function findKey(obj, key) {
  key = key.toLowerCase();
  const keys = Object.keys(obj);
  let i = keys.length;
  let _key;
  while (i-- > 0) {
    _key = keys[i];
    if (key === _key.toLowerCase()) {
      return _key;
    }
  }
  return null;
}

const _global = (() => {
  /*eslint no-undef:0*/
  if (typeof globalThis !== "undefined") return globalThis;
  return typeof self !== "undefined" ? self : (typeof window !== 'undefined' ? window : global)
})();

const isContextDefined = (context) => !isUndefined(context) && context !== _global;

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 *
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  const {caseless} = isContextDefined(this) && this || {};
  const result = {};
  const assignValue = (val, key) => {
    const targetKey = caseless && findKey(result, key) || key;
    if (isPlainObject$1(result[targetKey]) && isPlainObject$1(val)) {
      result[targetKey] = merge(result[targetKey], val);
    } else if (isPlainObject$1(val)) {
      result[targetKey] = merge({}, val);
    } else if (isArray(val)) {
      result[targetKey] = val.slice();
    } else {
      result[targetKey] = val;
    }
  };

  for (let i = 0, l = arguments.length; i < l; i++) {
    arguments[i] && forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 *
 * @param {Boolean} [allOwnKeys]
 * @returns {Object} The resulting value of object a
 */
const extend = (a, b, thisArg, {allOwnKeys}= {}) => {
  forEach(b, (val, key) => {
    if (thisArg && isFunction(val)) {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  }, {allOwnKeys});
  return a;
};

/**
 * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
 *
 * @param {string} content with BOM
 *
 * @returns {string} content value without BOM
 */
const stripBOM = (content) => {
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }
  return content;
};

/**
 * Inherit the prototype methods from one constructor into another
 * @param {function} constructor
 * @param {function} superConstructor
 * @param {object} [props]
 * @param {object} [descriptors]
 *
 * @returns {void}
 */
const inherits = (constructor, superConstructor, props, descriptors) => {
  constructor.prototype = Object.create(superConstructor.prototype, descriptors);
  constructor.prototype.constructor = constructor;
  Object.defineProperty(constructor, 'super', {
    value: superConstructor.prototype
  });
  props && Object.assign(constructor.prototype, props);
};

/**
 * Resolve object with deep prototype chain to a flat object
 * @param {Object} sourceObj source object
 * @param {Object} [destObj]
 * @param {Function|Boolean} [filter]
 * @param {Function} [propFilter]
 *
 * @returns {Object}
 */
const toFlatObject = (sourceObj, destObj, filter, propFilter) => {
  let props;
  let i;
  let prop;
  const merged = {};

  destObj = destObj || {};
  // eslint-disable-next-line no-eq-null,eqeqeq
  if (sourceObj == null) return destObj;

  do {
    props = Object.getOwnPropertyNames(sourceObj);
    i = props.length;
    while (i-- > 0) {
      prop = props[i];
      if ((!propFilter || propFilter(prop, sourceObj, destObj)) && !merged[prop]) {
        destObj[prop] = sourceObj[prop];
        merged[prop] = true;
      }
    }
    sourceObj = filter !== false && getPrototypeOf(sourceObj);
  } while (sourceObj && (!filter || filter(sourceObj, destObj)) && sourceObj !== Object.prototype);

  return destObj;
};

/**
 * Determines whether a string ends with the characters of a specified string
 *
 * @param {String} str
 * @param {String} searchString
 * @param {Number} [position= 0]
 *
 * @returns {boolean}
 */
const endsWith = (str, searchString, position) => {
  str = String(str);
  if (position === undefined || position > str.length) {
    position = str.length;
  }
  position -= searchString.length;
  const lastIndex = str.indexOf(searchString, position);
  return lastIndex !== -1 && lastIndex === position;
};


/**
 * Returns new array from array like object or null if failed
 *
 * @param {*} [thing]
 *
 * @returns {?Array}
 */
const toArray = (thing) => {
  if (!thing) return null;
  if (isArray(thing)) return thing;
  let i = thing.length;
  if (!isNumber(i)) return null;
  const arr = new Array(i);
  while (i-- > 0) {
    arr[i] = thing[i];
  }
  return arr;
};

/**
 * Checking if the Uint8Array exists and if it does, it returns a function that checks if the
 * thing passed in is an instance of Uint8Array
 *
 * @param {TypedArray}
 *
 * @returns {Array}
 */
// eslint-disable-next-line func-names
const isTypedArray = (TypedArray => {
  // eslint-disable-next-line func-names
  return thing => {
    return TypedArray && thing instanceof TypedArray;
  };
})(typeof Uint8Array !== 'undefined' && getPrototypeOf(Uint8Array));

/**
 * For each entry in the object, call the function with the key and value.
 *
 * @param {Object<any, any>} obj - The object to iterate over.
 * @param {Function} fn - The function to call for each entry.
 *
 * @returns {void}
 */
const forEachEntry = (obj, fn) => {
  const generator = obj && obj[iterator];

  const _iterator = generator.call(obj);

  let result;

  while ((result = _iterator.next()) && !result.done) {
    const pair = result.value;
    fn.call(obj, pair[0], pair[1]);
  }
};

/**
 * It takes a regular expression and a string, and returns an array of all the matches
 *
 * @param {string} regExp - The regular expression to match against.
 * @param {string} str - The string to search.
 *
 * @returns {Array<boolean>}
 */
const matchAll = (regExp, str) => {
  let matches;
  const arr = [];

  while ((matches = regExp.exec(str)) !== null) {
    arr.push(matches);
  }

  return arr;
};

/* Checking if the kindOfTest function returns true when passed an HTMLFormElement. */
const isHTMLForm = kindOfTest('HTMLFormElement');

const toCamelCase = str => {
  return str.toLowerCase().replace(/[-_\s]([a-z\d])(\w*)/g,
    function replacer(m, p1, p2) {
      return p1.toUpperCase() + p2;
    }
  );
};

/* Creating a function that will check if an object has a property. */
const hasOwnProperty = (({hasOwnProperty}) => (obj, prop) => hasOwnProperty.call(obj, prop))(Object.prototype);

/**
 * Determine if a value is a RegExp object
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a RegExp object, otherwise false
 */
const isRegExp = kindOfTest('RegExp');

const reduceDescriptors = (obj, reducer) => {
  const descriptors = Object.getOwnPropertyDescriptors(obj);
  const reducedDescriptors = {};

  forEach(descriptors, (descriptor, name) => {
    let ret;
    if ((ret = reducer(descriptor, name, obj)) !== false) {
      reducedDescriptors[name] = ret || descriptor;
    }
  });

  Object.defineProperties(obj, reducedDescriptors);
};

/**
 * Makes all methods read-only
 * @param {Object} obj
 */

const freezeMethods = (obj) => {
  reduceDescriptors(obj, (descriptor, name) => {
    // skip restricted props in strict mode
    if (isFunction(obj) && ['arguments', 'caller', 'callee'].indexOf(name) !== -1) {
      return false;
    }

    const value = obj[name];

    if (!isFunction(value)) return;

    descriptor.enumerable = false;

    if ('writable' in descriptor) {
      descriptor.writable = false;
      return;
    }

    if (!descriptor.set) {
      descriptor.set = () => {
        throw Error('Can not rewrite read-only method \'' + name + '\'');
      };
    }
  });
};

const toObjectSet = (arrayOrString, delimiter) => {
  const obj = {};

  const define = (arr) => {
    arr.forEach(value => {
      obj[value] = true;
    });
  };

  isArray(arrayOrString) ? define(arrayOrString) : define(String(arrayOrString).split(delimiter));

  return obj;
};

const noop = () => {};

const toFiniteNumber = (value, defaultValue) => {
  return value != null && Number.isFinite(value = +value) ? value : defaultValue;
};

/**
 * If the thing is a FormData object, return true, otherwise return false.
 *
 * @param {unknown} thing - The thing to check.
 *
 * @returns {boolean}
 */
function isSpecCompliantForm(thing) {
  return !!(thing && isFunction(thing.append) && thing[toStringTag] === 'FormData' && thing[iterator]);
}

const toJSONObject = (obj) => {
  const stack = new Array(10);

  const visit = (source, i) => {

    if (isObject(source)) {
      if (stack.indexOf(source) >= 0) {
        return;
      }

      if(!('toJSON' in source)) {
        stack[i] = source;
        const target = isArray(source) ? [] : {};

        forEach(source, (value, key) => {
          const reducedValue = visit(value, i + 1);
          !isUndefined(reducedValue) && (target[key] = reducedValue);
        });

        stack[i] = undefined;

        return target;
      }
    }

    return source;
  };

  return visit(obj, 0);
};

const isAsyncFn = kindOfTest('AsyncFunction');

const isThenable = (thing) =>
  thing && (isObject(thing) || isFunction(thing)) && isFunction(thing.then) && isFunction(thing.catch);

// original code
// https://github.com/DigitalBrainJS/AxiosPromise/blob/16deab13710ec09779922131f3fa5954320f83ab/lib/utils.js#L11-L34

const _setImmediate = ((setImmediateSupported, postMessageSupported) => {
  if (setImmediateSupported) {
    return setImmediate;
  }

  return postMessageSupported ? ((token, callbacks) => {
    _global.addEventListener("message", ({source, data}) => {
      if (source === _global && data === token) {
        callbacks.length && callbacks.shift()();
      }
    }, false);

    return (cb) => {
      callbacks.push(cb);
      _global.postMessage(token, "*");
    }
  })(`axios@${Math.random()}`, []) : (cb) => setTimeout(cb);
})(
  typeof setImmediate === 'function',
  isFunction(_global.postMessage)
);

const asap = typeof queueMicrotask !== 'undefined' ?
  queueMicrotask.bind(_global) : ( typeof process !== 'undefined' && process.nextTick || _setImmediate);

// *********************


const isIterable = (thing) => thing != null && isFunction(thing[iterator]);


var utils$2 = {
  isArray,
  isArrayBuffer,
  isBuffer,
  isFormData: isFormData$1,
  isArrayBufferView,
  isString,
  isNumber,
  isBoolean,
  isObject,
  isPlainObject: isPlainObject$1,
  isReadableStream,
  isRequest,
  isResponse,
  isHeaders,
  isUndefined,
  isDate,
  isFile,
  isBlob,
  isRegExp,
  isFunction,
  isStream,
  isURLSearchParams: isURLSearchParams$1,
  isTypedArray,
  isFileList,
  forEach,
  merge,
  extend,
  trim,
  stripBOM,
  inherits,
  toFlatObject,
  kindOf,
  kindOfTest,
  endsWith,
  toArray,
  forEachEntry,
  matchAll,
  isHTMLForm,
  hasOwnProperty,
  hasOwnProp: hasOwnProperty, // an alias to avoid ESLint no-prototype-builtins detection
  reduceDescriptors,
  freezeMethods,
  toObjectSet,
  toCamelCase,
  noop,
  toFiniteNumber,
  findKey,
  global: _global,
  isContextDefined,
  isSpecCompliantForm,
  toJSONObject,
  isAsyncFn,
  isThenable,
  setImmediate: _setImmediate,
  asap,
  isIterable
};

/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [config] The config.
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 *
 * @returns {Error} The created error.
 */
function AxiosError$1(message, code, config, request, response) {
  Error.call(this);

  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, this.constructor);
  } else {
    this.stack = (new Error()).stack;
  }

  this.message = message;
  this.name = 'AxiosError';
  code && (this.code = code);
  config && (this.config = config);
  request && (this.request = request);
  if (response) {
    this.response = response;
    this.status = response.status ? response.status : null;
  }
}

utils$2.inherits(AxiosError$1, Error, {
  toJSON: function toJSON() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: utils$2.toJSONObject(this.config),
      code: this.code,
      status: this.status
    };
  }
});

const prototype$1 = AxiosError$1.prototype;
const descriptors = {};

[
  'ERR_BAD_OPTION_VALUE',
  'ERR_BAD_OPTION',
  'ECONNABORTED',
  'ETIMEDOUT',
  'ERR_NETWORK',
  'ERR_FR_TOO_MANY_REDIRECTS',
  'ERR_DEPRECATED',
  'ERR_BAD_RESPONSE',
  'ERR_BAD_REQUEST',
  'ERR_CANCELED',
  'ERR_NOT_SUPPORT',
  'ERR_INVALID_URL'
// eslint-disable-next-line func-names
].forEach(code => {
  descriptors[code] = {value: code};
});

Object.defineProperties(AxiosError$1, descriptors);
Object.defineProperty(prototype$1, 'isAxiosError', {value: true});

// eslint-disable-next-line func-names
AxiosError$1.from = (error, code, config, request, response, customProps) => {
  const axiosError = Object.create(prototype$1);

  utils$2.toFlatObject(error, axiosError, function filter(obj) {
    return obj !== Error.prototype;
  }, prop => {
    return prop !== 'isAxiosError';
  });

  AxiosError$1.call(axiosError, error.message, code, config, request, response);

  axiosError.cause = error;

  axiosError.name = error.name;

  customProps && Object.assign(axiosError, customProps);

  return axiosError;
};

// eslint-disable-next-line strict
var httpAdapter = null;

/**
 * Determines if the given thing is a array or js object.
 *
 * @param {string} thing - The object or array to be visited.
 *
 * @returns {boolean}
 */
function isVisitable(thing) {
  return utils$2.isPlainObject(thing) || utils$2.isArray(thing);
}

/**
 * It removes the brackets from the end of a string
 *
 * @param {string} key - The key of the parameter.
 *
 * @returns {string} the key without the brackets.
 */
function removeBrackets(key) {
  return utils$2.endsWith(key, '[]') ? key.slice(0, -2) : key;
}

/**
 * It takes a path, a key, and a boolean, and returns a string
 *
 * @param {string} path - The path to the current key.
 * @param {string} key - The key of the current object being iterated over.
 * @param {string} dots - If true, the key will be rendered with dots instead of brackets.
 *
 * @returns {string} The path to the current key.
 */
function renderKey(path, key, dots) {
  if (!path) return key;
  return path.concat(key).map(function each(token, i) {
    // eslint-disable-next-line no-param-reassign
    token = removeBrackets(token);
    return !dots && i ? '[' + token + ']' : token;
  }).join(dots ? '.' : '');
}

/**
 * If the array is an array and none of its elements are visitable, then it's a flat array.
 *
 * @param {Array<any>} arr - The array to check
 *
 * @returns {boolean}
 */
function isFlatArray(arr) {
  return utils$2.isArray(arr) && !arr.some(isVisitable);
}

const predicates = utils$2.toFlatObject(utils$2, {}, null, function filter(prop) {
  return /^is[A-Z]/.test(prop);
});

/**
 * Convert a data object to FormData
 *
 * @param {Object} obj
 * @param {?Object} [formData]
 * @param {?Object} [options]
 * @param {Function} [options.visitor]
 * @param {Boolean} [options.metaTokens = true]
 * @param {Boolean} [options.dots = false]
 * @param {?Boolean} [options.indexes = false]
 *
 * @returns {Object}
 **/

/**
 * It converts an object into a FormData object
 *
 * @param {Object<any, any>} obj - The object to convert to form data.
 * @param {string} formData - The FormData object to append to.
 * @param {Object<string, any>} options
 *
 * @returns
 */
function toFormData$1(obj, formData, options) {
  if (!utils$2.isObject(obj)) {
    throw new TypeError('target must be an object');
  }

  // eslint-disable-next-line no-param-reassign
  formData = formData || new (FormData)();

  // eslint-disable-next-line no-param-reassign
  options = utils$2.toFlatObject(options, {
    metaTokens: true,
    dots: false,
    indexes: false
  }, false, function defined(option, source) {
    // eslint-disable-next-line no-eq-null,eqeqeq
    return !utils$2.isUndefined(source[option]);
  });

  const metaTokens = options.metaTokens;
  // eslint-disable-next-line no-use-before-define
  const visitor = options.visitor || defaultVisitor;
  const dots = options.dots;
  const indexes = options.indexes;
  const _Blob = options.Blob || typeof Blob !== 'undefined' && Blob;
  const useBlob = _Blob && utils$2.isSpecCompliantForm(formData);

  if (!utils$2.isFunction(visitor)) {
    throw new TypeError('visitor must be a function');
  }

  function convertValue(value) {
    if (value === null) return '';

    if (utils$2.isDate(value)) {
      return value.toISOString();
    }

    if (utils$2.isBoolean(value)) {
      return value.toString();
    }

    if (!useBlob && utils$2.isBlob(value)) {
      throw new AxiosError$1('Blob is not supported. Use a Buffer instead.');
    }

    if (utils$2.isArrayBuffer(value) || utils$2.isTypedArray(value)) {
      return useBlob && typeof Blob === 'function' ? new Blob([value]) : Buffer.from(value);
    }

    return value;
  }

  /**
   * Default visitor.
   *
   * @param {*} value
   * @param {String|Number} key
   * @param {Array<String|Number>} path
   * @this {FormData}
   *
   * @returns {boolean} return true to visit the each prop of the value recursively
   */
  function defaultVisitor(value, key, path) {
    let arr = value;

    if (value && !path && typeof value === 'object') {
      if (utils$2.endsWith(key, '{}')) {
        // eslint-disable-next-line no-param-reassign
        key = metaTokens ? key : key.slice(0, -2);
        // eslint-disable-next-line no-param-reassign
        value = JSON.stringify(value);
      } else if (
        (utils$2.isArray(value) && isFlatArray(value)) ||
        ((utils$2.isFileList(value) || utils$2.endsWith(key, '[]')) && (arr = utils$2.toArray(value))
        )) {
        // eslint-disable-next-line no-param-reassign
        key = removeBrackets(key);

        arr.forEach(function each(el, index) {
          !(utils$2.isUndefined(el) || el === null) && formData.append(
            // eslint-disable-next-line no-nested-ternary
            indexes === true ? renderKey([key], index, dots) : (indexes === null ? key : key + '[]'),
            convertValue(el)
          );
        });
        return false;
      }
    }

    if (isVisitable(value)) {
      return true;
    }

    formData.append(renderKey(path, key, dots), convertValue(value));

    return false;
  }

  const stack = [];

  const exposedHelpers = Object.assign(predicates, {
    defaultVisitor,
    convertValue,
    isVisitable
  });

  function build(value, path) {
    if (utils$2.isUndefined(value)) return;

    if (stack.indexOf(value) !== -1) {
      throw Error('Circular reference detected in ' + path.join('.'));
    }

    stack.push(value);

    utils$2.forEach(value, function each(el, key) {
      const result = !(utils$2.isUndefined(el) || el === null) && visitor.call(
        formData, el, utils$2.isString(key) ? key.trim() : key, path, exposedHelpers
      );

      if (result === true) {
        build(el, path ? path.concat(key) : [key]);
      }
    });

    stack.pop();
  }

  if (!utils$2.isObject(obj)) {
    throw new TypeError('data must be an object');
  }

  build(obj);

  return formData;
}

/**
 * It encodes a string by replacing all characters that are not in the unreserved set with
 * their percent-encoded equivalents
 *
 * @param {string} str - The string to encode.
 *
 * @returns {string} The encoded string.
 */
function encode$1(str) {
  const charMap = {
    '!': '%21',
    "'": '%27',
    '(': '%28',
    ')': '%29',
    '~': '%7E',
    '%20': '+',
    '%00': '\x00'
  };
  return encodeURIComponent(str).replace(/[!'()~]|%20|%00/g, function replacer(match) {
    return charMap[match];
  });
}

/**
 * It takes a params object and converts it to a FormData object
 *
 * @param {Object<string, any>} params - The parameters to be converted to a FormData object.
 * @param {Object<string, any>} options - The options object passed to the Axios constructor.
 *
 * @returns {void}
 */
function AxiosURLSearchParams(params, options) {
  this._pairs = [];

  params && toFormData$1(params, this, options);
}

const prototype = AxiosURLSearchParams.prototype;

prototype.append = function append(name, value) {
  this._pairs.push([name, value]);
};

prototype.toString = function toString(encoder) {
  const _encode = encoder ? function(value) {
    return encoder.call(this, value, encode$1);
  } : encode$1;

  return this._pairs.map(function each(pair) {
    return _encode(pair[0]) + '=' + _encode(pair[1]);
  }, '').join('&');
};

/**
 * It replaces all instances of the characters `:`, `$`, `,`, `+`, `[`, and `]` with their
 * URI encoded counterparts
 *
 * @param {string} val The value to be encoded.
 *
 * @returns {string} The encoded value.
 */
function encode(val) {
  return encodeURIComponent(val).
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @param {?(object|Function)} options
 *
 * @returns {string} The formatted url
 */
function buildURL(url, params, options) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }
  
  const _encode = options && options.encode || encode;

  if (utils$2.isFunction(options)) {
    options = {
      serialize: options
    };
  } 

  const serializeFn = options && options.serialize;

  let serializedParams;

  if (serializeFn) {
    serializedParams = serializeFn(params, options);
  } else {
    serializedParams = utils$2.isURLSearchParams(params) ?
      params.toString() :
      new AxiosURLSearchParams(params, options).toString(_encode);
  }

  if (serializedParams) {
    const hashmarkIndex = url.indexOf("#");

    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }
    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
}

class InterceptorManager {
  constructor() {
    this.handlers = [];
  }

  /**
   * Add a new interceptor to the stack
   *
   * @param {Function} fulfilled The function to handle `then` for a `Promise`
   * @param {Function} rejected The function to handle `reject` for a `Promise`
   *
   * @return {Number} An ID used to remove interceptor later
   */
  use(fulfilled, rejected, options) {
    this.handlers.push({
      fulfilled,
      rejected,
      synchronous: options ? options.synchronous : false,
      runWhen: options ? options.runWhen : null
    });
    return this.handlers.length - 1;
  }

  /**
   * Remove an interceptor from the stack
   *
   * @param {Number} id The ID that was returned by `use`
   *
   * @returns {Boolean} `true` if the interceptor was removed, `false` otherwise
   */
  eject(id) {
    if (this.handlers[id]) {
      this.handlers[id] = null;
    }
  }

  /**
   * Clear all interceptors from the stack
   *
   * @returns {void}
   */
  clear() {
    if (this.handlers) {
      this.handlers = [];
    }
  }

  /**
   * Iterate over all the registered interceptors
   *
   * This method is particularly useful for skipping over any
   * interceptors that may have become `null` calling `eject`.
   *
   * @param {Function} fn The function to call for each interceptor
   *
   * @returns {void}
   */
  forEach(fn) {
    utils$2.forEach(this.handlers, function forEachHandler(h) {
      if (h !== null) {
        fn(h);
      }
    });
  }
}

var transitionalDefaults = {
  silentJSONParsing: true,
  forcedJSONParsing: true,
  clarifyTimeoutError: false
};

var URLSearchParams$1 = typeof URLSearchParams !== 'undefined' ? URLSearchParams : AxiosURLSearchParams;

var FormData$1 = typeof FormData !== 'undefined' ? FormData : null;

var Blob$1 = typeof Blob !== 'undefined' ? Blob : null;

var platform$1 = {
  isBrowser: true,
  classes: {
    URLSearchParams: URLSearchParams$1,
    FormData: FormData$1,
    Blob: Blob$1
  },
  protocols: ['http', 'https', 'file', 'blob', 'url', 'data']
};

const hasBrowserEnv = typeof window !== 'undefined' && typeof document !== 'undefined';

const _navigator = typeof navigator === 'object' && navigator || undefined;

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 * nativescript
 *  navigator.product -> 'NativeScript' or 'NS'
 *
 * @returns {boolean}
 */
const hasStandardBrowserEnv = hasBrowserEnv &&
  (!_navigator || ['ReactNative', 'NativeScript', 'NS'].indexOf(_navigator.product) < 0);

/**
 * Determine if we're running in a standard browser webWorker environment
 *
 * Although the `isStandardBrowserEnv` method indicates that
 * `allows axios to run in a web worker`, the WebWorker will still be
 * filtered out due to its judgment standard
 * `typeof window !== 'undefined' && typeof document !== 'undefined'`.
 * This leads to a problem when axios post `FormData` in webWorker
 */
const hasStandardBrowserWebWorkerEnv = (() => {
  return (
    typeof WorkerGlobalScope !== 'undefined' &&
    // eslint-disable-next-line no-undef
    self instanceof WorkerGlobalScope &&
    typeof self.importScripts === 'function'
  );
})();

const origin = hasBrowserEnv && window.location.href || 'http://localhost';

var utils$1 = /*#__PURE__*/Object.freeze({
	__proto__: null,
	hasBrowserEnv: hasBrowserEnv,
	hasStandardBrowserEnv: hasStandardBrowserEnv,
	hasStandardBrowserWebWorkerEnv: hasStandardBrowserWebWorkerEnv,
	navigator: _navigator,
	origin: origin
});

var platform = {
  ...utils$1,
  ...platform$1
};

function toURLEncodedForm(data, options) {
  return toFormData$1(data, new platform.classes.URLSearchParams(), Object.assign({
    visitor: function(value, key, path, helpers) {
      if (platform.isNode && utils$2.isBuffer(value)) {
        this.append(key, value.toString('base64'));
        return false;
      }

      return helpers.defaultVisitor.apply(this, arguments);
    }
  }, options));
}

/**
 * It takes a string like `foo[x][y][z]` and returns an array like `['foo', 'x', 'y', 'z']
 *
 * @param {string} name - The name of the property to get.
 *
 * @returns An array of strings.
 */
function parsePropPath(name) {
  // foo[x][y][z]
  // foo.x.y.z
  // foo-x-y-z
  // foo x y z
  return utils$2.matchAll(/\w+|\[(\w*)]/g, name).map(match => {
    return match[0] === '[]' ? '' : match[1] || match[0];
  });
}

/**
 * Convert an array to an object.
 *
 * @param {Array<any>} arr - The array to convert to an object.
 *
 * @returns An object with the same keys and values as the array.
 */
function arrayToObject(arr) {
  const obj = {};
  const keys = Object.keys(arr);
  let i;
  const len = keys.length;
  let key;
  for (i = 0; i < len; i++) {
    key = keys[i];
    obj[key] = arr[key];
  }
  return obj;
}

/**
 * It takes a FormData object and returns a JavaScript object
 *
 * @param {string} formData The FormData object to convert to JSON.
 *
 * @returns {Object<string, any> | null} The converted object.
 */
function formDataToJSON(formData) {
  function buildPath(path, value, target, index) {
    let name = path[index++];

    if (name === '__proto__') return true;

    const isNumericKey = Number.isFinite(+name);
    const isLast = index >= path.length;
    name = !name && utils$2.isArray(target) ? target.length : name;

    if (isLast) {
      if (utils$2.hasOwnProp(target, name)) {
        target[name] = [target[name], value];
      } else {
        target[name] = value;
      }

      return !isNumericKey;
    }

    if (!target[name] || !utils$2.isObject(target[name])) {
      target[name] = [];
    }

    const result = buildPath(path, value, target[name], index);

    if (result && utils$2.isArray(target[name])) {
      target[name] = arrayToObject(target[name]);
    }

    return !isNumericKey;
  }

  if (utils$2.isFormData(formData) && utils$2.isFunction(formData.entries)) {
    const obj = {};

    utils$2.forEachEntry(formData, (name, value) => {
      buildPath(parsePropPath(name), value, obj, 0);
    });

    return obj;
  }

  return null;
}

/**
 * It takes a string, tries to parse it, and if it fails, it returns the stringified version
 * of the input
 *
 * @param {any} rawValue - The value to be stringified.
 * @param {Function} parser - A function that parses a string into a JavaScript object.
 * @param {Function} encoder - A function that takes a value and returns a string.
 *
 * @returns {string} A stringified version of the rawValue.
 */
function stringifySafely(rawValue, parser, encoder) {
  if (utils$2.isString(rawValue)) {
    try {
      (parser || JSON.parse)(rawValue);
      return utils$2.trim(rawValue);
    } catch (e) {
      if (e.name !== 'SyntaxError') {
        throw e;
      }
    }
  }

  return (encoder || JSON.stringify)(rawValue);
}

const defaults = {

  transitional: transitionalDefaults,

  adapter: ['xhr', 'http', 'fetch'],

  transformRequest: [function transformRequest(data, headers) {
    const contentType = headers.getContentType() || '';
    const hasJSONContentType = contentType.indexOf('application/json') > -1;
    const isObjectPayload = utils$2.isObject(data);

    if (isObjectPayload && utils$2.isHTMLForm(data)) {
      data = new FormData(data);
    }

    const isFormData = utils$2.isFormData(data);

    if (isFormData) {
      return hasJSONContentType ? JSON.stringify(formDataToJSON(data)) : data;
    }

    if (utils$2.isArrayBuffer(data) ||
      utils$2.isBuffer(data) ||
      utils$2.isStream(data) ||
      utils$2.isFile(data) ||
      utils$2.isBlob(data) ||
      utils$2.isReadableStream(data)
    ) {
      return data;
    }
    if (utils$2.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils$2.isURLSearchParams(data)) {
      headers.setContentType('application/x-www-form-urlencoded;charset=utf-8', false);
      return data.toString();
    }

    let isFileList;

    if (isObjectPayload) {
      if (contentType.indexOf('application/x-www-form-urlencoded') > -1) {
        return toURLEncodedForm(data, this.formSerializer).toString();
      }

      if ((isFileList = utils$2.isFileList(data)) || contentType.indexOf('multipart/form-data') > -1) {
        const _FormData = this.env && this.env.FormData;

        return toFormData$1(
          isFileList ? {'files[]': data} : data,
          _FormData && new _FormData(),
          this.formSerializer
        );
      }
    }

    if (isObjectPayload || hasJSONContentType ) {
      headers.setContentType('application/json', false);
      return stringifySafely(data);
    }

    return data;
  }],

  transformResponse: [function transformResponse(data) {
    const transitional = this.transitional || defaults.transitional;
    const forcedJSONParsing = transitional && transitional.forcedJSONParsing;
    const JSONRequested = this.responseType === 'json';

    if (utils$2.isResponse(data) || utils$2.isReadableStream(data)) {
      return data;
    }

    if (data && utils$2.isString(data) && ((forcedJSONParsing && !this.responseType) || JSONRequested)) {
      const silentJSONParsing = transitional && transitional.silentJSONParsing;
      const strictJSONParsing = !silentJSONParsing && JSONRequested;

      try {
        return JSON.parse(data);
      } catch (e) {
        if (strictJSONParsing) {
          if (e.name === 'SyntaxError') {
            throw AxiosError$1.from(e, AxiosError$1.ERR_BAD_RESPONSE, this, null, this.response);
          }
          throw e;
        }
      }
    }

    return data;
  }],

  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,
  maxBodyLength: -1,

  env: {
    FormData: platform.classes.FormData,
    Blob: platform.classes.Blob
  },

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  },

  headers: {
    common: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': undefined
    }
  }
};

utils$2.forEach(['delete', 'get', 'head', 'post', 'put', 'patch'], (method) => {
  defaults.headers[method] = {};
});

// RawAxiosHeaders whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
const ignoreDuplicateOf = utils$2.toObjectSet([
  'age', 'authorization', 'content-length', 'content-type', 'etag',
  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  'referer', 'retry-after', 'user-agent'
]);

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} rawHeaders Headers needing to be parsed
 *
 * @returns {Object} Headers parsed into an object
 */
var parseHeaders = rawHeaders => {
  const parsed = {};
  let key;
  let val;
  let i;

  rawHeaders && rawHeaders.split('\n').forEach(function parser(line) {
    i = line.indexOf(':');
    key = line.substring(0, i).trim().toLowerCase();
    val = line.substring(i + 1).trim();

    if (!key || (parsed[key] && ignoreDuplicateOf[key])) {
      return;
    }

    if (key === 'set-cookie') {
      if (parsed[key]) {
        parsed[key].push(val);
      } else {
        parsed[key] = [val];
      }
    } else {
      parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
    }
  });

  return parsed;
};

const $internals = Symbol('internals');

function normalizeHeader(header) {
  return header && String(header).trim().toLowerCase();
}

function normalizeValue(value) {
  if (value === false || value == null) {
    return value;
  }

  return utils$2.isArray(value) ? value.map(normalizeValue) : String(value);
}

function parseTokens(str) {
  const tokens = Object.create(null);
  const tokensRE = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
  let match;

  while ((match = tokensRE.exec(str))) {
    tokens[match[1]] = match[2];
  }

  return tokens;
}

const isValidHeaderName = (str) => /^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(str.trim());

function matchHeaderValue(context, value, header, filter, isHeaderNameFilter) {
  if (utils$2.isFunction(filter)) {
    return filter.call(this, value, header);
  }

  if (isHeaderNameFilter) {
    value = header;
  }

  if (!utils$2.isString(value)) return;

  if (utils$2.isString(filter)) {
    return value.indexOf(filter) !== -1;
  }

  if (utils$2.isRegExp(filter)) {
    return filter.test(value);
  }
}

function formatHeader(header) {
  return header.trim()
    .toLowerCase().replace(/([a-z\d])(\w*)/g, (w, char, str) => {
      return char.toUpperCase() + str;
    });
}

function buildAccessors(obj, header) {
  const accessorName = utils$2.toCamelCase(' ' + header);

  ['get', 'set', 'has'].forEach(methodName => {
    Object.defineProperty(obj, methodName + accessorName, {
      value: function(arg1, arg2, arg3) {
        return this[methodName].call(this, header, arg1, arg2, arg3);
      },
      configurable: true
    });
  });
}

let AxiosHeaders$1 = class AxiosHeaders {
  constructor(headers) {
    headers && this.set(headers);
  }

  set(header, valueOrRewrite, rewrite) {
    const self = this;

    function setHeader(_value, _header, _rewrite) {
      const lHeader = normalizeHeader(_header);

      if (!lHeader) {
        throw new Error('header name must be a non-empty string');
      }

      const key = utils$2.findKey(self, lHeader);

      if(!key || self[key] === undefined || _rewrite === true || (_rewrite === undefined && self[key] !== false)) {
        self[key || _header] = normalizeValue(_value);
      }
    }

    const setHeaders = (headers, _rewrite) =>
      utils$2.forEach(headers, (_value, _header) => setHeader(_value, _header, _rewrite));

    if (utils$2.isPlainObject(header) || header instanceof this.constructor) {
      setHeaders(header, valueOrRewrite);
    } else if(utils$2.isString(header) && (header = header.trim()) && !isValidHeaderName(header)) {
      setHeaders(parseHeaders(header), valueOrRewrite);
    } else if (utils$2.isObject(header) && utils$2.isIterable(header)) {
      let obj = {}, dest, key;
      for (const entry of header) {
        if (!utils$2.isArray(entry)) {
          throw TypeError('Object iterator must return a key-value pair');
        }

        obj[key = entry[0]] = (dest = obj[key]) ?
          (utils$2.isArray(dest) ? [...dest, entry[1]] : [dest, entry[1]]) : entry[1];
      }

      setHeaders(obj, valueOrRewrite);
    } else {
      header != null && setHeader(valueOrRewrite, header, rewrite);
    }

    return this;
  }

  get(header, parser) {
    header = normalizeHeader(header);

    if (header) {
      const key = utils$2.findKey(this, header);

      if (key) {
        const value = this[key];

        if (!parser) {
          return value;
        }

        if (parser === true) {
          return parseTokens(value);
        }

        if (utils$2.isFunction(parser)) {
          return parser.call(this, value, key);
        }

        if (utils$2.isRegExp(parser)) {
          return parser.exec(value);
        }

        throw new TypeError('parser must be boolean|regexp|function');
      }
    }
  }

  has(header, matcher) {
    header = normalizeHeader(header);

    if (header) {
      const key = utils$2.findKey(this, header);

      return !!(key && this[key] !== undefined && (!matcher || matchHeaderValue(this, this[key], key, matcher)));
    }

    return false;
  }

  delete(header, matcher) {
    const self = this;
    let deleted = false;

    function deleteHeader(_header) {
      _header = normalizeHeader(_header);

      if (_header) {
        const key = utils$2.findKey(self, _header);

        if (key && (!matcher || matchHeaderValue(self, self[key], key, matcher))) {
          delete self[key];

          deleted = true;
        }
      }
    }

    if (utils$2.isArray(header)) {
      header.forEach(deleteHeader);
    } else {
      deleteHeader(header);
    }

    return deleted;
  }

  clear(matcher) {
    const keys = Object.keys(this);
    let i = keys.length;
    let deleted = false;

    while (i--) {
      const key = keys[i];
      if(!matcher || matchHeaderValue(this, this[key], key, matcher, true)) {
        delete this[key];
        deleted = true;
      }
    }

    return deleted;
  }

  normalize(format) {
    const self = this;
    const headers = {};

    utils$2.forEach(this, (value, header) => {
      const key = utils$2.findKey(headers, header);

      if (key) {
        self[key] = normalizeValue(value);
        delete self[header];
        return;
      }

      const normalized = format ? formatHeader(header) : String(header).trim();

      if (normalized !== header) {
        delete self[header];
      }

      self[normalized] = normalizeValue(value);

      headers[normalized] = true;
    });

    return this;
  }

  concat(...targets) {
    return this.constructor.concat(this, ...targets);
  }

  toJSON(asStrings) {
    const obj = Object.create(null);

    utils$2.forEach(this, (value, header) => {
      value != null && value !== false && (obj[header] = asStrings && utils$2.isArray(value) ? value.join(', ') : value);
    });

    return obj;
  }

  [Symbol.iterator]() {
    return Object.entries(this.toJSON())[Symbol.iterator]();
  }

  toString() {
    return Object.entries(this.toJSON()).map(([header, value]) => header + ': ' + value).join('\n');
  }

  getSetCookie() {
    return this.get("set-cookie") || [];
  }

  get [Symbol.toStringTag]() {
    return 'AxiosHeaders';
  }

  static from(thing) {
    return thing instanceof this ? thing : new this(thing);
  }

  static concat(first, ...targets) {
    const computed = new this(first);

    targets.forEach((target) => computed.set(target));

    return computed;
  }

  static accessor(header) {
    const internals = this[$internals] = (this[$internals] = {
      accessors: {}
    });

    const accessors = internals.accessors;
    const prototype = this.prototype;

    function defineAccessor(_header) {
      const lHeader = normalizeHeader(_header);

      if (!accessors[lHeader]) {
        buildAccessors(prototype, _header);
        accessors[lHeader] = true;
      }
    }

    utils$2.isArray(header) ? header.forEach(defineAccessor) : defineAccessor(header);

    return this;
  }
};

AxiosHeaders$1.accessor(['Content-Type', 'Content-Length', 'Accept', 'Accept-Encoding', 'User-Agent', 'Authorization']);

// reserved names hotfix
utils$2.reduceDescriptors(AxiosHeaders$1.prototype, ({value}, key) => {
  let mapped = key[0].toUpperCase() + key.slice(1); // map `set` => `Set`
  return {
    get: () => value,
    set(headerValue) {
      this[mapped] = headerValue;
    }
  }
});

utils$2.freezeMethods(AxiosHeaders$1);

/**
 * Transform the data for a request or a response
 *
 * @param {Array|Function} fns A single function or Array of functions
 * @param {?Object} response The response object
 *
 * @returns {*} The resulting transformed data
 */
function transformData(fns, response) {
  const config = this || defaults;
  const context = response || config;
  const headers = AxiosHeaders$1.from(context.headers);
  let data = context.data;

  utils$2.forEach(fns, function transform(fn) {
    data = fn.call(config, data, headers.normalize(), response ? response.status : undefined);
  });

  headers.normalize();

  return data;
}

function isCancel$1(value) {
  return !!(value && value.__CANCEL__);
}

/**
 * A `CanceledError` is an object that is thrown when an operation is canceled.
 *
 * @param {string=} message The message.
 * @param {Object=} config The config.
 * @param {Object=} request The request.
 *
 * @returns {CanceledError} The created error.
 */
function CanceledError$1(message, config, request) {
  // eslint-disable-next-line no-eq-null,eqeqeq
  AxiosError$1.call(this, message == null ? 'canceled' : message, AxiosError$1.ERR_CANCELED, config, request);
  this.name = 'CanceledError';
}

utils$2.inherits(CanceledError$1, AxiosError$1, {
  __CANCEL__: true
});

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 *
 * @returns {object} The response.
 */
function settle(resolve, reject, response) {
  const validateStatus = response.config.validateStatus;
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(new AxiosError$1(
      'Request failed with status code ' + response.status,
      [AxiosError$1.ERR_BAD_REQUEST, AxiosError$1.ERR_BAD_RESPONSE][Math.floor(response.status / 100) - 4],
      response.config,
      response.request,
      response
    ));
  }
}

function parseProtocol(url) {
  const match = /^([-+\w]{1,25})(:?\/\/|:)/.exec(url);
  return match && match[1] || '';
}

/**
 * Calculate data maxRate
 * @param {Number} [samplesCount= 10]
 * @param {Number} [min= 1000]
 * @returns {Function}
 */
function speedometer(samplesCount, min) {
  samplesCount = samplesCount || 10;
  const bytes = new Array(samplesCount);
  const timestamps = new Array(samplesCount);
  let head = 0;
  let tail = 0;
  let firstSampleTS;

  min = min !== undefined ? min : 1000;

  return function push(chunkLength) {
    const now = Date.now();

    const startedAt = timestamps[tail];

    if (!firstSampleTS) {
      firstSampleTS = now;
    }

    bytes[head] = chunkLength;
    timestamps[head] = now;

    let i = tail;
    let bytesCount = 0;

    while (i !== head) {
      bytesCount += bytes[i++];
      i = i % samplesCount;
    }

    head = (head + 1) % samplesCount;

    if (head === tail) {
      tail = (tail + 1) % samplesCount;
    }

    if (now - firstSampleTS < min) {
      return;
    }

    const passed = startedAt && now - startedAt;

    return passed ? Math.round(bytesCount * 1000 / passed) : undefined;
  };
}

/**
 * Throttle decorator
 * @param {Function} fn
 * @param {Number} freq
 * @return {Function}
 */
function throttle(fn, freq) {
  let timestamp = 0;
  let threshold = 1000 / freq;
  let lastArgs;
  let timer;

  const invoke = (args, now = Date.now()) => {
    timestamp = now;
    lastArgs = null;
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    fn.apply(null, args);
  };

  const throttled = (...args) => {
    const now = Date.now();
    const passed = now - timestamp;
    if ( passed >= threshold) {
      invoke(args, now);
    } else {
      lastArgs = args;
      if (!timer) {
        timer = setTimeout(() => {
          timer = null;
          invoke(lastArgs);
        }, threshold - passed);
      }
    }
  };

  const flush = () => lastArgs && invoke(lastArgs);

  return [throttled, flush];
}

const progressEventReducer = (listener, isDownloadStream, freq = 3) => {
  let bytesNotified = 0;
  const _speedometer = speedometer(50, 250);

  return throttle(e => {
    const loaded = e.loaded;
    const total = e.lengthComputable ? e.total : undefined;
    const progressBytes = loaded - bytesNotified;
    const rate = _speedometer(progressBytes);
    const inRange = loaded <= total;

    bytesNotified = loaded;

    const data = {
      loaded,
      total,
      progress: total ? (loaded / total) : undefined,
      bytes: progressBytes,
      rate: rate ? rate : undefined,
      estimated: rate && total && inRange ? (total - loaded) / rate : undefined,
      event: e,
      lengthComputable: total != null,
      [isDownloadStream ? 'download' : 'upload']: true
    };

    listener(data);
  }, freq);
};

const progressEventDecorator = (total, throttled) => {
  const lengthComputable = total != null;

  return [(loaded) => throttled[0]({
    lengthComputable,
    total,
    loaded
  }), throttled[1]];
};

const asyncDecorator = (fn) => (...args) => utils$2.asap(() => fn(...args));

var isURLSameOrigin = platform.hasStandardBrowserEnv ? ((origin, isMSIE) => (url) => {
  url = new URL(url, platform.origin);

  return (
    origin.protocol === url.protocol &&
    origin.host === url.host &&
    (isMSIE || origin.port === url.port)
  );
})(
  new URL(platform.origin),
  platform.navigator && /(msie|trident)/i.test(platform.navigator.userAgent)
) : () => true;

var cookies = platform.hasStandardBrowserEnv ?

  // Standard browser envs support document.cookie
  {
    write(name, value, expires, path, domain, secure) {
      const cookie = [name + '=' + encodeURIComponent(value)];

      utils$2.isNumber(expires) && cookie.push('expires=' + new Date(expires).toGMTString());

      utils$2.isString(path) && cookie.push('path=' + path);

      utils$2.isString(domain) && cookie.push('domain=' + domain);

      secure === true && cookie.push('secure');

      document.cookie = cookie.join('; ');
    },

    read(name) {
      const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
      return (match ? decodeURIComponent(match[3]) : null);
    },

    remove(name) {
      this.write(name, '', Date.now() - 86400000);
    }
  }

  :

  // Non-standard browser env (web workers, react-native) lack needed support.
  {
    write() {},
    read() {
      return null;
    },
    remove() {}
  };

/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 *
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
}

/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 *
 * @returns {string} The combined URL
 */
function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/?\/$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
}

/**
 * Creates a new URL by combining the baseURL with the requestedURL,
 * only when the requestedURL is not already an absolute URL.
 * If the requestURL is absolute, this function returns the requestedURL untouched.
 *
 * @param {string} baseURL The base URL
 * @param {string} requestedURL Absolute or relative URL to combine
 *
 * @returns {string} The combined full path
 */
function buildFullPath(baseURL, requestedURL, allowAbsoluteUrls) {
  let isRelativeUrl = !isAbsoluteURL(requestedURL);
  if (baseURL && (isRelativeUrl || allowAbsoluteUrls == false)) {
    return combineURLs(baseURL, requestedURL);
  }
  return requestedURL;
}

const headersToObject = (thing) => thing instanceof AxiosHeaders$1 ? { ...thing } : thing;

/**
 * Config-specific merge-function which creates a new config-object
 * by merging two configuration objects together.
 *
 * @param {Object} config1
 * @param {Object} config2
 *
 * @returns {Object} New object resulting from merging config2 to config1
 */
function mergeConfig$1(config1, config2) {
  // eslint-disable-next-line no-param-reassign
  config2 = config2 || {};
  const config = {};

  function getMergedValue(target, source, prop, caseless) {
    if (utils$2.isPlainObject(target) && utils$2.isPlainObject(source)) {
      return utils$2.merge.call({caseless}, target, source);
    } else if (utils$2.isPlainObject(source)) {
      return utils$2.merge({}, source);
    } else if (utils$2.isArray(source)) {
      return source.slice();
    }
    return source;
  }

  // eslint-disable-next-line consistent-return
  function mergeDeepProperties(a, b, prop , caseless) {
    if (!utils$2.isUndefined(b)) {
      return getMergedValue(a, b, prop , caseless);
    } else if (!utils$2.isUndefined(a)) {
      return getMergedValue(undefined, a, prop , caseless);
    }
  }

  // eslint-disable-next-line consistent-return
  function valueFromConfig2(a, b) {
    if (!utils$2.isUndefined(b)) {
      return getMergedValue(undefined, b);
    }
  }

  // eslint-disable-next-line consistent-return
  function defaultToConfig2(a, b) {
    if (!utils$2.isUndefined(b)) {
      return getMergedValue(undefined, b);
    } else if (!utils$2.isUndefined(a)) {
      return getMergedValue(undefined, a);
    }
  }

  // eslint-disable-next-line consistent-return
  function mergeDirectKeys(a, b, prop) {
    if (prop in config2) {
      return getMergedValue(a, b);
    } else if (prop in config1) {
      return getMergedValue(undefined, a);
    }
  }

  const mergeMap = {
    url: valueFromConfig2,
    method: valueFromConfig2,
    data: valueFromConfig2,
    baseURL: defaultToConfig2,
    transformRequest: defaultToConfig2,
    transformResponse: defaultToConfig2,
    paramsSerializer: defaultToConfig2,
    timeout: defaultToConfig2,
    timeoutMessage: defaultToConfig2,
    withCredentials: defaultToConfig2,
    withXSRFToken: defaultToConfig2,
    adapter: defaultToConfig2,
    responseType: defaultToConfig2,
    xsrfCookieName: defaultToConfig2,
    xsrfHeaderName: defaultToConfig2,
    onUploadProgress: defaultToConfig2,
    onDownloadProgress: defaultToConfig2,
    decompress: defaultToConfig2,
    maxContentLength: defaultToConfig2,
    maxBodyLength: defaultToConfig2,
    beforeRedirect: defaultToConfig2,
    transport: defaultToConfig2,
    httpAgent: defaultToConfig2,
    httpsAgent: defaultToConfig2,
    cancelToken: defaultToConfig2,
    socketPath: defaultToConfig2,
    responseEncoding: defaultToConfig2,
    validateStatus: mergeDirectKeys,
    headers: (a, b , prop) => mergeDeepProperties(headersToObject(a), headersToObject(b),prop, true)
  };

  utils$2.forEach(Object.keys(Object.assign({}, config1, config2)), function computeConfigValue(prop) {
    const merge = mergeMap[prop] || mergeDeepProperties;
    const configValue = merge(config1[prop], config2[prop], prop);
    (utils$2.isUndefined(configValue) && merge !== mergeDirectKeys) || (config[prop] = configValue);
  });

  return config;
}

var resolveConfig = (config) => {
  const newConfig = mergeConfig$1({}, config);

  let {data, withXSRFToken, xsrfHeaderName, xsrfCookieName, headers, auth} = newConfig;

  newConfig.headers = headers = AxiosHeaders$1.from(headers);

  newConfig.url = buildURL(buildFullPath(newConfig.baseURL, newConfig.url, newConfig.allowAbsoluteUrls), config.params, config.paramsSerializer);

  // HTTP basic authentication
  if (auth) {
    headers.set('Authorization', 'Basic ' +
      btoa((auth.username || '') + ':' + (auth.password ? unescape(encodeURIComponent(auth.password)) : ''))
    );
  }

  let contentType;

  if (utils$2.isFormData(data)) {
    if (platform.hasStandardBrowserEnv || platform.hasStandardBrowserWebWorkerEnv) {
      headers.setContentType(undefined); // Let the browser set it
    } else if ((contentType = headers.getContentType()) !== false) {
      // fix semicolon duplication issue for ReactNative FormData implementation
      const [type, ...tokens] = contentType ? contentType.split(';').map(token => token.trim()).filter(Boolean) : [];
      headers.setContentType([type || 'multipart/form-data', ...tokens].join('; '));
    }
  }

  // Add xsrf header
  // This is only done if running in a standard browser environment.
  // Specifically not if we're in a web worker, or react-native.

  if (platform.hasStandardBrowserEnv) {
    withXSRFToken && utils$2.isFunction(withXSRFToken) && (withXSRFToken = withXSRFToken(newConfig));

    if (withXSRFToken || (withXSRFToken !== false && isURLSameOrigin(newConfig.url))) {
      // Add xsrf header
      const xsrfValue = xsrfHeaderName && xsrfCookieName && cookies.read(xsrfCookieName);

      if (xsrfValue) {
        headers.set(xsrfHeaderName, xsrfValue);
      }
    }
  }

  return newConfig;
};

const isXHRAdapterSupported = typeof XMLHttpRequest !== 'undefined';

var xhrAdapter = isXHRAdapterSupported && function (config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    const _config = resolveConfig(config);
    let requestData = _config.data;
    const requestHeaders = AxiosHeaders$1.from(_config.headers).normalize();
    let {responseType, onUploadProgress, onDownloadProgress} = _config;
    let onCanceled;
    let uploadThrottled, downloadThrottled;
    let flushUpload, flushDownload;

    function done() {
      flushUpload && flushUpload(); // flush events
      flushDownload && flushDownload(); // flush events

      _config.cancelToken && _config.cancelToken.unsubscribe(onCanceled);

      _config.signal && _config.signal.removeEventListener('abort', onCanceled);
    }

    let request = new XMLHttpRequest();

    request.open(_config.method.toUpperCase(), _config.url, true);

    // Set the request timeout in MS
    request.timeout = _config.timeout;

    function onloadend() {
      if (!request) {
        return;
      }
      // Prepare the response
      const responseHeaders = AxiosHeaders$1.from(
        'getAllResponseHeaders' in request && request.getAllResponseHeaders()
      );
      const responseData = !responseType || responseType === 'text' || responseType === 'json' ?
        request.responseText : request.response;
      const response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config,
        request
      };

      settle(function _resolve(value) {
        resolve(value);
        done();
      }, function _reject(err) {
        reject(err);
        done();
      }, response);

      // Clean up request
      request = null;
    }

    if ('onloadend' in request) {
      // Use onloadend if available
      request.onloadend = onloadend;
    } else {
      // Listen for ready state to emulate onloadend
      request.onreadystatechange = function handleLoad() {
        if (!request || request.readyState !== 4) {
          return;
        }

        // The request errored out and we didn't get a response, this will be
        // handled by onerror instead
        // With one exception: request that using file: protocol, most browsers
        // will return status as 0 even though it's a successful request
        if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
          return;
        }
        // readystate handler is calling before onerror or ontimeout handlers,
        // so we should call onloadend on the next 'tick'
        setTimeout(onloadend);
      };
    }

    // Handle browser request cancellation (as opposed to a manual cancellation)
    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }

      reject(new AxiosError$1('Request aborted', AxiosError$1.ECONNABORTED, config, request));

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(new AxiosError$1('Network Error', AxiosError$1.ERR_NETWORK, config, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      let timeoutErrorMessage = _config.timeout ? 'timeout of ' + _config.timeout + 'ms exceeded' : 'timeout exceeded';
      const transitional = _config.transitional || transitionalDefaults;
      if (_config.timeoutErrorMessage) {
        timeoutErrorMessage = _config.timeoutErrorMessage;
      }
      reject(new AxiosError$1(
        timeoutErrorMessage,
        transitional.clarifyTimeoutError ? AxiosError$1.ETIMEDOUT : AxiosError$1.ECONNABORTED,
        config,
        request));

      // Clean up request
      request = null;
    };

    // Remove Content-Type if data is undefined
    requestData === undefined && requestHeaders.setContentType(null);

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils$2.forEach(requestHeaders.toJSON(), function setRequestHeader(val, key) {
        request.setRequestHeader(key, val);
      });
    }

    // Add withCredentials to request if needed
    if (!utils$2.isUndefined(_config.withCredentials)) {
      request.withCredentials = !!_config.withCredentials;
    }

    // Add responseType to request if needed
    if (responseType && responseType !== 'json') {
      request.responseType = _config.responseType;
    }

    // Handle progress if needed
    if (onDownloadProgress) {
      ([downloadThrottled, flushDownload] = progressEventReducer(onDownloadProgress, true));
      request.addEventListener('progress', downloadThrottled);
    }

    // Not all browsers support upload events
    if (onUploadProgress && request.upload) {
      ([uploadThrottled, flushUpload] = progressEventReducer(onUploadProgress));

      request.upload.addEventListener('progress', uploadThrottled);

      request.upload.addEventListener('loadend', flushUpload);
    }

    if (_config.cancelToken || _config.signal) {
      // Handle cancellation
      // eslint-disable-next-line func-names
      onCanceled = cancel => {
        if (!request) {
          return;
        }
        reject(!cancel || cancel.type ? new CanceledError$1(null, config, request) : cancel);
        request.abort();
        request = null;
      };

      _config.cancelToken && _config.cancelToken.subscribe(onCanceled);
      if (_config.signal) {
        _config.signal.aborted ? onCanceled() : _config.signal.addEventListener('abort', onCanceled);
      }
    }

    const protocol = parseProtocol(_config.url);

    if (protocol && platform.protocols.indexOf(protocol) === -1) {
      reject(new AxiosError$1('Unsupported protocol ' + protocol + ':', AxiosError$1.ERR_BAD_REQUEST, config));
      return;
    }


    // Send the request
    request.send(requestData || null);
  });
};

const composeSignals = (signals, timeout) => {
  const {length} = (signals = signals ? signals.filter(Boolean) : []);

  if (timeout || length) {
    let controller = new AbortController();

    let aborted;

    const onabort = function (reason) {
      if (!aborted) {
        aborted = true;
        unsubscribe();
        const err = reason instanceof Error ? reason : this.reason;
        controller.abort(err instanceof AxiosError$1 ? err : new CanceledError$1(err instanceof Error ? err.message : err));
      }
    };

    let timer = timeout && setTimeout(() => {
      timer = null;
      onabort(new AxiosError$1(`timeout ${timeout} of ms exceeded`, AxiosError$1.ETIMEDOUT));
    }, timeout);

    const unsubscribe = () => {
      if (signals) {
        timer && clearTimeout(timer);
        timer = null;
        signals.forEach(signal => {
          signal.unsubscribe ? signal.unsubscribe(onabort) : signal.removeEventListener('abort', onabort);
        });
        signals = null;
      }
    };

    signals.forEach((signal) => signal.addEventListener('abort', onabort));

    const {signal} = controller;

    signal.unsubscribe = () => utils$2.asap(unsubscribe);

    return signal;
  }
};

const streamChunk = function* (chunk, chunkSize) {
  let len = chunk.byteLength;

  if (len < chunkSize) {
    yield chunk;
    return;
  }

  let pos = 0;
  let end;

  while (pos < len) {
    end = pos + chunkSize;
    yield chunk.slice(pos, end);
    pos = end;
  }
};

const readBytes = async function* (iterable, chunkSize) {
  for await (const chunk of readStream(iterable)) {
    yield* streamChunk(chunk, chunkSize);
  }
};

const readStream = async function* (stream) {
  if (stream[Symbol.asyncIterator]) {
    yield* stream;
    return;
  }

  const reader = stream.getReader();
  try {
    for (;;) {
      const {done, value} = await reader.read();
      if (done) {
        break;
      }
      yield value;
    }
  } finally {
    await reader.cancel();
  }
};

const trackStream = (stream, chunkSize, onProgress, onFinish) => {
  const iterator = readBytes(stream, chunkSize);

  let bytes = 0;
  let done;
  let _onFinish = (e) => {
    if (!done) {
      done = true;
      onFinish && onFinish(e);
    }
  };

  return new ReadableStream({
    async pull(controller) {
      try {
        const {done, value} = await iterator.next();

        if (done) {
         _onFinish();
          controller.close();
          return;
        }

        let len = value.byteLength;
        if (onProgress) {
          let loadedBytes = bytes += len;
          onProgress(loadedBytes);
        }
        controller.enqueue(new Uint8Array(value));
      } catch (err) {
        _onFinish(err);
        throw err;
      }
    },
    cancel(reason) {
      _onFinish(reason);
      return iterator.return();
    }
  }, {
    highWaterMark: 2
  })
};

const isFetchSupported = typeof fetch === 'function' && typeof Request === 'function' && typeof Response === 'function';
const isReadableStreamSupported = isFetchSupported && typeof ReadableStream === 'function';

// used only inside the fetch adapter
const encodeText = isFetchSupported && (typeof TextEncoder === 'function' ?
    ((encoder) => (str) => encoder.encode(str))(new TextEncoder()) :
    async (str) => new Uint8Array(await new Response(str).arrayBuffer())
);

const test = (fn, ...args) => {
  try {
    return !!fn(...args);
  } catch (e) {
    return false
  }
};

const supportsRequestStream = isReadableStreamSupported && test(() => {
  let duplexAccessed = false;

  const hasContentType = new Request(platform.origin, {
    body: new ReadableStream(),
    method: 'POST',
    get duplex() {
      duplexAccessed = true;
      return 'half';
    },
  }).headers.has('Content-Type');

  return duplexAccessed && !hasContentType;
});

const DEFAULT_CHUNK_SIZE = 64 * 1024;

const supportsResponseStream = isReadableStreamSupported &&
  test(() => utils$2.isReadableStream(new Response('').body));


const resolvers = {
  stream: supportsResponseStream && ((res) => res.body)
};

isFetchSupported && (((res) => {
  ['text', 'arrayBuffer', 'blob', 'formData', 'stream'].forEach(type => {
    !resolvers[type] && (resolvers[type] = utils$2.isFunction(res[type]) ? (res) => res[type]() :
      (_, config) => {
        throw new AxiosError$1(`Response type '${type}' is not supported`, AxiosError$1.ERR_NOT_SUPPORT, config);
      });
  });
})(new Response));

const getBodyLength = async (body) => {
  if (body == null) {
    return 0;
  }

  if(utils$2.isBlob(body)) {
    return body.size;
  }

  if(utils$2.isSpecCompliantForm(body)) {
    const _request = new Request(platform.origin, {
      method: 'POST',
      body,
    });
    return (await _request.arrayBuffer()).byteLength;
  }

  if(utils$2.isArrayBufferView(body) || utils$2.isArrayBuffer(body)) {
    return body.byteLength;
  }

  if(utils$2.isURLSearchParams(body)) {
    body = body + '';
  }

  if(utils$2.isString(body)) {
    return (await encodeText(body)).byteLength;
  }
};

const resolveBodyLength = async (headers, body) => {
  const length = utils$2.toFiniteNumber(headers.getContentLength());

  return length == null ? getBodyLength(body) : length;
};

var fetchAdapter = isFetchSupported && (async (config) => {
  let {
    url,
    method,
    data,
    signal,
    cancelToken,
    timeout,
    onDownloadProgress,
    onUploadProgress,
    responseType,
    headers,
    withCredentials = 'same-origin',
    fetchOptions
  } = resolveConfig(config);

  responseType = responseType ? (responseType + '').toLowerCase() : 'text';

  let composedSignal = composeSignals([signal, cancelToken && cancelToken.toAbortSignal()], timeout);

  let request;

  const unsubscribe = composedSignal && composedSignal.unsubscribe && (() => {
      composedSignal.unsubscribe();
  });

  let requestContentLength;

  try {
    if (
      onUploadProgress && supportsRequestStream && method !== 'get' && method !== 'head' &&
      (requestContentLength = await resolveBodyLength(headers, data)) !== 0
    ) {
      let _request = new Request(url, {
        method: 'POST',
        body: data,
        duplex: "half"
      });

      let contentTypeHeader;

      if (utils$2.isFormData(data) && (contentTypeHeader = _request.headers.get('content-type'))) {
        headers.setContentType(contentTypeHeader);
      }

      if (_request.body) {
        const [onProgress, flush] = progressEventDecorator(
          requestContentLength,
          progressEventReducer(asyncDecorator(onUploadProgress))
        );

        data = trackStream(_request.body, DEFAULT_CHUNK_SIZE, onProgress, flush);
      }
    }

    if (!utils$2.isString(withCredentials)) {
      withCredentials = withCredentials ? 'include' : 'omit';
    }

    // Cloudflare Workers throws when credentials are defined
    // see https://github.com/cloudflare/workerd/issues/902
    const isCredentialsSupported = "credentials" in Request.prototype;
    request = new Request(url, {
      ...fetchOptions,
      signal: composedSignal,
      method: method.toUpperCase(),
      headers: headers.normalize().toJSON(),
      body: data,
      duplex: "half",
      credentials: isCredentialsSupported ? withCredentials : undefined
    });

    let response = await fetch(request, fetchOptions);

    const isStreamResponse = supportsResponseStream && (responseType === 'stream' || responseType === 'response');

    if (supportsResponseStream && (onDownloadProgress || (isStreamResponse && unsubscribe))) {
      const options = {};

      ['status', 'statusText', 'headers'].forEach(prop => {
        options[prop] = response[prop];
      });

      const responseContentLength = utils$2.toFiniteNumber(response.headers.get('content-length'));

      const [onProgress, flush] = onDownloadProgress && progressEventDecorator(
        responseContentLength,
        progressEventReducer(asyncDecorator(onDownloadProgress), true)
      ) || [];

      response = new Response(
        trackStream(response.body, DEFAULT_CHUNK_SIZE, onProgress, () => {
          flush && flush();
          unsubscribe && unsubscribe();
        }),
        options
      );
    }

    responseType = responseType || 'text';

    let responseData = await resolvers[utils$2.findKey(resolvers, responseType) || 'text'](response, config);

    !isStreamResponse && unsubscribe && unsubscribe();

    return await new Promise((resolve, reject) => {
      settle(resolve, reject, {
        data: responseData,
        headers: AxiosHeaders$1.from(response.headers),
        status: response.status,
        statusText: response.statusText,
        config,
        request
      });
    })
  } catch (err) {
    unsubscribe && unsubscribe();

    if (err && err.name === 'TypeError' && /Load failed|fetch/i.test(err.message)) {
      throw Object.assign(
        new AxiosError$1('Network Error', AxiosError$1.ERR_NETWORK, config, request),
        {
          cause: err.cause || err
        }
      )
    }

    throw AxiosError$1.from(err, err && err.code, config, request);
  }
});

const knownAdapters = {
  http: httpAdapter,
  xhr: xhrAdapter,
  fetch: fetchAdapter
};

utils$2.forEach(knownAdapters, (fn, value) => {
  if (fn) {
    try {
      Object.defineProperty(fn, 'name', {value});
    } catch (e) {
      // eslint-disable-next-line no-empty
    }
    Object.defineProperty(fn, 'adapterName', {value});
  }
});

const renderReason = (reason) => `- ${reason}`;

const isResolvedHandle = (adapter) => utils$2.isFunction(adapter) || adapter === null || adapter === false;

var adapters = {
  getAdapter: (adapters) => {
    adapters = utils$2.isArray(adapters) ? adapters : [adapters];

    const {length} = adapters;
    let nameOrAdapter;
    let adapter;

    const rejectedReasons = {};

    for (let i = 0; i < length; i++) {
      nameOrAdapter = adapters[i];
      let id;

      adapter = nameOrAdapter;

      if (!isResolvedHandle(nameOrAdapter)) {
        adapter = knownAdapters[(id = String(nameOrAdapter)).toLowerCase()];

        if (adapter === undefined) {
          throw new AxiosError$1(`Unknown adapter '${id}'`);
        }
      }

      if (adapter) {
        break;
      }

      rejectedReasons[id || '#' + i] = adapter;
    }

    if (!adapter) {

      const reasons = Object.entries(rejectedReasons)
        .map(([id, state]) => `adapter ${id} ` +
          (state === false ? 'is not supported by the environment' : 'is not available in the build')
        );

      let s = length ?
        (reasons.length > 1 ? 'since :\n' + reasons.map(renderReason).join('\n') : ' ' + renderReason(reasons[0])) :
        'as no adapter specified';

      throw new AxiosError$1(
        `There is no suitable adapter to dispatch the request ` + s,
        'ERR_NOT_SUPPORT'
      );
    }

    return adapter;
  },
  adapters: knownAdapters
};

/**
 * Throws a `CanceledError` if cancellation has been requested.
 *
 * @param {Object} config The config that is to be used for the request
 *
 * @returns {void}
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }

  if (config.signal && config.signal.aborted) {
    throw new CanceledError$1(null, config);
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 *
 * @returns {Promise} The Promise to be fulfilled
 */
function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  config.headers = AxiosHeaders$1.from(config.headers);

  // Transform request data
  config.data = transformData.call(
    config,
    config.transformRequest
  );

  if (['post', 'put', 'patch'].indexOf(config.method) !== -1) {
    config.headers.setContentType('application/x-www-form-urlencoded', false);
  }

  const adapter = adapters.getAdapter(config.adapter || defaults.adapter);

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData.call(
      config,
      config.transformResponse,
      response
    );

    response.headers = AxiosHeaders$1.from(response.headers);

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel$1(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData.call(
          config,
          config.transformResponse,
          reason.response
        );
        reason.response.headers = AxiosHeaders$1.from(reason.response.headers);
      }
    }

    return Promise.reject(reason);
  });
}

const VERSION$1 = "1.10.0";

const validators$2 = {};

// eslint-disable-next-line func-names
['object', 'boolean', 'number', 'function', 'string', 'symbol'].forEach((type, i) => {
  validators$2[type] = function validator(thing) {
    return typeof thing === type || 'a' + (i < 1 ? 'n ' : ' ') + type;
  };
});

const deprecatedWarnings = {};

/**
 * Transitional option validator
 *
 * @param {function|boolean?} validator - set to false if the transitional option has been removed
 * @param {string?} version - deprecated version / removed since version
 * @param {string?} message - some message with additional info
 *
 * @returns {function}
 */
validators$2.transitional = function transitional(validator, version, message) {
  function formatMessage(opt, desc) {
    return '[Axios v' + VERSION$1 + '] Transitional option \'' + opt + '\'' + desc + (message ? '. ' + message : '');
  }

  // eslint-disable-next-line func-names
  return (value, opt, opts) => {
    if (validator === false) {
      throw new AxiosError$1(
        formatMessage(opt, ' has been removed' + (version ? ' in ' + version : '')),
        AxiosError$1.ERR_DEPRECATED
      );
    }

    if (version && !deprecatedWarnings[opt]) {
      deprecatedWarnings[opt] = true;
      // eslint-disable-next-line no-console
      console.warn(
        formatMessage(
          opt,
          ' has been deprecated since v' + version + ' and will be removed in the near future'
        )
      );
    }

    return validator ? validator(value, opt, opts) : true;
  };
};

validators$2.spelling = function spelling(correctSpelling) {
  return (value, opt) => {
    // eslint-disable-next-line no-console
    console.warn(`${opt} is likely a misspelling of ${correctSpelling}`);
    return true;
  }
};

/**
 * Assert object's properties type
 *
 * @param {object} options
 * @param {object} schema
 * @param {boolean?} allowUnknown
 *
 * @returns {object}
 */

function assertOptions(options, schema, allowUnknown) {
  if (typeof options !== 'object') {
    throw new AxiosError$1('options must be an object', AxiosError$1.ERR_BAD_OPTION_VALUE);
  }
  const keys = Object.keys(options);
  let i = keys.length;
  while (i-- > 0) {
    const opt = keys[i];
    const validator = schema[opt];
    if (validator) {
      const value = options[opt];
      const result = value === undefined || validator(value, opt, options);
      if (result !== true) {
        throw new AxiosError$1('option ' + opt + ' must be ' + result, AxiosError$1.ERR_BAD_OPTION_VALUE);
      }
      continue;
    }
    if (allowUnknown !== true) {
      throw new AxiosError$1('Unknown option ' + opt, AxiosError$1.ERR_BAD_OPTION);
    }
  }
}

var validator = {
  assertOptions,
  validators: validators$2
};

const validators$1 = validator.validators;

/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 *
 * @return {Axios} A new instance of Axios
 */
let Axios$1 = class Axios {
  constructor(instanceConfig) {
    this.defaults = instanceConfig || {};
    this.interceptors = {
      request: new InterceptorManager(),
      response: new InterceptorManager()
    };
  }

  /**
   * Dispatch a request
   *
   * @param {String|Object} configOrUrl The config specific for this request (merged with this.defaults)
   * @param {?Object} config
   *
   * @returns {Promise} The Promise to be fulfilled
   */
  async request(configOrUrl, config) {
    try {
      return await this._request(configOrUrl, config);
    } catch (err) {
      if (err instanceof Error) {
        let dummy = {};

        Error.captureStackTrace ? Error.captureStackTrace(dummy) : (dummy = new Error());

        // slice off the Error: ... line
        const stack = dummy.stack ? dummy.stack.replace(/^.+\n/, '') : '';
        try {
          if (!err.stack) {
            err.stack = stack;
            // match without the 2 top stack lines
          } else if (stack && !String(err.stack).endsWith(stack.replace(/^.+\n.+\n/, ''))) {
            err.stack += '\n' + stack;
          }
        } catch (e) {
          // ignore the case where "stack" is an un-writable property
        }
      }

      throw err;
    }
  }

  _request(configOrUrl, config) {
    /*eslint no-param-reassign:0*/
    // Allow for axios('example/url'[, config]) a la fetch API
    if (typeof configOrUrl === 'string') {
      config = config || {};
      config.url = configOrUrl;
    } else {
      config = configOrUrl || {};
    }

    config = mergeConfig$1(this.defaults, config);

    const {transitional, paramsSerializer, headers} = config;

    if (transitional !== undefined) {
      validator.assertOptions(transitional, {
        silentJSONParsing: validators$1.transitional(validators$1.boolean),
        forcedJSONParsing: validators$1.transitional(validators$1.boolean),
        clarifyTimeoutError: validators$1.transitional(validators$1.boolean)
      }, false);
    }

    if (paramsSerializer != null) {
      if (utils$2.isFunction(paramsSerializer)) {
        config.paramsSerializer = {
          serialize: paramsSerializer
        };
      } else {
        validator.assertOptions(paramsSerializer, {
          encode: validators$1.function,
          serialize: validators$1.function
        }, true);
      }
    }

    // Set config.allowAbsoluteUrls
    if (config.allowAbsoluteUrls !== undefined) ; else if (this.defaults.allowAbsoluteUrls !== undefined) {
      config.allowAbsoluteUrls = this.defaults.allowAbsoluteUrls;
    } else {
      config.allowAbsoluteUrls = true;
    }

    validator.assertOptions(config, {
      baseUrl: validators$1.spelling('baseURL'),
      withXsrfToken: validators$1.spelling('withXSRFToken')
    }, true);

    // Set config.method
    config.method = (config.method || this.defaults.method || 'get').toLowerCase();

    // Flatten headers
    let contextHeaders = headers && utils$2.merge(
      headers.common,
      headers[config.method]
    );

    headers && utils$2.forEach(
      ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
      (method) => {
        delete headers[method];
      }
    );

    config.headers = AxiosHeaders$1.concat(contextHeaders, headers);

    // filter out skipped interceptors
    const requestInterceptorChain = [];
    let synchronousRequestInterceptors = true;
    this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
      if (typeof interceptor.runWhen === 'function' && interceptor.runWhen(config) === false) {
        return;
      }

      synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;

      requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
    });

    const responseInterceptorChain = [];
    this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
      responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
    });

    let promise;
    let i = 0;
    let len;

    if (!synchronousRequestInterceptors) {
      const chain = [dispatchRequest.bind(this), undefined];
      chain.unshift.apply(chain, requestInterceptorChain);
      chain.push.apply(chain, responseInterceptorChain);
      len = chain.length;

      promise = Promise.resolve(config);

      while (i < len) {
        promise = promise.then(chain[i++], chain[i++]);
      }

      return promise;
    }

    len = requestInterceptorChain.length;

    let newConfig = config;

    i = 0;

    while (i < len) {
      const onFulfilled = requestInterceptorChain[i++];
      const onRejected = requestInterceptorChain[i++];
      try {
        newConfig = onFulfilled(newConfig);
      } catch (error) {
        onRejected.call(this, error);
        break;
      }
    }

    try {
      promise = dispatchRequest.call(this, newConfig);
    } catch (error) {
      return Promise.reject(error);
    }

    i = 0;
    len = responseInterceptorChain.length;

    while (i < len) {
      promise = promise.then(responseInterceptorChain[i++], responseInterceptorChain[i++]);
    }

    return promise;
  }

  getUri(config) {
    config = mergeConfig$1(this.defaults, config);
    const fullPath = buildFullPath(config.baseURL, config.url, config.allowAbsoluteUrls);
    return buildURL(fullPath, config.params, config.paramsSerializer);
  }
};

// Provide aliases for supported request methods
utils$2.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios$1.prototype[method] = function(url, config) {
    return this.request(mergeConfig$1(config || {}, {
      method,
      url,
      data: (config || {}).data
    }));
  };
});

utils$2.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/

  function generateHTTPMethod(isForm) {
    return function httpMethod(url, data, config) {
      return this.request(mergeConfig$1(config || {}, {
        method,
        headers: isForm ? {
          'Content-Type': 'multipart/form-data'
        } : {},
        url,
        data
      }));
    };
  }

  Axios$1.prototype[method] = generateHTTPMethod();

  Axios$1.prototype[method + 'Form'] = generateHTTPMethod(true);
});

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @param {Function} executor The executor function.
 *
 * @returns {CancelToken}
 */
let CancelToken$1 = class CancelToken {
  constructor(executor) {
    if (typeof executor !== 'function') {
      throw new TypeError('executor must be a function.');
    }

    let resolvePromise;

    this.promise = new Promise(function promiseExecutor(resolve) {
      resolvePromise = resolve;
    });

    const token = this;

    // eslint-disable-next-line func-names
    this.promise.then(cancel => {
      if (!token._listeners) return;

      let i = token._listeners.length;

      while (i-- > 0) {
        token._listeners[i](cancel);
      }
      token._listeners = null;
    });

    // eslint-disable-next-line func-names
    this.promise.then = onfulfilled => {
      let _resolve;
      // eslint-disable-next-line func-names
      const promise = new Promise(resolve => {
        token.subscribe(resolve);
        _resolve = resolve;
      }).then(onfulfilled);

      promise.cancel = function reject() {
        token.unsubscribe(_resolve);
      };

      return promise;
    };

    executor(function cancel(message, config, request) {
      if (token.reason) {
        // Cancellation has already been requested
        return;
      }

      token.reason = new CanceledError$1(message, config, request);
      resolvePromise(token.reason);
    });
  }

  /**
   * Throws a `CanceledError` if cancellation has been requested.
   */
  throwIfRequested() {
    if (this.reason) {
      throw this.reason;
    }
  }

  /**
   * Subscribe to the cancel signal
   */

  subscribe(listener) {
    if (this.reason) {
      listener(this.reason);
      return;
    }

    if (this._listeners) {
      this._listeners.push(listener);
    } else {
      this._listeners = [listener];
    }
  }

  /**
   * Unsubscribe from the cancel signal
   */

  unsubscribe(listener) {
    if (!this._listeners) {
      return;
    }
    const index = this._listeners.indexOf(listener);
    if (index !== -1) {
      this._listeners.splice(index, 1);
    }
  }

  toAbortSignal() {
    const controller = new AbortController();

    const abort = (err) => {
      controller.abort(err);
    };

    this.subscribe(abort);

    controller.signal.unsubscribe = () => this.unsubscribe(abort);

    return controller.signal;
  }

  /**
   * Returns an object that contains a new `CancelToken` and a function that, when called,
   * cancels the `CancelToken`.
   */
  static source() {
    let cancel;
    const token = new CancelToken(function executor(c) {
      cancel = c;
    });
    return {
      token,
      cancel
    };
  }
};

/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 *
 * @returns {Function}
 */
function spread$1(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
}

/**
 * Determines whether the payload is an error thrown by Axios
 *
 * @param {*} payload The value to test
 *
 * @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
 */
function isAxiosError$1(payload) {
  return utils$2.isObject(payload) && (payload.isAxiosError === true);
}

const HttpStatusCode$1 = {
  Continue: 100,
  SwitchingProtocols: 101,
  Processing: 102,
  EarlyHints: 103,
  Ok: 200,
  Created: 201,
  Accepted: 202,
  NonAuthoritativeInformation: 203,
  NoContent: 204,
  ResetContent: 205,
  PartialContent: 206,
  MultiStatus: 207,
  AlreadyReported: 208,
  ImUsed: 226,
  MultipleChoices: 300,
  MovedPermanently: 301,
  Found: 302,
  SeeOther: 303,
  NotModified: 304,
  UseProxy: 305,
  Unused: 306,
  TemporaryRedirect: 307,
  PermanentRedirect: 308,
  BadRequest: 400,
  Unauthorized: 401,
  PaymentRequired: 402,
  Forbidden: 403,
  NotFound: 404,
  MethodNotAllowed: 405,
  NotAcceptable: 406,
  ProxyAuthenticationRequired: 407,
  RequestTimeout: 408,
  Conflict: 409,
  Gone: 410,
  LengthRequired: 411,
  PreconditionFailed: 412,
  PayloadTooLarge: 413,
  UriTooLong: 414,
  UnsupportedMediaType: 415,
  RangeNotSatisfiable: 416,
  ExpectationFailed: 417,
  ImATeapot: 418,
  MisdirectedRequest: 421,
  UnprocessableEntity: 422,
  Locked: 423,
  FailedDependency: 424,
  TooEarly: 425,
  UpgradeRequired: 426,
  PreconditionRequired: 428,
  TooManyRequests: 429,
  RequestHeaderFieldsTooLarge: 431,
  UnavailableForLegalReasons: 451,
  InternalServerError: 500,
  NotImplemented: 501,
  BadGateway: 502,
  ServiceUnavailable: 503,
  GatewayTimeout: 504,
  HttpVersionNotSupported: 505,
  VariantAlsoNegotiates: 506,
  InsufficientStorage: 507,
  LoopDetected: 508,
  NotExtended: 510,
  NetworkAuthenticationRequired: 511,
};

Object.entries(HttpStatusCode$1).forEach(([key, value]) => {
  HttpStatusCode$1[value] = key;
});

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 *
 * @returns {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  const context = new Axios$1(defaultConfig);
  const instance = bind(Axios$1.prototype.request, context);

  // Copy axios.prototype to instance
  utils$2.extend(instance, Axios$1.prototype, context, {allOwnKeys: true});

  // Copy context to instance
  utils$2.extend(instance, context, null, {allOwnKeys: true});

  // Factory for creating new instances
  instance.create = function create(instanceConfig) {
    return createInstance(mergeConfig$1(defaultConfig, instanceConfig));
  };

  return instance;
}

// Create the default instance to be exported
const axios = createInstance(defaults);

// Expose Axios class to allow class inheritance
axios.Axios = Axios$1;

// Expose Cancel & CancelToken
axios.CanceledError = CanceledError$1;
axios.CancelToken = CancelToken$1;
axios.isCancel = isCancel$1;
axios.VERSION = VERSION$1;
axios.toFormData = toFormData$1;

// Expose AxiosError class
axios.AxiosError = AxiosError$1;

// alias for CanceledError for backward compatibility
axios.Cancel = axios.CanceledError;

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};

axios.spread = spread$1;

// Expose isAxiosError
axios.isAxiosError = isAxiosError$1;

// Expose mergeConfig
axios.mergeConfig = mergeConfig$1;

axios.AxiosHeaders = AxiosHeaders$1;

axios.formToJSON = thing => formDataToJSON(utils$2.isHTMLForm(thing) ? new FormData(thing) : thing);

axios.getAdapter = adapters.getAdapter;

axios.HttpStatusCode = HttpStatusCode$1;

axios.default = axios;

// This module is intended to unwrap Axios default export as named.
// Keep top-level export same with static properties
// so that it can keep same with es module or cjs
const {
  Axios,
  AxiosError,
  CanceledError,
  isCancel,
  CancelToken,
  VERSION,
  all,
  Cancel,
  isAxiosError,
  spread,
  toFormData,
  AxiosHeaders,
  HttpStatusCode,
  formToJSON,
  getAdapter,
  mergeConfig
} = axios;

var isURLSearchParams = function (value) {
    return (typeof URLSearchParams !== 'undefined' && value instanceof URLSearchParams);
};
var isFormData = function (value) {
    return typeof FormData !== 'undefined' && value instanceof FormData;
};
var isPlainObject = function (value) {
    if (value == null) {
        return false;
    }
    var proto = Object.getPrototypeOf(value);
    return proto === null || proto === Object.prototype;
};
var isTransformable = function (value) {
    return (Array.isArray(value) ||
        isPlainObject(value) ||
        isFormData(value) ||
        isURLSearchParams(value));
};
var isAxiosHeaders = function (value) {
    if (value == null) {
        return false;
    }
    return value instanceof AxiosHeaders;
};

var caseFunctions = {
    snake: snakeCase,
    camel: camelCase,
    header: headerCase,
};
var transformObjectUsingCallbackRecursive = function (data, fn, overwrite) {
    var e_1, _a, e_2, _b, e_3, _c;
    if (!isTransformable(data)) {
        return data;
    }
    /* eslint-disable no-console */
    // Check FormData/URLSearchParams compatibility
    if ((isFormData(data) || isURLSearchParams(data)) &&
        (!data.entries || (overwrite && !data.delete))) {
        var type = isFormData(data) ? 'FormData' : 'URLSearchParams';
        var polyfill = isFormData(data)
            ? 'https://github.com/jimmywarting/FormData'
            : 'https://github.com/jerrybendy/url-search-params-polyfill';
        if (typeof navigator !== 'undefined' &&
            navigator.product === 'ReactNative') {
            // You cannot transform FormData/URLSearchParams on React Native
            console.warn("Be careful that ".concat(type, " cannot be transformed on React Native. If you intentionally implemented, ignore this kind of warning: https://facebook.github.io/react-native/docs/debugging.html"));
        }
        else {
            if (!data.entries) {
                // You need to polyfill `entries` method
                console.warn("You must use polyfill of ".concat(type, ".prototype.entries() on Internet Explorer or Safari: ").concat(polyfill));
            }
            if (overwrite && !data.delete) {
                // You need to polyfill `delete` method for overwriting
                console.warn("You must use polyfill of ".concat(type, ".prototype.delete() on Internet Explorer or Safari: ").concat(polyfill));
            }
        }
        return data;
    }
    /* eslint-enable no-console */
    var prototype = Object.getPrototypeOf(data);
    // Storage of new values.
    // New instances are created when overwriting is disabled.
    var store = overwrite
        ? data
        : !prototype
            ? Object.create(null)
            : new prototype.constructor();
    // We need to clean up all entries before overwriting.
    var series;
    if (isFormData(data) || isURLSearchParams(data)) {
        // Create native iterator from FormData/URLSearchParams
        series = data.entries();
        if (overwrite) {
            // When overwriting, native iterator needs to be copied as array.
            series = __spreadArray$1([], __read(series), false);
            try {
                for (var series_1 = __values(series), series_1_1 = series_1.next(); !series_1_1.done; series_1_1 = series_1.next()) {
                    var _d = __read(series_1_1.value, 1), key = _d[0];
                    data.delete(key);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (series_1_1 && !series_1_1.done && (_a = series_1.return)) _a.call(series_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
    }
    else {
        // Create array from objects
        series = Object.entries(data);
        // Array keys never change, so we don't need to clean up
        if (overwrite && !Array.isArray(data)) {
            try {
                for (var series_2 = __values(series), series_2_1 = series_2.next(); !series_2_1.done; series_2_1 = series_2.next()) {
                    var _e = __read(series_2_1.value, 1), key = _e[0];
                    delete data[key];
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (series_2_1 && !series_2_1.done && (_b = series_2.return)) _b.call(series_2);
                }
                finally { if (e_2) throw e_2.error; }
            }
        }
    }
    try {
        for (var series_3 = __values(series), series_3_1 = series_3.next(); !series_3_1.done; series_3_1 = series_3.next()) {
            var _f = __read(series_3_1.value, 2), key = _f[0], value = _f[1];
            if (isFormData(store) || isURLSearchParams(store)) {
                store.append(fn(key), value);
            }
            else if (key !== '__proto__') {
                store[Array.isArray(data) ? Number(key) : fn("".concat(key))] =
                    transformObjectUsingCallbackRecursive(value, fn, overwrite);
            }
        }
    }
    catch (e_3_1) { e_3 = { error: e_3_1 }; }
    finally {
        try {
            if (series_3_1 && !series_3_1.done && (_c = series_3.return)) _c.call(series_3);
        }
        finally { if (e_3) throw e_3.error; }
    }
    return store;
};
var transformObjectUsingCallback = function (data, fn, options) {
    fn = applyCaseOptions(fn, __assign({ stripRegexp: /[^A-Z0-9[\]]+/gi }, options === null || options === void 0 ? void 0 : options.caseOptions));
    if (options === null || options === void 0 ? void 0 : options.preservedKeys) {
        fn = preserveSpecificKeys(fn, options.preservedKeys);
    }
    return transformObjectUsingCallbackRecursive(data, fn, (options === null || options === void 0 ? void 0 : options.overwrite) || false);
};
var createObjectTransformer = function (fn) {
    return function (data, options) {
        return transformObjectUsingCallback(data, fn, options);
    };
};
var createObjectTransformerOf = function (functionName, options) {
    return createObjectTransformer((options === null || options === void 0 ? void 0 : options[functionName]) || caseFunctions[functionName]);
};
var createObjectTransformers = function (options) {
    var e_4, _a;
    var functionNames = Object.keys(caseFunctions);
    var objectTransformers = {};
    try {
        for (var functionNames_1 = __values(functionNames), functionNames_1_1 = functionNames_1.next(); !functionNames_1_1.done; functionNames_1_1 = functionNames_1.next()) {
            var functionName = functionNames_1_1.value;
            objectTransformers[functionName] = createObjectTransformerOf(functionName, options);
        }
    }
    catch (e_4_1) { e_4 = { error: e_4_1 }; }
    finally {
        try {
            if (functionNames_1_1 && !functionNames_1_1.done && (_a = functionNames_1.return)) _a.call(functionNames_1);
        }
        finally { if (e_4) throw e_4.error; }
    }
    return objectTransformers;
};

var createSnakeParamsInterceptor = function (options) {
    var snake = createObjectTransformers(options === null || options === void 0 ? void 0 : options.caseFunctions).snake;
    return function (config) {
        if (!(options === null || options === void 0 ? void 0 : options.ignoreParams) && config.params) {
            config.params = snake(config.params, options);
        }
        return config;
    };
};
var createSnakeRequestTransformer = function (options) {
    var _a = createObjectTransformers(options === null || options === void 0 ? void 0 : options.caseFunctions), snake = _a.snake, header = _a.header;
    return function (data, headers) {
        overwriteHeadersOrNoop(headers, header, options, [
            'common',
            'delete',
            'get',
            'head',
            'post',
            'put',
            'patch',
        ]);
        return snake(data, options);
    };
};
var createCamelResponseTransformer = function (options) {
    var camel = createObjectTransformers(options === null || options === void 0 ? void 0 : options.caseFunctions).camel;
    return function (data, headers) {
        overwriteHeadersOrNoop(headers, camel, options);
        return camel(data, options);
    };
};
var overwriteHeadersOrNoop = function (headers, fn, options, excludedKeys) {
    var e_1, _a, _b, _c;
    if ((options === null || options === void 0 ? void 0 : options.ignoreHeaders) ||
        (!isPlainObject(headers) && !isAxiosHeaders(headers))) {
        return;
    }
    try {
        for (var _d = __values(Object.entries(headers)), _e = _d.next(); !_e.done; _e = _d.next()) {
            var _f = __read(_e.value, 2), key = _f[0], value = _f[1];
            fn(value, __assign({ overwrite: true }, options));
            if ((excludedKeys || []).includes(key)) {
                continue;
            }
            if (isAxiosHeaders(headers)) {
                headers.delete(key);
                headers.set(Object.keys(fn((_b = {}, _b[key] = null, _b), options))[0], value, true);
            }
            else {
                delete headers[key];
                headers[Object.keys(fn((_c = {}, _c[key] = null, _c), options))[0]] = value;
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_e && !_e.done && (_a = _d.return)) _a.call(_d);
        }
        finally { if (e_1) throw e_1.error; }
    }
};
var applyCaseMiddleware = function (axios, options) {
    var _a, _b, _c;
    axios.defaults.transformRequest = __spreadArray$1([
        ((_a = options === null || options === void 0 ? void 0 : options.caseMiddleware) === null || _a === void 0 ? void 0 : _a.requestTransformer) ||
            createSnakeRequestTransformer(options)
    ], __read((Array.isArray(axios.defaults.transformRequest)
        ? axios.defaults.transformRequest
        : axios.defaults.transformRequest !== undefined
            ? [axios.defaults.transformRequest]
            : [])), false);
    axios.defaults.transformResponse = __spreadArray$1(__spreadArray$1([], __read((Array.isArray(axios.defaults.transformResponse)
        ? axios.defaults.transformResponse
        : axios.defaults.transformResponse !== undefined
            ? [axios.defaults.transformResponse]
            : [])), false), [
        ((_b = options === null || options === void 0 ? void 0 : options.caseMiddleware) === null || _b === void 0 ? void 0 : _b.responseTransformer) ||
            createCamelResponseTransformer(options),
    ], false);
    axios.interceptors.request.use(((_c = options === null || options === void 0 ? void 0 : options.caseMiddleware) === null || _c === void 0 ? void 0 : _c.requestInterceptor) ||
        createSnakeParamsInterceptor(options));
    return axios;
};

var es = /*#__PURE__*/Object.freeze({
	__proto__: null,
	default: applyCaseMiddleware
});

var require$$1 = /*@__PURE__*/getAugmentedNamespace(es);

var errors$1 = {};

function fixProto(target, prototype) {
  var setPrototypeOf = Object.setPrototypeOf;
  setPrototypeOf ? setPrototypeOf(target, prototype) : target.__proto__ = prototype;
}
function fixStack(target, fn) {
  if (fn === void 0) {
    fn = target.constructor;
  }

  var captureStackTrace = Error.captureStackTrace;
  captureStackTrace && captureStackTrace(target, fn);
}

var __extends = function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");

    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

var CustomError = function (_super) {
  __extends(CustomError, _super);

  function CustomError(message, options) {
    var _newTarget = this.constructor;

    var _this = _super.call(this, message, options) || this;

    Object.defineProperty(_this, 'name', {
      value: _newTarget.name,
      enumerable: false,
      configurable: true
    });
    fixProto(_this, _newTarget.prototype);
    fixStack(_this);
    return _this;
  }

  return CustomError;
}(Error);

var __spreadArray = function (to, from, pack) {
  if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
    if (ar || !(i in from)) {
      if (!ar) ar = Array.prototype.slice.call(from, 0, i);
      ar[i] = from[i];
    }
  }
  return to.concat(ar || Array.prototype.slice.call(from));
};
function customErrorFactory(fn, parent) {
  if (parent === void 0) {
    parent = Error;
  }

  function CustomError() {
    var args = [];

    for (var _i = 0; _i < arguments.length; _i++) {
      args[_i] = arguments[_i];
    }

    if (!(this instanceof CustomError)) return new (CustomError.bind.apply(CustomError, __spreadArray([void 0], args, false)))();
    parent.apply(this, args);
    Object.defineProperty(this, 'name', {
      value: fn.name || parent.name,
      enumerable: false,
      configurable: true
    });
    fn.apply(this, args);
    fixStack(this, CustomError);
  }

  return Object.defineProperties(CustomError, {
    prototype: {
      value: Object.create(parent.prototype, {
        constructor: {
          value: CustomError,
          writable: true,
          configurable: true
        }
      })
    }
  });
}

var customError = /*#__PURE__*/Object.freeze({
	__proto__: null,
	CustomError: CustomError,
	customErrorFactory: customErrorFactory
});

var require$$0 = /*@__PURE__*/getAugmentedNamespace(customError);

var hasRequiredErrors$1;

function requireErrors$1 () {
	if (hasRequiredErrors$1) return errors$1;
	hasRequiredErrors$1 = 1;
	var __extends = (errors$1 && errors$1.__extends) || (function () {
	    var extendStatics = function (d, b) {
	        extendStatics = Object.setPrototypeOf ||
	            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
	        return extendStatics(d, b);
	    };
	    return function (d, b) {
	        if (typeof b !== "function" && b !== null)
	            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(errors$1, "__esModule", { value: true });
	errors$1.TodoistRequestError = void 0;
	var ts_custom_error_1 = require$$0;
	var authenticationErrorCodes = [401, 403];
	var TodoistRequestError = /** @class */ (function (_super) {
	    __extends(TodoistRequestError, _super);
	    function TodoistRequestError(message, httpStatusCode, responseData) {
	        var _this = _super.call(this, message) || this;
	        _this.message = message;
	        _this.httpStatusCode = httpStatusCode;
	        _this.responseData = responseData;
	        _this.isAuthenticationError = function () {
	            if (!_this.httpStatusCode) {
	                return false;
	            }
	            return authenticationErrorCodes.includes(_this.httpStatusCode);
	        };
	        Object.defineProperty(_this, 'name', { value: 'TodoistRequestError' });
	        return _this;
	    }
	    return TodoistRequestError;
	}(ts_custom_error_1.CustomError));
	errors$1.TodoistRequestError = TodoistRequestError;
	return errors$1;
}

var commonjsBrowser = {};

var v1 = {};

var rng = {};

var hasRequiredRng;

function requireRng () {
	if (hasRequiredRng) return rng;
	hasRequiredRng = 1;

	Object.defineProperty(rng, "__esModule", {
	  value: true
	});
	rng.default = rng$1;
	// Unique ID creation requires a high quality random # generator. In the browser we therefore
	// require the crypto API and do not support built-in fallback to lower quality random number
	// generators (like Math.random()).
	let getRandomValues;
	const rnds8 = new Uint8Array(16);

	function rng$1() {
	  // lazy load so that environments that need to polyfill have a chance to do so
	  if (!getRandomValues) {
	    // getRandomValues needs to be invoked in a context where "this" is a Crypto implementation.
	    getRandomValues = typeof crypto !== 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto);

	    if (!getRandomValues) {
	      throw new Error('crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported');
	    }
	  }

	  return getRandomValues(rnds8);
	}
	return rng;
}

var stringify = {};

var validate = {};

var regex = {};

var hasRequiredRegex;

function requireRegex () {
	if (hasRequiredRegex) return regex;
	hasRequiredRegex = 1;

	Object.defineProperty(regex, "__esModule", {
	  value: true
	});
	regex.default = void 0;
	var _default = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;
	regex.default = _default;
	return regex;
}

var hasRequiredValidate;

function requireValidate () {
	if (hasRequiredValidate) return validate;
	hasRequiredValidate = 1;

	Object.defineProperty(validate, "__esModule", {
	  value: true
	});
	validate.default = void 0;

	var _regex = _interopRequireDefault(/*@__PURE__*/ requireRegex());

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function validate$1(uuid) {
	  return typeof uuid === 'string' && _regex.default.test(uuid);
	}

	var _default = validate$1;
	validate.default = _default;
	return validate;
}

var hasRequiredStringify;

function requireStringify () {
	if (hasRequiredStringify) return stringify;
	hasRequiredStringify = 1;

	Object.defineProperty(stringify, "__esModule", {
	  value: true
	});
	stringify.default = void 0;
	stringify.unsafeStringify = unsafeStringify;

	var _validate = _interopRequireDefault(/*@__PURE__*/ requireValidate());

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * Convert array of 16 byte values to UUID string format of the form:
	 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
	 */
	const byteToHex = [];

	for (let i = 0; i < 256; ++i) {
	  byteToHex.push((i + 0x100).toString(16).slice(1));
	}

	function unsafeStringify(arr, offset = 0) {
	  // Note: Be careful editing this code!  It's been tuned for performance
	  // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
	  return byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]];
	}

	function stringify$1(arr, offset = 0) {
	  const uuid = unsafeStringify(arr, offset); // Consistency check for valid UUID.  If this throws, it's likely due to one
	  // of the following:
	  // - One or more input array values don't map to a hex octet (leading to
	  // "undefined" in the uuid)
	  // - Invalid input values for the RFC `version` or `variant` fields

	  if (!(0, _validate.default)(uuid)) {
	    throw TypeError('Stringified UUID is invalid');
	  }

	  return uuid;
	}

	var _default = stringify$1;
	stringify.default = _default;
	return stringify;
}

var hasRequiredV1;

function requireV1 () {
	if (hasRequiredV1) return v1;
	hasRequiredV1 = 1;

	Object.defineProperty(v1, "__esModule", {
	  value: true
	});
	v1.default = void 0;

	var _rng = _interopRequireDefault(/*@__PURE__*/ requireRng());

	var _stringify = /*@__PURE__*/ requireStringify();

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// **`v1()` - Generate time-based UUID**
	//
	// Inspired by https://github.com/LiosK/UUID.js
	// and http://docs.python.org/library/uuid.html
	let _nodeId;

	let _clockseq; // Previous uuid creation time


	let _lastMSecs = 0;
	let _lastNSecs = 0; // See https://github.com/uuidjs/uuid for API details

	function v1$1(options, buf, offset) {
	  let i = buf && offset || 0;
	  const b = buf || new Array(16);
	  options = options || {};
	  let node = options.node || _nodeId;
	  let clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq; // node and clockseq need to be initialized to random values if they're not
	  // specified.  We do this lazily to minimize issues related to insufficient
	  // system entropy.  See #189

	  if (node == null || clockseq == null) {
	    const seedBytes = options.random || (options.rng || _rng.default)();

	    if (node == null) {
	      // Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
	      node = _nodeId = [seedBytes[0] | 0x01, seedBytes[1], seedBytes[2], seedBytes[3], seedBytes[4], seedBytes[5]];
	    }

	    if (clockseq == null) {
	      // Per 4.2.2, randomize (14 bit) clockseq
	      clockseq = _clockseq = (seedBytes[6] << 8 | seedBytes[7]) & 0x3fff;
	    }
	  } // UUID timestamps are 100 nano-second units since the Gregorian epoch,
	  // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
	  // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
	  // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.


	  let msecs = options.msecs !== undefined ? options.msecs : Date.now(); // Per 4.2.1.2, use count of uuid's generated during the current clock
	  // cycle to simulate higher resolution clock

	  let nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1; // Time since last uuid creation (in msecs)

	  const dt = msecs - _lastMSecs + (nsecs - _lastNSecs) / 10000; // Per 4.2.1.2, Bump clockseq on clock regression

	  if (dt < 0 && options.clockseq === undefined) {
	    clockseq = clockseq + 1 & 0x3fff;
	  } // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
	  // time interval


	  if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
	    nsecs = 0;
	  } // Per 4.2.1.2 Throw error if too many uuids are requested


	  if (nsecs >= 10000) {
	    throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");
	  }

	  _lastMSecs = msecs;
	  _lastNSecs = nsecs;
	  _clockseq = clockseq; // Per 4.1.4 - Convert from unix epoch to Gregorian epoch

	  msecs += 12219292800000; // `time_low`

	  const tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
	  b[i++] = tl >>> 24 & 0xff;
	  b[i++] = tl >>> 16 & 0xff;
	  b[i++] = tl >>> 8 & 0xff;
	  b[i++] = tl & 0xff; // `time_mid`

	  const tmh = msecs / 0x100000000 * 10000 & 0xfffffff;
	  b[i++] = tmh >>> 8 & 0xff;
	  b[i++] = tmh & 0xff; // `time_high_and_version`

	  b[i++] = tmh >>> 24 & 0xf | 0x10; // include version

	  b[i++] = tmh >>> 16 & 0xff; // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)

	  b[i++] = clockseq >>> 8 | 0x80; // `clock_seq_low`

	  b[i++] = clockseq & 0xff; // `node`

	  for (let n = 0; n < 6; ++n) {
	    b[i + n] = node[n];
	  }

	  return buf || (0, _stringify.unsafeStringify)(b);
	}

	var _default = v1$1;
	v1.default = _default;
	return v1;
}

var v3$1 = {};

var v35 = {};

var parse = {};

var hasRequiredParse;

function requireParse () {
	if (hasRequiredParse) return parse;
	hasRequiredParse = 1;

	Object.defineProperty(parse, "__esModule", {
	  value: true
	});
	parse.default = void 0;

	var _validate = _interopRequireDefault(/*@__PURE__*/ requireValidate());

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function parse$1(uuid) {
	  if (!(0, _validate.default)(uuid)) {
	    throw TypeError('Invalid UUID');
	  }

	  let v;
	  const arr = new Uint8Array(16); // Parse ########-....-....-....-............

	  arr[0] = (v = parseInt(uuid.slice(0, 8), 16)) >>> 24;
	  arr[1] = v >>> 16 & 0xff;
	  arr[2] = v >>> 8 & 0xff;
	  arr[3] = v & 0xff; // Parse ........-####-....-....-............

	  arr[4] = (v = parseInt(uuid.slice(9, 13), 16)) >>> 8;
	  arr[5] = v & 0xff; // Parse ........-....-####-....-............

	  arr[6] = (v = parseInt(uuid.slice(14, 18), 16)) >>> 8;
	  arr[7] = v & 0xff; // Parse ........-....-....-####-............

	  arr[8] = (v = parseInt(uuid.slice(19, 23), 16)) >>> 8;
	  arr[9] = v & 0xff; // Parse ........-....-....-....-############
	  // (Use "/" to avoid 32-bit truncation when bit-shifting high-order bytes)

	  arr[10] = (v = parseInt(uuid.slice(24, 36), 16)) / 0x10000000000 & 0xff;
	  arr[11] = v / 0x100000000 & 0xff;
	  arr[12] = v >>> 24 & 0xff;
	  arr[13] = v >>> 16 & 0xff;
	  arr[14] = v >>> 8 & 0xff;
	  arr[15] = v & 0xff;
	  return arr;
	}

	var _default = parse$1;
	parse.default = _default;
	return parse;
}

var hasRequiredV35;

function requireV35 () {
	if (hasRequiredV35) return v35;
	hasRequiredV35 = 1;

	Object.defineProperty(v35, "__esModule", {
	  value: true
	});
	v35.URL = v35.DNS = void 0;
	v35.default = v35$1;

	var _stringify = /*@__PURE__*/ requireStringify();

	var _parse = _interopRequireDefault(/*@__PURE__*/ requireParse());

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function stringToBytes(str) {
	  str = unescape(encodeURIComponent(str)); // UTF8 escape

	  const bytes = [];

	  for (let i = 0; i < str.length; ++i) {
	    bytes.push(str.charCodeAt(i));
	  }

	  return bytes;
	}

	const DNS = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
	v35.DNS = DNS;
	const URL = '6ba7b811-9dad-11d1-80b4-00c04fd430c8';
	v35.URL = URL;

	function v35$1(name, version, hashfunc) {
	  function generateUUID(value, namespace, buf, offset) {
	    var _namespace;

	    if (typeof value === 'string') {
	      value = stringToBytes(value);
	    }

	    if (typeof namespace === 'string') {
	      namespace = (0, _parse.default)(namespace);
	    }

	    if (((_namespace = namespace) === null || _namespace === void 0 ? void 0 : _namespace.length) !== 16) {
	      throw TypeError('Namespace must be array-like (16 iterable integer values, 0-255)');
	    } // Compute hash of namespace and value, Per 4.3
	    // Future: Use spread syntax when supported on all platforms, e.g. `bytes =
	    // hashfunc([...namespace, ... value])`


	    let bytes = new Uint8Array(16 + value.length);
	    bytes.set(namespace);
	    bytes.set(value, namespace.length);
	    bytes = hashfunc(bytes);
	    bytes[6] = bytes[6] & 0x0f | version;
	    bytes[8] = bytes[8] & 0x3f | 0x80;

	    if (buf) {
	      offset = offset || 0;

	      for (let i = 0; i < 16; ++i) {
	        buf[offset + i] = bytes[i];
	      }

	      return buf;
	    }

	    return (0, _stringify.unsafeStringify)(bytes);
	  } // Function#name is not settable on some platforms (#270)


	  try {
	    generateUUID.name = name; // eslint-disable-next-line no-empty
	  } catch (err) {} // For CommonJS default export support


	  generateUUID.DNS = DNS;
	  generateUUID.URL = URL;
	  return generateUUID;
	}
	return v35;
}

var md5 = {};

var hasRequiredMd5;

function requireMd5 () {
	if (hasRequiredMd5) return md5;
	hasRequiredMd5 = 1;

	Object.defineProperty(md5, "__esModule", {
	  value: true
	});
	md5.default = void 0;

	/*
	 * Browser-compatible JavaScript MD5
	 *
	 * Modification of JavaScript MD5
	 * https://github.com/blueimp/JavaScript-MD5
	 *
	 * Copyright 2011, Sebastian Tschan
	 * https://blueimp.net
	 *
	 * Licensed under the MIT license:
	 * https://opensource.org/licenses/MIT
	 *
	 * Based on
	 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
	 * Digest Algorithm, as defined in RFC 1321.
	 * Version 2.2 Copyright (C) Paul Johnston 1999 - 2009
	 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
	 * Distributed under the BSD License
	 * See http://pajhome.org.uk/crypt/md5 for more info.
	 */
	function md5$1(bytes) {
	  if (typeof bytes === 'string') {
	    const msg = unescape(encodeURIComponent(bytes)); // UTF8 escape

	    bytes = new Uint8Array(msg.length);

	    for (let i = 0; i < msg.length; ++i) {
	      bytes[i] = msg.charCodeAt(i);
	    }
	  }

	  return md5ToHexEncodedArray(wordsToMd5(bytesToWords(bytes), bytes.length * 8));
	}
	/*
	 * Convert an array of little-endian words to an array of bytes
	 */


	function md5ToHexEncodedArray(input) {
	  const output = [];
	  const length32 = input.length * 32;
	  const hexTab = '0123456789abcdef';

	  for (let i = 0; i < length32; i += 8) {
	    const x = input[i >> 5] >>> i % 32 & 0xff;
	    const hex = parseInt(hexTab.charAt(x >>> 4 & 0x0f) + hexTab.charAt(x & 0x0f), 16);
	    output.push(hex);
	  }

	  return output;
	}
	/**
	 * Calculate output length with padding and bit length
	 */


	function getOutputLength(inputLength8) {
	  return (inputLength8 + 64 >>> 9 << 4) + 14 + 1;
	}
	/*
	 * Calculate the MD5 of an array of little-endian words, and a bit length.
	 */


	function wordsToMd5(x, len) {
	  /* append padding */
	  x[len >> 5] |= 0x80 << len % 32;
	  x[getOutputLength(len) - 1] = len;
	  let a = 1732584193;
	  let b = -271733879;
	  let c = -1732584194;
	  let d = 271733878;

	  for (let i = 0; i < x.length; i += 16) {
	    const olda = a;
	    const oldb = b;
	    const oldc = c;
	    const oldd = d;
	    a = md5ff(a, b, c, d, x[i], 7, -680876936);
	    d = md5ff(d, a, b, c, x[i + 1], 12, -389564586);
	    c = md5ff(c, d, a, b, x[i + 2], 17, 606105819);
	    b = md5ff(b, c, d, a, x[i + 3], 22, -1044525330);
	    a = md5ff(a, b, c, d, x[i + 4], 7, -176418897);
	    d = md5ff(d, a, b, c, x[i + 5], 12, 1200080426);
	    c = md5ff(c, d, a, b, x[i + 6], 17, -1473231341);
	    b = md5ff(b, c, d, a, x[i + 7], 22, -45705983);
	    a = md5ff(a, b, c, d, x[i + 8], 7, 1770035416);
	    d = md5ff(d, a, b, c, x[i + 9], 12, -1958414417);
	    c = md5ff(c, d, a, b, x[i + 10], 17, -42063);
	    b = md5ff(b, c, d, a, x[i + 11], 22, -1990404162);
	    a = md5ff(a, b, c, d, x[i + 12], 7, 1804603682);
	    d = md5ff(d, a, b, c, x[i + 13], 12, -40341101);
	    c = md5ff(c, d, a, b, x[i + 14], 17, -1502002290);
	    b = md5ff(b, c, d, a, x[i + 15], 22, 1236535329);
	    a = md5gg(a, b, c, d, x[i + 1], 5, -165796510);
	    d = md5gg(d, a, b, c, x[i + 6], 9, -1069501632);
	    c = md5gg(c, d, a, b, x[i + 11], 14, 643717713);
	    b = md5gg(b, c, d, a, x[i], 20, -373897302);
	    a = md5gg(a, b, c, d, x[i + 5], 5, -701558691);
	    d = md5gg(d, a, b, c, x[i + 10], 9, 38016083);
	    c = md5gg(c, d, a, b, x[i + 15], 14, -660478335);
	    b = md5gg(b, c, d, a, x[i + 4], 20, -405537848);
	    a = md5gg(a, b, c, d, x[i + 9], 5, 568446438);
	    d = md5gg(d, a, b, c, x[i + 14], 9, -1019803690);
	    c = md5gg(c, d, a, b, x[i + 3], 14, -187363961);
	    b = md5gg(b, c, d, a, x[i + 8], 20, 1163531501);
	    a = md5gg(a, b, c, d, x[i + 13], 5, -1444681467);
	    d = md5gg(d, a, b, c, x[i + 2], 9, -51403784);
	    c = md5gg(c, d, a, b, x[i + 7], 14, 1735328473);
	    b = md5gg(b, c, d, a, x[i + 12], 20, -1926607734);
	    a = md5hh(a, b, c, d, x[i + 5], 4, -378558);
	    d = md5hh(d, a, b, c, x[i + 8], 11, -2022574463);
	    c = md5hh(c, d, a, b, x[i + 11], 16, 1839030562);
	    b = md5hh(b, c, d, a, x[i + 14], 23, -35309556);
	    a = md5hh(a, b, c, d, x[i + 1], 4, -1530992060);
	    d = md5hh(d, a, b, c, x[i + 4], 11, 1272893353);
	    c = md5hh(c, d, a, b, x[i + 7], 16, -155497632);
	    b = md5hh(b, c, d, a, x[i + 10], 23, -1094730640);
	    a = md5hh(a, b, c, d, x[i + 13], 4, 681279174);
	    d = md5hh(d, a, b, c, x[i], 11, -358537222);
	    c = md5hh(c, d, a, b, x[i + 3], 16, -722521979);
	    b = md5hh(b, c, d, a, x[i + 6], 23, 76029189);
	    a = md5hh(a, b, c, d, x[i + 9], 4, -640364487);
	    d = md5hh(d, a, b, c, x[i + 12], 11, -421815835);
	    c = md5hh(c, d, a, b, x[i + 15], 16, 530742520);
	    b = md5hh(b, c, d, a, x[i + 2], 23, -995338651);
	    a = md5ii(a, b, c, d, x[i], 6, -198630844);
	    d = md5ii(d, a, b, c, x[i + 7], 10, 1126891415);
	    c = md5ii(c, d, a, b, x[i + 14], 15, -1416354905);
	    b = md5ii(b, c, d, a, x[i + 5], 21, -57434055);
	    a = md5ii(a, b, c, d, x[i + 12], 6, 1700485571);
	    d = md5ii(d, a, b, c, x[i + 3], 10, -1894986606);
	    c = md5ii(c, d, a, b, x[i + 10], 15, -1051523);
	    b = md5ii(b, c, d, a, x[i + 1], 21, -2054922799);
	    a = md5ii(a, b, c, d, x[i + 8], 6, 1873313359);
	    d = md5ii(d, a, b, c, x[i + 15], 10, -30611744);
	    c = md5ii(c, d, a, b, x[i + 6], 15, -1560198380);
	    b = md5ii(b, c, d, a, x[i + 13], 21, 1309151649);
	    a = md5ii(a, b, c, d, x[i + 4], 6, -145523070);
	    d = md5ii(d, a, b, c, x[i + 11], 10, -1120210379);
	    c = md5ii(c, d, a, b, x[i + 2], 15, 718787259);
	    b = md5ii(b, c, d, a, x[i + 9], 21, -343485551);
	    a = safeAdd(a, olda);
	    b = safeAdd(b, oldb);
	    c = safeAdd(c, oldc);
	    d = safeAdd(d, oldd);
	  }

	  return [a, b, c, d];
	}
	/*
	 * Convert an array bytes to an array of little-endian words
	 * Characters >255 have their high-byte silently ignored.
	 */


	function bytesToWords(input) {
	  if (input.length === 0) {
	    return [];
	  }

	  const length8 = input.length * 8;
	  const output = new Uint32Array(getOutputLength(length8));

	  for (let i = 0; i < length8; i += 8) {
	    output[i >> 5] |= (input[i / 8] & 0xff) << i % 32;
	  }

	  return output;
	}
	/*
	 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
	 * to work around bugs in some JS interpreters.
	 */


	function safeAdd(x, y) {
	  const lsw = (x & 0xffff) + (y & 0xffff);
	  const msw = (x >> 16) + (y >> 16) + (lsw >> 16);
	  return msw << 16 | lsw & 0xffff;
	}
	/*
	 * Bitwise rotate a 32-bit number to the left.
	 */


	function bitRotateLeft(num, cnt) {
	  return num << cnt | num >>> 32 - cnt;
	}
	/*
	 * These functions implement the four basic operations the algorithm uses.
	 */


	function md5cmn(q, a, b, x, s, t) {
	  return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b);
	}

	function md5ff(a, b, c, d, x, s, t) {
	  return md5cmn(b & c | ~b & d, a, b, x, s, t);
	}

	function md5gg(a, b, c, d, x, s, t) {
	  return md5cmn(b & d | c & ~d, a, b, x, s, t);
	}

	function md5hh(a, b, c, d, x, s, t) {
	  return md5cmn(b ^ c ^ d, a, b, x, s, t);
	}

	function md5ii(a, b, c, d, x, s, t) {
	  return md5cmn(c ^ (b | ~d), a, b, x, s, t);
	}

	var _default = md5$1;
	md5.default = _default;
	return md5;
}

var hasRequiredV3$1;

function requireV3$1 () {
	if (hasRequiredV3$1) return v3$1;
	hasRequiredV3$1 = 1;

	Object.defineProperty(v3$1, "__esModule", {
	  value: true
	});
	v3$1.default = void 0;

	var _v = _interopRequireDefault(/*@__PURE__*/ requireV35());

	var _md = _interopRequireDefault(/*@__PURE__*/ requireMd5());

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	const v3 = (0, _v.default)('v3', 0x30, _md.default);
	var _default = v3;
	v3$1.default = _default;
	return v3$1;
}

var v4 = {};

var native = {};

var hasRequiredNative;

function requireNative () {
	if (hasRequiredNative) return native;
	hasRequiredNative = 1;

	Object.defineProperty(native, "__esModule", {
	  value: true
	});
	native.default = void 0;
	const randomUUID = typeof crypto !== 'undefined' && crypto.randomUUID && crypto.randomUUID.bind(crypto);
	var _default = {
	  randomUUID
	};
	native.default = _default;
	return native;
}

var hasRequiredV4;

function requireV4 () {
	if (hasRequiredV4) return v4;
	hasRequiredV4 = 1;

	Object.defineProperty(v4, "__esModule", {
	  value: true
	});
	v4.default = void 0;

	var _native = _interopRequireDefault(/*@__PURE__*/ requireNative());

	var _rng = _interopRequireDefault(/*@__PURE__*/ requireRng());

	var _stringify = /*@__PURE__*/ requireStringify();

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function v4$1(options, buf, offset) {
	  if (_native.default.randomUUID && !buf && !options) {
	    return _native.default.randomUUID();
	  }

	  options = options || {};

	  const rnds = options.random || (options.rng || _rng.default)(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`


	  rnds[6] = rnds[6] & 0x0f | 0x40;
	  rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided

	  if (buf) {
	    offset = offset || 0;

	    for (let i = 0; i < 16; ++i) {
	      buf[offset + i] = rnds[i];
	    }

	    return buf;
	  }

	  return (0, _stringify.unsafeStringify)(rnds);
	}

	var _default = v4$1;
	v4.default = _default;
	return v4;
}

var v5 = {};

var sha1 = {};

var hasRequiredSha1;

function requireSha1 () {
	if (hasRequiredSha1) return sha1;
	hasRequiredSha1 = 1;

	Object.defineProperty(sha1, "__esModule", {
	  value: true
	});
	sha1.default = void 0;

	// Adapted from Chris Veness' SHA1 code at
	// http://www.movable-type.co.uk/scripts/sha1.html
	function f(s, x, y, z) {
	  switch (s) {
	    case 0:
	      return x & y ^ ~x & z;

	    case 1:
	      return x ^ y ^ z;

	    case 2:
	      return x & y ^ x & z ^ y & z;

	    case 3:
	      return x ^ y ^ z;
	  }
	}

	function ROTL(x, n) {
	  return x << n | x >>> 32 - n;
	}

	function sha1$1(bytes) {
	  const K = [0x5a827999, 0x6ed9eba1, 0x8f1bbcdc, 0xca62c1d6];
	  const H = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0];

	  if (typeof bytes === 'string') {
	    const msg = unescape(encodeURIComponent(bytes)); // UTF8 escape

	    bytes = [];

	    for (let i = 0; i < msg.length; ++i) {
	      bytes.push(msg.charCodeAt(i));
	    }
	  } else if (!Array.isArray(bytes)) {
	    // Convert Array-like to Array
	    bytes = Array.prototype.slice.call(bytes);
	  }

	  bytes.push(0x80);
	  const l = bytes.length / 4 + 2;
	  const N = Math.ceil(l / 16);
	  const M = new Array(N);

	  for (let i = 0; i < N; ++i) {
	    const arr = new Uint32Array(16);

	    for (let j = 0; j < 16; ++j) {
	      arr[j] = bytes[i * 64 + j * 4] << 24 | bytes[i * 64 + j * 4 + 1] << 16 | bytes[i * 64 + j * 4 + 2] << 8 | bytes[i * 64 + j * 4 + 3];
	    }

	    M[i] = arr;
	  }

	  M[N - 1][14] = (bytes.length - 1) * 8 / Math.pow(2, 32);
	  M[N - 1][14] = Math.floor(M[N - 1][14]);
	  M[N - 1][15] = (bytes.length - 1) * 8 & 0xffffffff;

	  for (let i = 0; i < N; ++i) {
	    const W = new Uint32Array(80);

	    for (let t = 0; t < 16; ++t) {
	      W[t] = M[i][t];
	    }

	    for (let t = 16; t < 80; ++t) {
	      W[t] = ROTL(W[t - 3] ^ W[t - 8] ^ W[t - 14] ^ W[t - 16], 1);
	    }

	    let a = H[0];
	    let b = H[1];
	    let c = H[2];
	    let d = H[3];
	    let e = H[4];

	    for (let t = 0; t < 80; ++t) {
	      const s = Math.floor(t / 20);
	      const T = ROTL(a, 5) + f(s, b, c, d) + e + K[s] + W[t] >>> 0;
	      e = d;
	      d = c;
	      c = ROTL(b, 30) >>> 0;
	      b = a;
	      a = T;
	    }

	    H[0] = H[0] + a >>> 0;
	    H[1] = H[1] + b >>> 0;
	    H[2] = H[2] + c >>> 0;
	    H[3] = H[3] + d >>> 0;
	    H[4] = H[4] + e >>> 0;
	  }

	  return [H[0] >> 24 & 0xff, H[0] >> 16 & 0xff, H[0] >> 8 & 0xff, H[0] & 0xff, H[1] >> 24 & 0xff, H[1] >> 16 & 0xff, H[1] >> 8 & 0xff, H[1] & 0xff, H[2] >> 24 & 0xff, H[2] >> 16 & 0xff, H[2] >> 8 & 0xff, H[2] & 0xff, H[3] >> 24 & 0xff, H[3] >> 16 & 0xff, H[3] >> 8 & 0xff, H[3] & 0xff, H[4] >> 24 & 0xff, H[4] >> 16 & 0xff, H[4] >> 8 & 0xff, H[4] & 0xff];
	}

	var _default = sha1$1;
	sha1.default = _default;
	return sha1;
}

var hasRequiredV5;

function requireV5 () {
	if (hasRequiredV5) return v5;
	hasRequiredV5 = 1;

	Object.defineProperty(v5, "__esModule", {
	  value: true
	});
	v5.default = void 0;

	var _v = _interopRequireDefault(/*@__PURE__*/ requireV35());

	var _sha = _interopRequireDefault(/*@__PURE__*/ requireSha1());

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	const v5$1 = (0, _v.default)('v5', 0x50, _sha.default);
	var _default = v5$1;
	v5.default = _default;
	return v5;
}

var nil = {};

var hasRequiredNil;

function requireNil () {
	if (hasRequiredNil) return nil;
	hasRequiredNil = 1;

	Object.defineProperty(nil, "__esModule", {
	  value: true
	});
	nil.default = void 0;
	var _default = '00000000-0000-0000-0000-000000000000';
	nil.default = _default;
	return nil;
}

var version = {};

var hasRequiredVersion;

function requireVersion () {
	if (hasRequiredVersion) return version;
	hasRequiredVersion = 1;

	Object.defineProperty(version, "__esModule", {
	  value: true
	});
	version.default = void 0;

	var _validate = _interopRequireDefault(/*@__PURE__*/ requireValidate());

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function version$1(uuid) {
	  if (!(0, _validate.default)(uuid)) {
	    throw TypeError('Invalid UUID');
	  }

	  return parseInt(uuid.slice(14, 15), 16);
	}

	var _default = version$1;
	version.default = _default;
	return version;
}

var hasRequiredCommonjsBrowser;

function requireCommonjsBrowser () {
	if (hasRequiredCommonjsBrowser) return commonjsBrowser;
	hasRequiredCommonjsBrowser = 1;
	(function (exports) {

		Object.defineProperty(exports, "__esModule", {
		  value: true
		});
		Object.defineProperty(exports, "NIL", {
		  enumerable: true,
		  get: function get() {
		    return _nil.default;
		  }
		});
		Object.defineProperty(exports, "parse", {
		  enumerable: true,
		  get: function get() {
		    return _parse.default;
		  }
		});
		Object.defineProperty(exports, "stringify", {
		  enumerable: true,
		  get: function get() {
		    return _stringify.default;
		  }
		});
		Object.defineProperty(exports, "v1", {
		  enumerable: true,
		  get: function get() {
		    return _v.default;
		  }
		});
		Object.defineProperty(exports, "v3", {
		  enumerable: true,
		  get: function get() {
		    return _v2.default;
		  }
		});
		Object.defineProperty(exports, "v4", {
		  enumerable: true,
		  get: function get() {
		    return _v3.default;
		  }
		});
		Object.defineProperty(exports, "v5", {
		  enumerable: true,
		  get: function get() {
		    return _v4.default;
		  }
		});
		Object.defineProperty(exports, "validate", {
		  enumerable: true,
		  get: function get() {
		    return _validate.default;
		  }
		});
		Object.defineProperty(exports, "version", {
		  enumerable: true,
		  get: function get() {
		    return _version.default;
		  }
		});

		var _v = _interopRequireDefault(/*@__PURE__*/ requireV1());

		var _v2 = _interopRequireDefault(/*@__PURE__*/ requireV3$1());

		var _v3 = _interopRequireDefault(/*@__PURE__*/ requireV4());

		var _v4 = _interopRequireDefault(/*@__PURE__*/ requireV5());

		var _nil = _interopRequireDefault(/*@__PURE__*/ requireNil());

		var _version = _interopRequireDefault(/*@__PURE__*/ requireVersion());

		var _validate = _interopRequireDefault(/*@__PURE__*/ requireValidate());

		var _stringify = _interopRequireDefault(/*@__PURE__*/ requireStringify());

		var _parse = _interopRequireDefault(/*@__PURE__*/ requireParse());

		function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } 
	} (commonjsBrowser));
	return commonjsBrowser;
}

var axiosRetry = {exports: {}};

var cjs$1 = {};

var interopRequireDefault = {exports: {}};

var hasRequiredInteropRequireDefault;

function requireInteropRequireDefault () {
	if (hasRequiredInteropRequireDefault) return interopRequireDefault.exports;
	hasRequiredInteropRequireDefault = 1;
	(function (module) {
		function _interopRequireDefault(e) {
		  return e && e.__esModule ? e : {
		    "default": e
		  };
		}
		module.exports = _interopRequireDefault, module.exports.__esModule = true, module.exports["default"] = module.exports; 
	} (interopRequireDefault));
	return interopRequireDefault.exports;
}

var regeneratorRuntime$1 = {exports: {}};

var OverloadYield = {exports: {}};

var hasRequiredOverloadYield;

function requireOverloadYield () {
	if (hasRequiredOverloadYield) return OverloadYield.exports;
	hasRequiredOverloadYield = 1;
	(function (module) {
		function _OverloadYield(e, d) {
		  this.v = e, this.k = d;
		}
		module.exports = _OverloadYield, module.exports.__esModule = true, module.exports["default"] = module.exports; 
	} (OverloadYield));
	return OverloadYield.exports;
}

var regenerator$1 = {exports: {}};

var regeneratorDefine = {exports: {}};

var hasRequiredRegeneratorDefine;

function requireRegeneratorDefine () {
	if (hasRequiredRegeneratorDefine) return regeneratorDefine.exports;
	hasRequiredRegeneratorDefine = 1;
	(function (module) {
		function _regeneratorDefine(e, r, n, t) {
		  var i = Object.defineProperty;
		  try {
		    i({}, "", {});
		  } catch (e) {
		    i = 0;
		  }
		  module.exports = _regeneratorDefine = function regeneratorDefine(e, r, n, t) {
		    if (r) i ? i(e, r, {
		      value: n,
		      enumerable: !t,
		      configurable: !t,
		      writable: !t
		    }) : e[r] = n;else {
		      var o = function o(r, n) {
		        _regeneratorDefine(e, r, function (e) {
		          return this._invoke(r, n, e);
		        });
		      };
		      o("next", 0), o("throw", 1), o("return", 2);
		    }
		  }, module.exports.__esModule = true, module.exports["default"] = module.exports, _regeneratorDefine(e, r, n, t);
		}
		module.exports = _regeneratorDefine, module.exports.__esModule = true, module.exports["default"] = module.exports; 
	} (regeneratorDefine));
	return regeneratorDefine.exports;
}

var hasRequiredRegenerator$1;

function requireRegenerator$1 () {
	if (hasRequiredRegenerator$1) return regenerator$1.exports;
	hasRequiredRegenerator$1 = 1;
	(function (module) {
		var regeneratorDefine = requireRegeneratorDefine();
		function _regenerator() {
		  /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */
		  var e,
		    t,
		    r = "function" == typeof Symbol ? Symbol : {},
		    n = r.iterator || "@@iterator",
		    o = r.toStringTag || "@@toStringTag";
		  function i(r, n, o, i) {
		    var c = n && n.prototype instanceof Generator ? n : Generator,
		      u = Object.create(c.prototype);
		    return regeneratorDefine(u, "_invoke", function (r, n, o) {
		      var i,
		        c,
		        u,
		        f = 0,
		        p = o || [],
		        y = false,
		        G = {
		          p: 0,
		          n: 0,
		          v: e,
		          a: d,
		          f: d.bind(e, 4),
		          d: function d(t, r) {
		            return i = t, c = 0, u = e, G.n = r, a;
		          }
		        };
		      function d(r, n) {
		        for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) {
		          var o,
		            i = p[t],
		            d = G.p,
		            l = i[2];
		          r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0));
		        }
		        if (o || r > 1) return a;
		        throw y = true, n;
		      }
		      return function (o, p, l) {
		        if (f > 1) throw TypeError("Generator is already running");
		        for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) {
		          i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u);
		          try {
		            if (f = 2, i) {
		              if (c || (o = "next"), t = i[o]) {
		                if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object");
		                if (!t.done) return t;
		                u = t.value, c < 2 && (c = 0);
		              } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1);
		              i = e;
		            } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break;
		          } catch (t) {
		            i = e, c = 1, u = t;
		          } finally {
		            f = 1;
		          }
		        }
		        return {
		          value: t,
		          done: y
		        };
		      };
		    }(r, o, i), true), u;
		  }
		  var a = {};
		  function Generator() {}
		  function GeneratorFunction() {}
		  function GeneratorFunctionPrototype() {}
		  t = Object.getPrototypeOf;
		  var c = [][n] ? t(t([][n]())) : (regeneratorDefine(t = {}, n, function () {
		      return this;
		    }), t),
		    u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c);
		  function f(e) {
		    return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, regeneratorDefine(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e;
		  }
		  return GeneratorFunction.prototype = GeneratorFunctionPrototype, regeneratorDefine(u, "constructor", GeneratorFunctionPrototype), regeneratorDefine(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", regeneratorDefine(GeneratorFunctionPrototype, o, "GeneratorFunction"), regeneratorDefine(u), regeneratorDefine(u, o, "Generator"), regeneratorDefine(u, n, function () {
		    return this;
		  }), regeneratorDefine(u, "toString", function () {
		    return "[object Generator]";
		  }), (module.exports = _regenerator = function _regenerator() {
		    return {
		      w: i,
		      m: f
		    };
		  }, module.exports.__esModule = true, module.exports["default"] = module.exports)();
		}
		module.exports = _regenerator, module.exports.__esModule = true, module.exports["default"] = module.exports; 
	} (regenerator$1));
	return regenerator$1.exports;
}

var regeneratorAsync = {exports: {}};

var regeneratorAsyncGen = {exports: {}};

var regeneratorAsyncIterator = {exports: {}};

var hasRequiredRegeneratorAsyncIterator;

function requireRegeneratorAsyncIterator () {
	if (hasRequiredRegeneratorAsyncIterator) return regeneratorAsyncIterator.exports;
	hasRequiredRegeneratorAsyncIterator = 1;
	(function (module) {
		var OverloadYield = requireOverloadYield();
		var regeneratorDefine = requireRegeneratorDefine();
		function AsyncIterator(t, e) {
		  function n(r, o, i, f) {
		    try {
		      var c = t[r](o),
		        u = c.value;
		      return u instanceof OverloadYield ? e.resolve(u.v).then(function (t) {
		        n("next", t, i, f);
		      }, function (t) {
		        n("throw", t, i, f);
		      }) : e.resolve(u).then(function (t) {
		        c.value = t, i(c);
		      }, function (t) {
		        return n("throw", t, i, f);
		      });
		    } catch (t) {
		      f(t);
		    }
		  }
		  var r;
		  this.next || (regeneratorDefine(AsyncIterator.prototype), regeneratorDefine(AsyncIterator.prototype, "function" == typeof Symbol && Symbol.asyncIterator || "@asyncIterator", function () {
		    return this;
		  })), regeneratorDefine(this, "_invoke", function (t, o, i) {
		    function f() {
		      return new e(function (e, r) {
		        n(t, i, e, r);
		      });
		    }
		    return r = r ? r.then(f, f) : f();
		  }, true);
		}
		module.exports = AsyncIterator, module.exports.__esModule = true, module.exports["default"] = module.exports; 
	} (regeneratorAsyncIterator));
	return regeneratorAsyncIterator.exports;
}

var hasRequiredRegeneratorAsyncGen;

function requireRegeneratorAsyncGen () {
	if (hasRequiredRegeneratorAsyncGen) return regeneratorAsyncGen.exports;
	hasRequiredRegeneratorAsyncGen = 1;
	(function (module) {
		var regenerator = requireRegenerator$1();
		var regeneratorAsyncIterator = requireRegeneratorAsyncIterator();
		function _regeneratorAsyncGen(r, e, t, o, n) {
		  return new regeneratorAsyncIterator(regenerator().w(r, e, t, o), n || Promise);
		}
		module.exports = _regeneratorAsyncGen, module.exports.__esModule = true, module.exports["default"] = module.exports; 
	} (regeneratorAsyncGen));
	return regeneratorAsyncGen.exports;
}

var hasRequiredRegeneratorAsync;

function requireRegeneratorAsync () {
	if (hasRequiredRegeneratorAsync) return regeneratorAsync.exports;
	hasRequiredRegeneratorAsync = 1;
	(function (module) {
		var regeneratorAsyncGen = requireRegeneratorAsyncGen();
		function _regeneratorAsync(n, e, r, t, o) {
		  var a = regeneratorAsyncGen(n, e, r, t, o);
		  return a.next().then(function (n) {
		    return n.done ? n.value : a.next();
		  });
		}
		module.exports = _regeneratorAsync, module.exports.__esModule = true, module.exports["default"] = module.exports; 
	} (regeneratorAsync));
	return regeneratorAsync.exports;
}

var regeneratorKeys = {exports: {}};

var hasRequiredRegeneratorKeys;

function requireRegeneratorKeys () {
	if (hasRequiredRegeneratorKeys) return regeneratorKeys.exports;
	hasRequiredRegeneratorKeys = 1;
	(function (module) {
		function _regeneratorKeys(e) {
		  var n = Object(e),
		    r = [];
		  for (var t in n) r.unshift(t);
		  return function e() {
		    for (; r.length;) if ((t = r.pop()) in n) return e.value = t, e.done = false, e;
		    return e.done = true, e;
		  };
		}
		module.exports = _regeneratorKeys, module.exports.__esModule = true, module.exports["default"] = module.exports; 
	} (regeneratorKeys));
	return regeneratorKeys.exports;
}

var regeneratorValues = {exports: {}};

var _typeof = {exports: {}};

var hasRequired_typeof;

function require_typeof () {
	if (hasRequired_typeof) return _typeof.exports;
	hasRequired_typeof = 1;
	(function (module) {
		function _typeof(o) {
		  "@babel/helpers - typeof";

		  return module.exports = _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
		    return typeof o;
		  } : function (o) {
		    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
		  }, module.exports.__esModule = true, module.exports["default"] = module.exports, _typeof(o);
		}
		module.exports = _typeof, module.exports.__esModule = true, module.exports["default"] = module.exports; 
	} (_typeof));
	return _typeof.exports;
}

var hasRequiredRegeneratorValues;

function requireRegeneratorValues () {
	if (hasRequiredRegeneratorValues) return regeneratorValues.exports;
	hasRequiredRegeneratorValues = 1;
	(function (module) {
		var _typeof = require_typeof()["default"];
		function _regeneratorValues(e) {
		  if (null != e) {
		    var t = e["function" == typeof Symbol && Symbol.iterator || "@@iterator"],
		      r = 0;
		    if (t) return t.call(e);
		    if ("function" == typeof e.next) return e;
		    if (!isNaN(e.length)) return {
		      next: function next() {
		        return e && r >= e.length && (e = void 0), {
		          value: e && e[r++],
		          done: !e
		        };
		      }
		    };
		  }
		  throw new TypeError(_typeof(e) + " is not iterable");
		}
		module.exports = _regeneratorValues, module.exports.__esModule = true, module.exports["default"] = module.exports; 
	} (regeneratorValues));
	return regeneratorValues.exports;
}

var hasRequiredRegeneratorRuntime;

function requireRegeneratorRuntime () {
	if (hasRequiredRegeneratorRuntime) return regeneratorRuntime$1.exports;
	hasRequiredRegeneratorRuntime = 1;
	(function (module) {
		var OverloadYield = requireOverloadYield();
		var regenerator = requireRegenerator$1();
		var regeneratorAsync = requireRegeneratorAsync();
		var regeneratorAsyncGen = requireRegeneratorAsyncGen();
		var regeneratorAsyncIterator = requireRegeneratorAsyncIterator();
		var regeneratorKeys = requireRegeneratorKeys();
		var regeneratorValues = requireRegeneratorValues();
		function _regeneratorRuntime() {

		  var r = regenerator(),
		    e = r.m(_regeneratorRuntime),
		    t = (Object.getPrototypeOf ? Object.getPrototypeOf(e) : e.__proto__).constructor;
		  function n(r) {
		    var e = "function" == typeof r && r.constructor;
		    return !!e && (e === t || "GeneratorFunction" === (e.displayName || e.name));
		  }
		  var o = {
		    "throw": 1,
		    "return": 2,
		    "break": 3,
		    "continue": 3
		  };
		  function a(r) {
		    var e, t;
		    return function (n) {
		      e || (e = {
		        stop: function stop() {
		          return t(n.a, 2);
		        },
		        "catch": function _catch() {
		          return n.v;
		        },
		        abrupt: function abrupt(r, e) {
		          return t(n.a, o[r], e);
		        },
		        delegateYield: function delegateYield(r, o, a) {
		          return e.resultName = o, t(n.d, regeneratorValues(r), a);
		        },
		        finish: function finish(r) {
		          return t(n.f, r);
		        }
		      }, t = function t(r, _t, o) {
		        n.p = e.prev, n.n = e.next;
		        try {
		          return r(_t, o);
		        } finally {
		          e.next = n.n;
		        }
		      }), e.resultName && (e[e.resultName] = n.v, e.resultName = void 0), e.sent = n.v, e.next = n.n;
		      try {
		        return r.call(this, e);
		      } finally {
		        n.p = e.prev, n.n = e.next;
		      }
		    };
		  }
		  return (module.exports = _regeneratorRuntime = function _regeneratorRuntime() {
		    return {
		      wrap: function wrap(e, t, n, o) {
		        return r.w(a(e), t, n, o && o.reverse());
		      },
		      isGeneratorFunction: n,
		      mark: r.m,
		      awrap: function awrap(r, e) {
		        return new OverloadYield(r, e);
		      },
		      AsyncIterator: regeneratorAsyncIterator,
		      async: function async(r, e, t, o, u) {
		        return (n(e) ? regeneratorAsyncGen : regeneratorAsync)(a(r), e, t, o, u);
		      },
		      keys: regeneratorKeys,
		      values: regeneratorValues
		    };
		  }, module.exports.__esModule = true, module.exports["default"] = module.exports)();
		}
		module.exports = _regeneratorRuntime, module.exports.__esModule = true, module.exports["default"] = module.exports; 
	} (regeneratorRuntime$1));
	return regeneratorRuntime$1.exports;
}

var regenerator;
var hasRequiredRegenerator;

function requireRegenerator () {
	if (hasRequiredRegenerator) return regenerator;
	hasRequiredRegenerator = 1;
	// TODO(Babel 8): Remove this file.

	var runtime = requireRegeneratorRuntime()();
	regenerator = runtime;

	// Copied from https://github.com/facebook/regenerator/blob/main/packages/runtime/runtime.js#L736=
	try {
	  regeneratorRuntime = runtime;
	} catch (accidentalStrictMode) {
	  if (typeof globalThis === "object") {
	    globalThis.regeneratorRuntime = runtime;
	  } else {
	    Function("r", "regeneratorRuntime = r")(runtime);
	  }
	}
	return regenerator;
}

var asyncToGenerator = {exports: {}};

var hasRequiredAsyncToGenerator;

function requireAsyncToGenerator () {
	if (hasRequiredAsyncToGenerator) return asyncToGenerator.exports;
	hasRequiredAsyncToGenerator = 1;
	(function (module) {
		function asyncGeneratorStep(n, t, e, r, o, a, c) {
		  try {
		    var i = n[a](c),
		      u = i.value;
		  } catch (n) {
		    return void e(n);
		  }
		  i.done ? t(u) : Promise.resolve(u).then(r, o);
		}
		function _asyncToGenerator(n) {
		  return function () {
		    var t = this,
		      e = arguments;
		    return new Promise(function (r, o) {
		      var a = n.apply(t, e);
		      function _next(n) {
		        asyncGeneratorStep(a, r, o, _next, _throw, "next", n);
		      }
		      function _throw(n) {
		        asyncGeneratorStep(a, r, o, _next, _throw, "throw", n);
		      }
		      _next(void 0);
		    });
		  };
		}
		module.exports = _asyncToGenerator, module.exports.__esModule = true, module.exports["default"] = module.exports; 
	} (asyncToGenerator));
	return asyncToGenerator.exports;
}

var defineProperty = {exports: {}};

var toPropertyKey = {exports: {}};

var toPrimitive = {exports: {}};

var hasRequiredToPrimitive;

function requireToPrimitive () {
	if (hasRequiredToPrimitive) return toPrimitive.exports;
	hasRequiredToPrimitive = 1;
	(function (module) {
		var _typeof = require_typeof()["default"];
		function toPrimitive(t, r) {
		  if ("object" != _typeof(t) || !t) return t;
		  var e = t[Symbol.toPrimitive];
		  if (void 0 !== e) {
		    var i = e.call(t, r || "default");
		    if ("object" != _typeof(i)) return i;
		    throw new TypeError("@@toPrimitive must return a primitive value.");
		  }
		  return ("string" === r ? String : Number)(t);
		}
		module.exports = toPrimitive, module.exports.__esModule = true, module.exports["default"] = module.exports; 
	} (toPrimitive));
	return toPrimitive.exports;
}

var hasRequiredToPropertyKey;

function requireToPropertyKey () {
	if (hasRequiredToPropertyKey) return toPropertyKey.exports;
	hasRequiredToPropertyKey = 1;
	(function (module) {
		var _typeof = require_typeof()["default"];
		var toPrimitive = requireToPrimitive();
		function toPropertyKey(t) {
		  var i = toPrimitive(t, "string");
		  return "symbol" == _typeof(i) ? i : i + "";
		}
		module.exports = toPropertyKey, module.exports.__esModule = true, module.exports["default"] = module.exports; 
	} (toPropertyKey));
	return toPropertyKey.exports;
}

var hasRequiredDefineProperty;

function requireDefineProperty () {
	if (hasRequiredDefineProperty) return defineProperty.exports;
	hasRequiredDefineProperty = 1;
	(function (module) {
		var toPropertyKey = requireToPropertyKey();
		function _defineProperty(e, r, t) {
		  return (r = toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
		    value: t,
		    enumerable: true,
		    configurable: true,
		    writable: true
		  }) : e[r] = t, e;
		}
		module.exports = _defineProperty, module.exports.__esModule = true, module.exports["default"] = module.exports; 
	} (defineProperty));
	return defineProperty.exports;
}

var isRetryAllowed;
var hasRequiredIsRetryAllowed;

function requireIsRetryAllowed () {
	if (hasRequiredIsRetryAllowed) return isRetryAllowed;
	hasRequiredIsRetryAllowed = 1;

	const denyList = new Set([
		'ENOTFOUND',
		'ENETUNREACH',

		// SSL errors from https://github.com/nodejs/node/blob/fc8e3e2cdc521978351de257030db0076d79e0ab/src/crypto/crypto_common.cc#L301-L328
		'UNABLE_TO_GET_ISSUER_CERT',
		'UNABLE_TO_GET_CRL',
		'UNABLE_TO_DECRYPT_CERT_SIGNATURE',
		'UNABLE_TO_DECRYPT_CRL_SIGNATURE',
		'UNABLE_TO_DECODE_ISSUER_PUBLIC_KEY',
		'CERT_SIGNATURE_FAILURE',
		'CRL_SIGNATURE_FAILURE',
		'CERT_NOT_YET_VALID',
		'CERT_HAS_EXPIRED',
		'CRL_NOT_YET_VALID',
		'CRL_HAS_EXPIRED',
		'ERROR_IN_CERT_NOT_BEFORE_FIELD',
		'ERROR_IN_CERT_NOT_AFTER_FIELD',
		'ERROR_IN_CRL_LAST_UPDATE_FIELD',
		'ERROR_IN_CRL_NEXT_UPDATE_FIELD',
		'OUT_OF_MEM',
		'DEPTH_ZERO_SELF_SIGNED_CERT',
		'SELF_SIGNED_CERT_IN_CHAIN',
		'UNABLE_TO_GET_ISSUER_CERT_LOCALLY',
		'UNABLE_TO_VERIFY_LEAF_SIGNATURE',
		'CERT_CHAIN_TOO_LONG',
		'CERT_REVOKED',
		'INVALID_CA',
		'PATH_LENGTH_EXCEEDED',
		'INVALID_PURPOSE',
		'CERT_UNTRUSTED',
		'CERT_REJECTED',
		'HOSTNAME_MISMATCH'
	]);

	// TODO: Use `error?.code` when targeting Node.js 14
	isRetryAllowed = error => !denyList.has(error && error.code);
	return isRetryAllowed;
}

var hasRequiredCjs$1;

function requireCjs$1 () {
	if (hasRequiredCjs$1) return cjs$1;
	hasRequiredCjs$1 = 1;

	var _interopRequireDefault = requireInteropRequireDefault();

	Object.defineProperty(cjs$1, "__esModule", {
	  value: true
	});
	cjs$1.isNetworkError = isNetworkError;
	cjs$1.isRetryableError = isRetryableError;
	cjs$1.isSafeRequestError = isSafeRequestError;
	cjs$1.isIdempotentRequestError = isIdempotentRequestError;
	cjs$1.isNetworkOrIdempotentRequestError = isNetworkOrIdempotentRequestError;
	cjs$1.exponentialDelay = exponentialDelay;
	cjs$1.default = axiosRetry;
	cjs$1.DEFAULT_OPTIONS = cjs$1.namespace = void 0;

	var _regenerator = _interopRequireDefault(requireRegenerator());

	var _typeof2 = _interopRequireDefault(require_typeof());

	var _asyncToGenerator2 = _interopRequireDefault(requireAsyncToGenerator());

	var _defineProperty2 = _interopRequireDefault(requireDefineProperty());

	var _isRetryAllowed = _interopRequireDefault(requireIsRetryAllowed());

	function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

	function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

	var namespace = 'axios-retry';
	/**
	 * @param  {Error}  error
	 * @return {boolean}
	 */

	cjs$1.namespace = namespace;

	function isNetworkError(error) {
	  var CODE_EXCLUDE_LIST = ['ERR_CANCELED', 'ECONNABORTED'];
	  return !error.response && Boolean(error.code) && // Prevents retrying cancelled requests
	  !CODE_EXCLUDE_LIST.includes(error.code) && // Prevents retrying timed out & cancelled requests
	  (0, _isRetryAllowed.default)(error) // Prevents retrying unsafe errors
	  ;
	}

	var SAFE_HTTP_METHODS = ['get', 'head', 'options'];
	var IDEMPOTENT_HTTP_METHODS = SAFE_HTTP_METHODS.concat(['put', 'delete']);
	/**
	 * @param  {Error}  error
	 * @return {boolean}
	 */

	function isRetryableError(error) {
	  return error.code !== 'ECONNABORTED' && (!error.response || error.response.status >= 500 && error.response.status <= 599);
	}
	/**
	 * @param  {Error}  error
	 * @return {boolean}
	 */


	function isSafeRequestError(error) {
	  if (!error.config) {
	    // Cannot determine if the request can be retried
	    return false;
	  }

	  return isRetryableError(error) && SAFE_HTTP_METHODS.indexOf(error.config.method) !== -1;
	}
	/**
	 * @param  {Error}  error
	 * @return {boolean}
	 */


	function isIdempotentRequestError(error) {
	  if (!error.config) {
	    // Cannot determine if the request can be retried
	    return false;
	  }

	  return isRetryableError(error) && IDEMPOTENT_HTTP_METHODS.indexOf(error.config.method) !== -1;
	}
	/**
	 * @param  {Error}  error
	 * @return {boolean}
	 */


	function isNetworkOrIdempotentRequestError(error) {
	  return isNetworkError(error) || isIdempotentRequestError(error);
	}
	/**
	 * @return {number} - delay in milliseconds, always 0
	 */


	function noDelay() {
	  return 0;
	}
	/**
	 * Set delayFactor 1000 for an exponential delay to occur on the order
	 * of seconds
	 * @param  {number} [retryNumber=0]
	 * @param  {Error}  error - unused; for existing API of retryDelay callback
	 * @param  {number} [delayFactor=100] milliseconds
	 * @return {number} - delay in milliseconds
	 */


	function exponentialDelay() {
	  var retryNumber = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
	  var delayFactor = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 100;
	  var delay = Math.pow(2, retryNumber) * delayFactor;
	  var randomSum = delay * 0.2 * Math.random(); // 0-20% of the delay

	  return delay + randomSum;
	}
	/** @type {IAxiosRetryConfig} */


	var DEFAULT_OPTIONS = {
	  retries: 3,
	  retryCondition: isNetworkOrIdempotentRequestError,
	  retryDelay: noDelay,
	  shouldResetTimeout: false,
	  onRetry: function onRetry() {}
	};
	/**
	 * Returns the axios-retry options for the current request
	 * @param  {AxiosRequestConfig} config
	 * @param  {IAxiosRetryConfig} defaultOptions
	 * @return {IAxiosRetryConfigExtended}
	 */

	cjs$1.DEFAULT_OPTIONS = DEFAULT_OPTIONS;

	function getRequestOptions(config, defaultOptions) {
	  return _objectSpread(_objectSpread(_objectSpread({}, DEFAULT_OPTIONS), defaultOptions), config[namespace]);
	}
	/**
	 * Initializes and returns the retry state for the given request/config
	 * @param  {AxiosRequestConfig} config
	 * @param  {IAxiosRetryConfig} defaultOptions
	 * @return {IAxiosRetryConfigExtended}
	 */


	function getCurrentState(config, defaultOptions) {
	  var currentState = getRequestOptions(config, defaultOptions);
	  currentState.retryCount = currentState.retryCount || 0;
	  config[namespace] = currentState;
	  return currentState;
	}
	/**
	 * @param  {Axios} axios
	 * @param  {AxiosRequestConfig} config
	 */


	function fixConfig(axios, config) {
	  if (axios.defaults.agent === config.agent) {
	    delete config.agent;
	  }

	  if (axios.defaults.httpAgent === config.httpAgent) {
	    delete config.httpAgent;
	  }

	  if (axios.defaults.httpsAgent === config.httpsAgent) {
	    delete config.httpsAgent;
	  }
	}
	/**
	 * Checks retryCondition if request can be retried. Handles it's returning value or Promise.
	 * @param  {IAxiosRetryConfigExtended} currentState
	 * @param  {Error} error
	 * @return {Promise<boolean>}
	 */


	function shouldRetry(_x, _x2) {
	  return _shouldRetry.apply(this, arguments);
	}
	/**
	 * Adds response interceptors to an axios instance to retry requests failed due to network issues
	 *
	 * @example
	 *
	 * import axios from 'axios';
	 *
	 * axiosRetry(axios, { retries: 3 });
	 *
	 * axios.get('http://example.com/test') // The first request fails and the second returns 'ok'
	 *   .then(result => {
	 *     result.data; // 'ok'
	 *   });
	 *
	 * // Exponential back-off retry delay between requests
	 * axiosRetry(axios, { retryDelay : axiosRetry.exponentialDelay});
	 *
	 * // Custom retry delay
	 * axiosRetry(axios, { retryDelay : (retryCount) => {
	 *   return retryCount * 1000;
	 * }});
	 *
	 * // Also works with custom axios instances
	 * const client = axios.create({ baseURL: 'http://example.com' });
	 * axiosRetry(client, { retries: 3 });
	 *
	 * client.get('/test') // The first request fails and the second returns 'ok'
	 *   .then(result => {
	 *     result.data; // 'ok'
	 *   });
	 *
	 * // Allows request-specific configuration
	 * client
	 *   .get('/test', {
	 *     'axios-retry': {
	 *       retries: 0
	 *     }
	 *   })
	 *   .catch(error => { // The first request fails
	 *     error !== undefined
	 *   });
	 *
	 * @param {Axios} axios An axios instance (the axios object or one created from axios.create)
	 * @param {Object} [defaultOptions]
	 * @param {number} [defaultOptions.retries=3] Number of retries
	 * @param {boolean} [defaultOptions.shouldResetTimeout=false]
	 *        Defines if the timeout should be reset between retries
	 * @param {Function} [defaultOptions.retryCondition=isNetworkOrIdempotentRequestError]
	 *        A function to determine if the error can be retried
	 * @param {Function} [defaultOptions.retryDelay=noDelay]
	 *        A function to determine the delay between retry requests
	 * @param {Function} [defaultOptions.onRetry=()=>{}]
	 *        A function to get notified when a retry occurs
	 * @return {{ requestInterceptorId: number, responseInterceptorId: number }}
	 *        The ids of the interceptors added to the request and to the response (so they can be ejected at a later time)
	 */


	function _shouldRetry() {
	  _shouldRetry = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2(currentState, error) {
	    var retries, retryCondition, shouldRetryOrPromise, shouldRetryPromiseResult;
	    return _regenerator.default.wrap(function _callee2$(_context2) {
	      while (1) {
	        switch (_context2.prev = _context2.next) {
	          case 0:
	            retries = currentState.retries, retryCondition = currentState.retryCondition;
	            shouldRetryOrPromise = currentState.retryCount < retries && retryCondition(error); // This could be a promise

	            if (!((0, _typeof2.default)(shouldRetryOrPromise) === 'object')) {
	              _context2.next = 13;
	              break;
	            }

	            _context2.prev = 3;
	            _context2.next = 6;
	            return shouldRetryOrPromise;

	          case 6:
	            shouldRetryPromiseResult = _context2.sent;
	            return _context2.abrupt("return", shouldRetryPromiseResult !== false);

	          case 10:
	            _context2.prev = 10;
	            _context2.t0 = _context2["catch"](3);
	            return _context2.abrupt("return", false);

	          case 13:
	            return _context2.abrupt("return", shouldRetryOrPromise);

	          case 14:
	          case "end":
	            return _context2.stop();
	        }
	      }
	    }, _callee2, null, [[3, 10]]);
	  }));
	  return _shouldRetry.apply(this, arguments);
	}

	function axiosRetry(axios, defaultOptions) {
	  var requestInterceptorId = axios.interceptors.request.use(function (config) {
	    var currentState = getCurrentState(config, defaultOptions);
	    currentState.lastRequestTime = Date.now();
	    return config;
	  });
	  var responseInterceptorId = axios.interceptors.response.use(null, /*#__PURE__*/function () {
	    var _ref = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(error) {
	      var config, currentState, retryDelay, shouldResetTimeout, onRetry, delay, lastRequestDuration, timeout;
	      return _regenerator.default.wrap(function _callee$(_context) {
	        while (1) {
	          switch (_context.prev = _context.next) {
	            case 0:
	              config = error.config; // If we have no information to retry the request

	              if (config) {
	                _context.next = 3;
	                break;
	              }

	              return _context.abrupt("return", Promise.reject(error));

	            case 3:
	              currentState = getCurrentState(config, defaultOptions);
	              _context.next = 6;
	              return shouldRetry(currentState, error);

	            case 6:
	              if (!_context.sent) {
	                _context.next = 21;
	                break;
	              }

	              currentState.retryCount += 1;
	              retryDelay = currentState.retryDelay, shouldResetTimeout = currentState.shouldResetTimeout, onRetry = currentState.onRetry;
	              delay = retryDelay(currentState.retryCount, error); // Axios fails merging this configuration to the default configuration because it has an issue
	              // with circular structures: https://github.com/mzabriskie/axios/issues/370

	              fixConfig(axios, config);

	              if (!(!shouldResetTimeout && config.timeout && currentState.lastRequestTime)) {
	                _context.next = 17;
	                break;
	              }

	              lastRequestDuration = Date.now() - currentState.lastRequestTime;
	              timeout = config.timeout - lastRequestDuration - delay;

	              if (!(timeout <= 0)) {
	                _context.next = 16;
	                break;
	              }

	              return _context.abrupt("return", Promise.reject(error));

	            case 16:
	              config.timeout = timeout;

	            case 17:
	              config.transformRequest = [function (data) {
	                return data;
	              }];
	              _context.next = 20;
	              return onRetry(currentState.retryCount, error, config);

	            case 20:
	              return _context.abrupt("return", new Promise(function (resolve) {
	                return setTimeout(function () {
	                  return resolve(axios(config));
	                }, delay);
	              }));

	            case 21:
	              return _context.abrupt("return", Promise.reject(error));

	            case 22:
	            case "end":
	              return _context.stop();
	          }
	        }
	      }, _callee);
	    }));

	    return function (_x3) {
	      return _ref.apply(this, arguments);
	    };
	  }());
	  return {
	    requestInterceptorId: requestInterceptorId,
	    responseInterceptorId: responseInterceptorId
	  };
	} // Compatibility with CommonJS


	axiosRetry.isNetworkError = isNetworkError;
	axiosRetry.isSafeRequestError = isSafeRequestError;
	axiosRetry.isIdempotentRequestError = isIdempotentRequestError;
	axiosRetry.isNetworkOrIdempotentRequestError = isNetworkOrIdempotentRequestError;
	axiosRetry.exponentialDelay = exponentialDelay;
	axiosRetry.isRetryableError = isRetryableError;
	
	return cjs$1;
}

var hasRequiredAxiosRetry;

function requireAxiosRetry () {
	if (hasRequiredAxiosRetry) return axiosRetry.exports;
	hasRequiredAxiosRetry = 1;
	const axiosRetry$1 = requireCjs$1().default;

	axiosRetry.exports = axiosRetry$1;
	axiosRetry.exports.default = axiosRetry$1;
	return axiosRetry.exports;
}

var endpoints = {};

var hasRequiredEndpoints;

function requireEndpoints () {
	if (hasRequiredEndpoints) return endpoints;
	hasRequiredEndpoints = 1;
	(function (exports) {
		Object.defineProperty(exports, "__esModule", { value: true });
		exports.ENDPOINT_REVOKE_TOKEN = exports.ENDPOINT_GET_TOKEN = exports.ENDPOINT_AUTHORIZATION = exports.ENDPOINT_SYNC = exports.ENDPOINT_SYNC_QUICK_ADD = exports.ENDPOINT_REST_PROJECT_COLLABORATORS = exports.ENDPOINT_REST_TASK_REOPEN = exports.ENDPOINT_REST_TASK_CLOSE = exports.ENDPOINT_REST_COMMENTS = exports.ENDPOINT_REST_LABELS_SHARED_REMOVE = exports.ENDPOINT_REST_LABELS_SHARED_RENAME = exports.ENDPOINT_REST_LABELS_SHARED = exports.ENDPOINT_REST_LABELS = exports.ENDPOINT_REST_SECTIONS = exports.ENDPOINT_REST_PROJECTS = exports.ENDPOINT_REST_TASKS_FILTER = exports.ENDPOINT_REST_TASKS = exports.getAuthBaseUri = exports.getSyncBaseUri = exports.API_BASE_URI = exports.API_VERSION = exports.TODOIST_WEB_URI = void 0;
		var BASE_URI = 'https://api.todoist.com';
		var TODOIST_URI = 'https://todoist.com';
		exports.TODOIST_WEB_URI = 'https://app.todoist.com/app';
		// The API version is not configurable, to ensure
		// compatibility between the API and the client.
		exports.API_VERSION = 'v1';
		exports.API_BASE_URI = "/api/".concat(exports.API_VERSION, "/");
		var API_AUTHORIZATION_BASE_URI = '/oauth/';
		function getSyncBaseUri(domainBase) {
		    if (domainBase === void 0) { domainBase = BASE_URI; }
		    return new URL(exports.API_BASE_URI, domainBase).toString();
		}
		exports.getSyncBaseUri = getSyncBaseUri;
		function getAuthBaseUri(domainBase) {
		    if (domainBase === void 0) { domainBase = TODOIST_URI; }
		    return new URL(API_AUTHORIZATION_BASE_URI, domainBase).toString();
		}
		exports.getAuthBaseUri = getAuthBaseUri;
		exports.ENDPOINT_REST_TASKS = 'tasks';
		exports.ENDPOINT_REST_TASKS_FILTER = exports.ENDPOINT_REST_TASKS + '/filter';
		exports.ENDPOINT_REST_PROJECTS = 'projects';
		exports.ENDPOINT_REST_SECTIONS = 'sections';
		exports.ENDPOINT_REST_LABELS = 'labels';
		exports.ENDPOINT_REST_LABELS_SHARED = exports.ENDPOINT_REST_LABELS + '/shared';
		exports.ENDPOINT_REST_LABELS_SHARED_RENAME = exports.ENDPOINT_REST_LABELS_SHARED + '/rename';
		exports.ENDPOINT_REST_LABELS_SHARED_REMOVE = exports.ENDPOINT_REST_LABELS_SHARED + '/remove';
		exports.ENDPOINT_REST_COMMENTS = 'comments';
		exports.ENDPOINT_REST_TASK_CLOSE = 'close';
		exports.ENDPOINT_REST_TASK_REOPEN = 'reopen';
		exports.ENDPOINT_REST_PROJECT_COLLABORATORS = 'collaborators';
		exports.ENDPOINT_SYNC_QUICK_ADD = exports.ENDPOINT_REST_TASKS + '/quick';
		exports.ENDPOINT_SYNC = 'sync';
		exports.ENDPOINT_AUTHORIZATION = 'authorize';
		exports.ENDPOINT_GET_TOKEN = 'access_token';
		exports.ENDPOINT_REVOKE_TOKEN = 'access_tokens/revoke'; 
	} (endpoints));
	return endpoints;
}

var hasRequiredRestClient;

function requireRestClient () {
	if (hasRequiredRestClient) return restClient;
	hasRequiredRestClient = 1;
	var __assign = (restClient && restClient.__assign) || function () {
	    __assign = Object.assign || function(t) {
	        for (var s, i = 1, n = arguments.length; i < n; i++) {
	            s = arguments[i];
	            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
	                t[p] = s[p];
	        }
	        return t;
	    };
	    return __assign.apply(this, arguments);
	};
	var __awaiter = (restClient && restClient.__awaiter) || function (thisArg, _arguments, P, generator) {
	    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
	    return new (P || (P = Promise))(function (resolve, reject) {
	        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
	        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
	        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
	        step((generator = generator.apply(thisArg, _arguments || [])).next());
	    });
	};
	var __generator = (restClient && restClient.__generator) || function (thisArg, body) {
	    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
	    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
	    function verb(n) { return function (v) { return step([n, v]); }; }
	    function step(op) {
	        if (f) throw new TypeError("Generator is already executing.");
	        while (g && (g = 0, op[0] && (_ = 0)), _) try {
	            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
	            if (y = 0, t) op = [op[0] & 2, t.value];
	            switch (op[0]) {
	                case 0: case 1: t = op; break;
	                case 4: _.label++; return { value: op[1], done: false };
	                case 5: _.label++; y = op[1]; op = [0]; continue;
	                case 7: op = _.ops.pop(); _.trys.pop(); continue;
	                default:
	                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
	                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
	                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
	                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
	                    if (t[2]) _.ops.pop();
	                    _.trys.pop(); continue;
	            }
	            op = body.call(thisArg, _);
	        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
	        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
	    }
	};
	var __importDefault = (restClient && restClient.__importDefault) || function (mod) {
	    return (mod && mod.__esModule) ? mod : { "default": mod };
	};
	Object.defineProperty(restClient, "__esModule", { value: true });
	restClient.request = restClient.isSuccess = restClient.paramsSerializer = void 0;
	// eslint-disable-next-line import/no-named-as-default
	var axios_1 = __importDefault(/*@__PURE__*/ requireAxios());
	var axios_case_converter_1 = __importDefault(require$$1);
	var errors_1 = /*@__PURE__*/ requireErrors$1();
	var uuid_1 = /*@__PURE__*/ requireCommonjsBrowser();
	var axios_retry_1 = __importDefault(requireAxiosRetry());
	var endpoints_1 = /*@__PURE__*/ requireEndpoints();
	function paramsSerializer(params) {
	    var qs = new URLSearchParams();
	    Object.keys(params).forEach(function (key) {
	        var value = params[key];
	        if (value != null) {
	            if (Array.isArray(value)) {
	                qs.append(key, value.join(','));
	            }
	            else {
	                qs.append(key, String(value));
	            }
	        }
	    });
	    return qs.toString();
	}
	restClient.paramsSerializer = paramsSerializer;
	var defaultHeaders = {
	    'Content-Type': 'application/json',
	};
	function getAuthHeader(apiKey) {
	    return "Bearer ".concat(apiKey);
	}
	function isNetworkError(error) {
	    return Boolean(!error.response && error.code !== 'ECONNABORTED');
	}
	function getRetryDelay(retryCount) {
	    return retryCount === 1 ? 0 : 500;
	}
	function isAxiosError(error) {
	    return Boolean(error === null || error === void 0 ? void 0 : error.isAxiosError);
	}
	function getTodoistRequestError(error, originalStack) {
	    var requestError = new errors_1.TodoistRequestError(error.message);
	    requestError.stack = isAxiosError(error) && originalStack ? originalStack.stack : error.stack;
	    if (isAxiosError(error) && error.response) {
	        requestError.httpStatusCode = error.response.status;
	        requestError.responseData = error.response.data;
	    }
	    return requestError;
	}
	function getRequestConfiguration(baseURL, apiToken, requestId) {
	    var authHeader = apiToken ? { Authorization: getAuthHeader(apiToken) } : undefined;
	    var requestIdHeader = requestId ? { 'X-Request-Id': requestId } : undefined;
	    var headers = __assign(__assign(__assign({}, defaultHeaders), authHeader), requestIdHeader);
	    return { baseURL: baseURL, headers: headers };
	}
	function getAxiosClient(baseURL, apiToken, requestId) {
	    var configuration = getRequestConfiguration(baseURL, apiToken, requestId);
	    var client = (0, axios_case_converter_1.default)(axios_1.default.create(configuration));
	    (0, axios_retry_1.default)(client, {
	        retries: 3,
	        retryCondition: isNetworkError,
	        retryDelay: getRetryDelay,
	    });
	    return client;
	}
	function isSuccess(response) {
	    return response.status >= 200 && response.status < 300;
	}
	restClient.isSuccess = isSuccess;
	function request(httpMethod, baseUri, relativePath, apiToken, payload, requestId, hasSyncCommands) {
	    return __awaiter(this, void 0, void 0, function () {
	        var originalStack, axiosClient, _a, error_1;
	        return __generator(this, function (_b) {
	            switch (_b.label) {
	                case 0:
	                    originalStack = new Error();
	                    _b.label = 1;
	                case 1:
	                    _b.trys.push([1, 9, , 10]);
	                    // Sync api don't allow a request id in the CORS
	                    if (httpMethod === 'POST' && !requestId && !baseUri.includes(endpoints_1.API_BASE_URI)) {
	                        requestId = (0, uuid_1.v4)();
	                    }
	                    axiosClient = getAxiosClient(baseUri, apiToken, requestId);
	                    _a = httpMethod;
	                    switch (_a) {
	                        case 'GET': return [3 /*break*/, 2];
	                        case 'POST': return [3 /*break*/, 4];
	                        case 'DELETE': return [3 /*break*/, 6];
	                    }
	                    return [3 /*break*/, 8];
	                case 2: return [4 /*yield*/, axiosClient.get(relativePath, {
	                        params: payload,
	                        paramsSerializer: {
	                            serialize: paramsSerializer,
	                        },
	                    })];
	                case 3: return [2 /*return*/, _b.sent()];
	                case 4: return [4 /*yield*/, axiosClient.post(relativePath, hasSyncCommands ? JSON.stringify(payload) : payload)];
	                case 5: return [2 /*return*/, _b.sent()];
	                case 6: return [4 /*yield*/, axiosClient.delete(relativePath)];
	                case 7: return [2 /*return*/, _b.sent()];
	                case 8: return [3 /*break*/, 10];
	                case 9:
	                    error_1 = _b.sent();
	                    if (!isAxiosError(error_1) && !(error_1 instanceof Error)) {
	                        throw new Error('An unknown error occurred during the request');
	                    }
	                    throw getTodoistRequestError(error_1, originalStack);
	                case 10: return [2 /*return*/];
	            }
	        });
	    });
	}
	restClient.request = request;
	return restClient;
}

var validators = {};

var entities = {};

var cjs = {};

var v3 = {};

var external = {};

var errors = {};

var en = {};

var ZodError = {};

var util = {};

var hasRequiredUtil;

function requireUtil () {
	if (hasRequiredUtil) return util;
	hasRequiredUtil = 1;
	(function (exports) {
		Object.defineProperty(exports, "__esModule", { value: true });
		exports.getParsedType = exports.ZodParsedType = exports.objectUtil = exports.util = void 0;
		var util;
		(function (util) {
		    util.assertEqual = (_) => { };
		    function assertIs(_arg) { }
		    util.assertIs = assertIs;
		    function assertNever(_x) {
		        throw new Error();
		    }
		    util.assertNever = assertNever;
		    util.arrayToEnum = (items) => {
		        const obj = {};
		        for (const item of items) {
		            obj[item] = item;
		        }
		        return obj;
		    };
		    util.getValidEnumValues = (obj) => {
		        const validKeys = util.objectKeys(obj).filter((k) => typeof obj[obj[k]] !== "number");
		        const filtered = {};
		        for (const k of validKeys) {
		            filtered[k] = obj[k];
		        }
		        return util.objectValues(filtered);
		    };
		    util.objectValues = (obj) => {
		        return util.objectKeys(obj).map(function (e) {
		            return obj[e];
		        });
		    };
		    util.objectKeys = typeof Object.keys === "function" // eslint-disable-line ban/ban
		        ? (obj) => Object.keys(obj) // eslint-disable-line ban/ban
		        : (object) => {
		            const keys = [];
		            for (const key in object) {
		                if (Object.prototype.hasOwnProperty.call(object, key)) {
		                    keys.push(key);
		                }
		            }
		            return keys;
		        };
		    util.find = (arr, checker) => {
		        for (const item of arr) {
		            if (checker(item))
		                return item;
		        }
		        return undefined;
		    };
		    util.isInteger = typeof Number.isInteger === "function"
		        ? (val) => Number.isInteger(val) // eslint-disable-line ban/ban
		        : (val) => typeof val === "number" && Number.isFinite(val) && Math.floor(val) === val;
		    function joinValues(array, separator = " | ") {
		        return array.map((val) => (typeof val === "string" ? `'${val}'` : val)).join(separator);
		    }
		    util.joinValues = joinValues;
		    util.jsonStringifyReplacer = (_, value) => {
		        if (typeof value === "bigint") {
		            return value.toString();
		        }
		        return value;
		    };
		})(util || (exports.util = util = {}));
		var objectUtil;
		(function (objectUtil) {
		    objectUtil.mergeShapes = (first, second) => {
		        return {
		            ...first,
		            ...second, // second overwrites first
		        };
		    };
		})(objectUtil || (exports.objectUtil = objectUtil = {}));
		exports.ZodParsedType = util.arrayToEnum([
		    "string",
		    "nan",
		    "number",
		    "integer",
		    "float",
		    "boolean",
		    "date",
		    "bigint",
		    "symbol",
		    "function",
		    "undefined",
		    "null",
		    "array",
		    "object",
		    "unknown",
		    "promise",
		    "void",
		    "never",
		    "map",
		    "set",
		]);
		const getParsedType = (data) => {
		    const t = typeof data;
		    switch (t) {
		        case "undefined":
		            return exports.ZodParsedType.undefined;
		        case "string":
		            return exports.ZodParsedType.string;
		        case "number":
		            return Number.isNaN(data) ? exports.ZodParsedType.nan : exports.ZodParsedType.number;
		        case "boolean":
		            return exports.ZodParsedType.boolean;
		        case "function":
		            return exports.ZodParsedType.function;
		        case "bigint":
		            return exports.ZodParsedType.bigint;
		        case "symbol":
		            return exports.ZodParsedType.symbol;
		        case "object":
		            if (Array.isArray(data)) {
		                return exports.ZodParsedType.array;
		            }
		            if (data === null) {
		                return exports.ZodParsedType.null;
		            }
		            if (data.then && typeof data.then === "function" && data.catch && typeof data.catch === "function") {
		                return exports.ZodParsedType.promise;
		            }
		            if (typeof Map !== "undefined" && data instanceof Map) {
		                return exports.ZodParsedType.map;
		            }
		            if (typeof Set !== "undefined" && data instanceof Set) {
		                return exports.ZodParsedType.set;
		            }
		            if (typeof Date !== "undefined" && data instanceof Date) {
		                return exports.ZodParsedType.date;
		            }
		            return exports.ZodParsedType.object;
		        default:
		            return exports.ZodParsedType.unknown;
		    }
		};
		exports.getParsedType = getParsedType; 
	} (util));
	return util;
}

var hasRequiredZodError;

function requireZodError () {
	if (hasRequiredZodError) return ZodError;
	hasRequiredZodError = 1;
	Object.defineProperty(ZodError, "__esModule", { value: true });
	ZodError.ZodError = ZodError.quotelessJson = ZodError.ZodIssueCode = void 0;
	const util_js_1 = requireUtil();
	ZodError.ZodIssueCode = util_js_1.util.arrayToEnum([
	    "invalid_type",
	    "invalid_literal",
	    "custom",
	    "invalid_union",
	    "invalid_union_discriminator",
	    "invalid_enum_value",
	    "unrecognized_keys",
	    "invalid_arguments",
	    "invalid_return_type",
	    "invalid_date",
	    "invalid_string",
	    "too_small",
	    "too_big",
	    "invalid_intersection_types",
	    "not_multiple_of",
	    "not_finite",
	]);
	const quotelessJson = (obj) => {
	    const json = JSON.stringify(obj, null, 2);
	    return json.replace(/"([^"]+)":/g, "$1:");
	};
	ZodError.quotelessJson = quotelessJson;
	let ZodError$1 = class ZodError extends Error {
	    get errors() {
	        return this.issues;
	    }
	    constructor(issues) {
	        super();
	        this.issues = [];
	        this.addIssue = (sub) => {
	            this.issues = [...this.issues, sub];
	        };
	        this.addIssues = (subs = []) => {
	            this.issues = [...this.issues, ...subs];
	        };
	        const actualProto = new.target.prototype;
	        if (Object.setPrototypeOf) {
	            // eslint-disable-next-line ban/ban
	            Object.setPrototypeOf(this, actualProto);
	        }
	        else {
	            this.__proto__ = actualProto;
	        }
	        this.name = "ZodError";
	        this.issues = issues;
	    }
	    format(_mapper) {
	        const mapper = _mapper ||
	            function (issue) {
	                return issue.message;
	            };
	        const fieldErrors = { _errors: [] };
	        const processError = (error) => {
	            for (const issue of error.issues) {
	                if (issue.code === "invalid_union") {
	                    issue.unionErrors.map(processError);
	                }
	                else if (issue.code === "invalid_return_type") {
	                    processError(issue.returnTypeError);
	                }
	                else if (issue.code === "invalid_arguments") {
	                    processError(issue.argumentsError);
	                }
	                else if (issue.path.length === 0) {
	                    fieldErrors._errors.push(mapper(issue));
	                }
	                else {
	                    let curr = fieldErrors;
	                    let i = 0;
	                    while (i < issue.path.length) {
	                        const el = issue.path[i];
	                        const terminal = i === issue.path.length - 1;
	                        if (!terminal) {
	                            curr[el] = curr[el] || { _errors: [] };
	                            // if (typeof el === "string") {
	                            //   curr[el] = curr[el] || { _errors: [] };
	                            // } else if (typeof el === "number") {
	                            //   const errorArray: any = [];
	                            //   errorArray._errors = [];
	                            //   curr[el] = curr[el] || errorArray;
	                            // }
	                        }
	                        else {
	                            curr[el] = curr[el] || { _errors: [] };
	                            curr[el]._errors.push(mapper(issue));
	                        }
	                        curr = curr[el];
	                        i++;
	                    }
	                }
	            }
	        };
	        processError(this);
	        return fieldErrors;
	    }
	    static assert(value) {
	        if (!(value instanceof ZodError)) {
	            throw new Error(`Not a ZodError: ${value}`);
	        }
	    }
	    toString() {
	        return this.message;
	    }
	    get message() {
	        return JSON.stringify(this.issues, util_js_1.util.jsonStringifyReplacer, 2);
	    }
	    get isEmpty() {
	        return this.issues.length === 0;
	    }
	    flatten(mapper = (issue) => issue.message) {
	        const fieldErrors = {};
	        const formErrors = [];
	        for (const sub of this.issues) {
	            if (sub.path.length > 0) {
	                fieldErrors[sub.path[0]] = fieldErrors[sub.path[0]] || [];
	                fieldErrors[sub.path[0]].push(mapper(sub));
	            }
	            else {
	                formErrors.push(mapper(sub));
	            }
	        }
	        return { formErrors, fieldErrors };
	    }
	    get formErrors() {
	        return this.flatten();
	    }
	};
	ZodError.ZodError = ZodError$1;
	ZodError$1.create = (issues) => {
	    const error = new ZodError$1(issues);
	    return error;
	};
	return ZodError;
}

var hasRequiredEn;

function requireEn () {
	if (hasRequiredEn) return en;
	hasRequiredEn = 1;
	Object.defineProperty(en, "__esModule", { value: true });
	const ZodError_js_1 = requireZodError();
	const util_js_1 = requireUtil();
	const errorMap = (issue, _ctx) => {
	    let message;
	    switch (issue.code) {
	        case ZodError_js_1.ZodIssueCode.invalid_type:
	            if (issue.received === util_js_1.ZodParsedType.undefined) {
	                message = "Required";
	            }
	            else {
	                message = `Expected ${issue.expected}, received ${issue.received}`;
	            }
	            break;
	        case ZodError_js_1.ZodIssueCode.invalid_literal:
	            message = `Invalid literal value, expected ${JSON.stringify(issue.expected, util_js_1.util.jsonStringifyReplacer)}`;
	            break;
	        case ZodError_js_1.ZodIssueCode.unrecognized_keys:
	            message = `Unrecognized key(s) in object: ${util_js_1.util.joinValues(issue.keys, ", ")}`;
	            break;
	        case ZodError_js_1.ZodIssueCode.invalid_union:
	            message = `Invalid input`;
	            break;
	        case ZodError_js_1.ZodIssueCode.invalid_union_discriminator:
	            message = `Invalid discriminator value. Expected ${util_js_1.util.joinValues(issue.options)}`;
	            break;
	        case ZodError_js_1.ZodIssueCode.invalid_enum_value:
	            message = `Invalid enum value. Expected ${util_js_1.util.joinValues(issue.options)}, received '${issue.received}'`;
	            break;
	        case ZodError_js_1.ZodIssueCode.invalid_arguments:
	            message = `Invalid function arguments`;
	            break;
	        case ZodError_js_1.ZodIssueCode.invalid_return_type:
	            message = `Invalid function return type`;
	            break;
	        case ZodError_js_1.ZodIssueCode.invalid_date:
	            message = `Invalid date`;
	            break;
	        case ZodError_js_1.ZodIssueCode.invalid_string:
	            if (typeof issue.validation === "object") {
	                if ("includes" in issue.validation) {
	                    message = `Invalid input: must include "${issue.validation.includes}"`;
	                    if (typeof issue.validation.position === "number") {
	                        message = `${message} at one or more positions greater than or equal to ${issue.validation.position}`;
	                    }
	                }
	                else if ("startsWith" in issue.validation) {
	                    message = `Invalid input: must start with "${issue.validation.startsWith}"`;
	                }
	                else if ("endsWith" in issue.validation) {
	                    message = `Invalid input: must end with "${issue.validation.endsWith}"`;
	                }
	                else {
	                    util_js_1.util.assertNever(issue.validation);
	                }
	            }
	            else if (issue.validation !== "regex") {
	                message = `Invalid ${issue.validation}`;
	            }
	            else {
	                message = "Invalid";
	            }
	            break;
	        case ZodError_js_1.ZodIssueCode.too_small:
	            if (issue.type === "array")
	                message = `Array must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `more than`} ${issue.minimum} element(s)`;
	            else if (issue.type === "string")
	                message = `String must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `over`} ${issue.minimum} character(s)`;
	            else if (issue.type === "number")
	                message = `Number must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${issue.minimum}`;
	            else if (issue.type === "date")
	                message = `Date must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${new Date(Number(issue.minimum))}`;
	            else
	                message = "Invalid input";
	            break;
	        case ZodError_js_1.ZodIssueCode.too_big:
	            if (issue.type === "array")
	                message = `Array must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `less than`} ${issue.maximum} element(s)`;
	            else if (issue.type === "string")
	                message = `String must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `under`} ${issue.maximum} character(s)`;
	            else if (issue.type === "number")
	                message = `Number must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`;
	            else if (issue.type === "bigint")
	                message = `BigInt must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`;
	            else if (issue.type === "date")
	                message = `Date must be ${issue.exact ? `exactly` : issue.inclusive ? `smaller than or equal to` : `smaller than`} ${new Date(Number(issue.maximum))}`;
	            else
	                message = "Invalid input";
	            break;
	        case ZodError_js_1.ZodIssueCode.custom:
	            message = `Invalid input`;
	            break;
	        case ZodError_js_1.ZodIssueCode.invalid_intersection_types:
	            message = `Intersection results could not be merged`;
	            break;
	        case ZodError_js_1.ZodIssueCode.not_multiple_of:
	            message = `Number must be a multiple of ${issue.multipleOf}`;
	            break;
	        case ZodError_js_1.ZodIssueCode.not_finite:
	            message = "Number must be finite";
	            break;
	        default:
	            message = _ctx.defaultError;
	            util_js_1.util.assertNever(issue);
	    }
	    return { message };
	};
	en.default = errorMap;
	return en;
}

var hasRequiredErrors;

function requireErrors () {
	if (hasRequiredErrors) return errors;
	hasRequiredErrors = 1;
	var __importDefault = (errors && errors.__importDefault) || function (mod) {
	    return (mod && mod.__esModule) ? mod : { "default": mod };
	};
	Object.defineProperty(errors, "__esModule", { value: true });
	errors.defaultErrorMap = void 0;
	errors.setErrorMap = setErrorMap;
	errors.getErrorMap = getErrorMap;
	const en_js_1 = __importDefault(requireEn());
	errors.defaultErrorMap = en_js_1.default;
	let overrideErrorMap = en_js_1.default;
	function setErrorMap(map) {
	    overrideErrorMap = map;
	}
	function getErrorMap() {
	    return overrideErrorMap;
	}
	return errors;
}

var parseUtil = {};

var hasRequiredParseUtil;

function requireParseUtil () {
	if (hasRequiredParseUtil) return parseUtil;
	hasRequiredParseUtil = 1;
	(function (exports) {
		var __importDefault = (parseUtil && parseUtil.__importDefault) || function (mod) {
		    return (mod && mod.__esModule) ? mod : { "default": mod };
		};
		Object.defineProperty(exports, "__esModule", { value: true });
		exports.isAsync = exports.isValid = exports.isDirty = exports.isAborted = exports.OK = exports.DIRTY = exports.INVALID = exports.ParseStatus = exports.EMPTY_PATH = exports.makeIssue = void 0;
		exports.addIssueToContext = addIssueToContext;
		const errors_js_1 = requireErrors();
		const en_js_1 = __importDefault(requireEn());
		const makeIssue = (params) => {
		    const { data, path, errorMaps, issueData } = params;
		    const fullPath = [...path, ...(issueData.path || [])];
		    const fullIssue = {
		        ...issueData,
		        path: fullPath,
		    };
		    if (issueData.message !== undefined) {
		        return {
		            ...issueData,
		            path: fullPath,
		            message: issueData.message,
		        };
		    }
		    let errorMessage = "";
		    const maps = errorMaps
		        .filter((m) => !!m)
		        .slice()
		        .reverse();
		    for (const map of maps) {
		        errorMessage = map(fullIssue, { data, defaultError: errorMessage }).message;
		    }
		    return {
		        ...issueData,
		        path: fullPath,
		        message: errorMessage,
		    };
		};
		exports.makeIssue = makeIssue;
		exports.EMPTY_PATH = [];
		function addIssueToContext(ctx, issueData) {
		    const overrideMap = (0, errors_js_1.getErrorMap)();
		    const issue = (0, exports.makeIssue)({
		        issueData: issueData,
		        data: ctx.data,
		        path: ctx.path,
		        errorMaps: [
		            ctx.common.contextualErrorMap, // contextual error map is first priority
		            ctx.schemaErrorMap, // then schema-bound map if available
		            overrideMap, // then global override map
		            overrideMap === en_js_1.default ? undefined : en_js_1.default, // then global default map
		        ].filter((x) => !!x),
		    });
		    ctx.common.issues.push(issue);
		}
		class ParseStatus {
		    constructor() {
		        this.value = "valid";
		    }
		    dirty() {
		        if (this.value === "valid")
		            this.value = "dirty";
		    }
		    abort() {
		        if (this.value !== "aborted")
		            this.value = "aborted";
		    }
		    static mergeArray(status, results) {
		        const arrayValue = [];
		        for (const s of results) {
		            if (s.status === "aborted")
		                return exports.INVALID;
		            if (s.status === "dirty")
		                status.dirty();
		            arrayValue.push(s.value);
		        }
		        return { status: status.value, value: arrayValue };
		    }
		    static async mergeObjectAsync(status, pairs) {
		        const syncPairs = [];
		        for (const pair of pairs) {
		            const key = await pair.key;
		            const value = await pair.value;
		            syncPairs.push({
		                key,
		                value,
		            });
		        }
		        return ParseStatus.mergeObjectSync(status, syncPairs);
		    }
		    static mergeObjectSync(status, pairs) {
		        const finalObject = {};
		        for (const pair of pairs) {
		            const { key, value } = pair;
		            if (key.status === "aborted")
		                return exports.INVALID;
		            if (value.status === "aborted")
		                return exports.INVALID;
		            if (key.status === "dirty")
		                status.dirty();
		            if (value.status === "dirty")
		                status.dirty();
		            if (key.value !== "__proto__" && (typeof value.value !== "undefined" || pair.alwaysSet)) {
		                finalObject[key.value] = value.value;
		            }
		        }
		        return { status: status.value, value: finalObject };
		    }
		}
		exports.ParseStatus = ParseStatus;
		exports.INVALID = Object.freeze({
		    status: "aborted",
		});
		const DIRTY = (value) => ({ status: "dirty", value });
		exports.DIRTY = DIRTY;
		const OK = (value) => ({ status: "valid", value });
		exports.OK = OK;
		const isAborted = (x) => x.status === "aborted";
		exports.isAborted = isAborted;
		const isDirty = (x) => x.status === "dirty";
		exports.isDirty = isDirty;
		const isValid = (x) => x.status === "valid";
		exports.isValid = isValid;
		const isAsync = (x) => typeof Promise !== "undefined" && x instanceof Promise;
		exports.isAsync = isAsync; 
	} (parseUtil));
	return parseUtil;
}

var typeAliases = {};

var hasRequiredTypeAliases;

function requireTypeAliases () {
	if (hasRequiredTypeAliases) return typeAliases;
	hasRequiredTypeAliases = 1;
	Object.defineProperty(typeAliases, "__esModule", { value: true });
	return typeAliases;
}

var types$1 = {};

var errorUtil = {};

var hasRequiredErrorUtil;

function requireErrorUtil () {
	if (hasRequiredErrorUtil) return errorUtil;
	hasRequiredErrorUtil = 1;
	Object.defineProperty(errorUtil, "__esModule", { value: true });
	errorUtil.errorUtil = void 0;
	var errorUtil$1;
	(function (errorUtil) {
	    errorUtil.errToObj = (message) => typeof message === "string" ? { message } : message || {};
	    // biome-ignore lint:
	    errorUtil.toString = (message) => typeof message === "string" ? message : message?.message;
	})(errorUtil$1 || (errorUtil.errorUtil = errorUtil$1 = {}));
	return errorUtil;
}

var hasRequiredTypes$1;

function requireTypes$1 () {
	if (hasRequiredTypes$1) return types$1;
	hasRequiredTypes$1 = 1;
	Object.defineProperty(types$1, "__esModule", { value: true });
	types$1.discriminatedUnion = types$1.date = types$1.boolean = types$1.bigint = types$1.array = types$1.any = types$1.coerce = types$1.ZodFirstPartyTypeKind = types$1.late = types$1.ZodSchema = types$1.Schema = types$1.ZodReadonly = types$1.ZodPipeline = types$1.ZodBranded = types$1.BRAND = types$1.ZodNaN = types$1.ZodCatch = types$1.ZodDefault = types$1.ZodNullable = types$1.ZodOptional = types$1.ZodTransformer = types$1.ZodEffects = types$1.ZodPromise = types$1.ZodNativeEnum = types$1.ZodEnum = types$1.ZodLiteral = types$1.ZodLazy = types$1.ZodFunction = types$1.ZodSet = types$1.ZodMap = types$1.ZodRecord = types$1.ZodTuple = types$1.ZodIntersection = types$1.ZodDiscriminatedUnion = types$1.ZodUnion = types$1.ZodObject = types$1.ZodArray = types$1.ZodVoid = types$1.ZodNever = types$1.ZodUnknown = types$1.ZodAny = types$1.ZodNull = types$1.ZodUndefined = types$1.ZodSymbol = types$1.ZodDate = types$1.ZodBoolean = types$1.ZodBigInt = types$1.ZodNumber = types$1.ZodString = types$1.ZodType = void 0;
	types$1.NEVER = types$1.void = types$1.unknown = types$1.union = types$1.undefined = types$1.tuple = types$1.transformer = types$1.symbol = types$1.string = types$1.strictObject = types$1.set = types$1.record = types$1.promise = types$1.preprocess = types$1.pipeline = types$1.ostring = types$1.optional = types$1.onumber = types$1.oboolean = types$1.object = types$1.number = types$1.nullable = types$1.null = types$1.never = types$1.nativeEnum = types$1.nan = types$1.map = types$1.literal = types$1.lazy = types$1.intersection = types$1.instanceof = types$1.function = types$1.enum = types$1.effect = void 0;
	types$1.datetimeRegex = datetimeRegex;
	types$1.custom = custom;
	const ZodError_js_1 = requireZodError();
	const errors_js_1 = requireErrors();
	const errorUtil_js_1 = requireErrorUtil();
	const parseUtil_js_1 = requireParseUtil();
	const util_js_1 = requireUtil();
	class ParseInputLazyPath {
	    constructor(parent, value, path, key) {
	        this._cachedPath = [];
	        this.parent = parent;
	        this.data = value;
	        this._path = path;
	        this._key = key;
	    }
	    get path() {
	        if (!this._cachedPath.length) {
	            if (Array.isArray(this._key)) {
	                this._cachedPath.push(...this._path, ...this._key);
	            }
	            else {
	                this._cachedPath.push(...this._path, this._key);
	            }
	        }
	        return this._cachedPath;
	    }
	}
	const handleResult = (ctx, result) => {
	    if ((0, parseUtil_js_1.isValid)(result)) {
	        return { success: true, data: result.value };
	    }
	    else {
	        if (!ctx.common.issues.length) {
	            throw new Error("Validation failed but no issues detected.");
	        }
	        return {
	            success: false,
	            get error() {
	                if (this._error)
	                    return this._error;
	                const error = new ZodError_js_1.ZodError(ctx.common.issues);
	                this._error = error;
	                return this._error;
	            },
	        };
	    }
	};
	function processCreateParams(params) {
	    if (!params)
	        return {};
	    const { errorMap, invalid_type_error, required_error, description } = params;
	    if (errorMap && (invalid_type_error || required_error)) {
	        throw new Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);
	    }
	    if (errorMap)
	        return { errorMap: errorMap, description };
	    const customMap = (iss, ctx) => {
	        const { message } = params;
	        if (iss.code === "invalid_enum_value") {
	            return { message: message ?? ctx.defaultError };
	        }
	        if (typeof ctx.data === "undefined") {
	            return { message: message ?? required_error ?? ctx.defaultError };
	        }
	        if (iss.code !== "invalid_type")
	            return { message: ctx.defaultError };
	        return { message: message ?? invalid_type_error ?? ctx.defaultError };
	    };
	    return { errorMap: customMap, description };
	}
	class ZodType {
	    get description() {
	        return this._def.description;
	    }
	    _getType(input) {
	        return (0, util_js_1.getParsedType)(input.data);
	    }
	    _getOrReturnCtx(input, ctx) {
	        return (ctx || {
	            common: input.parent.common,
	            data: input.data,
	            parsedType: (0, util_js_1.getParsedType)(input.data),
	            schemaErrorMap: this._def.errorMap,
	            path: input.path,
	            parent: input.parent,
	        });
	    }
	    _processInputParams(input) {
	        return {
	            status: new parseUtil_js_1.ParseStatus(),
	            ctx: {
	                common: input.parent.common,
	                data: input.data,
	                parsedType: (0, util_js_1.getParsedType)(input.data),
	                schemaErrorMap: this._def.errorMap,
	                path: input.path,
	                parent: input.parent,
	            },
	        };
	    }
	    _parseSync(input) {
	        const result = this._parse(input);
	        if ((0, parseUtil_js_1.isAsync)(result)) {
	            throw new Error("Synchronous parse encountered promise.");
	        }
	        return result;
	    }
	    _parseAsync(input) {
	        const result = this._parse(input);
	        return Promise.resolve(result);
	    }
	    parse(data, params) {
	        const result = this.safeParse(data, params);
	        if (result.success)
	            return result.data;
	        throw result.error;
	    }
	    safeParse(data, params) {
	        const ctx = {
	            common: {
	                issues: [],
	                async: params?.async ?? false,
	                contextualErrorMap: params?.errorMap,
	            },
	            path: params?.path || [],
	            schemaErrorMap: this._def.errorMap,
	            parent: null,
	            data,
	            parsedType: (0, util_js_1.getParsedType)(data),
	        };
	        const result = this._parseSync({ data, path: ctx.path, parent: ctx });
	        return handleResult(ctx, result);
	    }
	    "~validate"(data) {
	        const ctx = {
	            common: {
	                issues: [],
	                async: !!this["~standard"].async,
	            },
	            path: [],
	            schemaErrorMap: this._def.errorMap,
	            parent: null,
	            data,
	            parsedType: (0, util_js_1.getParsedType)(data),
	        };
	        if (!this["~standard"].async) {
	            try {
	                const result = this._parseSync({ data, path: [], parent: ctx });
	                return (0, parseUtil_js_1.isValid)(result)
	                    ? {
	                        value: result.value,
	                    }
	                    : {
	                        issues: ctx.common.issues,
	                    };
	            }
	            catch (err) {
	                if (err?.message?.toLowerCase()?.includes("encountered")) {
	                    this["~standard"].async = true;
	                }
	                ctx.common = {
	                    issues: [],
	                    async: true,
	                };
	            }
	        }
	        return this._parseAsync({ data, path: [], parent: ctx }).then((result) => (0, parseUtil_js_1.isValid)(result)
	            ? {
	                value: result.value,
	            }
	            : {
	                issues: ctx.common.issues,
	            });
	    }
	    async parseAsync(data, params) {
	        const result = await this.safeParseAsync(data, params);
	        if (result.success)
	            return result.data;
	        throw result.error;
	    }
	    async safeParseAsync(data, params) {
	        const ctx = {
	            common: {
	                issues: [],
	                contextualErrorMap: params?.errorMap,
	                async: true,
	            },
	            path: params?.path || [],
	            schemaErrorMap: this._def.errorMap,
	            parent: null,
	            data,
	            parsedType: (0, util_js_1.getParsedType)(data),
	        };
	        const maybeAsyncResult = this._parse({ data, path: ctx.path, parent: ctx });
	        const result = await ((0, parseUtil_js_1.isAsync)(maybeAsyncResult) ? maybeAsyncResult : Promise.resolve(maybeAsyncResult));
	        return handleResult(ctx, result);
	    }
	    refine(check, message) {
	        const getIssueProperties = (val) => {
	            if (typeof message === "string" || typeof message === "undefined") {
	                return { message };
	            }
	            else if (typeof message === "function") {
	                return message(val);
	            }
	            else {
	                return message;
	            }
	        };
	        return this._refinement((val, ctx) => {
	            const result = check(val);
	            const setError = () => ctx.addIssue({
	                code: ZodError_js_1.ZodIssueCode.custom,
	                ...getIssueProperties(val),
	            });
	            if (typeof Promise !== "undefined" && result instanceof Promise) {
	                return result.then((data) => {
	                    if (!data) {
	                        setError();
	                        return false;
	                    }
	                    else {
	                        return true;
	                    }
	                });
	            }
	            if (!result) {
	                setError();
	                return false;
	            }
	            else {
	                return true;
	            }
	        });
	    }
	    refinement(check, refinementData) {
	        return this._refinement((val, ctx) => {
	            if (!check(val)) {
	                ctx.addIssue(typeof refinementData === "function" ? refinementData(val, ctx) : refinementData);
	                return false;
	            }
	            else {
	                return true;
	            }
	        });
	    }
	    _refinement(refinement) {
	        return new ZodEffects({
	            schema: this,
	            typeName: ZodFirstPartyTypeKind.ZodEffects,
	            effect: { type: "refinement", refinement },
	        });
	    }
	    superRefine(refinement) {
	        return this._refinement(refinement);
	    }
	    constructor(def) {
	        /** Alias of safeParseAsync */
	        this.spa = this.safeParseAsync;
	        this._def = def;
	        this.parse = this.parse.bind(this);
	        this.safeParse = this.safeParse.bind(this);
	        this.parseAsync = this.parseAsync.bind(this);
	        this.safeParseAsync = this.safeParseAsync.bind(this);
	        this.spa = this.spa.bind(this);
	        this.refine = this.refine.bind(this);
	        this.refinement = this.refinement.bind(this);
	        this.superRefine = this.superRefine.bind(this);
	        this.optional = this.optional.bind(this);
	        this.nullable = this.nullable.bind(this);
	        this.nullish = this.nullish.bind(this);
	        this.array = this.array.bind(this);
	        this.promise = this.promise.bind(this);
	        this.or = this.or.bind(this);
	        this.and = this.and.bind(this);
	        this.transform = this.transform.bind(this);
	        this.brand = this.brand.bind(this);
	        this.default = this.default.bind(this);
	        this.catch = this.catch.bind(this);
	        this.describe = this.describe.bind(this);
	        this.pipe = this.pipe.bind(this);
	        this.readonly = this.readonly.bind(this);
	        this.isNullable = this.isNullable.bind(this);
	        this.isOptional = this.isOptional.bind(this);
	        this["~standard"] = {
	            version: 1,
	            vendor: "zod",
	            validate: (data) => this["~validate"](data),
	        };
	    }
	    optional() {
	        return ZodOptional.create(this, this._def);
	    }
	    nullable() {
	        return ZodNullable.create(this, this._def);
	    }
	    nullish() {
	        return this.nullable().optional();
	    }
	    array() {
	        return ZodArray.create(this);
	    }
	    promise() {
	        return ZodPromise.create(this, this._def);
	    }
	    or(option) {
	        return ZodUnion.create([this, option], this._def);
	    }
	    and(incoming) {
	        return ZodIntersection.create(this, incoming, this._def);
	    }
	    transform(transform) {
	        return new ZodEffects({
	            ...processCreateParams(this._def),
	            schema: this,
	            typeName: ZodFirstPartyTypeKind.ZodEffects,
	            effect: { type: "transform", transform },
	        });
	    }
	    default(def) {
	        const defaultValueFunc = typeof def === "function" ? def : () => def;
	        return new ZodDefault({
	            ...processCreateParams(this._def),
	            innerType: this,
	            defaultValue: defaultValueFunc,
	            typeName: ZodFirstPartyTypeKind.ZodDefault,
	        });
	    }
	    brand() {
	        return new ZodBranded({
	            typeName: ZodFirstPartyTypeKind.ZodBranded,
	            type: this,
	            ...processCreateParams(this._def),
	        });
	    }
	    catch(def) {
	        const catchValueFunc = typeof def === "function" ? def : () => def;
	        return new ZodCatch({
	            ...processCreateParams(this._def),
	            innerType: this,
	            catchValue: catchValueFunc,
	            typeName: ZodFirstPartyTypeKind.ZodCatch,
	        });
	    }
	    describe(description) {
	        const This = this.constructor;
	        return new This({
	            ...this._def,
	            description,
	        });
	    }
	    pipe(target) {
	        return ZodPipeline.create(this, target);
	    }
	    readonly() {
	        return ZodReadonly.create(this);
	    }
	    isOptional() {
	        return this.safeParse(undefined).success;
	    }
	    isNullable() {
	        return this.safeParse(null).success;
	    }
	}
	types$1.ZodType = ZodType;
	types$1.Schema = ZodType;
	types$1.ZodSchema = ZodType;
	const cuidRegex = /^c[^\s-]{8,}$/i;
	const cuid2Regex = /^[0-9a-z]+$/;
	const ulidRegex = /^[0-9A-HJKMNP-TV-Z]{26}$/i;
	// const uuidRegex =
	//   /^([a-f0-9]{8}-[a-f0-9]{4}-[1-5][a-f0-9]{3}-[a-f0-9]{4}-[a-f0-9]{12}|00000000-0000-0000-0000-000000000000)$/i;
	const uuidRegex = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i;
	const nanoidRegex = /^[a-z0-9_-]{21}$/i;
	const jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/;
	const durationRegex = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/;
	// from https://stackoverflow.com/a/46181/1550155
	// old version: too slow, didn't support unicode
	// const emailRegex = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i;
	//old email regex
	// const emailRegex = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@((?!-)([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{1,})[^-<>()[\].,;:\s@"]$/i;
	// eslint-disable-next-line
	// const emailRegex =
	//   /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[(((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\.){3}((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\])|(\[IPv6:(([a-f0-9]{1,4}:){7}|::([a-f0-9]{1,4}:){0,6}|([a-f0-9]{1,4}:){1}:([a-f0-9]{1,4}:){0,5}|([a-f0-9]{1,4}:){2}:([a-f0-9]{1,4}:){0,4}|([a-f0-9]{1,4}:){3}:([a-f0-9]{1,4}:){0,3}|([a-f0-9]{1,4}:){4}:([a-f0-9]{1,4}:){0,2}|([a-f0-9]{1,4}:){5}:([a-f0-9]{1,4}:){0,1})([a-f0-9]{1,4}|(((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\.){3}((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2})))\])|([A-Za-z0-9]([A-Za-z0-9-]*[A-Za-z0-9])*(\.[A-Za-z]{2,})+))$/;
	// const emailRegex =
	//   /^[a-zA-Z0-9\.\!\#\$\%\&\'\*\+\/\=\?\^\_\`\{\|\}\~\-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
	// const emailRegex =
	//   /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/i;
	const emailRegex = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i;
	// const emailRegex =
	//   /^[a-z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-z0-9-]+(?:\.[a-z0-9\-]+)*$/i;
	// from https://thekevinscott.com/emojis-in-javascript/#writing-a-regular-expression
	const _emojiRegex = `^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$`;
	let emojiRegex;
	// faster, simpler, safer
	const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
	const ipv4CidrRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/;
	// const ipv6Regex =
	// /^(([a-f0-9]{1,4}:){7}|::([a-f0-9]{1,4}:){0,6}|([a-f0-9]{1,4}:){1}:([a-f0-9]{1,4}:){0,5}|([a-f0-9]{1,4}:){2}:([a-f0-9]{1,4}:){0,4}|([a-f0-9]{1,4}:){3}:([a-f0-9]{1,4}:){0,3}|([a-f0-9]{1,4}:){4}:([a-f0-9]{1,4}:){0,2}|([a-f0-9]{1,4}:){5}:([a-f0-9]{1,4}:){0,1})([a-f0-9]{1,4}|(((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\.){3}((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2})))$/;
	const ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;
	const ipv6CidrRegex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/;
	// https://stackoverflow.com/questions/7860392/determine-if-string-is-in-base64-using-javascript
	const base64Regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
	// https://base64.guru/standards/base64url
	const base64urlRegex = /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/;
	// simple
	// const dateRegexSource = `\\d{4}-\\d{2}-\\d{2}`;
	// no leap year validation
	// const dateRegexSource = `\\d{4}-((0[13578]|10|12)-31|(0[13-9]|1[0-2])-30|(0[1-9]|1[0-2])-(0[1-9]|1\\d|2\\d))`;
	// with leap year validation
	const dateRegexSource = `((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))`;
	const dateRegex = new RegExp(`^${dateRegexSource}$`);
	function timeRegexSource(args) {
	    let secondsRegexSource = `[0-5]\\d`;
	    if (args.precision) {
	        secondsRegexSource = `${secondsRegexSource}\\.\\d{${args.precision}}`;
	    }
	    else if (args.precision == null) {
	        secondsRegexSource = `${secondsRegexSource}(\\.\\d+)?`;
	    }
	    const secondsQuantifier = args.precision ? "+" : "?"; // require seconds if precision is nonzero
	    return `([01]\\d|2[0-3]):[0-5]\\d(:${secondsRegexSource})${secondsQuantifier}`;
	}
	function timeRegex(args) {
	    return new RegExp(`^${timeRegexSource(args)}$`);
	}
	// Adapted from https://stackoverflow.com/a/3143231
	function datetimeRegex(args) {
	    let regex = `${dateRegexSource}T${timeRegexSource(args)}`;
	    const opts = [];
	    opts.push(args.local ? `Z?` : `Z`);
	    if (args.offset)
	        opts.push(`([+-]\\d{2}:?\\d{2})`);
	    regex = `${regex}(${opts.join("|")})`;
	    return new RegExp(`^${regex}$`);
	}
	function isValidIP(ip, version) {
	    if ((version === "v4" || !version) && ipv4Regex.test(ip)) {
	        return true;
	    }
	    if ((version === "v6" || !version) && ipv6Regex.test(ip)) {
	        return true;
	    }
	    return false;
	}
	function isValidJWT(jwt, alg) {
	    if (!jwtRegex.test(jwt))
	        return false;
	    try {
	        const [header] = jwt.split(".");
	        // Convert base64url to base64
	        const base64 = header
	            .replace(/-/g, "+")
	            .replace(/_/g, "/")
	            .padEnd(header.length + ((4 - (header.length % 4)) % 4), "=");
	        const decoded = JSON.parse(atob(base64));
	        if (typeof decoded !== "object" || decoded === null)
	            return false;
	        if ("typ" in decoded && decoded?.typ !== "JWT")
	            return false;
	        if (!decoded.alg)
	            return false;
	        if (alg && decoded.alg !== alg)
	            return false;
	        return true;
	    }
	    catch {
	        return false;
	    }
	}
	function isValidCidr(ip, version) {
	    if ((version === "v4" || !version) && ipv4CidrRegex.test(ip)) {
	        return true;
	    }
	    if ((version === "v6" || !version) && ipv6CidrRegex.test(ip)) {
	        return true;
	    }
	    return false;
	}
	class ZodString extends ZodType {
	    _parse(input) {
	        if (this._def.coerce) {
	            input.data = String(input.data);
	        }
	        const parsedType = this._getType(input);
	        if (parsedType !== util_js_1.ZodParsedType.string) {
	            const ctx = this._getOrReturnCtx(input);
	            (0, parseUtil_js_1.addIssueToContext)(ctx, {
	                code: ZodError_js_1.ZodIssueCode.invalid_type,
	                expected: util_js_1.ZodParsedType.string,
	                received: ctx.parsedType,
	            });
	            return parseUtil_js_1.INVALID;
	        }
	        const status = new parseUtil_js_1.ParseStatus();
	        let ctx = undefined;
	        for (const check of this._def.checks) {
	            if (check.kind === "min") {
	                if (input.data.length < check.value) {
	                    ctx = this._getOrReturnCtx(input, ctx);
	                    (0, parseUtil_js_1.addIssueToContext)(ctx, {
	                        code: ZodError_js_1.ZodIssueCode.too_small,
	                        minimum: check.value,
	                        type: "string",
	                        inclusive: true,
	                        exact: false,
	                        message: check.message,
	                    });
	                    status.dirty();
	                }
	            }
	            else if (check.kind === "max") {
	                if (input.data.length > check.value) {
	                    ctx = this._getOrReturnCtx(input, ctx);
	                    (0, parseUtil_js_1.addIssueToContext)(ctx, {
	                        code: ZodError_js_1.ZodIssueCode.too_big,
	                        maximum: check.value,
	                        type: "string",
	                        inclusive: true,
	                        exact: false,
	                        message: check.message,
	                    });
	                    status.dirty();
	                }
	            }
	            else if (check.kind === "length") {
	                const tooBig = input.data.length > check.value;
	                const tooSmall = input.data.length < check.value;
	                if (tooBig || tooSmall) {
	                    ctx = this._getOrReturnCtx(input, ctx);
	                    if (tooBig) {
	                        (0, parseUtil_js_1.addIssueToContext)(ctx, {
	                            code: ZodError_js_1.ZodIssueCode.too_big,
	                            maximum: check.value,
	                            type: "string",
	                            inclusive: true,
	                            exact: true,
	                            message: check.message,
	                        });
	                    }
	                    else if (tooSmall) {
	                        (0, parseUtil_js_1.addIssueToContext)(ctx, {
	                            code: ZodError_js_1.ZodIssueCode.too_small,
	                            minimum: check.value,
	                            type: "string",
	                            inclusive: true,
	                            exact: true,
	                            message: check.message,
	                        });
	                    }
	                    status.dirty();
	                }
	            }
	            else if (check.kind === "email") {
	                if (!emailRegex.test(input.data)) {
	                    ctx = this._getOrReturnCtx(input, ctx);
	                    (0, parseUtil_js_1.addIssueToContext)(ctx, {
	                        validation: "email",
	                        code: ZodError_js_1.ZodIssueCode.invalid_string,
	                        message: check.message,
	                    });
	                    status.dirty();
	                }
	            }
	            else if (check.kind === "emoji") {
	                if (!emojiRegex) {
	                    emojiRegex = new RegExp(_emojiRegex, "u");
	                }
	                if (!emojiRegex.test(input.data)) {
	                    ctx = this._getOrReturnCtx(input, ctx);
	                    (0, parseUtil_js_1.addIssueToContext)(ctx, {
	                        validation: "emoji",
	                        code: ZodError_js_1.ZodIssueCode.invalid_string,
	                        message: check.message,
	                    });
	                    status.dirty();
	                }
	            }
	            else if (check.kind === "uuid") {
	                if (!uuidRegex.test(input.data)) {
	                    ctx = this._getOrReturnCtx(input, ctx);
	                    (0, parseUtil_js_1.addIssueToContext)(ctx, {
	                        validation: "uuid",
	                        code: ZodError_js_1.ZodIssueCode.invalid_string,
	                        message: check.message,
	                    });
	                    status.dirty();
	                }
	            }
	            else if (check.kind === "nanoid") {
	                if (!nanoidRegex.test(input.data)) {
	                    ctx = this._getOrReturnCtx(input, ctx);
	                    (0, parseUtil_js_1.addIssueToContext)(ctx, {
	                        validation: "nanoid",
	                        code: ZodError_js_1.ZodIssueCode.invalid_string,
	                        message: check.message,
	                    });
	                    status.dirty();
	                }
	            }
	            else if (check.kind === "cuid") {
	                if (!cuidRegex.test(input.data)) {
	                    ctx = this._getOrReturnCtx(input, ctx);
	                    (0, parseUtil_js_1.addIssueToContext)(ctx, {
	                        validation: "cuid",
	                        code: ZodError_js_1.ZodIssueCode.invalid_string,
	                        message: check.message,
	                    });
	                    status.dirty();
	                }
	            }
	            else if (check.kind === "cuid2") {
	                if (!cuid2Regex.test(input.data)) {
	                    ctx = this._getOrReturnCtx(input, ctx);
	                    (0, parseUtil_js_1.addIssueToContext)(ctx, {
	                        validation: "cuid2",
	                        code: ZodError_js_1.ZodIssueCode.invalid_string,
	                        message: check.message,
	                    });
	                    status.dirty();
	                }
	            }
	            else if (check.kind === "ulid") {
	                if (!ulidRegex.test(input.data)) {
	                    ctx = this._getOrReturnCtx(input, ctx);
	                    (0, parseUtil_js_1.addIssueToContext)(ctx, {
	                        validation: "ulid",
	                        code: ZodError_js_1.ZodIssueCode.invalid_string,
	                        message: check.message,
	                    });
	                    status.dirty();
	                }
	            }
	            else if (check.kind === "url") {
	                try {
	                    new URL(input.data);
	                }
	                catch {
	                    ctx = this._getOrReturnCtx(input, ctx);
	                    (0, parseUtil_js_1.addIssueToContext)(ctx, {
	                        validation: "url",
	                        code: ZodError_js_1.ZodIssueCode.invalid_string,
	                        message: check.message,
	                    });
	                    status.dirty();
	                }
	            }
	            else if (check.kind === "regex") {
	                check.regex.lastIndex = 0;
	                const testResult = check.regex.test(input.data);
	                if (!testResult) {
	                    ctx = this._getOrReturnCtx(input, ctx);
	                    (0, parseUtil_js_1.addIssueToContext)(ctx, {
	                        validation: "regex",
	                        code: ZodError_js_1.ZodIssueCode.invalid_string,
	                        message: check.message,
	                    });
	                    status.dirty();
	                }
	            }
	            else if (check.kind === "trim") {
	                input.data = input.data.trim();
	            }
	            else if (check.kind === "includes") {
	                if (!input.data.includes(check.value, check.position)) {
	                    ctx = this._getOrReturnCtx(input, ctx);
	                    (0, parseUtil_js_1.addIssueToContext)(ctx, {
	                        code: ZodError_js_1.ZodIssueCode.invalid_string,
	                        validation: { includes: check.value, position: check.position },
	                        message: check.message,
	                    });
	                    status.dirty();
	                }
	            }
	            else if (check.kind === "toLowerCase") {
	                input.data = input.data.toLowerCase();
	            }
	            else if (check.kind === "toUpperCase") {
	                input.data = input.data.toUpperCase();
	            }
	            else if (check.kind === "startsWith") {
	                if (!input.data.startsWith(check.value)) {
	                    ctx = this._getOrReturnCtx(input, ctx);
	                    (0, parseUtil_js_1.addIssueToContext)(ctx, {
	                        code: ZodError_js_1.ZodIssueCode.invalid_string,
	                        validation: { startsWith: check.value },
	                        message: check.message,
	                    });
	                    status.dirty();
	                }
	            }
	            else if (check.kind === "endsWith") {
	                if (!input.data.endsWith(check.value)) {
	                    ctx = this._getOrReturnCtx(input, ctx);
	                    (0, parseUtil_js_1.addIssueToContext)(ctx, {
	                        code: ZodError_js_1.ZodIssueCode.invalid_string,
	                        validation: { endsWith: check.value },
	                        message: check.message,
	                    });
	                    status.dirty();
	                }
	            }
	            else if (check.kind === "datetime") {
	                const regex = datetimeRegex(check);
	                if (!regex.test(input.data)) {
	                    ctx = this._getOrReturnCtx(input, ctx);
	                    (0, parseUtil_js_1.addIssueToContext)(ctx, {
	                        code: ZodError_js_1.ZodIssueCode.invalid_string,
	                        validation: "datetime",
	                        message: check.message,
	                    });
	                    status.dirty();
	                }
	            }
	            else if (check.kind === "date") {
	                const regex = dateRegex;
	                if (!regex.test(input.data)) {
	                    ctx = this._getOrReturnCtx(input, ctx);
	                    (0, parseUtil_js_1.addIssueToContext)(ctx, {
	                        code: ZodError_js_1.ZodIssueCode.invalid_string,
	                        validation: "date",
	                        message: check.message,
	                    });
	                    status.dirty();
	                }
	            }
	            else if (check.kind === "time") {
	                const regex = timeRegex(check);
	                if (!regex.test(input.data)) {
	                    ctx = this._getOrReturnCtx(input, ctx);
	                    (0, parseUtil_js_1.addIssueToContext)(ctx, {
	                        code: ZodError_js_1.ZodIssueCode.invalid_string,
	                        validation: "time",
	                        message: check.message,
	                    });
	                    status.dirty();
	                }
	            }
	            else if (check.kind === "duration") {
	                if (!durationRegex.test(input.data)) {
	                    ctx = this._getOrReturnCtx(input, ctx);
	                    (0, parseUtil_js_1.addIssueToContext)(ctx, {
	                        validation: "duration",
	                        code: ZodError_js_1.ZodIssueCode.invalid_string,
	                        message: check.message,
	                    });
	                    status.dirty();
	                }
	            }
	            else if (check.kind === "ip") {
	                if (!isValidIP(input.data, check.version)) {
	                    ctx = this._getOrReturnCtx(input, ctx);
	                    (0, parseUtil_js_1.addIssueToContext)(ctx, {
	                        validation: "ip",
	                        code: ZodError_js_1.ZodIssueCode.invalid_string,
	                        message: check.message,
	                    });
	                    status.dirty();
	                }
	            }
	            else if (check.kind === "jwt") {
	                if (!isValidJWT(input.data, check.alg)) {
	                    ctx = this._getOrReturnCtx(input, ctx);
	                    (0, parseUtil_js_1.addIssueToContext)(ctx, {
	                        validation: "jwt",
	                        code: ZodError_js_1.ZodIssueCode.invalid_string,
	                        message: check.message,
	                    });
	                    status.dirty();
	                }
	            }
	            else if (check.kind === "cidr") {
	                if (!isValidCidr(input.data, check.version)) {
	                    ctx = this._getOrReturnCtx(input, ctx);
	                    (0, parseUtil_js_1.addIssueToContext)(ctx, {
	                        validation: "cidr",
	                        code: ZodError_js_1.ZodIssueCode.invalid_string,
	                        message: check.message,
	                    });
	                    status.dirty();
	                }
	            }
	            else if (check.kind === "base64") {
	                if (!base64Regex.test(input.data)) {
	                    ctx = this._getOrReturnCtx(input, ctx);
	                    (0, parseUtil_js_1.addIssueToContext)(ctx, {
	                        validation: "base64",
	                        code: ZodError_js_1.ZodIssueCode.invalid_string,
	                        message: check.message,
	                    });
	                    status.dirty();
	                }
	            }
	            else if (check.kind === "base64url") {
	                if (!base64urlRegex.test(input.data)) {
	                    ctx = this._getOrReturnCtx(input, ctx);
	                    (0, parseUtil_js_1.addIssueToContext)(ctx, {
	                        validation: "base64url",
	                        code: ZodError_js_1.ZodIssueCode.invalid_string,
	                        message: check.message,
	                    });
	                    status.dirty();
	                }
	            }
	            else {
	                util_js_1.util.assertNever(check);
	            }
	        }
	        return { status: status.value, value: input.data };
	    }
	    _regex(regex, validation, message) {
	        return this.refinement((data) => regex.test(data), {
	            validation,
	            code: ZodError_js_1.ZodIssueCode.invalid_string,
	            ...errorUtil_js_1.errorUtil.errToObj(message),
	        });
	    }
	    _addCheck(check) {
	        return new ZodString({
	            ...this._def,
	            checks: [...this._def.checks, check],
	        });
	    }
	    email(message) {
	        return this._addCheck({ kind: "email", ...errorUtil_js_1.errorUtil.errToObj(message) });
	    }
	    url(message) {
	        return this._addCheck({ kind: "url", ...errorUtil_js_1.errorUtil.errToObj(message) });
	    }
	    emoji(message) {
	        return this._addCheck({ kind: "emoji", ...errorUtil_js_1.errorUtil.errToObj(message) });
	    }
	    uuid(message) {
	        return this._addCheck({ kind: "uuid", ...errorUtil_js_1.errorUtil.errToObj(message) });
	    }
	    nanoid(message) {
	        return this._addCheck({ kind: "nanoid", ...errorUtil_js_1.errorUtil.errToObj(message) });
	    }
	    cuid(message) {
	        return this._addCheck({ kind: "cuid", ...errorUtil_js_1.errorUtil.errToObj(message) });
	    }
	    cuid2(message) {
	        return this._addCheck({ kind: "cuid2", ...errorUtil_js_1.errorUtil.errToObj(message) });
	    }
	    ulid(message) {
	        return this._addCheck({ kind: "ulid", ...errorUtil_js_1.errorUtil.errToObj(message) });
	    }
	    base64(message) {
	        return this._addCheck({ kind: "base64", ...errorUtil_js_1.errorUtil.errToObj(message) });
	    }
	    base64url(message) {
	        // base64url encoding is a modification of base64 that can safely be used in URLs and filenames
	        return this._addCheck({
	            kind: "base64url",
	            ...errorUtil_js_1.errorUtil.errToObj(message),
	        });
	    }
	    jwt(options) {
	        return this._addCheck({ kind: "jwt", ...errorUtil_js_1.errorUtil.errToObj(options) });
	    }
	    ip(options) {
	        return this._addCheck({ kind: "ip", ...errorUtil_js_1.errorUtil.errToObj(options) });
	    }
	    cidr(options) {
	        return this._addCheck({ kind: "cidr", ...errorUtil_js_1.errorUtil.errToObj(options) });
	    }
	    datetime(options) {
	        if (typeof options === "string") {
	            return this._addCheck({
	                kind: "datetime",
	                precision: null,
	                offset: false,
	                local: false,
	                message: options,
	            });
	        }
	        return this._addCheck({
	            kind: "datetime",
	            precision: typeof options?.precision === "undefined" ? null : options?.precision,
	            offset: options?.offset ?? false,
	            local: options?.local ?? false,
	            ...errorUtil_js_1.errorUtil.errToObj(options?.message),
	        });
	    }
	    date(message) {
	        return this._addCheck({ kind: "date", message });
	    }
	    time(options) {
	        if (typeof options === "string") {
	            return this._addCheck({
	                kind: "time",
	                precision: null,
	                message: options,
	            });
	        }
	        return this._addCheck({
	            kind: "time",
	            precision: typeof options?.precision === "undefined" ? null : options?.precision,
	            ...errorUtil_js_1.errorUtil.errToObj(options?.message),
	        });
	    }
	    duration(message) {
	        return this._addCheck({ kind: "duration", ...errorUtil_js_1.errorUtil.errToObj(message) });
	    }
	    regex(regex, message) {
	        return this._addCheck({
	            kind: "regex",
	            regex: regex,
	            ...errorUtil_js_1.errorUtil.errToObj(message),
	        });
	    }
	    includes(value, options) {
	        return this._addCheck({
	            kind: "includes",
	            value: value,
	            position: options?.position,
	            ...errorUtil_js_1.errorUtil.errToObj(options?.message),
	        });
	    }
	    startsWith(value, message) {
	        return this._addCheck({
	            kind: "startsWith",
	            value: value,
	            ...errorUtil_js_1.errorUtil.errToObj(message),
	        });
	    }
	    endsWith(value, message) {
	        return this._addCheck({
	            kind: "endsWith",
	            value: value,
	            ...errorUtil_js_1.errorUtil.errToObj(message),
	        });
	    }
	    min(minLength, message) {
	        return this._addCheck({
	            kind: "min",
	            value: minLength,
	            ...errorUtil_js_1.errorUtil.errToObj(message),
	        });
	    }
	    max(maxLength, message) {
	        return this._addCheck({
	            kind: "max",
	            value: maxLength,
	            ...errorUtil_js_1.errorUtil.errToObj(message),
	        });
	    }
	    length(len, message) {
	        return this._addCheck({
	            kind: "length",
	            value: len,
	            ...errorUtil_js_1.errorUtil.errToObj(message),
	        });
	    }
	    /**
	     * Equivalent to `.min(1)`
	     */
	    nonempty(message) {
	        return this.min(1, errorUtil_js_1.errorUtil.errToObj(message));
	    }
	    trim() {
	        return new ZodString({
	            ...this._def,
	            checks: [...this._def.checks, { kind: "trim" }],
	        });
	    }
	    toLowerCase() {
	        return new ZodString({
	            ...this._def,
	            checks: [...this._def.checks, { kind: "toLowerCase" }],
	        });
	    }
	    toUpperCase() {
	        return new ZodString({
	            ...this._def,
	            checks: [...this._def.checks, { kind: "toUpperCase" }],
	        });
	    }
	    get isDatetime() {
	        return !!this._def.checks.find((ch) => ch.kind === "datetime");
	    }
	    get isDate() {
	        return !!this._def.checks.find((ch) => ch.kind === "date");
	    }
	    get isTime() {
	        return !!this._def.checks.find((ch) => ch.kind === "time");
	    }
	    get isDuration() {
	        return !!this._def.checks.find((ch) => ch.kind === "duration");
	    }
	    get isEmail() {
	        return !!this._def.checks.find((ch) => ch.kind === "email");
	    }
	    get isURL() {
	        return !!this._def.checks.find((ch) => ch.kind === "url");
	    }
	    get isEmoji() {
	        return !!this._def.checks.find((ch) => ch.kind === "emoji");
	    }
	    get isUUID() {
	        return !!this._def.checks.find((ch) => ch.kind === "uuid");
	    }
	    get isNANOID() {
	        return !!this._def.checks.find((ch) => ch.kind === "nanoid");
	    }
	    get isCUID() {
	        return !!this._def.checks.find((ch) => ch.kind === "cuid");
	    }
	    get isCUID2() {
	        return !!this._def.checks.find((ch) => ch.kind === "cuid2");
	    }
	    get isULID() {
	        return !!this._def.checks.find((ch) => ch.kind === "ulid");
	    }
	    get isIP() {
	        return !!this._def.checks.find((ch) => ch.kind === "ip");
	    }
	    get isCIDR() {
	        return !!this._def.checks.find((ch) => ch.kind === "cidr");
	    }
	    get isBase64() {
	        return !!this._def.checks.find((ch) => ch.kind === "base64");
	    }
	    get isBase64url() {
	        // base64url encoding is a modification of base64 that can safely be used in URLs and filenames
	        return !!this._def.checks.find((ch) => ch.kind === "base64url");
	    }
	    get minLength() {
	        let min = null;
	        for (const ch of this._def.checks) {
	            if (ch.kind === "min") {
	                if (min === null || ch.value > min)
	                    min = ch.value;
	            }
	        }
	        return min;
	    }
	    get maxLength() {
	        let max = null;
	        for (const ch of this._def.checks) {
	            if (ch.kind === "max") {
	                if (max === null || ch.value < max)
	                    max = ch.value;
	            }
	        }
	        return max;
	    }
	}
	types$1.ZodString = ZodString;
	ZodString.create = (params) => {
	    return new ZodString({
	        checks: [],
	        typeName: ZodFirstPartyTypeKind.ZodString,
	        coerce: params?.coerce ?? false,
	        ...processCreateParams(params),
	    });
	};
	// https://stackoverflow.com/questions/3966484/why-does-modulus-operator-return-fractional-number-in-javascript/31711034#31711034
	function floatSafeRemainder(val, step) {
	    const valDecCount = (val.toString().split(".")[1] || "").length;
	    const stepDecCount = (step.toString().split(".")[1] || "").length;
	    const decCount = valDecCount > stepDecCount ? valDecCount : stepDecCount;
	    const valInt = Number.parseInt(val.toFixed(decCount).replace(".", ""));
	    const stepInt = Number.parseInt(step.toFixed(decCount).replace(".", ""));
	    return (valInt % stepInt) / 10 ** decCount;
	}
	class ZodNumber extends ZodType {
	    constructor() {
	        super(...arguments);
	        this.min = this.gte;
	        this.max = this.lte;
	        this.step = this.multipleOf;
	    }
	    _parse(input) {
	        if (this._def.coerce) {
	            input.data = Number(input.data);
	        }
	        const parsedType = this._getType(input);
	        if (parsedType !== util_js_1.ZodParsedType.number) {
	            const ctx = this._getOrReturnCtx(input);
	            (0, parseUtil_js_1.addIssueToContext)(ctx, {
	                code: ZodError_js_1.ZodIssueCode.invalid_type,
	                expected: util_js_1.ZodParsedType.number,
	                received: ctx.parsedType,
	            });
	            return parseUtil_js_1.INVALID;
	        }
	        let ctx = undefined;
	        const status = new parseUtil_js_1.ParseStatus();
	        for (const check of this._def.checks) {
	            if (check.kind === "int") {
	                if (!util_js_1.util.isInteger(input.data)) {
	                    ctx = this._getOrReturnCtx(input, ctx);
	                    (0, parseUtil_js_1.addIssueToContext)(ctx, {
	                        code: ZodError_js_1.ZodIssueCode.invalid_type,
	                        expected: "integer",
	                        received: "float",
	                        message: check.message,
	                    });
	                    status.dirty();
	                }
	            }
	            else if (check.kind === "min") {
	                const tooSmall = check.inclusive ? input.data < check.value : input.data <= check.value;
	                if (tooSmall) {
	                    ctx = this._getOrReturnCtx(input, ctx);
	                    (0, parseUtil_js_1.addIssueToContext)(ctx, {
	                        code: ZodError_js_1.ZodIssueCode.too_small,
	                        minimum: check.value,
	                        type: "number",
	                        inclusive: check.inclusive,
	                        exact: false,
	                        message: check.message,
	                    });
	                    status.dirty();
	                }
	            }
	            else if (check.kind === "max") {
	                const tooBig = check.inclusive ? input.data > check.value : input.data >= check.value;
	                if (tooBig) {
	                    ctx = this._getOrReturnCtx(input, ctx);
	                    (0, parseUtil_js_1.addIssueToContext)(ctx, {
	                        code: ZodError_js_1.ZodIssueCode.too_big,
	                        maximum: check.value,
	                        type: "number",
	                        inclusive: check.inclusive,
	                        exact: false,
	                        message: check.message,
	                    });
	                    status.dirty();
	                }
	            }
	            else if (check.kind === "multipleOf") {
	                if (floatSafeRemainder(input.data, check.value) !== 0) {
	                    ctx = this._getOrReturnCtx(input, ctx);
	                    (0, parseUtil_js_1.addIssueToContext)(ctx, {
	                        code: ZodError_js_1.ZodIssueCode.not_multiple_of,
	                        multipleOf: check.value,
	                        message: check.message,
	                    });
	                    status.dirty();
	                }
	            }
	            else if (check.kind === "finite") {
	                if (!Number.isFinite(input.data)) {
	                    ctx = this._getOrReturnCtx(input, ctx);
	                    (0, parseUtil_js_1.addIssueToContext)(ctx, {
	                        code: ZodError_js_1.ZodIssueCode.not_finite,
	                        message: check.message,
	                    });
	                    status.dirty();
	                }
	            }
	            else {
	                util_js_1.util.assertNever(check);
	            }
	        }
	        return { status: status.value, value: input.data };
	    }
	    gte(value, message) {
	        return this.setLimit("min", value, true, errorUtil_js_1.errorUtil.toString(message));
	    }
	    gt(value, message) {
	        return this.setLimit("min", value, false, errorUtil_js_1.errorUtil.toString(message));
	    }
	    lte(value, message) {
	        return this.setLimit("max", value, true, errorUtil_js_1.errorUtil.toString(message));
	    }
	    lt(value, message) {
	        return this.setLimit("max", value, false, errorUtil_js_1.errorUtil.toString(message));
	    }
	    setLimit(kind, value, inclusive, message) {
	        return new ZodNumber({
	            ...this._def,
	            checks: [
	                ...this._def.checks,
	                {
	                    kind,
	                    value,
	                    inclusive,
	                    message: errorUtil_js_1.errorUtil.toString(message),
	                },
	            ],
	        });
	    }
	    _addCheck(check) {
	        return new ZodNumber({
	            ...this._def,
	            checks: [...this._def.checks, check],
	        });
	    }
	    int(message) {
	        return this._addCheck({
	            kind: "int",
	            message: errorUtil_js_1.errorUtil.toString(message),
	        });
	    }
	    positive(message) {
	        return this._addCheck({
	            kind: "min",
	            value: 0,
	            inclusive: false,
	            message: errorUtil_js_1.errorUtil.toString(message),
	        });
	    }
	    negative(message) {
	        return this._addCheck({
	            kind: "max",
	            value: 0,
	            inclusive: false,
	            message: errorUtil_js_1.errorUtil.toString(message),
	        });
	    }
	    nonpositive(message) {
	        return this._addCheck({
	            kind: "max",
	            value: 0,
	            inclusive: true,
	            message: errorUtil_js_1.errorUtil.toString(message),
	        });
	    }
	    nonnegative(message) {
	        return this._addCheck({
	            kind: "min",
	            value: 0,
	            inclusive: true,
	            message: errorUtil_js_1.errorUtil.toString(message),
	        });
	    }
	    multipleOf(value, message) {
	        return this._addCheck({
	            kind: "multipleOf",
	            value: value,
	            message: errorUtil_js_1.errorUtil.toString(message),
	        });
	    }
	    finite(message) {
	        return this._addCheck({
	            kind: "finite",
	            message: errorUtil_js_1.errorUtil.toString(message),
	        });
	    }
	    safe(message) {
	        return this._addCheck({
	            kind: "min",
	            inclusive: true,
	            value: Number.MIN_SAFE_INTEGER,
	            message: errorUtil_js_1.errorUtil.toString(message),
	        })._addCheck({
	            kind: "max",
	            inclusive: true,
	            value: Number.MAX_SAFE_INTEGER,
	            message: errorUtil_js_1.errorUtil.toString(message),
	        });
	    }
	    get minValue() {
	        let min = null;
	        for (const ch of this._def.checks) {
	            if (ch.kind === "min") {
	                if (min === null || ch.value > min)
	                    min = ch.value;
	            }
	        }
	        return min;
	    }
	    get maxValue() {
	        let max = null;
	        for (const ch of this._def.checks) {
	            if (ch.kind === "max") {
	                if (max === null || ch.value < max)
	                    max = ch.value;
	            }
	        }
	        return max;
	    }
	    get isInt() {
	        return !!this._def.checks.find((ch) => ch.kind === "int" || (ch.kind === "multipleOf" && util_js_1.util.isInteger(ch.value)));
	    }
	    get isFinite() {
	        let max = null;
	        let min = null;
	        for (const ch of this._def.checks) {
	            if (ch.kind === "finite" || ch.kind === "int" || ch.kind === "multipleOf") {
	                return true;
	            }
	            else if (ch.kind === "min") {
	                if (min === null || ch.value > min)
	                    min = ch.value;
	            }
	            else if (ch.kind === "max") {
	                if (max === null || ch.value < max)
	                    max = ch.value;
	            }
	        }
	        return Number.isFinite(min) && Number.isFinite(max);
	    }
	}
	types$1.ZodNumber = ZodNumber;
	ZodNumber.create = (params) => {
	    return new ZodNumber({
	        checks: [],
	        typeName: ZodFirstPartyTypeKind.ZodNumber,
	        coerce: params?.coerce || false,
	        ...processCreateParams(params),
	    });
	};
	class ZodBigInt extends ZodType {
	    constructor() {
	        super(...arguments);
	        this.min = this.gte;
	        this.max = this.lte;
	    }
	    _parse(input) {
	        if (this._def.coerce) {
	            try {
	                input.data = BigInt(input.data);
	            }
	            catch {
	                return this._getInvalidInput(input);
	            }
	        }
	        const parsedType = this._getType(input);
	        if (parsedType !== util_js_1.ZodParsedType.bigint) {
	            return this._getInvalidInput(input);
	        }
	        let ctx = undefined;
	        const status = new parseUtil_js_1.ParseStatus();
	        for (const check of this._def.checks) {
	            if (check.kind === "min") {
	                const tooSmall = check.inclusive ? input.data < check.value : input.data <= check.value;
	                if (tooSmall) {
	                    ctx = this._getOrReturnCtx(input, ctx);
	                    (0, parseUtil_js_1.addIssueToContext)(ctx, {
	                        code: ZodError_js_1.ZodIssueCode.too_small,
	                        type: "bigint",
	                        minimum: check.value,
	                        inclusive: check.inclusive,
	                        message: check.message,
	                    });
	                    status.dirty();
	                }
	            }
	            else if (check.kind === "max") {
	                const tooBig = check.inclusive ? input.data > check.value : input.data >= check.value;
	                if (tooBig) {
	                    ctx = this._getOrReturnCtx(input, ctx);
	                    (0, parseUtil_js_1.addIssueToContext)(ctx, {
	                        code: ZodError_js_1.ZodIssueCode.too_big,
	                        type: "bigint",
	                        maximum: check.value,
	                        inclusive: check.inclusive,
	                        message: check.message,
	                    });
	                    status.dirty();
	                }
	            }
	            else if (check.kind === "multipleOf") {
	                if (input.data % check.value !== BigInt(0)) {
	                    ctx = this._getOrReturnCtx(input, ctx);
	                    (0, parseUtil_js_1.addIssueToContext)(ctx, {
	                        code: ZodError_js_1.ZodIssueCode.not_multiple_of,
	                        multipleOf: check.value,
	                        message: check.message,
	                    });
	                    status.dirty();
	                }
	            }
	            else {
	                util_js_1.util.assertNever(check);
	            }
	        }
	        return { status: status.value, value: input.data };
	    }
	    _getInvalidInput(input) {
	        const ctx = this._getOrReturnCtx(input);
	        (0, parseUtil_js_1.addIssueToContext)(ctx, {
	            code: ZodError_js_1.ZodIssueCode.invalid_type,
	            expected: util_js_1.ZodParsedType.bigint,
	            received: ctx.parsedType,
	        });
	        return parseUtil_js_1.INVALID;
	    }
	    gte(value, message) {
	        return this.setLimit("min", value, true, errorUtil_js_1.errorUtil.toString(message));
	    }
	    gt(value, message) {
	        return this.setLimit("min", value, false, errorUtil_js_1.errorUtil.toString(message));
	    }
	    lte(value, message) {
	        return this.setLimit("max", value, true, errorUtil_js_1.errorUtil.toString(message));
	    }
	    lt(value, message) {
	        return this.setLimit("max", value, false, errorUtil_js_1.errorUtil.toString(message));
	    }
	    setLimit(kind, value, inclusive, message) {
	        return new ZodBigInt({
	            ...this._def,
	            checks: [
	                ...this._def.checks,
	                {
	                    kind,
	                    value,
	                    inclusive,
	                    message: errorUtil_js_1.errorUtil.toString(message),
	                },
	            ],
	        });
	    }
	    _addCheck(check) {
	        return new ZodBigInt({
	            ...this._def,
	            checks: [...this._def.checks, check],
	        });
	    }
	    positive(message) {
	        return this._addCheck({
	            kind: "min",
	            value: BigInt(0),
	            inclusive: false,
	            message: errorUtil_js_1.errorUtil.toString(message),
	        });
	    }
	    negative(message) {
	        return this._addCheck({
	            kind: "max",
	            value: BigInt(0),
	            inclusive: false,
	            message: errorUtil_js_1.errorUtil.toString(message),
	        });
	    }
	    nonpositive(message) {
	        return this._addCheck({
	            kind: "max",
	            value: BigInt(0),
	            inclusive: true,
	            message: errorUtil_js_1.errorUtil.toString(message),
	        });
	    }
	    nonnegative(message) {
	        return this._addCheck({
	            kind: "min",
	            value: BigInt(0),
	            inclusive: true,
	            message: errorUtil_js_1.errorUtil.toString(message),
	        });
	    }
	    multipleOf(value, message) {
	        return this._addCheck({
	            kind: "multipleOf",
	            value,
	            message: errorUtil_js_1.errorUtil.toString(message),
	        });
	    }
	    get minValue() {
	        let min = null;
	        for (const ch of this._def.checks) {
	            if (ch.kind === "min") {
	                if (min === null || ch.value > min)
	                    min = ch.value;
	            }
	        }
	        return min;
	    }
	    get maxValue() {
	        let max = null;
	        for (const ch of this._def.checks) {
	            if (ch.kind === "max") {
	                if (max === null || ch.value < max)
	                    max = ch.value;
	            }
	        }
	        return max;
	    }
	}
	types$1.ZodBigInt = ZodBigInt;
	ZodBigInt.create = (params) => {
	    return new ZodBigInt({
	        checks: [],
	        typeName: ZodFirstPartyTypeKind.ZodBigInt,
	        coerce: params?.coerce ?? false,
	        ...processCreateParams(params),
	    });
	};
	class ZodBoolean extends ZodType {
	    _parse(input) {
	        if (this._def.coerce) {
	            input.data = Boolean(input.data);
	        }
	        const parsedType = this._getType(input);
	        if (parsedType !== util_js_1.ZodParsedType.boolean) {
	            const ctx = this._getOrReturnCtx(input);
	            (0, parseUtil_js_1.addIssueToContext)(ctx, {
	                code: ZodError_js_1.ZodIssueCode.invalid_type,
	                expected: util_js_1.ZodParsedType.boolean,
	                received: ctx.parsedType,
	            });
	            return parseUtil_js_1.INVALID;
	        }
	        return (0, parseUtil_js_1.OK)(input.data);
	    }
	}
	types$1.ZodBoolean = ZodBoolean;
	ZodBoolean.create = (params) => {
	    return new ZodBoolean({
	        typeName: ZodFirstPartyTypeKind.ZodBoolean,
	        coerce: params?.coerce || false,
	        ...processCreateParams(params),
	    });
	};
	class ZodDate extends ZodType {
	    _parse(input) {
	        if (this._def.coerce) {
	            input.data = new Date(input.data);
	        }
	        const parsedType = this._getType(input);
	        if (parsedType !== util_js_1.ZodParsedType.date) {
	            const ctx = this._getOrReturnCtx(input);
	            (0, parseUtil_js_1.addIssueToContext)(ctx, {
	                code: ZodError_js_1.ZodIssueCode.invalid_type,
	                expected: util_js_1.ZodParsedType.date,
	                received: ctx.parsedType,
	            });
	            return parseUtil_js_1.INVALID;
	        }
	        if (Number.isNaN(input.data.getTime())) {
	            const ctx = this._getOrReturnCtx(input);
	            (0, parseUtil_js_1.addIssueToContext)(ctx, {
	                code: ZodError_js_1.ZodIssueCode.invalid_date,
	            });
	            return parseUtil_js_1.INVALID;
	        }
	        const status = new parseUtil_js_1.ParseStatus();
	        let ctx = undefined;
	        for (const check of this._def.checks) {
	            if (check.kind === "min") {
	                if (input.data.getTime() < check.value) {
	                    ctx = this._getOrReturnCtx(input, ctx);
	                    (0, parseUtil_js_1.addIssueToContext)(ctx, {
	                        code: ZodError_js_1.ZodIssueCode.too_small,
	                        message: check.message,
	                        inclusive: true,
	                        exact: false,
	                        minimum: check.value,
	                        type: "date",
	                    });
	                    status.dirty();
	                }
	            }
	            else if (check.kind === "max") {
	                if (input.data.getTime() > check.value) {
	                    ctx = this._getOrReturnCtx(input, ctx);
	                    (0, parseUtil_js_1.addIssueToContext)(ctx, {
	                        code: ZodError_js_1.ZodIssueCode.too_big,
	                        message: check.message,
	                        inclusive: true,
	                        exact: false,
	                        maximum: check.value,
	                        type: "date",
	                    });
	                    status.dirty();
	                }
	            }
	            else {
	                util_js_1.util.assertNever(check);
	            }
	        }
	        return {
	            status: status.value,
	            value: new Date(input.data.getTime()),
	        };
	    }
	    _addCheck(check) {
	        return new ZodDate({
	            ...this._def,
	            checks: [...this._def.checks, check],
	        });
	    }
	    min(minDate, message) {
	        return this._addCheck({
	            kind: "min",
	            value: minDate.getTime(),
	            message: errorUtil_js_1.errorUtil.toString(message),
	        });
	    }
	    max(maxDate, message) {
	        return this._addCheck({
	            kind: "max",
	            value: maxDate.getTime(),
	            message: errorUtil_js_1.errorUtil.toString(message),
	        });
	    }
	    get minDate() {
	        let min = null;
	        for (const ch of this._def.checks) {
	            if (ch.kind === "min") {
	                if (min === null || ch.value > min)
	                    min = ch.value;
	            }
	        }
	        return min != null ? new Date(min) : null;
	    }
	    get maxDate() {
	        let max = null;
	        for (const ch of this._def.checks) {
	            if (ch.kind === "max") {
	                if (max === null || ch.value < max)
	                    max = ch.value;
	            }
	        }
	        return max != null ? new Date(max) : null;
	    }
	}
	types$1.ZodDate = ZodDate;
	ZodDate.create = (params) => {
	    return new ZodDate({
	        checks: [],
	        coerce: params?.coerce || false,
	        typeName: ZodFirstPartyTypeKind.ZodDate,
	        ...processCreateParams(params),
	    });
	};
	class ZodSymbol extends ZodType {
	    _parse(input) {
	        const parsedType = this._getType(input);
	        if (parsedType !== util_js_1.ZodParsedType.symbol) {
	            const ctx = this._getOrReturnCtx(input);
	            (0, parseUtil_js_1.addIssueToContext)(ctx, {
	                code: ZodError_js_1.ZodIssueCode.invalid_type,
	                expected: util_js_1.ZodParsedType.symbol,
	                received: ctx.parsedType,
	            });
	            return parseUtil_js_1.INVALID;
	        }
	        return (0, parseUtil_js_1.OK)(input.data);
	    }
	}
	types$1.ZodSymbol = ZodSymbol;
	ZodSymbol.create = (params) => {
	    return new ZodSymbol({
	        typeName: ZodFirstPartyTypeKind.ZodSymbol,
	        ...processCreateParams(params),
	    });
	};
	class ZodUndefined extends ZodType {
	    _parse(input) {
	        const parsedType = this._getType(input);
	        if (parsedType !== util_js_1.ZodParsedType.undefined) {
	            const ctx = this._getOrReturnCtx(input);
	            (0, parseUtil_js_1.addIssueToContext)(ctx, {
	                code: ZodError_js_1.ZodIssueCode.invalid_type,
	                expected: util_js_1.ZodParsedType.undefined,
	                received: ctx.parsedType,
	            });
	            return parseUtil_js_1.INVALID;
	        }
	        return (0, parseUtil_js_1.OK)(input.data);
	    }
	}
	types$1.ZodUndefined = ZodUndefined;
	ZodUndefined.create = (params) => {
	    return new ZodUndefined({
	        typeName: ZodFirstPartyTypeKind.ZodUndefined,
	        ...processCreateParams(params),
	    });
	};
	class ZodNull extends ZodType {
	    _parse(input) {
	        const parsedType = this._getType(input);
	        if (parsedType !== util_js_1.ZodParsedType.null) {
	            const ctx = this._getOrReturnCtx(input);
	            (0, parseUtil_js_1.addIssueToContext)(ctx, {
	                code: ZodError_js_1.ZodIssueCode.invalid_type,
	                expected: util_js_1.ZodParsedType.null,
	                received: ctx.parsedType,
	            });
	            return parseUtil_js_1.INVALID;
	        }
	        return (0, parseUtil_js_1.OK)(input.data);
	    }
	}
	types$1.ZodNull = ZodNull;
	ZodNull.create = (params) => {
	    return new ZodNull({
	        typeName: ZodFirstPartyTypeKind.ZodNull,
	        ...processCreateParams(params),
	    });
	};
	class ZodAny extends ZodType {
	    constructor() {
	        super(...arguments);
	        // to prevent instances of other classes from extending ZodAny. this causes issues with catchall in ZodObject.
	        this._any = true;
	    }
	    _parse(input) {
	        return (0, parseUtil_js_1.OK)(input.data);
	    }
	}
	types$1.ZodAny = ZodAny;
	ZodAny.create = (params) => {
	    return new ZodAny({
	        typeName: ZodFirstPartyTypeKind.ZodAny,
	        ...processCreateParams(params),
	    });
	};
	class ZodUnknown extends ZodType {
	    constructor() {
	        super(...arguments);
	        // required
	        this._unknown = true;
	    }
	    _parse(input) {
	        return (0, parseUtil_js_1.OK)(input.data);
	    }
	}
	types$1.ZodUnknown = ZodUnknown;
	ZodUnknown.create = (params) => {
	    return new ZodUnknown({
	        typeName: ZodFirstPartyTypeKind.ZodUnknown,
	        ...processCreateParams(params),
	    });
	};
	class ZodNever extends ZodType {
	    _parse(input) {
	        const ctx = this._getOrReturnCtx(input);
	        (0, parseUtil_js_1.addIssueToContext)(ctx, {
	            code: ZodError_js_1.ZodIssueCode.invalid_type,
	            expected: util_js_1.ZodParsedType.never,
	            received: ctx.parsedType,
	        });
	        return parseUtil_js_1.INVALID;
	    }
	}
	types$1.ZodNever = ZodNever;
	ZodNever.create = (params) => {
	    return new ZodNever({
	        typeName: ZodFirstPartyTypeKind.ZodNever,
	        ...processCreateParams(params),
	    });
	};
	class ZodVoid extends ZodType {
	    _parse(input) {
	        const parsedType = this._getType(input);
	        if (parsedType !== util_js_1.ZodParsedType.undefined) {
	            const ctx = this._getOrReturnCtx(input);
	            (0, parseUtil_js_1.addIssueToContext)(ctx, {
	                code: ZodError_js_1.ZodIssueCode.invalid_type,
	                expected: util_js_1.ZodParsedType.void,
	                received: ctx.parsedType,
	            });
	            return parseUtil_js_1.INVALID;
	        }
	        return (0, parseUtil_js_1.OK)(input.data);
	    }
	}
	types$1.ZodVoid = ZodVoid;
	ZodVoid.create = (params) => {
	    return new ZodVoid({
	        typeName: ZodFirstPartyTypeKind.ZodVoid,
	        ...processCreateParams(params),
	    });
	};
	class ZodArray extends ZodType {
	    _parse(input) {
	        const { ctx, status } = this._processInputParams(input);
	        const def = this._def;
	        if (ctx.parsedType !== util_js_1.ZodParsedType.array) {
	            (0, parseUtil_js_1.addIssueToContext)(ctx, {
	                code: ZodError_js_1.ZodIssueCode.invalid_type,
	                expected: util_js_1.ZodParsedType.array,
	                received: ctx.parsedType,
	            });
	            return parseUtil_js_1.INVALID;
	        }
	        if (def.exactLength !== null) {
	            const tooBig = ctx.data.length > def.exactLength.value;
	            const tooSmall = ctx.data.length < def.exactLength.value;
	            if (tooBig || tooSmall) {
	                (0, parseUtil_js_1.addIssueToContext)(ctx, {
	                    code: tooBig ? ZodError_js_1.ZodIssueCode.too_big : ZodError_js_1.ZodIssueCode.too_small,
	                    minimum: (tooSmall ? def.exactLength.value : undefined),
	                    maximum: (tooBig ? def.exactLength.value : undefined),
	                    type: "array",
	                    inclusive: true,
	                    exact: true,
	                    message: def.exactLength.message,
	                });
	                status.dirty();
	            }
	        }
	        if (def.minLength !== null) {
	            if (ctx.data.length < def.minLength.value) {
	                (0, parseUtil_js_1.addIssueToContext)(ctx, {
	                    code: ZodError_js_1.ZodIssueCode.too_small,
	                    minimum: def.minLength.value,
	                    type: "array",
	                    inclusive: true,
	                    exact: false,
	                    message: def.minLength.message,
	                });
	                status.dirty();
	            }
	        }
	        if (def.maxLength !== null) {
	            if (ctx.data.length > def.maxLength.value) {
	                (0, parseUtil_js_1.addIssueToContext)(ctx, {
	                    code: ZodError_js_1.ZodIssueCode.too_big,
	                    maximum: def.maxLength.value,
	                    type: "array",
	                    inclusive: true,
	                    exact: false,
	                    message: def.maxLength.message,
	                });
	                status.dirty();
	            }
	        }
	        if (ctx.common.async) {
	            return Promise.all([...ctx.data].map((item, i) => {
	                return def.type._parseAsync(new ParseInputLazyPath(ctx, item, ctx.path, i));
	            })).then((result) => {
	                return parseUtil_js_1.ParseStatus.mergeArray(status, result);
	            });
	        }
	        const result = [...ctx.data].map((item, i) => {
	            return def.type._parseSync(new ParseInputLazyPath(ctx, item, ctx.path, i));
	        });
	        return parseUtil_js_1.ParseStatus.mergeArray(status, result);
	    }
	    get element() {
	        return this._def.type;
	    }
	    min(minLength, message) {
	        return new ZodArray({
	            ...this._def,
	            minLength: { value: minLength, message: errorUtil_js_1.errorUtil.toString(message) },
	        });
	    }
	    max(maxLength, message) {
	        return new ZodArray({
	            ...this._def,
	            maxLength: { value: maxLength, message: errorUtil_js_1.errorUtil.toString(message) },
	        });
	    }
	    length(len, message) {
	        return new ZodArray({
	            ...this._def,
	            exactLength: { value: len, message: errorUtil_js_1.errorUtil.toString(message) },
	        });
	    }
	    nonempty(message) {
	        return this.min(1, message);
	    }
	}
	types$1.ZodArray = ZodArray;
	ZodArray.create = (schema, params) => {
	    return new ZodArray({
	        type: schema,
	        minLength: null,
	        maxLength: null,
	        exactLength: null,
	        typeName: ZodFirstPartyTypeKind.ZodArray,
	        ...processCreateParams(params),
	    });
	};
	function deepPartialify(schema) {
	    if (schema instanceof ZodObject) {
	        const newShape = {};
	        for (const key in schema.shape) {
	            const fieldSchema = schema.shape[key];
	            newShape[key] = ZodOptional.create(deepPartialify(fieldSchema));
	        }
	        return new ZodObject({
	            ...schema._def,
	            shape: () => newShape,
	        });
	    }
	    else if (schema instanceof ZodArray) {
	        return new ZodArray({
	            ...schema._def,
	            type: deepPartialify(schema.element),
	        });
	    }
	    else if (schema instanceof ZodOptional) {
	        return ZodOptional.create(deepPartialify(schema.unwrap()));
	    }
	    else if (schema instanceof ZodNullable) {
	        return ZodNullable.create(deepPartialify(schema.unwrap()));
	    }
	    else if (schema instanceof ZodTuple) {
	        return ZodTuple.create(schema.items.map((item) => deepPartialify(item)));
	    }
	    else {
	        return schema;
	    }
	}
	class ZodObject extends ZodType {
	    constructor() {
	        super(...arguments);
	        this._cached = null;
	        /**
	         * @deprecated In most cases, this is no longer needed - unknown properties are now silently stripped.
	         * If you want to pass through unknown properties, use `.passthrough()` instead.
	         */
	        this.nonstrict = this.passthrough;
	        // extend<
	        //   Augmentation extends ZodRawShape,
	        //   NewOutput extends util.flatten<{
	        //     [k in keyof Augmentation | keyof Output]: k extends keyof Augmentation
	        //       ? Augmentation[k]["_output"]
	        //       : k extends keyof Output
	        //       ? Output[k]
	        //       : never;
	        //   }>,
	        //   NewInput extends util.flatten<{
	        //     [k in keyof Augmentation | keyof Input]: k extends keyof Augmentation
	        //       ? Augmentation[k]["_input"]
	        //       : k extends keyof Input
	        //       ? Input[k]
	        //       : never;
	        //   }>
	        // >(
	        //   augmentation: Augmentation
	        // ): ZodObject<
	        //   extendShape<T, Augmentation>,
	        //   UnknownKeys,
	        //   Catchall,
	        //   NewOutput,
	        //   NewInput
	        // > {
	        //   return new ZodObject({
	        //     ...this._def,
	        //     shape: () => ({
	        //       ...this._def.shape(),
	        //       ...augmentation,
	        //     }),
	        //   }) as any;
	        // }
	        /**
	         * @deprecated Use `.extend` instead
	         *  */
	        this.augment = this.extend;
	    }
	    _getCached() {
	        if (this._cached !== null)
	            return this._cached;
	        const shape = this._def.shape();
	        const keys = util_js_1.util.objectKeys(shape);
	        this._cached = { shape, keys };
	        return this._cached;
	    }
	    _parse(input) {
	        const parsedType = this._getType(input);
	        if (parsedType !== util_js_1.ZodParsedType.object) {
	            const ctx = this._getOrReturnCtx(input);
	            (0, parseUtil_js_1.addIssueToContext)(ctx, {
	                code: ZodError_js_1.ZodIssueCode.invalid_type,
	                expected: util_js_1.ZodParsedType.object,
	                received: ctx.parsedType,
	            });
	            return parseUtil_js_1.INVALID;
	        }
	        const { status, ctx } = this._processInputParams(input);
	        const { shape, keys: shapeKeys } = this._getCached();
	        const extraKeys = [];
	        if (!(this._def.catchall instanceof ZodNever && this._def.unknownKeys === "strip")) {
	            for (const key in ctx.data) {
	                if (!shapeKeys.includes(key)) {
	                    extraKeys.push(key);
	                }
	            }
	        }
	        const pairs = [];
	        for (const key of shapeKeys) {
	            const keyValidator = shape[key];
	            const value = ctx.data[key];
	            pairs.push({
	                key: { status: "valid", value: key },
	                value: keyValidator._parse(new ParseInputLazyPath(ctx, value, ctx.path, key)),
	                alwaysSet: key in ctx.data,
	            });
	        }
	        if (this._def.catchall instanceof ZodNever) {
	            const unknownKeys = this._def.unknownKeys;
	            if (unknownKeys === "passthrough") {
	                for (const key of extraKeys) {
	                    pairs.push({
	                        key: { status: "valid", value: key },
	                        value: { status: "valid", value: ctx.data[key] },
	                    });
	                }
	            }
	            else if (unknownKeys === "strict") {
	                if (extraKeys.length > 0) {
	                    (0, parseUtil_js_1.addIssueToContext)(ctx, {
	                        code: ZodError_js_1.ZodIssueCode.unrecognized_keys,
	                        keys: extraKeys,
	                    });
	                    status.dirty();
	                }
	            }
	            else if (unknownKeys === "strip") ;
	            else {
	                throw new Error(`Internal ZodObject error: invalid unknownKeys value.`);
	            }
	        }
	        else {
	            // run catchall validation
	            const catchall = this._def.catchall;
	            for (const key of extraKeys) {
	                const value = ctx.data[key];
	                pairs.push({
	                    key: { status: "valid", value: key },
	                    value: catchall._parse(new ParseInputLazyPath(ctx, value, ctx.path, key) //, ctx.child(key), value, getParsedType(value)
	                    ),
	                    alwaysSet: key in ctx.data,
	                });
	            }
	        }
	        if (ctx.common.async) {
	            return Promise.resolve()
	                .then(async () => {
	                const syncPairs = [];
	                for (const pair of pairs) {
	                    const key = await pair.key;
	                    const value = await pair.value;
	                    syncPairs.push({
	                        key,
	                        value,
	                        alwaysSet: pair.alwaysSet,
	                    });
	                }
	                return syncPairs;
	            })
	                .then((syncPairs) => {
	                return parseUtil_js_1.ParseStatus.mergeObjectSync(status, syncPairs);
	            });
	        }
	        else {
	            return parseUtil_js_1.ParseStatus.mergeObjectSync(status, pairs);
	        }
	    }
	    get shape() {
	        return this._def.shape();
	    }
	    strict(message) {
	        errorUtil_js_1.errorUtil.errToObj;
	        return new ZodObject({
	            ...this._def,
	            unknownKeys: "strict",
	            ...(message !== undefined
	                ? {
	                    errorMap: (issue, ctx) => {
	                        const defaultError = this._def.errorMap?.(issue, ctx).message ?? ctx.defaultError;
	                        if (issue.code === "unrecognized_keys")
	                            return {
	                                message: errorUtil_js_1.errorUtil.errToObj(message).message ?? defaultError,
	                            };
	                        return {
	                            message: defaultError,
	                        };
	                    },
	                }
	                : {}),
	        });
	    }
	    strip() {
	        return new ZodObject({
	            ...this._def,
	            unknownKeys: "strip",
	        });
	    }
	    passthrough() {
	        return new ZodObject({
	            ...this._def,
	            unknownKeys: "passthrough",
	        });
	    }
	    // const AugmentFactory =
	    //   <Def extends ZodObjectDef>(def: Def) =>
	    //   <Augmentation extends ZodRawShape>(
	    //     augmentation: Augmentation
	    //   ): ZodObject<
	    //     extendShape<ReturnType<Def["shape"]>, Augmentation>,
	    //     Def["unknownKeys"],
	    //     Def["catchall"]
	    //   > => {
	    //     return new ZodObject({
	    //       ...def,
	    //       shape: () => ({
	    //         ...def.shape(),
	    //         ...augmentation,
	    //       }),
	    //     }) as any;
	    //   };
	    extend(augmentation) {
	        return new ZodObject({
	            ...this._def,
	            shape: () => ({
	                ...this._def.shape(),
	                ...augmentation,
	            }),
	        });
	    }
	    /**
	     * Prior to zod@1.0.12 there was a bug in the
	     * inferred type of merged objects. Please
	     * upgrade if you are experiencing issues.
	     */
	    merge(merging) {
	        const merged = new ZodObject({
	            unknownKeys: merging._def.unknownKeys,
	            catchall: merging._def.catchall,
	            shape: () => ({
	                ...this._def.shape(),
	                ...merging._def.shape(),
	            }),
	            typeName: ZodFirstPartyTypeKind.ZodObject,
	        });
	        return merged;
	    }
	    // merge<
	    //   Incoming extends AnyZodObject,
	    //   Augmentation extends Incoming["shape"],
	    //   NewOutput extends {
	    //     [k in keyof Augmentation | keyof Output]: k extends keyof Augmentation
	    //       ? Augmentation[k]["_output"]
	    //       : k extends keyof Output
	    //       ? Output[k]
	    //       : never;
	    //   },
	    //   NewInput extends {
	    //     [k in keyof Augmentation | keyof Input]: k extends keyof Augmentation
	    //       ? Augmentation[k]["_input"]
	    //       : k extends keyof Input
	    //       ? Input[k]
	    //       : never;
	    //   }
	    // >(
	    //   merging: Incoming
	    // ): ZodObject<
	    //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
	    //   Incoming["_def"]["unknownKeys"],
	    //   Incoming["_def"]["catchall"],
	    //   NewOutput,
	    //   NewInput
	    // > {
	    //   const merged: any = new ZodObject({
	    //     unknownKeys: merging._def.unknownKeys,
	    //     catchall: merging._def.catchall,
	    //     shape: () =>
	    //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
	    //     typeName: ZodFirstPartyTypeKind.ZodObject,
	    //   }) as any;
	    //   return merged;
	    // }
	    setKey(key, schema) {
	        return this.augment({ [key]: schema });
	    }
	    // merge<Incoming extends AnyZodObject>(
	    //   merging: Incoming
	    // ): //ZodObject<T & Incoming["_shape"], UnknownKeys, Catchall> = (merging) => {
	    // ZodObject<
	    //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
	    //   Incoming["_def"]["unknownKeys"],
	    //   Incoming["_def"]["catchall"]
	    // > {
	    //   // const mergedShape = objectUtil.mergeShapes(
	    //   //   this._def.shape(),
	    //   //   merging._def.shape()
	    //   // );
	    //   const merged: any = new ZodObject({
	    //     unknownKeys: merging._def.unknownKeys,
	    //     catchall: merging._def.catchall,
	    //     shape: () =>
	    //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
	    //     typeName: ZodFirstPartyTypeKind.ZodObject,
	    //   }) as any;
	    //   return merged;
	    // }
	    catchall(index) {
	        return new ZodObject({
	            ...this._def,
	            catchall: index,
	        });
	    }
	    pick(mask) {
	        const shape = {};
	        for (const key of util_js_1.util.objectKeys(mask)) {
	            if (mask[key] && this.shape[key]) {
	                shape[key] = this.shape[key];
	            }
	        }
	        return new ZodObject({
	            ...this._def,
	            shape: () => shape,
	        });
	    }
	    omit(mask) {
	        const shape = {};
	        for (const key of util_js_1.util.objectKeys(this.shape)) {
	            if (!mask[key]) {
	                shape[key] = this.shape[key];
	            }
	        }
	        return new ZodObject({
	            ...this._def,
	            shape: () => shape,
	        });
	    }
	    /**
	     * @deprecated
	     */
	    deepPartial() {
	        return deepPartialify(this);
	    }
	    partial(mask) {
	        const newShape = {};
	        for (const key of util_js_1.util.objectKeys(this.shape)) {
	            const fieldSchema = this.shape[key];
	            if (mask && !mask[key]) {
	                newShape[key] = fieldSchema;
	            }
	            else {
	                newShape[key] = fieldSchema.optional();
	            }
	        }
	        return new ZodObject({
	            ...this._def,
	            shape: () => newShape,
	        });
	    }
	    required(mask) {
	        const newShape = {};
	        for (const key of util_js_1.util.objectKeys(this.shape)) {
	            if (mask && !mask[key]) {
	                newShape[key] = this.shape[key];
	            }
	            else {
	                const fieldSchema = this.shape[key];
	                let newField = fieldSchema;
	                while (newField instanceof ZodOptional) {
	                    newField = newField._def.innerType;
	                }
	                newShape[key] = newField;
	            }
	        }
	        return new ZodObject({
	            ...this._def,
	            shape: () => newShape,
	        });
	    }
	    keyof() {
	        return createZodEnum(util_js_1.util.objectKeys(this.shape));
	    }
	}
	types$1.ZodObject = ZodObject;
	ZodObject.create = (shape, params) => {
	    return new ZodObject({
	        shape: () => shape,
	        unknownKeys: "strip",
	        catchall: ZodNever.create(),
	        typeName: ZodFirstPartyTypeKind.ZodObject,
	        ...processCreateParams(params),
	    });
	};
	ZodObject.strictCreate = (shape, params) => {
	    return new ZodObject({
	        shape: () => shape,
	        unknownKeys: "strict",
	        catchall: ZodNever.create(),
	        typeName: ZodFirstPartyTypeKind.ZodObject,
	        ...processCreateParams(params),
	    });
	};
	ZodObject.lazycreate = (shape, params) => {
	    return new ZodObject({
	        shape,
	        unknownKeys: "strip",
	        catchall: ZodNever.create(),
	        typeName: ZodFirstPartyTypeKind.ZodObject,
	        ...processCreateParams(params),
	    });
	};
	class ZodUnion extends ZodType {
	    _parse(input) {
	        const { ctx } = this._processInputParams(input);
	        const options = this._def.options;
	        function handleResults(results) {
	            // return first issue-free validation if it exists
	            for (const result of results) {
	                if (result.result.status === "valid") {
	                    return result.result;
	                }
	            }
	            for (const result of results) {
	                if (result.result.status === "dirty") {
	                    // add issues from dirty option
	                    ctx.common.issues.push(...result.ctx.common.issues);
	                    return result.result;
	                }
	            }
	            // return invalid
	            const unionErrors = results.map((result) => new ZodError_js_1.ZodError(result.ctx.common.issues));
	            (0, parseUtil_js_1.addIssueToContext)(ctx, {
	                code: ZodError_js_1.ZodIssueCode.invalid_union,
	                unionErrors,
	            });
	            return parseUtil_js_1.INVALID;
	        }
	        if (ctx.common.async) {
	            return Promise.all(options.map(async (option) => {
	                const childCtx = {
	                    ...ctx,
	                    common: {
	                        ...ctx.common,
	                        issues: [],
	                    },
	                    parent: null,
	                };
	                return {
	                    result: await option._parseAsync({
	                        data: ctx.data,
	                        path: ctx.path,
	                        parent: childCtx,
	                    }),
	                    ctx: childCtx,
	                };
	            })).then(handleResults);
	        }
	        else {
	            let dirty = undefined;
	            const issues = [];
	            for (const option of options) {
	                const childCtx = {
	                    ...ctx,
	                    common: {
	                        ...ctx.common,
	                        issues: [],
	                    },
	                    parent: null,
	                };
	                const result = option._parseSync({
	                    data: ctx.data,
	                    path: ctx.path,
	                    parent: childCtx,
	                });
	                if (result.status === "valid") {
	                    return result;
	                }
	                else if (result.status === "dirty" && !dirty) {
	                    dirty = { result, ctx: childCtx };
	                }
	                if (childCtx.common.issues.length) {
	                    issues.push(childCtx.common.issues);
	                }
	            }
	            if (dirty) {
	                ctx.common.issues.push(...dirty.ctx.common.issues);
	                return dirty.result;
	            }
	            const unionErrors = issues.map((issues) => new ZodError_js_1.ZodError(issues));
	            (0, parseUtil_js_1.addIssueToContext)(ctx, {
	                code: ZodError_js_1.ZodIssueCode.invalid_union,
	                unionErrors,
	            });
	            return parseUtil_js_1.INVALID;
	        }
	    }
	    get options() {
	        return this._def.options;
	    }
	}
	types$1.ZodUnion = ZodUnion;
	ZodUnion.create = (types, params) => {
	    return new ZodUnion({
	        options: types,
	        typeName: ZodFirstPartyTypeKind.ZodUnion,
	        ...processCreateParams(params),
	    });
	};
	/////////////////////////////////////////////////////
	/////////////////////////////////////////////////////
	//////////                                 //////////
	//////////      ZodDiscriminatedUnion      //////////
	//////////                                 //////////
	/////////////////////////////////////////////////////
	/////////////////////////////////////////////////////
	const getDiscriminator = (type) => {
	    if (type instanceof ZodLazy) {
	        return getDiscriminator(type.schema);
	    }
	    else if (type instanceof ZodEffects) {
	        return getDiscriminator(type.innerType());
	    }
	    else if (type instanceof ZodLiteral) {
	        return [type.value];
	    }
	    else if (type instanceof ZodEnum) {
	        return type.options;
	    }
	    else if (type instanceof ZodNativeEnum) {
	        // eslint-disable-next-line ban/ban
	        return util_js_1.util.objectValues(type.enum);
	    }
	    else if (type instanceof ZodDefault) {
	        return getDiscriminator(type._def.innerType);
	    }
	    else if (type instanceof ZodUndefined) {
	        return [undefined];
	    }
	    else if (type instanceof ZodNull) {
	        return [null];
	    }
	    else if (type instanceof ZodOptional) {
	        return [undefined, ...getDiscriminator(type.unwrap())];
	    }
	    else if (type instanceof ZodNullable) {
	        return [null, ...getDiscriminator(type.unwrap())];
	    }
	    else if (type instanceof ZodBranded) {
	        return getDiscriminator(type.unwrap());
	    }
	    else if (type instanceof ZodReadonly) {
	        return getDiscriminator(type.unwrap());
	    }
	    else if (type instanceof ZodCatch) {
	        return getDiscriminator(type._def.innerType);
	    }
	    else {
	        return [];
	    }
	};
	class ZodDiscriminatedUnion extends ZodType {
	    _parse(input) {
	        const { ctx } = this._processInputParams(input);
	        if (ctx.parsedType !== util_js_1.ZodParsedType.object) {
	            (0, parseUtil_js_1.addIssueToContext)(ctx, {
	                code: ZodError_js_1.ZodIssueCode.invalid_type,
	                expected: util_js_1.ZodParsedType.object,
	                received: ctx.parsedType,
	            });
	            return parseUtil_js_1.INVALID;
	        }
	        const discriminator = this.discriminator;
	        const discriminatorValue = ctx.data[discriminator];
	        const option = this.optionsMap.get(discriminatorValue);
	        if (!option) {
	            (0, parseUtil_js_1.addIssueToContext)(ctx, {
	                code: ZodError_js_1.ZodIssueCode.invalid_union_discriminator,
	                options: Array.from(this.optionsMap.keys()),
	                path: [discriminator],
	            });
	            return parseUtil_js_1.INVALID;
	        }
	        if (ctx.common.async) {
	            return option._parseAsync({
	                data: ctx.data,
	                path: ctx.path,
	                parent: ctx,
	            });
	        }
	        else {
	            return option._parseSync({
	                data: ctx.data,
	                path: ctx.path,
	                parent: ctx,
	            });
	        }
	    }
	    get discriminator() {
	        return this._def.discriminator;
	    }
	    get options() {
	        return this._def.options;
	    }
	    get optionsMap() {
	        return this._def.optionsMap;
	    }
	    /**
	     * The constructor of the discriminated union schema. Its behaviour is very similar to that of the normal z.union() constructor.
	     * However, it only allows a union of objects, all of which need to share a discriminator property. This property must
	     * have a different value for each object in the union.
	     * @param discriminator the name of the discriminator property
	     * @param types an array of object schemas
	     * @param params
	     */
	    static create(discriminator, options, params) {
	        // Get all the valid discriminator values
	        const optionsMap = new Map();
	        // try {
	        for (const type of options) {
	            const discriminatorValues = getDiscriminator(type.shape[discriminator]);
	            if (!discriminatorValues.length) {
	                throw new Error(`A discriminator value for key \`${discriminator}\` could not be extracted from all schema options`);
	            }
	            for (const value of discriminatorValues) {
	                if (optionsMap.has(value)) {
	                    throw new Error(`Discriminator property ${String(discriminator)} has duplicate value ${String(value)}`);
	                }
	                optionsMap.set(value, type);
	            }
	        }
	        return new ZodDiscriminatedUnion({
	            typeName: ZodFirstPartyTypeKind.ZodDiscriminatedUnion,
	            discriminator,
	            options,
	            optionsMap,
	            ...processCreateParams(params),
	        });
	    }
	}
	types$1.ZodDiscriminatedUnion = ZodDiscriminatedUnion;
	function mergeValues(a, b) {
	    const aType = (0, util_js_1.getParsedType)(a);
	    const bType = (0, util_js_1.getParsedType)(b);
	    if (a === b) {
	        return { valid: true, data: a };
	    }
	    else if (aType === util_js_1.ZodParsedType.object && bType === util_js_1.ZodParsedType.object) {
	        const bKeys = util_js_1.util.objectKeys(b);
	        const sharedKeys = util_js_1.util.objectKeys(a).filter((key) => bKeys.indexOf(key) !== -1);
	        const newObj = { ...a, ...b };
	        for (const key of sharedKeys) {
	            const sharedValue = mergeValues(a[key], b[key]);
	            if (!sharedValue.valid) {
	                return { valid: false };
	            }
	            newObj[key] = sharedValue.data;
	        }
	        return { valid: true, data: newObj };
	    }
	    else if (aType === util_js_1.ZodParsedType.array && bType === util_js_1.ZodParsedType.array) {
	        if (a.length !== b.length) {
	            return { valid: false };
	        }
	        const newArray = [];
	        for (let index = 0; index < a.length; index++) {
	            const itemA = a[index];
	            const itemB = b[index];
	            const sharedValue = mergeValues(itemA, itemB);
	            if (!sharedValue.valid) {
	                return { valid: false };
	            }
	            newArray.push(sharedValue.data);
	        }
	        return { valid: true, data: newArray };
	    }
	    else if (aType === util_js_1.ZodParsedType.date && bType === util_js_1.ZodParsedType.date && +a === +b) {
	        return { valid: true, data: a };
	    }
	    else {
	        return { valid: false };
	    }
	}
	class ZodIntersection extends ZodType {
	    _parse(input) {
	        const { status, ctx } = this._processInputParams(input);
	        const handleParsed = (parsedLeft, parsedRight) => {
	            if ((0, parseUtil_js_1.isAborted)(parsedLeft) || (0, parseUtil_js_1.isAborted)(parsedRight)) {
	                return parseUtil_js_1.INVALID;
	            }
	            const merged = mergeValues(parsedLeft.value, parsedRight.value);
	            if (!merged.valid) {
	                (0, parseUtil_js_1.addIssueToContext)(ctx, {
	                    code: ZodError_js_1.ZodIssueCode.invalid_intersection_types,
	                });
	                return parseUtil_js_1.INVALID;
	            }
	            if ((0, parseUtil_js_1.isDirty)(parsedLeft) || (0, parseUtil_js_1.isDirty)(parsedRight)) {
	                status.dirty();
	            }
	            return { status: status.value, value: merged.data };
	        };
	        if (ctx.common.async) {
	            return Promise.all([
	                this._def.left._parseAsync({
	                    data: ctx.data,
	                    path: ctx.path,
	                    parent: ctx,
	                }),
	                this._def.right._parseAsync({
	                    data: ctx.data,
	                    path: ctx.path,
	                    parent: ctx,
	                }),
	            ]).then(([left, right]) => handleParsed(left, right));
	        }
	        else {
	            return handleParsed(this._def.left._parseSync({
	                data: ctx.data,
	                path: ctx.path,
	                parent: ctx,
	            }), this._def.right._parseSync({
	                data: ctx.data,
	                path: ctx.path,
	                parent: ctx,
	            }));
	        }
	    }
	}
	types$1.ZodIntersection = ZodIntersection;
	ZodIntersection.create = (left, right, params) => {
	    return new ZodIntersection({
	        left: left,
	        right: right,
	        typeName: ZodFirstPartyTypeKind.ZodIntersection,
	        ...processCreateParams(params),
	    });
	};
	// type ZodTupleItems = [ZodTypeAny, ...ZodTypeAny[]];
	class ZodTuple extends ZodType {
	    _parse(input) {
	        const { status, ctx } = this._processInputParams(input);
	        if (ctx.parsedType !== util_js_1.ZodParsedType.array) {
	            (0, parseUtil_js_1.addIssueToContext)(ctx, {
	                code: ZodError_js_1.ZodIssueCode.invalid_type,
	                expected: util_js_1.ZodParsedType.array,
	                received: ctx.parsedType,
	            });
	            return parseUtil_js_1.INVALID;
	        }
	        if (ctx.data.length < this._def.items.length) {
	            (0, parseUtil_js_1.addIssueToContext)(ctx, {
	                code: ZodError_js_1.ZodIssueCode.too_small,
	                minimum: this._def.items.length,
	                inclusive: true,
	                exact: false,
	                type: "array",
	            });
	            return parseUtil_js_1.INVALID;
	        }
	        const rest = this._def.rest;
	        if (!rest && ctx.data.length > this._def.items.length) {
	            (0, parseUtil_js_1.addIssueToContext)(ctx, {
	                code: ZodError_js_1.ZodIssueCode.too_big,
	                maximum: this._def.items.length,
	                inclusive: true,
	                exact: false,
	                type: "array",
	            });
	            status.dirty();
	        }
	        const items = [...ctx.data]
	            .map((item, itemIndex) => {
	            const schema = this._def.items[itemIndex] || this._def.rest;
	            if (!schema)
	                return null;
	            return schema._parse(new ParseInputLazyPath(ctx, item, ctx.path, itemIndex));
	        })
	            .filter((x) => !!x); // filter nulls
	        if (ctx.common.async) {
	            return Promise.all(items).then((results) => {
	                return parseUtil_js_1.ParseStatus.mergeArray(status, results);
	            });
	        }
	        else {
	            return parseUtil_js_1.ParseStatus.mergeArray(status, items);
	        }
	    }
	    get items() {
	        return this._def.items;
	    }
	    rest(rest) {
	        return new ZodTuple({
	            ...this._def,
	            rest,
	        });
	    }
	}
	types$1.ZodTuple = ZodTuple;
	ZodTuple.create = (schemas, params) => {
	    if (!Array.isArray(schemas)) {
	        throw new Error("You must pass an array of schemas to z.tuple([ ... ])");
	    }
	    return new ZodTuple({
	        items: schemas,
	        typeName: ZodFirstPartyTypeKind.ZodTuple,
	        rest: null,
	        ...processCreateParams(params),
	    });
	};
	class ZodRecord extends ZodType {
	    get keySchema() {
	        return this._def.keyType;
	    }
	    get valueSchema() {
	        return this._def.valueType;
	    }
	    _parse(input) {
	        const { status, ctx } = this._processInputParams(input);
	        if (ctx.parsedType !== util_js_1.ZodParsedType.object) {
	            (0, parseUtil_js_1.addIssueToContext)(ctx, {
	                code: ZodError_js_1.ZodIssueCode.invalid_type,
	                expected: util_js_1.ZodParsedType.object,
	                received: ctx.parsedType,
	            });
	            return parseUtil_js_1.INVALID;
	        }
	        const pairs = [];
	        const keyType = this._def.keyType;
	        const valueType = this._def.valueType;
	        for (const key in ctx.data) {
	            pairs.push({
	                key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, key)),
	                value: valueType._parse(new ParseInputLazyPath(ctx, ctx.data[key], ctx.path, key)),
	                alwaysSet: key in ctx.data,
	            });
	        }
	        if (ctx.common.async) {
	            return parseUtil_js_1.ParseStatus.mergeObjectAsync(status, pairs);
	        }
	        else {
	            return parseUtil_js_1.ParseStatus.mergeObjectSync(status, pairs);
	        }
	    }
	    get element() {
	        return this._def.valueType;
	    }
	    static create(first, second, third) {
	        if (second instanceof ZodType) {
	            return new ZodRecord({
	                keyType: first,
	                valueType: second,
	                typeName: ZodFirstPartyTypeKind.ZodRecord,
	                ...processCreateParams(third),
	            });
	        }
	        return new ZodRecord({
	            keyType: ZodString.create(),
	            valueType: first,
	            typeName: ZodFirstPartyTypeKind.ZodRecord,
	            ...processCreateParams(second),
	        });
	    }
	}
	types$1.ZodRecord = ZodRecord;
	class ZodMap extends ZodType {
	    get keySchema() {
	        return this._def.keyType;
	    }
	    get valueSchema() {
	        return this._def.valueType;
	    }
	    _parse(input) {
	        const { status, ctx } = this._processInputParams(input);
	        if (ctx.parsedType !== util_js_1.ZodParsedType.map) {
	            (0, parseUtil_js_1.addIssueToContext)(ctx, {
	                code: ZodError_js_1.ZodIssueCode.invalid_type,
	                expected: util_js_1.ZodParsedType.map,
	                received: ctx.parsedType,
	            });
	            return parseUtil_js_1.INVALID;
	        }
	        const keyType = this._def.keyType;
	        const valueType = this._def.valueType;
	        const pairs = [...ctx.data.entries()].map(([key, value], index) => {
	            return {
	                key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, [index, "key"])),
	                value: valueType._parse(new ParseInputLazyPath(ctx, value, ctx.path, [index, "value"])),
	            };
	        });
	        if (ctx.common.async) {
	            const finalMap = new Map();
	            return Promise.resolve().then(async () => {
	                for (const pair of pairs) {
	                    const key = await pair.key;
	                    const value = await pair.value;
	                    if (key.status === "aborted" || value.status === "aborted") {
	                        return parseUtil_js_1.INVALID;
	                    }
	                    if (key.status === "dirty" || value.status === "dirty") {
	                        status.dirty();
	                    }
	                    finalMap.set(key.value, value.value);
	                }
	                return { status: status.value, value: finalMap };
	            });
	        }
	        else {
	            const finalMap = new Map();
	            for (const pair of pairs) {
	                const key = pair.key;
	                const value = pair.value;
	                if (key.status === "aborted" || value.status === "aborted") {
	                    return parseUtil_js_1.INVALID;
	                }
	                if (key.status === "dirty" || value.status === "dirty") {
	                    status.dirty();
	                }
	                finalMap.set(key.value, value.value);
	            }
	            return { status: status.value, value: finalMap };
	        }
	    }
	}
	types$1.ZodMap = ZodMap;
	ZodMap.create = (keyType, valueType, params) => {
	    return new ZodMap({
	        valueType,
	        keyType,
	        typeName: ZodFirstPartyTypeKind.ZodMap,
	        ...processCreateParams(params),
	    });
	};
	class ZodSet extends ZodType {
	    _parse(input) {
	        const { status, ctx } = this._processInputParams(input);
	        if (ctx.parsedType !== util_js_1.ZodParsedType.set) {
	            (0, parseUtil_js_1.addIssueToContext)(ctx, {
	                code: ZodError_js_1.ZodIssueCode.invalid_type,
	                expected: util_js_1.ZodParsedType.set,
	                received: ctx.parsedType,
	            });
	            return parseUtil_js_1.INVALID;
	        }
	        const def = this._def;
	        if (def.minSize !== null) {
	            if (ctx.data.size < def.minSize.value) {
	                (0, parseUtil_js_1.addIssueToContext)(ctx, {
	                    code: ZodError_js_1.ZodIssueCode.too_small,
	                    minimum: def.minSize.value,
	                    type: "set",
	                    inclusive: true,
	                    exact: false,
	                    message: def.minSize.message,
	                });
	                status.dirty();
	            }
	        }
	        if (def.maxSize !== null) {
	            if (ctx.data.size > def.maxSize.value) {
	                (0, parseUtil_js_1.addIssueToContext)(ctx, {
	                    code: ZodError_js_1.ZodIssueCode.too_big,
	                    maximum: def.maxSize.value,
	                    type: "set",
	                    inclusive: true,
	                    exact: false,
	                    message: def.maxSize.message,
	                });
	                status.dirty();
	            }
	        }
	        const valueType = this._def.valueType;
	        function finalizeSet(elements) {
	            const parsedSet = new Set();
	            for (const element of elements) {
	                if (element.status === "aborted")
	                    return parseUtil_js_1.INVALID;
	                if (element.status === "dirty")
	                    status.dirty();
	                parsedSet.add(element.value);
	            }
	            return { status: status.value, value: parsedSet };
	        }
	        const elements = [...ctx.data.values()].map((item, i) => valueType._parse(new ParseInputLazyPath(ctx, item, ctx.path, i)));
	        if (ctx.common.async) {
	            return Promise.all(elements).then((elements) => finalizeSet(elements));
	        }
	        else {
	            return finalizeSet(elements);
	        }
	    }
	    min(minSize, message) {
	        return new ZodSet({
	            ...this._def,
	            minSize: { value: minSize, message: errorUtil_js_1.errorUtil.toString(message) },
	        });
	    }
	    max(maxSize, message) {
	        return new ZodSet({
	            ...this._def,
	            maxSize: { value: maxSize, message: errorUtil_js_1.errorUtil.toString(message) },
	        });
	    }
	    size(size, message) {
	        return this.min(size, message).max(size, message);
	    }
	    nonempty(message) {
	        return this.min(1, message);
	    }
	}
	types$1.ZodSet = ZodSet;
	ZodSet.create = (valueType, params) => {
	    return new ZodSet({
	        valueType,
	        minSize: null,
	        maxSize: null,
	        typeName: ZodFirstPartyTypeKind.ZodSet,
	        ...processCreateParams(params),
	    });
	};
	class ZodFunction extends ZodType {
	    constructor() {
	        super(...arguments);
	        this.validate = this.implement;
	    }
	    _parse(input) {
	        const { ctx } = this._processInputParams(input);
	        if (ctx.parsedType !== util_js_1.ZodParsedType.function) {
	            (0, parseUtil_js_1.addIssueToContext)(ctx, {
	                code: ZodError_js_1.ZodIssueCode.invalid_type,
	                expected: util_js_1.ZodParsedType.function,
	                received: ctx.parsedType,
	            });
	            return parseUtil_js_1.INVALID;
	        }
	        function makeArgsIssue(args, error) {
	            return (0, parseUtil_js_1.makeIssue)({
	                data: args,
	                path: ctx.path,
	                errorMaps: [ctx.common.contextualErrorMap, ctx.schemaErrorMap, (0, errors_js_1.getErrorMap)(), errors_js_1.defaultErrorMap].filter((x) => !!x),
	                issueData: {
	                    code: ZodError_js_1.ZodIssueCode.invalid_arguments,
	                    argumentsError: error,
	                },
	            });
	        }
	        function makeReturnsIssue(returns, error) {
	            return (0, parseUtil_js_1.makeIssue)({
	                data: returns,
	                path: ctx.path,
	                errorMaps: [ctx.common.contextualErrorMap, ctx.schemaErrorMap, (0, errors_js_1.getErrorMap)(), errors_js_1.defaultErrorMap].filter((x) => !!x),
	                issueData: {
	                    code: ZodError_js_1.ZodIssueCode.invalid_return_type,
	                    returnTypeError: error,
	                },
	            });
	        }
	        const params = { errorMap: ctx.common.contextualErrorMap };
	        const fn = ctx.data;
	        if (this._def.returns instanceof ZodPromise) {
	            // Would love a way to avoid disabling this rule, but we need
	            // an alias (using an arrow function was what caused 2651).
	            // eslint-disable-next-line @typescript-eslint/no-this-alias
	            const me = this;
	            return (0, parseUtil_js_1.OK)(async function (...args) {
	                const error = new ZodError_js_1.ZodError([]);
	                const parsedArgs = await me._def.args.parseAsync(args, params).catch((e) => {
	                    error.addIssue(makeArgsIssue(args, e));
	                    throw error;
	                });
	                const result = await Reflect.apply(fn, this, parsedArgs);
	                const parsedReturns = await me._def.returns._def.type
	                    .parseAsync(result, params)
	                    .catch((e) => {
	                    error.addIssue(makeReturnsIssue(result, e));
	                    throw error;
	                });
	                return parsedReturns;
	            });
	        }
	        else {
	            // Would love a way to avoid disabling this rule, but we need
	            // an alias (using an arrow function was what caused 2651).
	            // eslint-disable-next-line @typescript-eslint/no-this-alias
	            const me = this;
	            return (0, parseUtil_js_1.OK)(function (...args) {
	                const parsedArgs = me._def.args.safeParse(args, params);
	                if (!parsedArgs.success) {
	                    throw new ZodError_js_1.ZodError([makeArgsIssue(args, parsedArgs.error)]);
	                }
	                const result = Reflect.apply(fn, this, parsedArgs.data);
	                const parsedReturns = me._def.returns.safeParse(result, params);
	                if (!parsedReturns.success) {
	                    throw new ZodError_js_1.ZodError([makeReturnsIssue(result, parsedReturns.error)]);
	                }
	                return parsedReturns.data;
	            });
	        }
	    }
	    parameters() {
	        return this._def.args;
	    }
	    returnType() {
	        return this._def.returns;
	    }
	    args(...items) {
	        return new ZodFunction({
	            ...this._def,
	            args: ZodTuple.create(items).rest(ZodUnknown.create()),
	        });
	    }
	    returns(returnType) {
	        return new ZodFunction({
	            ...this._def,
	            returns: returnType,
	        });
	    }
	    implement(func) {
	        const validatedFunc = this.parse(func);
	        return validatedFunc;
	    }
	    strictImplement(func) {
	        const validatedFunc = this.parse(func);
	        return validatedFunc;
	    }
	    static create(args, returns, params) {
	        return new ZodFunction({
	            args: (args ? args : ZodTuple.create([]).rest(ZodUnknown.create())),
	            returns: returns || ZodUnknown.create(),
	            typeName: ZodFirstPartyTypeKind.ZodFunction,
	            ...processCreateParams(params),
	        });
	    }
	}
	types$1.ZodFunction = ZodFunction;
	class ZodLazy extends ZodType {
	    get schema() {
	        return this._def.getter();
	    }
	    _parse(input) {
	        const { ctx } = this._processInputParams(input);
	        const lazySchema = this._def.getter();
	        return lazySchema._parse({ data: ctx.data, path: ctx.path, parent: ctx });
	    }
	}
	types$1.ZodLazy = ZodLazy;
	ZodLazy.create = (getter, params) => {
	    return new ZodLazy({
	        getter: getter,
	        typeName: ZodFirstPartyTypeKind.ZodLazy,
	        ...processCreateParams(params),
	    });
	};
	class ZodLiteral extends ZodType {
	    _parse(input) {
	        if (input.data !== this._def.value) {
	            const ctx = this._getOrReturnCtx(input);
	            (0, parseUtil_js_1.addIssueToContext)(ctx, {
	                received: ctx.data,
	                code: ZodError_js_1.ZodIssueCode.invalid_literal,
	                expected: this._def.value,
	            });
	            return parseUtil_js_1.INVALID;
	        }
	        return { status: "valid", value: input.data };
	    }
	    get value() {
	        return this._def.value;
	    }
	}
	types$1.ZodLiteral = ZodLiteral;
	ZodLiteral.create = (value, params) => {
	    return new ZodLiteral({
	        value: value,
	        typeName: ZodFirstPartyTypeKind.ZodLiteral,
	        ...processCreateParams(params),
	    });
	};
	function createZodEnum(values, params) {
	    return new ZodEnum({
	        values,
	        typeName: ZodFirstPartyTypeKind.ZodEnum,
	        ...processCreateParams(params),
	    });
	}
	class ZodEnum extends ZodType {
	    _parse(input) {
	        if (typeof input.data !== "string") {
	            const ctx = this._getOrReturnCtx(input);
	            const expectedValues = this._def.values;
	            (0, parseUtil_js_1.addIssueToContext)(ctx, {
	                expected: util_js_1.util.joinValues(expectedValues),
	                received: ctx.parsedType,
	                code: ZodError_js_1.ZodIssueCode.invalid_type,
	            });
	            return parseUtil_js_1.INVALID;
	        }
	        if (!this._cache) {
	            this._cache = new Set(this._def.values);
	        }
	        if (!this._cache.has(input.data)) {
	            const ctx = this._getOrReturnCtx(input);
	            const expectedValues = this._def.values;
	            (0, parseUtil_js_1.addIssueToContext)(ctx, {
	                received: ctx.data,
	                code: ZodError_js_1.ZodIssueCode.invalid_enum_value,
	                options: expectedValues,
	            });
	            return parseUtil_js_1.INVALID;
	        }
	        return (0, parseUtil_js_1.OK)(input.data);
	    }
	    get options() {
	        return this._def.values;
	    }
	    get enum() {
	        const enumValues = {};
	        for (const val of this._def.values) {
	            enumValues[val] = val;
	        }
	        return enumValues;
	    }
	    get Values() {
	        const enumValues = {};
	        for (const val of this._def.values) {
	            enumValues[val] = val;
	        }
	        return enumValues;
	    }
	    get Enum() {
	        const enumValues = {};
	        for (const val of this._def.values) {
	            enumValues[val] = val;
	        }
	        return enumValues;
	    }
	    extract(values, newDef = this._def) {
	        return ZodEnum.create(values, {
	            ...this._def,
	            ...newDef,
	        });
	    }
	    exclude(values, newDef = this._def) {
	        return ZodEnum.create(this.options.filter((opt) => !values.includes(opt)), {
	            ...this._def,
	            ...newDef,
	        });
	    }
	}
	types$1.ZodEnum = ZodEnum;
	ZodEnum.create = createZodEnum;
	class ZodNativeEnum extends ZodType {
	    _parse(input) {
	        const nativeEnumValues = util_js_1.util.getValidEnumValues(this._def.values);
	        const ctx = this._getOrReturnCtx(input);
	        if (ctx.parsedType !== util_js_1.ZodParsedType.string && ctx.parsedType !== util_js_1.ZodParsedType.number) {
	            const expectedValues = util_js_1.util.objectValues(nativeEnumValues);
	            (0, parseUtil_js_1.addIssueToContext)(ctx, {
	                expected: util_js_1.util.joinValues(expectedValues),
	                received: ctx.parsedType,
	                code: ZodError_js_1.ZodIssueCode.invalid_type,
	            });
	            return parseUtil_js_1.INVALID;
	        }
	        if (!this._cache) {
	            this._cache = new Set(util_js_1.util.getValidEnumValues(this._def.values));
	        }
	        if (!this._cache.has(input.data)) {
	            const expectedValues = util_js_1.util.objectValues(nativeEnumValues);
	            (0, parseUtil_js_1.addIssueToContext)(ctx, {
	                received: ctx.data,
	                code: ZodError_js_1.ZodIssueCode.invalid_enum_value,
	                options: expectedValues,
	            });
	            return parseUtil_js_1.INVALID;
	        }
	        return (0, parseUtil_js_1.OK)(input.data);
	    }
	    get enum() {
	        return this._def.values;
	    }
	}
	types$1.ZodNativeEnum = ZodNativeEnum;
	ZodNativeEnum.create = (values, params) => {
	    return new ZodNativeEnum({
	        values: values,
	        typeName: ZodFirstPartyTypeKind.ZodNativeEnum,
	        ...processCreateParams(params),
	    });
	};
	class ZodPromise extends ZodType {
	    unwrap() {
	        return this._def.type;
	    }
	    _parse(input) {
	        const { ctx } = this._processInputParams(input);
	        if (ctx.parsedType !== util_js_1.ZodParsedType.promise && ctx.common.async === false) {
	            (0, parseUtil_js_1.addIssueToContext)(ctx, {
	                code: ZodError_js_1.ZodIssueCode.invalid_type,
	                expected: util_js_1.ZodParsedType.promise,
	                received: ctx.parsedType,
	            });
	            return parseUtil_js_1.INVALID;
	        }
	        const promisified = ctx.parsedType === util_js_1.ZodParsedType.promise ? ctx.data : Promise.resolve(ctx.data);
	        return (0, parseUtil_js_1.OK)(promisified.then((data) => {
	            return this._def.type.parseAsync(data, {
	                path: ctx.path,
	                errorMap: ctx.common.contextualErrorMap,
	            });
	        }));
	    }
	}
	types$1.ZodPromise = ZodPromise;
	ZodPromise.create = (schema, params) => {
	    return new ZodPromise({
	        type: schema,
	        typeName: ZodFirstPartyTypeKind.ZodPromise,
	        ...processCreateParams(params),
	    });
	};
	class ZodEffects extends ZodType {
	    innerType() {
	        return this._def.schema;
	    }
	    sourceType() {
	        return this._def.schema._def.typeName === ZodFirstPartyTypeKind.ZodEffects
	            ? this._def.schema.sourceType()
	            : this._def.schema;
	    }
	    _parse(input) {
	        const { status, ctx } = this._processInputParams(input);
	        const effect = this._def.effect || null;
	        const checkCtx = {
	            addIssue: (arg) => {
	                (0, parseUtil_js_1.addIssueToContext)(ctx, arg);
	                if (arg.fatal) {
	                    status.abort();
	                }
	                else {
	                    status.dirty();
	                }
	            },
	            get path() {
	                return ctx.path;
	            },
	        };
	        checkCtx.addIssue = checkCtx.addIssue.bind(checkCtx);
	        if (effect.type === "preprocess") {
	            const processed = effect.transform(ctx.data, checkCtx);
	            if (ctx.common.async) {
	                return Promise.resolve(processed).then(async (processed) => {
	                    if (status.value === "aborted")
	                        return parseUtil_js_1.INVALID;
	                    const result = await this._def.schema._parseAsync({
	                        data: processed,
	                        path: ctx.path,
	                        parent: ctx,
	                    });
	                    if (result.status === "aborted")
	                        return parseUtil_js_1.INVALID;
	                    if (result.status === "dirty")
	                        return (0, parseUtil_js_1.DIRTY)(result.value);
	                    if (status.value === "dirty")
	                        return (0, parseUtil_js_1.DIRTY)(result.value);
	                    return result;
	                });
	            }
	            else {
	                if (status.value === "aborted")
	                    return parseUtil_js_1.INVALID;
	                const result = this._def.schema._parseSync({
	                    data: processed,
	                    path: ctx.path,
	                    parent: ctx,
	                });
	                if (result.status === "aborted")
	                    return parseUtil_js_1.INVALID;
	                if (result.status === "dirty")
	                    return (0, parseUtil_js_1.DIRTY)(result.value);
	                if (status.value === "dirty")
	                    return (0, parseUtil_js_1.DIRTY)(result.value);
	                return result;
	            }
	        }
	        if (effect.type === "refinement") {
	            const executeRefinement = (acc) => {
	                const result = effect.refinement(acc, checkCtx);
	                if (ctx.common.async) {
	                    return Promise.resolve(result);
	                }
	                if (result instanceof Promise) {
	                    throw new Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");
	                }
	                return acc;
	            };
	            if (ctx.common.async === false) {
	                const inner = this._def.schema._parseSync({
	                    data: ctx.data,
	                    path: ctx.path,
	                    parent: ctx,
	                });
	                if (inner.status === "aborted")
	                    return parseUtil_js_1.INVALID;
	                if (inner.status === "dirty")
	                    status.dirty();
	                // return value is ignored
	                executeRefinement(inner.value);
	                return { status: status.value, value: inner.value };
	            }
	            else {
	                return this._def.schema._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx }).then((inner) => {
	                    if (inner.status === "aborted")
	                        return parseUtil_js_1.INVALID;
	                    if (inner.status === "dirty")
	                        status.dirty();
	                    return executeRefinement(inner.value).then(() => {
	                        return { status: status.value, value: inner.value };
	                    });
	                });
	            }
	        }
	        if (effect.type === "transform") {
	            if (ctx.common.async === false) {
	                const base = this._def.schema._parseSync({
	                    data: ctx.data,
	                    path: ctx.path,
	                    parent: ctx,
	                });
	                if (!(0, parseUtil_js_1.isValid)(base))
	                    return parseUtil_js_1.INVALID;
	                const result = effect.transform(base.value, checkCtx);
	                if (result instanceof Promise) {
	                    throw new Error(`Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.`);
	                }
	                return { status: status.value, value: result };
	            }
	            else {
	                return this._def.schema._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx }).then((base) => {
	                    if (!(0, parseUtil_js_1.isValid)(base))
	                        return parseUtil_js_1.INVALID;
	                    return Promise.resolve(effect.transform(base.value, checkCtx)).then((result) => ({
	                        status: status.value,
	                        value: result,
	                    }));
	                });
	            }
	        }
	        util_js_1.util.assertNever(effect);
	    }
	}
	types$1.ZodEffects = ZodEffects;
	types$1.ZodTransformer = ZodEffects;
	ZodEffects.create = (schema, effect, params) => {
	    return new ZodEffects({
	        schema,
	        typeName: ZodFirstPartyTypeKind.ZodEffects,
	        effect,
	        ...processCreateParams(params),
	    });
	};
	ZodEffects.createWithPreprocess = (preprocess, schema, params) => {
	    return new ZodEffects({
	        schema,
	        effect: { type: "preprocess", transform: preprocess },
	        typeName: ZodFirstPartyTypeKind.ZodEffects,
	        ...processCreateParams(params),
	    });
	};
	class ZodOptional extends ZodType {
	    _parse(input) {
	        const parsedType = this._getType(input);
	        if (parsedType === util_js_1.ZodParsedType.undefined) {
	            return (0, parseUtil_js_1.OK)(undefined);
	        }
	        return this._def.innerType._parse(input);
	    }
	    unwrap() {
	        return this._def.innerType;
	    }
	}
	types$1.ZodOptional = ZodOptional;
	ZodOptional.create = (type, params) => {
	    return new ZodOptional({
	        innerType: type,
	        typeName: ZodFirstPartyTypeKind.ZodOptional,
	        ...processCreateParams(params),
	    });
	};
	class ZodNullable extends ZodType {
	    _parse(input) {
	        const parsedType = this._getType(input);
	        if (parsedType === util_js_1.ZodParsedType.null) {
	            return (0, parseUtil_js_1.OK)(null);
	        }
	        return this._def.innerType._parse(input);
	    }
	    unwrap() {
	        return this._def.innerType;
	    }
	}
	types$1.ZodNullable = ZodNullable;
	ZodNullable.create = (type, params) => {
	    return new ZodNullable({
	        innerType: type,
	        typeName: ZodFirstPartyTypeKind.ZodNullable,
	        ...processCreateParams(params),
	    });
	};
	class ZodDefault extends ZodType {
	    _parse(input) {
	        const { ctx } = this._processInputParams(input);
	        let data = ctx.data;
	        if (ctx.parsedType === util_js_1.ZodParsedType.undefined) {
	            data = this._def.defaultValue();
	        }
	        return this._def.innerType._parse({
	            data,
	            path: ctx.path,
	            parent: ctx,
	        });
	    }
	    removeDefault() {
	        return this._def.innerType;
	    }
	}
	types$1.ZodDefault = ZodDefault;
	ZodDefault.create = (type, params) => {
	    return new ZodDefault({
	        innerType: type,
	        typeName: ZodFirstPartyTypeKind.ZodDefault,
	        defaultValue: typeof params.default === "function" ? params.default : () => params.default,
	        ...processCreateParams(params),
	    });
	};
	class ZodCatch extends ZodType {
	    _parse(input) {
	        const { ctx } = this._processInputParams(input);
	        // newCtx is used to not collect issues from inner types in ctx
	        const newCtx = {
	            ...ctx,
	            common: {
	                ...ctx.common,
	                issues: [],
	            },
	        };
	        const result = this._def.innerType._parse({
	            data: newCtx.data,
	            path: newCtx.path,
	            parent: {
	                ...newCtx,
	            },
	        });
	        if ((0, parseUtil_js_1.isAsync)(result)) {
	            return result.then((result) => {
	                return {
	                    status: "valid",
	                    value: result.status === "valid"
	                        ? result.value
	                        : this._def.catchValue({
	                            get error() {
	                                return new ZodError_js_1.ZodError(newCtx.common.issues);
	                            },
	                            input: newCtx.data,
	                        }),
	                };
	            });
	        }
	        else {
	            return {
	                status: "valid",
	                value: result.status === "valid"
	                    ? result.value
	                    : this._def.catchValue({
	                        get error() {
	                            return new ZodError_js_1.ZodError(newCtx.common.issues);
	                        },
	                        input: newCtx.data,
	                    }),
	            };
	        }
	    }
	    removeCatch() {
	        return this._def.innerType;
	    }
	}
	types$1.ZodCatch = ZodCatch;
	ZodCatch.create = (type, params) => {
	    return new ZodCatch({
	        innerType: type,
	        typeName: ZodFirstPartyTypeKind.ZodCatch,
	        catchValue: typeof params.catch === "function" ? params.catch : () => params.catch,
	        ...processCreateParams(params),
	    });
	};
	class ZodNaN extends ZodType {
	    _parse(input) {
	        const parsedType = this._getType(input);
	        if (parsedType !== util_js_1.ZodParsedType.nan) {
	            const ctx = this._getOrReturnCtx(input);
	            (0, parseUtil_js_1.addIssueToContext)(ctx, {
	                code: ZodError_js_1.ZodIssueCode.invalid_type,
	                expected: util_js_1.ZodParsedType.nan,
	                received: ctx.parsedType,
	            });
	            return parseUtil_js_1.INVALID;
	        }
	        return { status: "valid", value: input.data };
	    }
	}
	types$1.ZodNaN = ZodNaN;
	ZodNaN.create = (params) => {
	    return new ZodNaN({
	        typeName: ZodFirstPartyTypeKind.ZodNaN,
	        ...processCreateParams(params),
	    });
	};
	types$1.BRAND = Symbol("zod_brand");
	class ZodBranded extends ZodType {
	    _parse(input) {
	        const { ctx } = this._processInputParams(input);
	        const data = ctx.data;
	        return this._def.type._parse({
	            data,
	            path: ctx.path,
	            parent: ctx,
	        });
	    }
	    unwrap() {
	        return this._def.type;
	    }
	}
	types$1.ZodBranded = ZodBranded;
	class ZodPipeline extends ZodType {
	    _parse(input) {
	        const { status, ctx } = this._processInputParams(input);
	        if (ctx.common.async) {
	            const handleAsync = async () => {
	                const inResult = await this._def.in._parseAsync({
	                    data: ctx.data,
	                    path: ctx.path,
	                    parent: ctx,
	                });
	                if (inResult.status === "aborted")
	                    return parseUtil_js_1.INVALID;
	                if (inResult.status === "dirty") {
	                    status.dirty();
	                    return (0, parseUtil_js_1.DIRTY)(inResult.value);
	                }
	                else {
	                    return this._def.out._parseAsync({
	                        data: inResult.value,
	                        path: ctx.path,
	                        parent: ctx,
	                    });
	                }
	            };
	            return handleAsync();
	        }
	        else {
	            const inResult = this._def.in._parseSync({
	                data: ctx.data,
	                path: ctx.path,
	                parent: ctx,
	            });
	            if (inResult.status === "aborted")
	                return parseUtil_js_1.INVALID;
	            if (inResult.status === "dirty") {
	                status.dirty();
	                return {
	                    status: "dirty",
	                    value: inResult.value,
	                };
	            }
	            else {
	                return this._def.out._parseSync({
	                    data: inResult.value,
	                    path: ctx.path,
	                    parent: ctx,
	                });
	            }
	        }
	    }
	    static create(a, b) {
	        return new ZodPipeline({
	            in: a,
	            out: b,
	            typeName: ZodFirstPartyTypeKind.ZodPipeline,
	        });
	    }
	}
	types$1.ZodPipeline = ZodPipeline;
	class ZodReadonly extends ZodType {
	    _parse(input) {
	        const result = this._def.innerType._parse(input);
	        const freeze = (data) => {
	            if ((0, parseUtil_js_1.isValid)(data)) {
	                data.value = Object.freeze(data.value);
	            }
	            return data;
	        };
	        return (0, parseUtil_js_1.isAsync)(result) ? result.then((data) => freeze(data)) : freeze(result);
	    }
	    unwrap() {
	        return this._def.innerType;
	    }
	}
	types$1.ZodReadonly = ZodReadonly;
	ZodReadonly.create = (type, params) => {
	    return new ZodReadonly({
	        innerType: type,
	        typeName: ZodFirstPartyTypeKind.ZodReadonly,
	        ...processCreateParams(params),
	    });
	};
	////////////////////////////////////////
	////////////////////////////////////////
	//////////                    //////////
	//////////      z.custom      //////////
	//////////                    //////////
	////////////////////////////////////////
	////////////////////////////////////////
	function cleanParams(params, data) {
	    const p = typeof params === "function" ? params(data) : typeof params === "string" ? { message: params } : params;
	    const p2 = typeof p === "string" ? { message: p } : p;
	    return p2;
	}
	function custom(check, _params = {}, 
	/**
	 * @deprecated
	 *
	 * Pass `fatal` into the params object instead:
	 *
	 * ```ts
	 * z.string().custom((val) => val.length > 5, { fatal: false })
	 * ```
	 *
	 */
	fatal) {
	    if (check)
	        return ZodAny.create().superRefine((data, ctx) => {
	            const r = check(data);
	            if (r instanceof Promise) {
	                return r.then((r) => {
	                    if (!r) {
	                        const params = cleanParams(_params, data);
	                        const _fatal = params.fatal ?? fatal ?? true;
	                        ctx.addIssue({ code: "custom", ...params, fatal: _fatal });
	                    }
	                });
	            }
	            if (!r) {
	                const params = cleanParams(_params, data);
	                const _fatal = params.fatal ?? fatal ?? true;
	                ctx.addIssue({ code: "custom", ...params, fatal: _fatal });
	            }
	            return;
	        });
	    return ZodAny.create();
	}
	types$1.late = {
	    object: ZodObject.lazycreate,
	};
	var ZodFirstPartyTypeKind;
	(function (ZodFirstPartyTypeKind) {
	    ZodFirstPartyTypeKind["ZodString"] = "ZodString";
	    ZodFirstPartyTypeKind["ZodNumber"] = "ZodNumber";
	    ZodFirstPartyTypeKind["ZodNaN"] = "ZodNaN";
	    ZodFirstPartyTypeKind["ZodBigInt"] = "ZodBigInt";
	    ZodFirstPartyTypeKind["ZodBoolean"] = "ZodBoolean";
	    ZodFirstPartyTypeKind["ZodDate"] = "ZodDate";
	    ZodFirstPartyTypeKind["ZodSymbol"] = "ZodSymbol";
	    ZodFirstPartyTypeKind["ZodUndefined"] = "ZodUndefined";
	    ZodFirstPartyTypeKind["ZodNull"] = "ZodNull";
	    ZodFirstPartyTypeKind["ZodAny"] = "ZodAny";
	    ZodFirstPartyTypeKind["ZodUnknown"] = "ZodUnknown";
	    ZodFirstPartyTypeKind["ZodNever"] = "ZodNever";
	    ZodFirstPartyTypeKind["ZodVoid"] = "ZodVoid";
	    ZodFirstPartyTypeKind["ZodArray"] = "ZodArray";
	    ZodFirstPartyTypeKind["ZodObject"] = "ZodObject";
	    ZodFirstPartyTypeKind["ZodUnion"] = "ZodUnion";
	    ZodFirstPartyTypeKind["ZodDiscriminatedUnion"] = "ZodDiscriminatedUnion";
	    ZodFirstPartyTypeKind["ZodIntersection"] = "ZodIntersection";
	    ZodFirstPartyTypeKind["ZodTuple"] = "ZodTuple";
	    ZodFirstPartyTypeKind["ZodRecord"] = "ZodRecord";
	    ZodFirstPartyTypeKind["ZodMap"] = "ZodMap";
	    ZodFirstPartyTypeKind["ZodSet"] = "ZodSet";
	    ZodFirstPartyTypeKind["ZodFunction"] = "ZodFunction";
	    ZodFirstPartyTypeKind["ZodLazy"] = "ZodLazy";
	    ZodFirstPartyTypeKind["ZodLiteral"] = "ZodLiteral";
	    ZodFirstPartyTypeKind["ZodEnum"] = "ZodEnum";
	    ZodFirstPartyTypeKind["ZodEffects"] = "ZodEffects";
	    ZodFirstPartyTypeKind["ZodNativeEnum"] = "ZodNativeEnum";
	    ZodFirstPartyTypeKind["ZodOptional"] = "ZodOptional";
	    ZodFirstPartyTypeKind["ZodNullable"] = "ZodNullable";
	    ZodFirstPartyTypeKind["ZodDefault"] = "ZodDefault";
	    ZodFirstPartyTypeKind["ZodCatch"] = "ZodCatch";
	    ZodFirstPartyTypeKind["ZodPromise"] = "ZodPromise";
	    ZodFirstPartyTypeKind["ZodBranded"] = "ZodBranded";
	    ZodFirstPartyTypeKind["ZodPipeline"] = "ZodPipeline";
	    ZodFirstPartyTypeKind["ZodReadonly"] = "ZodReadonly";
	})(ZodFirstPartyTypeKind || (types$1.ZodFirstPartyTypeKind = ZodFirstPartyTypeKind = {}));
	const instanceOfType = (
	// const instanceOfType = <T extends new (...args: any[]) => any>(
	cls, params = {
	    message: `Input not instance of ${cls.name}`,
	}) => custom((data) => data instanceof cls, params);
	types$1.instanceof = instanceOfType;
	const stringType = ZodString.create;
	types$1.string = stringType;
	const numberType = ZodNumber.create;
	types$1.number = numberType;
	const nanType = ZodNaN.create;
	types$1.nan = nanType;
	const bigIntType = ZodBigInt.create;
	types$1.bigint = bigIntType;
	const booleanType = ZodBoolean.create;
	types$1.boolean = booleanType;
	const dateType = ZodDate.create;
	types$1.date = dateType;
	const symbolType = ZodSymbol.create;
	types$1.symbol = symbolType;
	const undefinedType = ZodUndefined.create;
	types$1.undefined = undefinedType;
	const nullType = ZodNull.create;
	types$1.null = nullType;
	const anyType = ZodAny.create;
	types$1.any = anyType;
	const unknownType = ZodUnknown.create;
	types$1.unknown = unknownType;
	const neverType = ZodNever.create;
	types$1.never = neverType;
	const voidType = ZodVoid.create;
	types$1.void = voidType;
	const arrayType = ZodArray.create;
	types$1.array = arrayType;
	const objectType = ZodObject.create;
	types$1.object = objectType;
	const strictObjectType = ZodObject.strictCreate;
	types$1.strictObject = strictObjectType;
	const unionType = ZodUnion.create;
	types$1.union = unionType;
	const discriminatedUnionType = ZodDiscriminatedUnion.create;
	types$1.discriminatedUnion = discriminatedUnionType;
	const intersectionType = ZodIntersection.create;
	types$1.intersection = intersectionType;
	const tupleType = ZodTuple.create;
	types$1.tuple = tupleType;
	const recordType = ZodRecord.create;
	types$1.record = recordType;
	const mapType = ZodMap.create;
	types$1.map = mapType;
	const setType = ZodSet.create;
	types$1.set = setType;
	const functionType = ZodFunction.create;
	types$1.function = functionType;
	const lazyType = ZodLazy.create;
	types$1.lazy = lazyType;
	const literalType = ZodLiteral.create;
	types$1.literal = literalType;
	const enumType = ZodEnum.create;
	types$1.enum = enumType;
	const nativeEnumType = ZodNativeEnum.create;
	types$1.nativeEnum = nativeEnumType;
	const promiseType = ZodPromise.create;
	types$1.promise = promiseType;
	const effectsType = ZodEffects.create;
	types$1.effect = effectsType;
	types$1.transformer = effectsType;
	const optionalType = ZodOptional.create;
	types$1.optional = optionalType;
	const nullableType = ZodNullable.create;
	types$1.nullable = nullableType;
	const preprocessType = ZodEffects.createWithPreprocess;
	types$1.preprocess = preprocessType;
	const pipelineType = ZodPipeline.create;
	types$1.pipeline = pipelineType;
	const ostring = () => stringType().optional();
	types$1.ostring = ostring;
	const onumber = () => numberType().optional();
	types$1.onumber = onumber;
	const oboolean = () => booleanType().optional();
	types$1.oboolean = oboolean;
	types$1.coerce = {
	    string: ((arg) => ZodString.create({ ...arg, coerce: true })),
	    number: ((arg) => ZodNumber.create({ ...arg, coerce: true })),
	    boolean: ((arg) => ZodBoolean.create({
	        ...arg,
	        coerce: true,
	    })),
	    bigint: ((arg) => ZodBigInt.create({ ...arg, coerce: true })),
	    date: ((arg) => ZodDate.create({ ...arg, coerce: true })),
	};
	types$1.NEVER = parseUtil_js_1.INVALID;
	return types$1;
}

var hasRequiredExternal;

function requireExternal () {
	if (hasRequiredExternal) return external;
	hasRequiredExternal = 1;
	(function (exports) {
		var __createBinding = (external && external.__createBinding) || (Object.create ? (function(o, m, k, k2) {
		    if (k2 === undefined) k2 = k;
		    var desc = Object.getOwnPropertyDescriptor(m, k);
		    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
		      desc = { enumerable: true, get: function() { return m[k]; } };
		    }
		    Object.defineProperty(o, k2, desc);
		}) : (function(o, m, k, k2) {
		    if (k2 === undefined) k2 = k;
		    o[k2] = m[k];
		}));
		var __exportStar = (external && external.__exportStar) || function(m, exports) {
		    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
		};
		Object.defineProperty(exports, "__esModule", { value: true });
		__exportStar(requireErrors(), exports);
		__exportStar(requireParseUtil(), exports);
		__exportStar(requireTypeAliases(), exports);
		__exportStar(requireUtil(), exports);
		__exportStar(requireTypes$1(), exports);
		__exportStar(requireZodError(), exports); 
	} (external));
	return external;
}

var hasRequiredV3;

function requireV3 () {
	if (hasRequiredV3) return v3;
	hasRequiredV3 = 1;
	(function (exports) {
		var __createBinding = (v3 && v3.__createBinding) || (Object.create ? (function(o, m, k, k2) {
		    if (k2 === undefined) k2 = k;
		    var desc = Object.getOwnPropertyDescriptor(m, k);
		    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
		      desc = { enumerable: true, get: function() { return m[k]; } };
		    }
		    Object.defineProperty(o, k2, desc);
		}) : (function(o, m, k, k2) {
		    if (k2 === undefined) k2 = k;
		    o[k2] = m[k];
		}));
		var __setModuleDefault = (v3 && v3.__setModuleDefault) || (Object.create ? (function(o, v) {
		    Object.defineProperty(o, "default", { enumerable: true, value: v });
		}) : function(o, v) {
		    o["default"] = v;
		});
		var __importStar = (v3 && v3.__importStar) || function (mod) {
		    if (mod && mod.__esModule) return mod;
		    var result = {};
		    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
		    __setModuleDefault(result, mod);
		    return result;
		};
		var __exportStar = (v3 && v3.__exportStar) || function(m, exports) {
		    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
		};
		Object.defineProperty(exports, "__esModule", { value: true });
		exports.z = void 0;
		const z = __importStar(requireExternal());
		exports.z = z;
		__exportStar(requireExternal(), exports);
		exports.default = z; 
	} (v3));
	return v3;
}

var hasRequiredCjs;

function requireCjs () {
	if (hasRequiredCjs) return cjs;
	hasRequiredCjs = 1;
	(function (exports) {
		var __createBinding = (cjs && cjs.__createBinding) || (Object.create ? (function(o, m, k, k2) {
		    if (k2 === undefined) k2 = k;
		    var desc = Object.getOwnPropertyDescriptor(m, k);
		    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
		      desc = { enumerable: true, get: function() { return m[k]; } };
		    }
		    Object.defineProperty(o, k2, desc);
		}) : (function(o, m, k, k2) {
		    if (k2 === undefined) k2 = k;
		    o[k2] = m[k];
		}));
		var __exportStar = (cjs && cjs.__exportStar) || function(m, exports) {
		    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
		};
		var __importDefault = (cjs && cjs.__importDefault) || function (mod) {
		    return (mod && mod.__esModule) ? mod : { "default": mod };
		};
		Object.defineProperty(exports, "__esModule", { value: true });
		const index_js_1 = __importDefault(requireV3());
		__exportStar(requireV3(), exports);
		exports.default = index_js_1.default; 
	} (cjs));
	return cjs;
}

var urlHelpers = {};

var hasRequiredUrlHelpers;

function requireUrlHelpers () {
	if (hasRequiredUrlHelpers) return urlHelpers;
	hasRequiredUrlHelpers = 1;
	Object.defineProperty(urlHelpers, "__esModule", { value: true });
	urlHelpers.getProjectUrl = urlHelpers.getTaskUrl = void 0;
	var endpoints_1 = /*@__PURE__*/ requireEndpoints();
	/**
	 * Generate the URL for a given task.
	 *
	 * @param taskId The ID of the task.
	 * @param content The content of the task.
	 * @returns The URL string for the task view.
	 */
	function getTaskUrl(taskId, content) {
	    var slug = content ? slugify(content) : undefined;
	    var path = slug ? "".concat(slug, "-").concat(taskId) : taskId;
	    return "".concat(endpoints_1.TODOIST_WEB_URI, "/task/").concat(path);
	}
	urlHelpers.getTaskUrl = getTaskUrl;
	/**
	 * Generate the URL for a given project.
	 *
	 * @param projectId The ID of the project.
	 * @param name The name of the project.
	 * @returns The URL string for the project view.
	 */
	function getProjectUrl(projectId, name) {
	    var slug = name ? slugify(name) : undefined;
	    var path = slug ? "".concat(slug, "-").concat(projectId) : projectId;
	    return "".concat(endpoints_1.TODOIST_WEB_URI, "/project/").concat(path);
	}
	urlHelpers.getProjectUrl = getProjectUrl;
	/**
	 * Slugify function borrowed from Django.
	 *
	 * @param value The string to slugify.
	 * @returns The slugified string.
	 */
	function slugify(value) {
	    // Convert to ASCII
	    var result = value.normalize('NFKD').replace(/[\u0300-\u036f]/g, '');
	    // Remove non-ASCII characters
	    result = result.replace(/[^\x20-\x7E]/g, '');
	    // Convert to lowercase and replace non-alphanumeric characters with dashes
	    result = result.toLowerCase().replace(/[^\w\s-]/g, '');
	    // Replace spaces and repeated dashes with single dashes
	    result = result.replace(/[-\s]+/g, '-');
	    // Strip dashes from the beginning and end
	    return result.replace(/^-+|-+$/g, '');
	}
	return urlHelpers;
}

var hasRequiredEntities;

function requireEntities () {
	if (hasRequiredEntities) return entities;
	hasRequiredEntities = 1;
	(function (exports) {
		var __assign = (entities && entities.__assign) || function () {
		    __assign = Object.assign || function(t) {
		        for (var s, i = 1, n = arguments.length; i < n; i++) {
		            s = arguments[i];
		            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
		                t[p] = s[p];
		        }
		        return t;
		    };
		    return __assign.apply(this, arguments);
		};
		var __rest = (entities && entities.__rest) || function (s, e) {
		    var t = {};
		    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
		        t[p] = s[p];
		    if (s != null && typeof Object.getOwnPropertySymbols === "function")
		        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
		            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
		                t[p[i]] = s[p[i]];
		        }
		    return t;
		};
		Object.defineProperty(exports, "__esModule", { value: true });
		exports.ColorSchema = exports.UserSchema = exports.CommentSchema = exports.RawCommentSchema = exports.AttachmentSchema = exports.LabelSchema = exports.SectionSchema = exports.WorkspaceProjectSchema = exports.PersonalProjectSchema = exports.BaseProjectSchema = exports.TaskSchema = exports.DeadlineSchema = exports.DurationSchema = exports.DueDateSchema = void 0;
		var zod_1 = /*@__PURE__*/ requireCjs();
		var urlHelpers_1 = /*@__PURE__*/ requireUrlHelpers();
		exports.DueDateSchema = zod_1.z
		    .object({
		    isRecurring: zod_1.z.boolean(),
		    string: zod_1.z.string(),
		    date: zod_1.z.string(),
		})
		    .extend({
		    datetime: zod_1.z.string().nullable().optional(),
		    timezone: zod_1.z.string().nullable().optional(),
		    lang: zod_1.z.string().nullable().optional(),
		});
		exports.DurationSchema = zod_1.z.object({
		    amount: zod_1.z.number().positive('Value should be greater than zero'),
		    unit: zod_1.z.enum(['minute', 'day']),
		});
		exports.DeadlineSchema = zod_1.z.object({
		    date: zod_1.z.string(),
		    lang: zod_1.z.string(),
		});
		exports.TaskSchema = zod_1.z
		    .object({
		    id: zod_1.z.string(),
		    userId: zod_1.z.string(),
		    projectId: zod_1.z.string(),
		    sectionId: zod_1.z.string().nullable(),
		    parentId: zod_1.z.string().nullable(),
		    addedByUid: zod_1.z.string().nullable(),
		    assignedByUid: zod_1.z.string().nullable(),
		    responsibleUid: zod_1.z.string().nullable(),
		    labels: zod_1.z.array(zod_1.z.string()),
		    deadline: exports.DeadlineSchema.nullable(),
		    duration: exports.DurationSchema.nullable(),
		    checked: zod_1.z.boolean(),
		    isDeleted: zod_1.z.boolean(),
		    addedAt: zod_1.z.string().nullable(),
		    completedAt: zod_1.z.string().nullable(),
		    updatedAt: zod_1.z.string().nullable(),
		    due: exports.DueDateSchema.nullable(),
		    priority: zod_1.z.number().int(),
		    childOrder: zod_1.z.number().int(),
		    content: zod_1.z.string(),
		    description: zod_1.z.string(),
		    noteCount: zod_1.z.number().int(),
		    dayOrder: zod_1.z.number().int(),
		    isCollapsed: zod_1.z.boolean(),
		})
		    .transform(function (data) {
		    return __assign(__assign({}, data), { url: (0, urlHelpers_1.getTaskUrl)(data.id, data.content) });
		});
		/**
		 * Base schema for all project types in Todoist.
		 * Contains common fields shared between personal and workspace projects.
		 */
		exports.BaseProjectSchema = zod_1.z.object({
		    id: zod_1.z.string(),
		    canAssignTasks: zod_1.z.boolean(),
		    childOrder: zod_1.z.number().int(),
		    color: zod_1.z.string(),
		    createdAt: zod_1.z.string().nullable(),
		    isArchived: zod_1.z.boolean(),
		    isDeleted: zod_1.z.boolean(),
		    isFavorite: zod_1.z.boolean(),
		    isFrozen: zod_1.z.boolean(),
		    name: zod_1.z.string(),
		    updatedAt: zod_1.z.string().nullable(),
		    viewStyle: zod_1.z.string(),
		    defaultOrder: zod_1.z.number().int(),
		    description: zod_1.z.string(),
		    isCollapsed: zod_1.z.boolean(),
		    isShared: zod_1.z.boolean(),
		});
		/**
		 * Schema for personal projects in Todoist.
		 */
		exports.PersonalProjectSchema = exports.BaseProjectSchema.extend({
		    parentId: zod_1.z.string().nullable(),
		    inboxProject: zod_1.z.boolean(),
		}).transform(function (data) {
		    return __assign(__assign({}, data), { url: (0, urlHelpers_1.getProjectUrl)(data.id, data.name) });
		});
		/**
		 * Schema for workspace projects in Todoist.
		 */
		exports.WorkspaceProjectSchema = exports.BaseProjectSchema.extend({
		    collaboratorRoleDefault: zod_1.z.string(),
		    folderId: zod_1.z.string().nullable(),
		    isInviteOnly: zod_1.z.boolean().nullable(),
		    isLinkSharingEnabled: zod_1.z.boolean(),
		    role: zod_1.z.string().nullable(),
		    status: zod_1.z.string(),
		    workspaceId: zod_1.z.string(),
		}).transform(function (data) {
		    return __assign(__assign({}, data), { url: (0, urlHelpers_1.getProjectUrl)(data.id, data.name) });
		});
		exports.SectionSchema = zod_1.z.object({
		    id: zod_1.z.string(),
		    userId: zod_1.z.string(),
		    projectId: zod_1.z.string(),
		    addedAt: zod_1.z.string(),
		    updatedAt: zod_1.z.string(),
		    archivedAt: zod_1.z.string().nullable(),
		    name: zod_1.z.string(),
		    sectionOrder: zod_1.z.number().int(),
		    isArchived: zod_1.z.boolean(),
		    isDeleted: zod_1.z.boolean(),
		    isCollapsed: zod_1.z.boolean(),
		});
		exports.LabelSchema = zod_1.z.object({
		    id: zod_1.z.string(),
		    order: zod_1.z.number().int().nullable(),
		    name: zod_1.z.string(),
		    color: zod_1.z.string(),
		    isFavorite: zod_1.z.boolean(),
		});
		exports.AttachmentSchema = zod_1.z
		    .object({
		    resourceType: zod_1.z.string(),
		})
		    .extend({
		    fileName: zod_1.z.string().nullable().optional(),
		    fileSize: zod_1.z.number().int().nullable().optional(),
		    fileType: zod_1.z.string().nullable().optional(),
		    fileUrl: zod_1.z.string().nullable().optional(),
		    fileDuration: zod_1.z.number().int().nullable().optional(),
		    uploadState: zod_1.z.enum(['pending', 'completed']).nullable().optional(),
		    image: zod_1.z.string().nullable().optional(),
		    imageWidth: zod_1.z.number().int().nullable().optional(),
		    imageHeight: zod_1.z.number().int().nullable().optional(),
		    url: zod_1.z.string().nullable().optional(),
		    title: zod_1.z.string().nullable().optional(),
		});
		exports.RawCommentSchema = zod_1.z
		    .object({
		    id: zod_1.z.string(),
		    itemId: zod_1.z.string().optional(),
		    projectId: zod_1.z.string().optional(),
		    content: zod_1.z.string(),
		    postedAt: zod_1.z.string(),
		    fileAttachment: exports.AttachmentSchema.nullable(),
		    postedUid: zod_1.z.string(),
		    uidsToNotify: zod_1.z.array(zod_1.z.string()).nullable(),
		    reactions: zod_1.z.record(zod_1.z.string(), zod_1.z.array(zod_1.z.string())).nullable(),
		    isDeleted: zod_1.z.boolean(),
		})
		    .refine(function (data) {
		    // At least one of itemId or projectId must be present
		    return ((data.itemId !== undefined && data.projectId === undefined) ||
		        (data.itemId === undefined && data.projectId !== undefined));
		}, {
		    message: 'Exactly one of itemId or projectId must be provided',
		});
		exports.CommentSchema = exports.RawCommentSchema.transform(function (data) {
		    var itemId = data.itemId, rest = __rest(data, ["itemId"]);
		    return __assign(__assign({}, rest), { 
		        // Map itemId to taskId for backwards compatibility
		        taskId: itemId });
		});
		exports.UserSchema = zod_1.z.object({
		    id: zod_1.z.string(),
		    name: zod_1.z.string(),
		    email: zod_1.z.string(),
		});
		exports.ColorSchema = zod_1.z.object({
		    /** @deprecated No longer used */
		    id: zod_1.z.number(),
		    /** The key of the color (i.e. 'berry_red') */
		    key: zod_1.z.string(),
		    /** The display name of the color (i.e. 'Berry Red') */
		    displayName: zod_1.z.string(),
		    /** @deprecated Use {@link Color.displayName} instead */
		    name: zod_1.z.string(),
		    /** The hex value of the color (i.e. '#b8255f') */
		    hexValue: zod_1.z.string(),
		    /**
		     * @deprecated Use {@link Color.hexValue} instead
		     */
		    value: zod_1.z.string(),
		}); 
	} (entities));
	return entities;
}

var hasRequiredValidators;

function requireValidators () {
	if (hasRequiredValidators) return validators;
	hasRequiredValidators = 1;
	Object.defineProperty(validators, "__esModule", { value: true });
	validators.validateUserArray = validators.validateUser = validators.validateCommentArray = validators.validateComment = validators.validateLabelArray = validators.validateLabel = validators.validateSectionArray = validators.validateSection = validators.validateProjectArray = validators.validateProject = validators.isPersonalProject = validators.isWorkspaceProject = validators.validateTaskArray = validators.validateTask = void 0;
	var entities_1 = /*@__PURE__*/ requireEntities();
	function validateTask(input) {
	    return entities_1.TaskSchema.parse(input);
	}
	validators.validateTask = validateTask;
	function validateTaskArray(input) {
	    return input.map(validateTask);
	}
	validators.validateTaskArray = validateTaskArray;
	/**
	 * Type guard to check if a project is a workspace project.
	 * @param project The project to check
	 * @returns True if the project is a workspace project
	 */
	function isWorkspaceProject(project) {
	    return 'workspaceId' in project;
	}
	validators.isWorkspaceProject = isWorkspaceProject;
	/**
	 * Type guard to check if a project is a personal project.
	 * @param project The project to check
	 * @returns True if the project is a personal project
	 */
	function isPersonalProject(project) {
	    return !isWorkspaceProject(project);
	}
	validators.isPersonalProject = isPersonalProject;
	/**
	 * Validates and parses a project input.
	 * @param input The input to validate
	 * @returns A validated project (either PersonalProject or WorkspaceProject)
	 */
	function validateProject(input) {
	    if ('workspaceId' in input) {
	        return entities_1.WorkspaceProjectSchema.parse(input);
	    }
	    return entities_1.PersonalProjectSchema.parse(input);
	}
	validators.validateProject = validateProject;
	function validateProjectArray(input) {
	    return input.map(validateProject);
	}
	validators.validateProjectArray = validateProjectArray;
	function validateSection(input) {
	    return entities_1.SectionSchema.parse(input);
	}
	validators.validateSection = validateSection;
	function validateSectionArray(input) {
	    return input.map(validateSection);
	}
	validators.validateSectionArray = validateSectionArray;
	function validateLabel(input) {
	    return entities_1.LabelSchema.parse(input);
	}
	validators.validateLabel = validateLabel;
	function validateLabelArray(input) {
	    return input.map(validateLabel);
	}
	validators.validateLabelArray = validateLabelArray;
	function validateComment(input) {
	    return entities_1.CommentSchema.parse(input);
	}
	validators.validateComment = validateComment;
	function validateCommentArray(input) {
	    return input.map(validateComment);
	}
	validators.validateCommentArray = validateCommentArray;
	function validateUser(input) {
	    return entities_1.UserSchema.parse(input);
	}
	validators.validateUser = validateUser;
	function validateUserArray(input) {
	    return input.map(validateUser);
	}
	validators.validateUserArray = validateUserArray;
	return validators;
}

var types = {};

var requests = {};

var hasRequiredRequests;

function requireRequests () {
	if (hasRequiredRequests) return requests;
	hasRequiredRequests = 1;
	Object.defineProperty(requests, "__esModule", { value: true });
	return requests;
}

var hasRequiredTypes;

function requireTypes () {
	if (hasRequiredTypes) return types;
	hasRequiredTypes = 1;
	(function (exports) {
		var __createBinding = (types && types.__createBinding) || (Object.create ? (function(o, m, k, k2) {
		    if (k2 === undefined) k2 = k;
		    var desc = Object.getOwnPropertyDescriptor(m, k);
		    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
		      desc = { enumerable: true, get: function() { return m[k]; } };
		    }
		    Object.defineProperty(o, k2, desc);
		}) : (function(o, m, k, k2) {
		    if (k2 === undefined) k2 = k;
		    o[k2] = m[k];
		}));
		var __exportStar = (types && types.__exportStar) || function(m, exports) {
		    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
		};
		Object.defineProperty(exports, "__esModule", { value: true });
		__exportStar(/*@__PURE__*/ requireEntities(), exports);
		__exportStar(/*@__PURE__*/ requireErrors$1(), exports);
		__exportStar(/*@__PURE__*/ requireRequests(), exports); 
	} (types));
	return types;
}

var hasRequiredTodoistApi;

function requireTodoistApi () {
	if (hasRequiredTodoistApi) return TodoistApi;
	hasRequiredTodoistApi = 1;
	var __assign = (TodoistApi && TodoistApi.__assign) || function () {
	    __assign = Object.assign || function(t) {
	        for (var s, i = 1, n = arguments.length; i < n; i++) {
	            s = arguments[i];
	            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
	                t[p] = s[p];
	        }
	        return t;
	    };
	    return __assign.apply(this, arguments);
	};
	var __awaiter = (TodoistApi && TodoistApi.__awaiter) || function (thisArg, _arguments, P, generator) {
	    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
	    return new (P || (P = Promise))(function (resolve, reject) {
	        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
	        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
	        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
	        step((generator = generator.apply(thisArg, _arguments || [])).next());
	    });
	};
	var __generator = (TodoistApi && TodoistApi.__generator) || function (thisArg, body) {
	    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
	    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
	    function verb(n) { return function (v) { return step([n, v]); }; }
	    function step(op) {
	        if (f) throw new TypeError("Generator is already executing.");
	        while (g && (g = 0, op[0] && (_ = 0)), _) try {
	            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
	            if (y = 0, t) op = [op[0] & 2, t.value];
	            switch (op[0]) {
	                case 0: case 1: t = op; break;
	                case 4: _.label++; return { value: op[1], done: false };
	                case 5: _.label++; y = op[1]; op = [0]; continue;
	                case 7: op = _.ops.pop(); _.trys.pop(); continue;
	                default:
	                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
	                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
	                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
	                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
	                    if (t[2]) _.ops.pop();
	                    _.trys.pop(); continue;
	            }
	            op = body.call(thisArg, _);
	        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
	        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
	    }
	};
	Object.defineProperty(TodoistApi, "__esModule", { value: true });
	TodoistApi.TodoistApi = void 0;
	var restClient_1 = /*@__PURE__*/ requireRestClient();
	var endpoints_1 = /*@__PURE__*/ requireEndpoints();
	var validators_1 = /*@__PURE__*/ requireValidators();
	var zod_1 = /*@__PURE__*/ requireCjs();
	var uuid_1 = /*@__PURE__*/ requireCommonjsBrowser();
	var types_1 = /*@__PURE__*/ requireTypes();
	var MAX_COMMAND_COUNT = 100;
	/**
	 * Joins path segments using `/` separator.
	 * @param segments A list of **valid** path segments.
	 * @returns A joined path.
	 */
	function generatePath() {
	    var segments = [];
	    for (var _i = 0; _i < arguments.length; _i++) {
	        segments[_i] = arguments[_i];
	    }
	    return segments.join('/');
	}
	/**
	 * A client for interacting with the Todoist API v1.
	 * This class provides methods to manage tasks, projects, sections, labels, and comments in Todoist.
	 *
	 * @example
	 * ```typescript
	 * const api = new TodoistApi('your-api-token');
	 *
	 * // Get all tasks
	 * const tasks = await api.getTasks();
	 *
	 * // Create a new task
	 * const newTask = await api.addTask({
	 *   content: 'My new task',
	 *   projectId: '12345'
	 * });
	 * ```
	 *
	 * For more information about the Todoist API v1, see the [official documentation](https://todoist.com/api/v1).
	 * If you're migrating from v9, please refer to the [migration guide](https://todoist.com/api/v1/docs#tag/Migrating-from-v9).
	 */
	var TodoistApi$1 = /** @class */ (function () {
	    function TodoistApi(
	    /**
	     * Your Todoist API token.
	     */
	    authToken, 
	    /**
	     * Optional custom API base URL. If not provided, defaults to Todoist's standard API endpoint
	     */
	    baseUrl) {
	        this.authToken = authToken;
	        this.syncApiBase = (0, endpoints_1.getSyncBaseUri)(baseUrl);
	    }
	    /**
	     * Retrieves a single active (non-completed) task by its ID.
	     *
	     * @param id - The unique identifier of the task.
	     * @returns A promise that resolves to the requested task.
	     */
	    TodoistApi.prototype.getTask = function (id) {
	        return __awaiter(this, void 0, void 0, function () {
	            var response;
	            return __generator(this, function (_a) {
	                switch (_a.label) {
	                    case 0:
	                        zod_1.z.string().parse(id);
	                        return [4 /*yield*/, (0, restClient_1.request)('GET', this.syncApiBase, generatePath(endpoints_1.ENDPOINT_REST_TASKS, id), this.authToken)];
	                    case 1:
	                        response = _a.sent();
	                        return [2 /*return*/, (0, validators_1.validateTask)(response.data)];
	                }
	            });
	        });
	    };
	    /**
	     * Retrieves a list of active tasks filtered by specific parameters.
	     *
	     * @param args - Filter parameters such as project ID, label ID, or due date.
	     * @returns A promise that resolves to an array of tasks.
	     */
	    TodoistApi.prototype.getTasks = function (args) {
	        if (args === void 0) { args = {}; }
	        return __awaiter(this, void 0, void 0, function () {
	            var _a, results, nextCursor;
	            return __generator(this, function (_b) {
	                switch (_b.label) {
	                    case 0: return [4 /*yield*/, (0, restClient_1.request)('GET', this.syncApiBase, endpoints_1.ENDPOINT_REST_TASKS, this.authToken, args)];
	                    case 1:
	                        _a = (_b.sent()).data, results = _a.results, nextCursor = _a.nextCursor;
	                        return [2 /*return*/, {
	                                results: (0, validators_1.validateTaskArray)(results),
	                                nextCursor: nextCursor,
	                            }];
	                }
	            });
	        });
	    };
	    /**
	     * Retrieves tasks filtered by a filter string.
	     *
	     * @param args - Parameters for filtering tasks, including the query string and optional language.
	     * @returns A promise that resolves to a paginated response of tasks.
	     */
	    TodoistApi.prototype.getTasksByFilter = function (args) {
	        return __awaiter(this, void 0, void 0, function () {
	            var _a, results, nextCursor;
	            return __generator(this, function (_b) {
	                switch (_b.label) {
	                    case 0: return [4 /*yield*/, (0, restClient_1.request)('GET', this.syncApiBase, endpoints_1.ENDPOINT_REST_TASKS_FILTER, this.authToken, args)];
	                    case 1:
	                        _a = (_b.sent()).data, results = _a.results, nextCursor = _a.nextCursor;
	                        return [2 /*return*/, {
	                                results: (0, validators_1.validateTaskArray)(results),
	                                nextCursor: nextCursor,
	                            }];
	                }
	            });
	        });
	    };
	    /**
	     * Creates a new task with the provided parameters.
	     *
	     * @param args - Task creation parameters such as content, due date, or priority.
	     * @param requestId - Optional custom identifier for the request.
	     * @returns A promise that resolves to the created task.
	     */
	    TodoistApi.prototype.addTask = function (args, requestId) {
	        return __awaiter(this, void 0, void 0, function () {
	            var response;
	            return __generator(this, function (_a) {
	                switch (_a.label) {
	                    case 0: return [4 /*yield*/, (0, restClient_1.request)('POST', this.syncApiBase, endpoints_1.ENDPOINT_REST_TASKS, this.authToken, args, requestId)];
	                    case 1:
	                        response = _a.sent();
	                        return [2 /*return*/, (0, validators_1.validateTask)(response.data)];
	                }
	            });
	        });
	    };
	    /**
	     * Quickly adds a task using natural language processing for due dates.
	     *
	     * @param args - Quick add task parameters, including content and due date.
	     * @returns A promise that resolves to the created task.
	     */
	    TodoistApi.prototype.quickAddTask = function (args) {
	        return __awaiter(this, void 0, void 0, function () {
	            var response;
	            return __generator(this, function (_a) {
	                switch (_a.label) {
	                    case 0: return [4 /*yield*/, (0, restClient_1.request)('POST', this.syncApiBase, endpoints_1.ENDPOINT_SYNC_QUICK_ADD, this.authToken, args)];
	                    case 1:
	                        response = _a.sent();
	                        return [2 /*return*/, (0, validators_1.validateTask)(response.data)];
	                }
	            });
	        });
	    };
	    /**
	     * Updates an existing task by its ID with the provided parameters.
	     *
	     * @param id - The unique identifier of the task to update.
	     * @param args - Update parameters such as content, priority, or due date.
	     * @param requestId - Optional custom identifier for the request.
	     * @returns A promise that resolves to the updated task.
	     */
	    TodoistApi.prototype.updateTask = function (id, args, requestId) {
	        return __awaiter(this, void 0, void 0, function () {
	            var response;
	            return __generator(this, function (_a) {
	                switch (_a.label) {
	                    case 0:
	                        zod_1.z.string().parse(id);
	                        return [4 /*yield*/, (0, restClient_1.request)('POST', this.syncApiBase, generatePath(endpoints_1.ENDPOINT_REST_TASKS, id), this.authToken, args, requestId)];
	                    case 1:
	                        response = _a.sent();
	                        return [2 /*return*/, (0, validators_1.validateTask)(response.data)];
	                }
	            });
	        });
	    };
	    /**
	     * Moves existing tasks by their ID to either a different parent/section/project.
	     *
	     * @param ids - The unique identifier of the tasks to be moved.
	     * @param args - The paramets that should contain only one of projectId, sectionId, or parentId
	     * @param requestId - Optional custom identifier for the request.
	     * @returns - A promise that resolves to an array of the updated tasks.
	     */
	    TodoistApi.prototype.moveTasks = function (ids, args, requestId) {
	        var _a;
	        return __awaiter(this, void 0, void 0, function () {
	            var uuid, commands, syncRequest, response, syncTasks;
	            return __generator(this, function (_b) {
	                switch (_b.label) {
	                    case 0:
	                        if (ids.length > MAX_COMMAND_COUNT) {
	                            throw new types_1.TodoistRequestError("Maximum number of items is ".concat(MAX_COMMAND_COUNT), 400);
	                        }
	                        uuid = (0, uuid_1.v4)();
	                        commands = ids.map(function (id) { return ({
	                            type: 'item_move',
	                            uuid: uuid,
	                            args: __assign(__assign(__assign({ id: id }, (args.projectId && { project_id: args.projectId })), (args.sectionId && { section_id: args.sectionId })), (args.parentId && { parent_id: args.parentId })),
	                        }); });
	                        syncRequest = {
	                            commands: commands,
	                            resource_types: ['items'],
	                        };
	                        return [4 /*yield*/, (0, restClient_1.request)('POST', this.syncApiBase, endpoints_1.ENDPOINT_SYNC, this.authToken, syncRequest, requestId, 
	                            /*hasSyncCommands: */ true)];
	                    case 1:
	                        response = _b.sent();
	                        if (response.data.sync_status) {
	                            Object.entries(response.data.sync_status).forEach(function (_a) {
	                                _a[0]; var value = _a[1];
	                                if (value === 'ok')
	                                    return;
	                                throw new types_1.TodoistRequestError(value.error, value.http_code, value.error_extra);
	                            });
	                        }
	                        if (!((_a = response.data.items) === null || _a === void 0 ? void 0 : _a.length)) {
	                            throw new types_1.TodoistRequestError('Tasks not found', 404);
	                        }
	                        syncTasks = response.data.items.filter(function (task) { return ids.includes(task.id); });
	                        if (!syncTasks.length) {
	                            throw new types_1.TodoistRequestError('Tasks not found', 404);
	                        }
	                        return [2 /*return*/, (0, validators_1.validateTaskArray)(syncTasks)];
	                }
	            });
	        });
	    };
	    /**
	     * Closes (completes) a task by its ID.
	     *
	     * @param id - The unique identifier of the task to close.
	     * @param requestId - Optional custom identifier for the request.
	     * @returns A promise that resolves to `true` if successful.
	     */
	    TodoistApi.prototype.closeTask = function (id, requestId) {
	        return __awaiter(this, void 0, void 0, function () {
	            var response;
	            return __generator(this, function (_a) {
	                switch (_a.label) {
	                    case 0:
	                        zod_1.z.string().parse(id);
	                        return [4 /*yield*/, (0, restClient_1.request)('POST', this.syncApiBase, generatePath(endpoints_1.ENDPOINT_REST_TASKS, id, endpoints_1.ENDPOINT_REST_TASK_CLOSE), this.authToken, undefined, requestId)];
	                    case 1:
	                        response = _a.sent();
	                        return [2 /*return*/, (0, restClient_1.isSuccess)(response)];
	                }
	            });
	        });
	    };
	    /**
	     * Reopens a previously closed (completed) task by its ID.
	     *
	     * @param id - The unique identifier of the task to reopen.
	     * @param requestId - Optional custom identifier for the request.
	     * @returns A promise that resolves to `true` if successful.
	     */
	    TodoistApi.prototype.reopenTask = function (id, requestId) {
	        return __awaiter(this, void 0, void 0, function () {
	            var response;
	            return __generator(this, function (_a) {
	                switch (_a.label) {
	                    case 0:
	                        zod_1.z.string().parse(id);
	                        return [4 /*yield*/, (0, restClient_1.request)('POST', this.syncApiBase, generatePath(endpoints_1.ENDPOINT_REST_TASKS, id, endpoints_1.ENDPOINT_REST_TASK_REOPEN), this.authToken, undefined, requestId)];
	                    case 1:
	                        response = _a.sent();
	                        return [2 /*return*/, (0, restClient_1.isSuccess)(response)];
	                }
	            });
	        });
	    };
	    /**
	     * Deletes a task by its ID.
	     *
	     * @param id - The unique identifier of the task to delete.
	     * @param requestId - Optional custom identifier for the request.
	     * @returns A promise that resolves to `true` if successful.
	     */
	    TodoistApi.prototype.deleteTask = function (id, requestId) {
	        return __awaiter(this, void 0, void 0, function () {
	            var response;
	            return __generator(this, function (_a) {
	                switch (_a.label) {
	                    case 0:
	                        zod_1.z.string().parse(id);
	                        return [4 /*yield*/, (0, restClient_1.request)('DELETE', this.syncApiBase, generatePath(endpoints_1.ENDPOINT_REST_TASKS, id), this.authToken, undefined, requestId)];
	                    case 1:
	                        response = _a.sent();
	                        return [2 /*return*/, (0, restClient_1.isSuccess)(response)];
	                }
	            });
	        });
	    };
	    /**
	     * Retrieves a project by its ID.
	     *
	     * @param id - The unique identifier of the project.
	     * @returns A promise that resolves to the requested project.
	     */
	    TodoistApi.prototype.getProject = function (id) {
	        return __awaiter(this, void 0, void 0, function () {
	            var response;
	            return __generator(this, function (_a) {
	                switch (_a.label) {
	                    case 0:
	                        zod_1.z.string().parse(id);
	                        return [4 /*yield*/, (0, restClient_1.request)('GET', this.syncApiBase, generatePath(endpoints_1.ENDPOINT_REST_PROJECTS, id), this.authToken)];
	                    case 1:
	                        response = _a.sent();
	                        return [2 /*return*/, (0, validators_1.validateProject)(response.data)];
	                }
	            });
	        });
	    };
	    /**
	     * Retrieves all projects with optional filters.
	     *
	     * @param args - Optional filters for retrieving projects.
	     * @returns A promise that resolves to an array of projects.
	     */
	    TodoistApi.prototype.getProjects = function (args) {
	        if (args === void 0) { args = {}; }
	        return __awaiter(this, void 0, void 0, function () {
	            var _a, results, nextCursor;
	            return __generator(this, function (_b) {
	                switch (_b.label) {
	                    case 0: return [4 /*yield*/, (0, restClient_1.request)('GET', this.syncApiBase, endpoints_1.ENDPOINT_REST_PROJECTS, this.authToken, args)];
	                    case 1:
	                        _a = (_b.sent()).data, results = _a.results, nextCursor = _a.nextCursor;
	                        return [2 /*return*/, {
	                                results: (0, validators_1.validateProjectArray)(results),
	                                nextCursor: nextCursor,
	                            }];
	                }
	            });
	        });
	    };
	    /**
	     * Creates a new project with the provided parameters.
	     *
	     * @param args - Project creation parameters such as name or color.
	     * @param requestId - Optional custom identifier for the request.
	     * @returns A promise that resolves to the created project.
	     */
	    TodoistApi.prototype.addProject = function (args, requestId) {
	        return __awaiter(this, void 0, void 0, function () {
	            var response;
	            return __generator(this, function (_a) {
	                switch (_a.label) {
	                    case 0: return [4 /*yield*/, (0, restClient_1.request)('POST', this.syncApiBase, endpoints_1.ENDPOINT_REST_PROJECTS, this.authToken, args, requestId)];
	                    case 1:
	                        response = _a.sent();
	                        return [2 /*return*/, (0, validators_1.validateProject)(response.data)];
	                }
	            });
	        });
	    };
	    /**
	     * Updates an existing project by its ID with the provided parameters.
	     *
	     * @param id - The unique identifier of the project to update.
	     * @param args - Update parameters such as name or color.
	     * @param requestId - Optional custom identifier for the request.
	     * @returns A promise that resolves to the updated project.
	     */
	    TodoistApi.prototype.updateProject = function (id, args, requestId) {
	        return __awaiter(this, void 0, void 0, function () {
	            var response;
	            return __generator(this, function (_a) {
	                switch (_a.label) {
	                    case 0:
	                        zod_1.z.string().parse(id);
	                        return [4 /*yield*/, (0, restClient_1.request)('POST', this.syncApiBase, generatePath(endpoints_1.ENDPOINT_REST_PROJECTS, id), this.authToken, args, requestId)];
	                    case 1:
	                        response = _a.sent();
	                        return [2 /*return*/, (0, validators_1.validateProject)(response.data)];
	                }
	            });
	        });
	    };
	    /**
	     * Deletes a project by its ID.
	     *
	     * @param id - The unique identifier of the project to delete.
	     * @param requestId - Optional custom identifier for the request.
	     * @returns A promise that resolves to `true` if successful.
	     */
	    TodoistApi.prototype.deleteProject = function (id, requestId) {
	        return __awaiter(this, void 0, void 0, function () {
	            var response;
	            return __generator(this, function (_a) {
	                switch (_a.label) {
	                    case 0:
	                        zod_1.z.string().parse(id);
	                        return [4 /*yield*/, (0, restClient_1.request)('DELETE', this.syncApiBase, generatePath(endpoints_1.ENDPOINT_REST_PROJECTS, id), this.authToken, undefined, requestId)];
	                    case 1:
	                        response = _a.sent();
	                        return [2 /*return*/, (0, restClient_1.isSuccess)(response)];
	                }
	            });
	        });
	    };
	    /**
	     * Retrieves a list of collaborators for a specific project.
	     *
	     * @param projectId - The unique identifier of the project.
	     * @param args - Optional parameters to filter collaborators.
	     * @returns A promise that resolves to an array of collaborators for the project.
	     */
	    TodoistApi.prototype.getProjectCollaborators = function (projectId, args) {
	        if (args === void 0) { args = {}; }
	        return __awaiter(this, void 0, void 0, function () {
	            var _a, results, nextCursor;
	            return __generator(this, function (_b) {
	                switch (_b.label) {
	                    case 0:
	                        zod_1.z.string().parse(projectId);
	                        return [4 /*yield*/, (0, restClient_1.request)('GET', this.syncApiBase, generatePath(endpoints_1.ENDPOINT_REST_PROJECTS, projectId, endpoints_1.ENDPOINT_REST_PROJECT_COLLABORATORS), this.authToken, args)];
	                    case 1:
	                        _a = (_b.sent()).data, results = _a.results, nextCursor = _a.nextCursor;
	                        return [2 /*return*/, {
	                                results: (0, validators_1.validateUserArray)(results),
	                                nextCursor: nextCursor,
	                            }];
	                }
	            });
	        });
	    };
	    /**
	     * Retrieves all sections within a specific project or matching criteria.
	     *
	     * @param args - Filter parameters such as project ID.
	     * @returns A promise that resolves to an array of sections.
	     */
	    TodoistApi.prototype.getSections = function (args) {
	        return __awaiter(this, void 0, void 0, function () {
	            var _a, results, nextCursor;
	            return __generator(this, function (_b) {
	                switch (_b.label) {
	                    case 0: return [4 /*yield*/, (0, restClient_1.request)('GET', this.syncApiBase, endpoints_1.ENDPOINT_REST_SECTIONS, this.authToken, args)];
	                    case 1:
	                        _a = (_b.sent()).data, results = _a.results, nextCursor = _a.nextCursor;
	                        return [2 /*return*/, {
	                                results: (0, validators_1.validateSectionArray)(results),
	                                nextCursor: nextCursor,
	                            }];
	                }
	            });
	        });
	    };
	    /**
	     * Retrieves a single section by its ID.
	     *
	     * @param id - The unique identifier of the section.
	     * @returns A promise that resolves to the requested section.
	     */
	    TodoistApi.prototype.getSection = function (id) {
	        return __awaiter(this, void 0, void 0, function () {
	            var response;
	            return __generator(this, function (_a) {
	                switch (_a.label) {
	                    case 0:
	                        zod_1.z.string().parse(id);
	                        return [4 /*yield*/, (0, restClient_1.request)('GET', this.syncApiBase, generatePath(endpoints_1.ENDPOINT_REST_SECTIONS, id), this.authToken)];
	                    case 1:
	                        response = _a.sent();
	                        return [2 /*return*/, (0, validators_1.validateSection)(response.data)];
	                }
	            });
	        });
	    };
	    /**
	     * Creates a new section within a project.
	     *
	     * @param args - Section creation parameters such as name or project ID.
	     * @param requestId - Optional custom identifier for the request.
	     * @returns A promise that resolves to the created section.
	     */
	    TodoistApi.prototype.addSection = function (args, requestId) {
	        return __awaiter(this, void 0, void 0, function () {
	            var response;
	            return __generator(this, function (_a) {
	                switch (_a.label) {
	                    case 0: return [4 /*yield*/, (0, restClient_1.request)('POST', this.syncApiBase, endpoints_1.ENDPOINT_REST_SECTIONS, this.authToken, args, requestId)];
	                    case 1:
	                        response = _a.sent();
	                        return [2 /*return*/, (0, validators_1.validateSection)(response.data)];
	                }
	            });
	        });
	    };
	    /**
	     * Updates a section by its ID with the provided parameters.
	     *
	     * @param id - The unique identifier of the section to update.
	     * @param args - Update parameters such as name or project ID.
	     * @param requestId - Optional custom identifier for the request.
	     * @returns A promise that resolves to the updated section.
	     */
	    TodoistApi.prototype.updateSection = function (id, args, requestId) {
	        return __awaiter(this, void 0, void 0, function () {
	            var response;
	            return __generator(this, function (_a) {
	                switch (_a.label) {
	                    case 0:
	                        zod_1.z.string().parse(id);
	                        return [4 /*yield*/, (0, restClient_1.request)('POST', this.syncApiBase, generatePath(endpoints_1.ENDPOINT_REST_SECTIONS, id), this.authToken, args, requestId)];
	                    case 1:
	                        response = _a.sent();
	                        return [2 /*return*/, (0, validators_1.validateSection)(response.data)];
	                }
	            });
	        });
	    };
	    /**
	     * Deletes a section by its ID.
	     *
	     * @param id - The unique identifier of the section to delete.
	     * @param requestId - Optional custom identifier for the request.
	     * @returns A promise that resolves to `true` if successful.
	     */
	    TodoistApi.prototype.deleteSection = function (id, requestId) {
	        return __awaiter(this, void 0, void 0, function () {
	            var response;
	            return __generator(this, function (_a) {
	                switch (_a.label) {
	                    case 0:
	                        zod_1.z.string().parse(id);
	                        return [4 /*yield*/, (0, restClient_1.request)('DELETE', this.syncApiBase, generatePath(endpoints_1.ENDPOINT_REST_SECTIONS, id), this.authToken, undefined, requestId)];
	                    case 1:
	                        response = _a.sent();
	                        return [2 /*return*/, (0, restClient_1.isSuccess)(response)];
	                }
	            });
	        });
	    };
	    /**
	     * Retrieves a label by its ID.
	     *
	     * @param id - The unique identifier of the label.
	     * @returns A promise that resolves to the requested label.
	     */
	    TodoistApi.prototype.getLabel = function (id) {
	        return __awaiter(this, void 0, void 0, function () {
	            var response;
	            return __generator(this, function (_a) {
	                switch (_a.label) {
	                    case 0:
	                        zod_1.z.string().parse(id);
	                        return [4 /*yield*/, (0, restClient_1.request)('GET', this.syncApiBase, generatePath(endpoints_1.ENDPOINT_REST_LABELS, id), this.authToken)];
	                    case 1:
	                        response = _a.sent();
	                        return [2 /*return*/, (0, validators_1.validateLabel)(response.data)];
	                }
	            });
	        });
	    };
	    /**
	     * Retrieves all labels.
	     *
	     * @param args - Optional filter parameters.
	     * @returns A promise that resolves to an array of labels.
	     */
	    TodoistApi.prototype.getLabels = function (args) {
	        if (args === void 0) { args = {}; }
	        return __awaiter(this, void 0, void 0, function () {
	            var _a, results, nextCursor;
	            return __generator(this, function (_b) {
	                switch (_b.label) {
	                    case 0: return [4 /*yield*/, (0, restClient_1.request)('GET', this.syncApiBase, endpoints_1.ENDPOINT_REST_LABELS, this.authToken, args)];
	                    case 1:
	                        _a = (_b.sent()).data, results = _a.results, nextCursor = _a.nextCursor;
	                        return [2 /*return*/, {
	                                results: (0, validators_1.validateLabelArray)(results),
	                                nextCursor: nextCursor,
	                            }];
	                }
	            });
	        });
	    };
	    /**
	     * Adds a new label.
	     *
	     * @param args - Label creation parameters such as name.
	     * @param requestId - Optional custom identifier for the request.
	     * @returns A promise that resolves to the created label.
	     */
	    TodoistApi.prototype.addLabel = function (args, requestId) {
	        return __awaiter(this, void 0, void 0, function () {
	            var response;
	            return __generator(this, function (_a) {
	                switch (_a.label) {
	                    case 0: return [4 /*yield*/, (0, restClient_1.request)('POST', this.syncApiBase, endpoints_1.ENDPOINT_REST_LABELS, this.authToken, args, requestId)];
	                    case 1:
	                        response = _a.sent();
	                        return [2 /*return*/, (0, validators_1.validateLabel)(response.data)];
	                }
	            });
	        });
	    };
	    /**
	     * Updates an existing label by its ID.
	     *
	     * @param id - The unique identifier of the label to update.
	     * @param args - Update parameters such as name or color.
	     * @param requestId - Optional custom identifier for the request.
	     * @returns A promise that resolves to the updated label.
	     */
	    TodoistApi.prototype.updateLabel = function (id, args, requestId) {
	        return __awaiter(this, void 0, void 0, function () {
	            var response;
	            return __generator(this, function (_a) {
	                switch (_a.label) {
	                    case 0:
	                        zod_1.z.string().parse(id);
	                        return [4 /*yield*/, (0, restClient_1.request)('POST', this.syncApiBase, generatePath(endpoints_1.ENDPOINT_REST_LABELS, id), this.authToken, args, requestId)];
	                    case 1:
	                        response = _a.sent();
	                        return [2 /*return*/, (0, validators_1.validateLabel)(response.data)];
	                }
	            });
	        });
	    };
	    /**
	     * Deletes a label by its ID.
	     *
	     * @param id - The unique identifier of the label to delete.
	     * @param requestId - Optional custom identifier for the request.
	     * @returns A promise that resolves to `true` if successful.
	     */
	    TodoistApi.prototype.deleteLabel = function (id, requestId) {
	        return __awaiter(this, void 0, void 0, function () {
	            var response;
	            return __generator(this, function (_a) {
	                switch (_a.label) {
	                    case 0:
	                        zod_1.z.string().parse(id);
	                        return [4 /*yield*/, (0, restClient_1.request)('DELETE', this.syncApiBase, generatePath(endpoints_1.ENDPOINT_REST_LABELS, id), this.authToken, undefined, requestId)];
	                    case 1:
	                        response = _a.sent();
	                        return [2 /*return*/, (0, restClient_1.isSuccess)(response)];
	                }
	            });
	        });
	    };
	    /**
	     * Retrieves a list of shared labels.
	     *
	     * @param args - Optional parameters to filter shared labels.
	     * @returns A promise that resolves to an array of shared labels.
	     */
	    TodoistApi.prototype.getSharedLabels = function (args) {
	        return __awaiter(this, void 0, void 0, function () {
	            var _a, results, nextCursor;
	            return __generator(this, function (_b) {
	                switch (_b.label) {
	                    case 0: return [4 /*yield*/, (0, restClient_1.request)('GET', this.syncApiBase, endpoints_1.ENDPOINT_REST_LABELS_SHARED, this.authToken, args)];
	                    case 1:
	                        _a = (_b.sent()).data, results = _a.results, nextCursor = _a.nextCursor;
	                        return [2 /*return*/, { results: results, nextCursor: nextCursor }];
	                }
	            });
	        });
	    };
	    /**
	     * Renames an existing shared label.
	     *
	     * @param args - Parameters for renaming the shared label, including the current and new name.
	     * @returns A promise that resolves to `true` if successful.
	     */
	    TodoistApi.prototype.renameSharedLabel = function (args) {
	        return __awaiter(this, void 0, void 0, function () {
	            var response;
	            return __generator(this, function (_a) {
	                switch (_a.label) {
	                    case 0: return [4 /*yield*/, (0, restClient_1.request)('POST', this.syncApiBase, endpoints_1.ENDPOINT_REST_LABELS_SHARED_RENAME, this.authToken, args)];
	                    case 1:
	                        response = _a.sent();
	                        return [2 /*return*/, (0, restClient_1.isSuccess)(response)];
	                }
	            });
	        });
	    };
	    /**
	     * Removes a shared label.
	     *
	     * @param args - Parameters for removing the shared label.
	     * @returns A promise that resolves to `true` if successful.
	     */
	    TodoistApi.prototype.removeSharedLabel = function (args) {
	        return __awaiter(this, void 0, void 0, function () {
	            var response;
	            return __generator(this, function (_a) {
	                switch (_a.label) {
	                    case 0: return [4 /*yield*/, (0, restClient_1.request)('POST', this.syncApiBase, endpoints_1.ENDPOINT_REST_LABELS_SHARED_REMOVE, this.authToken, args)];
	                    case 1:
	                        response = _a.sent();
	                        return [2 /*return*/, (0, restClient_1.isSuccess)(response)];
	                }
	            });
	        });
	    };
	    /**
	     * Retrieves all comments associated with a task or project.
	     *
	     * @param args - Parameters for retrieving comments, such as task ID or project ID.
	     * @returns A promise that resolves to an array of comments.
	     */
	    TodoistApi.prototype.getComments = function (args) {
	        return __awaiter(this, void 0, void 0, function () {
	            var _a, results, nextCursor;
	            return __generator(this, function (_b) {
	                switch (_b.label) {
	                    case 0: return [4 /*yield*/, (0, restClient_1.request)('GET', this.syncApiBase, endpoints_1.ENDPOINT_REST_COMMENTS, this.authToken, args)];
	                    case 1:
	                        _a = (_b.sent()).data, results = _a.results, nextCursor = _a.nextCursor;
	                        return [2 /*return*/, {
	                                results: (0, validators_1.validateCommentArray)(results),
	                                nextCursor: nextCursor,
	                            }];
	                }
	            });
	        });
	    };
	    /**
	     * Retrieves a specific comment by its ID.
	     *
	     * @param id - The unique identifier of the comment to retrieve.
	     * @returns A promise that resolves to the requested comment.
	     */
	    TodoistApi.prototype.getComment = function (id) {
	        return __awaiter(this, void 0, void 0, function () {
	            var response;
	            return __generator(this, function (_a) {
	                switch (_a.label) {
	                    case 0:
	                        zod_1.z.string().parse(id);
	                        return [4 /*yield*/, (0, restClient_1.request)('GET', this.syncApiBase, generatePath(endpoints_1.ENDPOINT_REST_COMMENTS, id), this.authToken)];
	                    case 1:
	                        response = _a.sent();
	                        return [2 /*return*/, (0, validators_1.validateComment)(response.data)];
	                }
	            });
	        });
	    };
	    /**
	     * Adds a comment to a task or project.
	     *
	     * @param args - Parameters for creating the comment, such as content and the target task or project ID.
	     * @param requestId - Optional custom identifier for the request.
	     * @returns A promise that resolves to the created comment.
	     */
	    TodoistApi.prototype.addComment = function (args, requestId) {
	        return __awaiter(this, void 0, void 0, function () {
	            var response;
	            return __generator(this, function (_a) {
	                switch (_a.label) {
	                    case 0: return [4 /*yield*/, (0, restClient_1.request)('POST', this.syncApiBase, endpoints_1.ENDPOINT_REST_COMMENTS, this.authToken, args, requestId)];
	                    case 1:
	                        response = _a.sent();
	                        return [2 /*return*/, (0, validators_1.validateComment)(response.data)];
	                }
	            });
	        });
	    };
	    /**
	     * Updates an existing comment by its ID.
	     *
	     * @param id - The unique identifier of the comment to update.
	     * @param args - Update parameters such as new content.
	     * @param requestId - Optional custom identifier for the request.
	     * @returns A promise that resolves to the updated comment.
	     */
	    TodoistApi.prototype.updateComment = function (id, args, requestId) {
	        return __awaiter(this, void 0, void 0, function () {
	            var response;
	            return __generator(this, function (_a) {
	                switch (_a.label) {
	                    case 0:
	                        zod_1.z.string().parse(id);
	                        return [4 /*yield*/, (0, restClient_1.request)('POST', this.syncApiBase, generatePath(endpoints_1.ENDPOINT_REST_COMMENTS, id), this.authToken, args, requestId)];
	                    case 1:
	                        response = _a.sent();
	                        return [2 /*return*/, (0, validators_1.validateComment)(response.data)];
	                }
	            });
	        });
	    };
	    /**
	     * Deletes a comment by its ID.
	     *
	     * @param id - The unique identifier of the comment to delete.
	     * @param requestId - Optional custom identifier for the request.
	     * @returns A promise that resolves to `true` if successful.
	     */
	    TodoistApi.prototype.deleteComment = function (id, requestId) {
	        return __awaiter(this, void 0, void 0, function () {
	            var response;
	            return __generator(this, function (_a) {
	                switch (_a.label) {
	                    case 0:
	                        zod_1.z.string().parse(id);
	                        return [4 /*yield*/, (0, restClient_1.request)('DELETE', this.syncApiBase, generatePath(endpoints_1.ENDPOINT_REST_COMMENTS, id), this.authToken, undefined, requestId)];
	                    case 1:
	                        response = _a.sent();
	                        return [2 /*return*/, (0, restClient_1.isSuccess)(response)];
	                }
	            });
	        });
	    };
	    return TodoistApi;
	}());
	TodoistApi.TodoistApi = TodoistApi$1;
	return TodoistApi;
}

var authentication = {};

var hasRequiredAuthentication;

function requireAuthentication () {
	if (hasRequiredAuthentication) return authentication;
	hasRequiredAuthentication = 1;
	var __awaiter = (authentication && authentication.__awaiter) || function (thisArg, _arguments, P, generator) {
	    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
	    return new (P || (P = Promise))(function (resolve, reject) {
	        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
	        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
	        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
	        step((generator = generator.apply(thisArg, _arguments || [])).next());
	    });
	};
	var __generator = (authentication && authentication.__generator) || function (thisArg, body) {
	    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
	    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
	    function verb(n) { return function (v) { return step([n, v]); }; }
	    function step(op) {
	        if (f) throw new TypeError("Generator is already executing.");
	        while (g && (g = 0, op[0] && (_ = 0)), _) try {
	            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
	            if (y = 0, t) op = [op[0] & 2, t.value];
	            switch (op[0]) {
	                case 0: case 1: t = op; break;
	                case 4: _.label++; return { value: op[1], done: false };
	                case 5: _.label++; y = op[1]; op = [0]; continue;
	                case 7: op = _.ops.pop(); _.trys.pop(); continue;
	                default:
	                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
	                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
	                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
	                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
	                    if (t[2]) _.ops.pop();
	                    _.trys.pop(); continue;
	            }
	            op = body.call(thisArg, _);
	        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
	        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
	    }
	};
	Object.defineProperty(authentication, "__esModule", { value: true });
	authentication.revokeAuthToken = authentication.getAuthToken = authentication.getAuthorizationUrl = authentication.getAuthStateParameter = void 0;
	var restClient_1 = /*@__PURE__*/ requireRestClient();
	var uuid_1 = /*@__PURE__*/ requireCommonjsBrowser();
	var types_1 = /*@__PURE__*/ requireTypes();
	var endpoints_1 = /*@__PURE__*/ requireEndpoints();
	/**
	 * Generates a random state parameter for OAuth2 authorization.
	 * The state parameter helps prevent CSRF attacks.
	 *
	 * @example
	 * ```typescript
	 * const state = getAuthStateParameter()
	 * // Store state in session
	 * const authUrl = getAuthorizationUrl(clientId, ['data:read'], state)
	 * ```
	 *
	 * @returns A random UUID v4 string
	 */
	function getAuthStateParameter() {
	    return (0, uuid_1.v4)();
	}
	authentication.getAuthStateParameter = getAuthStateParameter;
	/**
	 * Generates the authorization URL for the OAuth2 flow.
	 *
	 * @example
	 * ```typescript
	 * const url = getAuthorizationUrl(
	 *   'your-client-id',
	 *   ['data:read', 'task:add'],
	 *   state
	 * )
	 * // Redirect user to url
	 * ```
	 *
	 * @returns The full authorization URL to redirect users to
	 * @see https://todoist.com/api/v1/docs#tag/Authorization/OAuth
	 */
	function getAuthorizationUrl(clientId, permissions, state, baseUrl) {
	    if (!(permissions === null || permissions === void 0 ? void 0 : permissions.length)) {
	        throw new Error('At least one scope value should be passed for permissions.');
	    }
	    var scope = permissions.join(',');
	    return "".concat((0, endpoints_1.getAuthBaseUri)(baseUrl)).concat(endpoints_1.ENDPOINT_AUTHORIZATION, "?client_id=").concat(clientId, "&scope=").concat(scope, "&state=").concat(state);
	}
	authentication.getAuthorizationUrl = getAuthorizationUrl;
	/**
	 * Exchanges an authorization code for an access token.
	 *
	 * @example
	 * ```typescript
	 * const { accessToken } = await getAuthToken({
	 *   clientId: 'your-client-id',
	 *   clientSecret: 'your-client-secret',
	 *   code: authCode
	 * })
	 * ```
	 *
	 * @returns The access token response
	 * @throws {@link TodoistRequestError} If the token exchange fails
	 */
	function getAuthToken(args, baseUrl) {
	    var _a;
	    return __awaiter(this, void 0, void 0, function () {
	        var response;
	        return __generator(this, function (_b) {
	            switch (_b.label) {
	                case 0: return [4 /*yield*/, (0, restClient_1.request)('POST', (0, endpoints_1.getAuthBaseUri)(baseUrl), endpoints_1.ENDPOINT_GET_TOKEN, undefined, args)];
	                case 1:
	                    response = _b.sent();
	                    if (response.status !== 200 || !((_a = response.data) === null || _a === void 0 ? void 0 : _a.accessToken)) {
	                        throw new types_1.TodoistRequestError('Authentication token exchange failed.', response.status, response.data);
	                    }
	                    return [2 /*return*/, response.data];
	            }
	        });
	    });
	}
	authentication.getAuthToken = getAuthToken;
	/**
	 * Revokes an access token, making it invalid for future use.
	 *
	 * @example
	 * ```typescript
	 * await revokeAuthToken({
	 *   clientId: 'your-client-id',
	 *   clientSecret: 'your-client-secret',
	 *   accessToken: token
	 * })
	 * ```
	 *
	 * @returns True if revocation was successful
	 * @see https://todoist.com/api/v1/docs#tag/Authorization/operation/revoke_access_token_api_api_v1_access_tokens_delete
	 */
	function revokeAuthToken(args, baseUrl) {
	    return __awaiter(this, void 0, void 0, function () {
	        var response;
	        return __generator(this, function (_a) {
	            switch (_a.label) {
	                case 0: return [4 /*yield*/, (0, restClient_1.request)('POST', (0, endpoints_1.getSyncBaseUri)(baseUrl), endpoints_1.ENDPOINT_REVOKE_TOKEN, undefined, args)];
	                case 1:
	                    response = _a.sent();
	                    return [2 /*return*/, (0, restClient_1.isSuccess)(response)];
	            }
	        });
	    });
	}
	authentication.revokeAuthToken = revokeAuthToken;
	return authentication;
}

var utils = {};

var colors = {};

var hasRequiredColors;

function requireColors () {
	if (hasRequiredColors) return colors;
	hasRequiredColors = 1;
	(function (exports) {
		Object.defineProperty(exports, "__esModule", { value: true });
		exports.getColorByKey = exports.getColorByName = exports.getColorById = exports.defaultColor = exports.colors = exports.taupe = exports.gray = exports.charcoal = exports.salmon = exports.magenta = exports.lavender = exports.violet = exports.grape = exports.blue = exports.lightBlue = exports.skyBlue = exports.turquoise = exports.mintGreen = exports.green = exports.limeGreen = exports.oliveGreen = exports.yellow = exports.orange = exports.red = exports.berryRed = void 0;
		exports.berryRed = {
		    id: 30,
		    key: 'berry_red',
		    displayName: 'Berry Red',
		    name: 'Berry Red',
		    hexValue: '#b8255f',
		    value: '#b8255f',
		};
		exports.red = {
		    id: 31,
		    key: 'red',
		    displayName: 'Red',
		    name: 'Red',
		    hexValue: '#db4035',
		    value: '#db4035',
		};
		exports.orange = {
		    id: 32,
		    key: 'orange',
		    displayName: 'Orange',
		    name: 'Orange',
		    hexValue: '#ff9933',
		    value: '#ff9933',
		};
		exports.yellow = {
		    id: 33,
		    key: 'yellow',
		    displayName: 'Yellow',
		    name: 'Yellow',
		    hexValue: '#fad000',
		    value: '#fad000',
		};
		exports.oliveGreen = {
		    id: 34,
		    key: 'olive_green',
		    displayName: 'Olive Green',
		    name: 'Olive Green',
		    hexValue: '#afb83b',
		    value: '#afb83b',
		};
		exports.limeGreen = {
		    id: 35,
		    key: 'lime_green',
		    displayName: 'Lime Green',
		    name: 'Lime Green',
		    hexValue: '#7ecc49',
		    value: '#7ecc49',
		};
		exports.green = {
		    id: 36,
		    key: 'green',
		    displayName: 'Green',
		    name: 'Green',
		    hexValue: '#299438',
		    value: '#299438',
		};
		exports.mintGreen = {
		    id: 37,
		    key: 'mint_green',
		    displayName: 'Mint Green',
		    name: 'Mint Green',
		    hexValue: '#6accbc',
		    value: '#6accbc',
		};
		exports.turquoise = {
		    id: 38,
		    key: 'turquoise',
		    displayName: 'Turquoise',
		    name: 'Turquoise',
		    hexValue: '#158fad',
		    value: '#158fad',
		};
		exports.skyBlue = {
		    id: 39,
		    key: 'sky_blue',
		    displayName: 'Sky Blue',
		    name: 'Sky Blue',
		    hexValue: '#14aaf5',
		    value: '#14aaf5',
		};
		exports.lightBlue = {
		    id: 40,
		    key: 'light_blue',
		    displayName: 'Light Blue',
		    name: 'Light Blue',
		    hexValue: '#96c3eb',
		    value: '#96c3eb',
		};
		exports.blue = {
		    id: 41,
		    key: 'blue',
		    displayName: 'Blue',
		    name: 'Blue',
		    hexValue: '#4073ff',
		    value: '#4073ff',
		};
		exports.grape = {
		    id: 42,
		    key: 'grape',
		    displayName: 'Grape',
		    name: 'Grape',
		    hexValue: '#884dff',
		    value: '#884dff',
		};
		exports.violet = {
		    id: 43,
		    key: 'violet',
		    displayName: 'Violet',
		    name: 'Violet',
		    hexValue: '#af38eb',
		    value: '#af38eb',
		};
		exports.lavender = {
		    id: 44,
		    key: 'lavender',
		    displayName: 'Lavender',
		    name: 'Lavender',
		    hexValue: '#eb96eb',
		    value: '#eb96eb',
		};
		exports.magenta = {
		    id: 45,
		    key: 'magenta',
		    displayName: 'Magenta',
		    name: 'Magenta',
		    hexValue: '#e05194',
		    value: '#e05194',
		};
		exports.salmon = {
		    id: 46,
		    key: 'salmon',
		    displayName: 'Salmon',
		    name: 'Salmon',
		    hexValue: '#ff8d85',
		    value: '#ff8d85',
		};
		exports.charcoal = {
		    id: 47,
		    key: 'charcoal',
		    displayName: 'Charcoal',
		    name: 'Charcoal',
		    hexValue: '#808080',
		    value: '#808080',
		};
		exports.gray = {
		    id: 48,
		    key: 'gray',
		    displayName: 'Gray',
		    name: 'Gray',
		    hexValue: '#b8b8b8',
		    value: '#b8b8b8',
		};
		exports.taupe = {
		    id: 49,
		    key: 'taupe',
		    displayName: 'Taupe',
		    name: 'Taupe',
		    hexValue: '#ccac93',
		    value: '#ccac93',
		};
		exports.colors = [
		    exports.berryRed,
		    exports.red,
		    exports.orange,
		    exports.yellow,
		    exports.oliveGreen,
		    exports.limeGreen,
		    exports.green,
		    exports.mintGreen,
		    exports.turquoise,
		    exports.skyBlue,
		    exports.lightBlue,
		    exports.blue,
		    exports.grape,
		    exports.violet,
		    exports.lavender,
		    exports.magenta,
		    exports.salmon,
		    exports.charcoal,
		    exports.gray,
		    exports.taupe,
		];
		exports.defaultColor = exports.charcoal;
		/**
		 * @private
		 * @deprecated Use {@link getColorByKey} instead
		 */
		function getColorById(colorId) {
		    var color = exports.colors.find(function (color) { return color.id === colorId; });
		    return color !== null && color !== void 0 ? color : exports.defaultColor;
		}
		exports.getColorById = getColorById;
		/**
		 * @private
		 * @deprecated Use {@link getColorByKey} instead
		 */
		function getColorByName(colorName) {
		    var color = exports.colors.find(function (color) { return color.name === colorName; });
		    return color !== null && color !== void 0 ? color : exports.defaultColor;
		}
		exports.getColorByName = getColorByName;
		/**
		 * Retrieves a {@link Color} object by its key identifier.
		 *
		 * @param colorKey - The unique key identifier of the color to find (e.g., 'berry_red', 'sky_blue')
		 * @returns The matching Color object if found, otherwise returns the default color (charcoal)
		 *
		 * @example
		 * ```typescript
		 * const color = getColorByKey('berry_red');
		 * console.log(color.hexValue); // '#b8255f'
		 * ```
		 */
		function getColorByKey(colorKey) {
		    var color = exports.colors.find(function (color) { return color.key === colorKey; });
		    return color !== null && color !== void 0 ? color : exports.defaultColor;
		}
		exports.getColorByKey = getColorByKey; 
	} (colors));
	return colors;
}

var sanitization = {};

var hasRequiredSanitization;

function requireSanitization () {
	if (hasRequiredSanitization) return sanitization;
	hasRequiredSanitization = 1;
	var __assign = (sanitization && sanitization.__assign) || function () {
	    __assign = Object.assign || function(t) {
	        for (var s, i = 1, n = arguments.length; i < n; i++) {
	            s = arguments[i];
	            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
	                t[p] = s[p];
	        }
	        return t;
	    };
	    return __assign.apply(this, arguments);
	};
	Object.defineProperty(sanitization, "__esModule", { value: true });
	sanitization.getSanitizedTasks = sanitization.getSanitizedContent = void 0;
	var BOLD_FORMAT = /(^|[\s!?,;>:]+)(?:\*\*|__|!!)(.+?)(\*\*|__|!!)(?=$|[\s!?,;><:]+)/gi;
	var ITALIC_FORMAT = /(^|[\s!?,;>:]+)(?:\*|_|!)(.+?)(\*|_|!)(?=$|[\s!?,;><:]+)/gi;
	var BOLD_ITALIC_FORMAT = /(^|[\s!?,;>:]+)(?:\*\*\*|___|!!!)(.+?)(\*\*\*|___|!!!)(?=$|[\s!?,;><:]+)/gi;
	var CODE_BLOCK_FORMAT = /```([\s\S]*?)```/gi;
	var CODE_INLINE_FORMAT = /`([^`]+)`/gi;
	var TODOIST_LINK = /((?:(?:onenote:)?[\w-]+):\/\/[^\s]+)\s+[[(]([^)]+)[\])]/gi;
	var MARKDOWN_LINK = /\[(.+?)\]\((.+?)\)/gi;
	var GMAIL_LINK = /\[\[gmail=(.+?),\s*(.+?)\]\]/gi;
	var OUTLOOK_LINK = /\[\[outlook=(.+?),\s*(.+?)\]\]/gi;
	var THUNDERBIRD_LINK = /\[\[thunderbird\n(.+)\n(.+)\n\s*\]\]/gi;
	var FAKE_SECTION_PREFIX = '* ';
	var FAKE_SECTION_SUFFIX = ':';
	function removeStyleFormatting(input) {
	    if (!input.includes('!') && !input.includes('*') && !input.includes('_')) {
	        return input;
	    }
	    function removeMarkdown(match, prefix, text) {
	        return "".concat(prefix).concat(text);
	    }
	    input = input.replace(BOLD_ITALIC_FORMAT, removeMarkdown);
	    input = input.replace(BOLD_FORMAT, removeMarkdown);
	    input = input.replace(ITALIC_FORMAT, removeMarkdown);
	    return input;
	}
	function removeCodeFormatting(input) {
	    function removeMarkdown(match, text) {
	        return text;
	    }
	    input = input.replace(CODE_BLOCK_FORMAT, removeMarkdown);
	    input = input.replace(CODE_INLINE_FORMAT, removeMarkdown);
	    return input;
	}
	function removeFakeSectionFormatting(input) {
	    if (input.startsWith(FAKE_SECTION_PREFIX)) {
	        input = input.slice(FAKE_SECTION_PREFIX.length);
	    }
	    if (input.endsWith(FAKE_SECTION_SUFFIX)) {
	        input = input.slice(0, input.length - FAKE_SECTION_SUFFIX.length);
	    }
	    return input;
	}
	function removeMarkdownLinks(input) {
	    if (!input.includes('[') || !input.includes(']')) {
	        return input;
	    }
	    function removeMarkdown(match, text) {
	        return text;
	    }
	    return input.replace(MARKDOWN_LINK, removeMarkdown);
	}
	function removeTodoistLinks(input) {
	    if (!input.includes('(') || !input.includes(')')) {
	        return input;
	    }
	    function removeMarkdown(match, url, text) {
	        return text;
	    }
	    return input.replace(TODOIST_LINK, removeMarkdown);
	}
	function removeAppLinks(input) {
	    if (input.includes('gmail')) {
	        input = input.replace(GMAIL_LINK, function (match, id, text) { return text; });
	    }
	    if (input.includes('outlook')) {
	        input = input.replace(OUTLOOK_LINK, function (match, id, text) { return text; });
	    }
	    if (input.includes('thunderbird')) {
	        input = input.replace(THUNDERBIRD_LINK, function (match, text) { return text; });
	    }
	    return input;
	}
	/**
	 * Sanitizes a string by removing Todoist's formatting syntax (e.g. bold, italic, code blocks, links).
	 *
	 * @example
	 * // Removes bold/italic formatting
	 * getSanitizedContent('Some **bold** and *italic*') // 'Some bold and italic'
	 *
	 * // Removes markdown links
	 * getSanitizedContent('A [markdown](http://url.com) link') // 'A markdown link'
	 *
	 * // Removes app-specific links
	 * getSanitizedContent('A [[gmail=id, link from gmail]]') // 'A link from gmail'
	 *
	 * @param input - The string to sanitize
	 * @returns The sanitized string with all formatting removed
	 */
	function getSanitizedContent(input) {
	    input = removeStyleFormatting(input);
	    input = removeCodeFormatting(input);
	    input = removeFakeSectionFormatting(input);
	    input = removeMarkdownLinks(input);
	    input = removeTodoistLinks(input);
	    input = removeAppLinks(input);
	    return input;
	}
	sanitization.getSanitizedContent = getSanitizedContent;
	/**
	 * Takes an array of tasks and returns a new array with sanitized content
	 * added as 'sanitizedContent' property to each task.
	 *
	 * @see {@link getSanitizedContent}
	 *
	 * @example
	 * const tasks = [{ content: '**Bold** task', ... }]
	 * getSanitizedTasks(tasks) // [{ content: '**Bold** task', sanitizedContent: 'Bold task', ... }]
	 *
	 * @param tasks - Array of Task objects to sanitize
	 * @returns Array of tasks with added sanitizedContent property
	 */
	function getSanitizedTasks(tasks) {
	    return tasks.map(function (task) { return (__assign(__assign({}, task), { sanitizedContent: getSanitizedContent(task.content) })); });
	}
	sanitization.getSanitizedTasks = getSanitizedTasks;
	return sanitization;
}

var hasRequiredUtils;

function requireUtils () {
	if (hasRequiredUtils) return utils;
	hasRequiredUtils = 1;
	(function (exports) {
		var __createBinding = (utils && utils.__createBinding) || (Object.create ? (function(o, m, k, k2) {
		    if (k2 === undefined) k2 = k;
		    var desc = Object.getOwnPropertyDescriptor(m, k);
		    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
		      desc = { enumerable: true, get: function() { return m[k]; } };
		    }
		    Object.defineProperty(o, k2, desc);
		}) : (function(o, m, k, k2) {
		    if (k2 === undefined) k2 = k;
		    o[k2] = m[k];
		}));
		var __exportStar = (utils && utils.__exportStar) || function(m, exports) {
		    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
		};
		Object.defineProperty(exports, "__esModule", { value: true });
		__exportStar(/*@__PURE__*/ requireColors(), exports);
		__exportStar(/*@__PURE__*/ requireSanitization(), exports); 
	} (utils));
	return utils;
}

var hasRequiredDist;

function requireDist () {
	if (hasRequiredDist) return dist;
	hasRequiredDist = 1;
	(function (exports) {
		var __createBinding = (dist && dist.__createBinding) || (Object.create ? (function(o, m, k, k2) {
		    if (k2 === undefined) k2 = k;
		    var desc = Object.getOwnPropertyDescriptor(m, k);
		    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
		      desc = { enumerable: true, get: function() { return m[k]; } };
		    }
		    Object.defineProperty(o, k2, desc);
		}) : (function(o, m, k, k2) {
		    if (k2 === undefined) k2 = k;
		    o[k2] = m[k];
		}));
		var __exportStar = (dist && dist.__exportStar) || function(m, exports) {
		    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
		};
		Object.defineProperty(exports, "__esModule", { value: true });
		__exportStar(/*@__PURE__*/ requireTodoistApi(), exports);
		__exportStar(/*@__PURE__*/ requireAuthentication(), exports);
		__exportStar(/*@__PURE__*/ requireTypes(), exports);
		__exportStar(/*@__PURE__*/ requireUtils(), exports); 
	} (dist));
	return dist;
}

var distExports = /*@__PURE__*/ requireDist();

function styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css_248z = "\n/* ========== CSS Variables ========== */\n:root {\n  font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", sans-serif;\n  --pill-bg: #f1f3f5;\n  --pill-text: #4b5563;\n  --selected-bg: #f6f9ff;\n  --selected-border: #b4cef5;\n  --deadline-bg: #d8d5ff;\n  --deadline-text: #6b21a8;\n  --meta-text: #6b7280;\n  \n  /* Enhanced animation variables for native feel */\n  --transition-fast: 100ms cubic-bezier(0.3, 0.7, 0.4, 1);\n  --transition-medium: 280ms cubic-bezier(0.33, 1, 0.68, 1);\n  --transition-smooth: 420ms cubic-bezier(0.25, 0.8, 0.25, 1);\n  --transition-spring: 300ms cubic-bezier(0.3, 1, 0.5, 1);\n  \n  --shadow-light: 0 1px 3px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04);\n  --shadow-medium: 0 2px 8px rgba(0,0,0,0.1), 0 4px 12px rgba(0,0,0,0.05);\n  --shadow-heavy: 0 4px 16px rgba(0, 0, 0, 0.15);\n  --shadow-interactive: 0 1px 2px rgba(0,0,0,0.04), 0 2px 4px rgba(0,0,0,0.08);\n}\n\n.html {\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n}\n\n/* ========== MODULE: Layout & Container ========== */\n.todoist-board {\n  position: relative;\n  inset: 0;\n  margin: 0 0.125rem;\n  max-width: unset;\n  overflow-y: scroll;\n  touch-action: pan-y;\n  -webkit-overflow-scrolling: touch;\n  background: transparent;\n  padding: 0;\n  border: none;\n  box-shadow: none;\n  overflow: visible;\n  isolation: unset;\n  z-index: 1000;\n  /* Hardware acceleration */\n  will-change: scroll-position;\n  transform: translate3d(0, 0, 0);\n}\n\n.list-view {\n  display: block;\n  max-width: 768px;\n  min-height: auto;\n  /* margin: 0 auto; */\n  /* padding: 0.5rem 1rem; */\n  font-size: 0.9rem; \n  line-height: 1.5; \n  position: relative; \n  opacity: 1;\n  touch-action: pan-y;\n}\n\n.list-wrapper {\n  display: block;\n  touch-action: pan-y;\n}\n\n/* ========== Enhanced Toolbar Styles ========== */\n/* ========== MODULE: Toolbar & Chin ========== */\n.list-toolbar {\n  display: flex;\n  flex-direction: row;\n  align-items: center;\n  justify-content: space-between;\n  position: sticky;\n  z-index: 1000;\n  padding: 0px 8px 0px 8px;\n  margin: 0 auto;\n  border-radius: 16px;\n  /* Inset effect for toolbar */\n  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.05),\n              inset 0 -1px 2px rgba(0, 0, 0, 0.04);\n  /* background-color: #f9fafb; */\n  transition: background-color 0.2s ease;\n  /* Remove background and shadow by default */\n  /* backdrop-filter: blur(20px) saturate(1.2); */\n  border: 1px solid rgba(255, 255, 255, 0.3);\n  font-size: 0.85rem;\n  overflow-x: auto;\n  overflow-y: hidden;\n  min-width: min-content;\n  flex-wrap: nowrap;\n  touch-action: pan-y;\n  transform: translate3d(0, 0, 0);\n  animation: fade-in-up var(--transition-medium) ease-out both;\n  /* Added for dropdown/menu support */\n  overflow: visible;\n  position: relative;\n  z-index: 1010;\n}\n\n.list-toolbar.sticky {\n  background-color: #1e1e1e;\n  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.05),\n              inset 0 -1px 2px rgba(0, 0, 0, 0.04),\n              0 1px 4px rgba(0, 0, 0, 0.15);\n}\n\n/* ========== MODULE: Filter Bar ========== */\n.filter-button-wrapper {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  width: 48px;\n}\n\n/* Enhanced filter-btn style for native feel */\n.filter-btn {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  font-size: 11px;\n  color: var(--text-muted);\n  gap: 4px;\n  cursor: pointer;\n  position: relative;\n  padding: 6px;\n  border-radius: 12px;\n  transition: all var(--transition-fast);\n  transform: translate3d(0, 0, 0);\n}\n\n.filter-btn .icon {\n  font-size: 20px;\n  line-height: 1;\n  transition: transform var(--transition-fast);\n}\n\n.filter-btn .label {\n  pointer-events: none;\n  font-weight: 500;\n  opacity: 0.8;\n}\n\n.filter-btn:hover {\n  background: rgba(0, 0, 0, 0.04);\n  transform: scale(1.02) translate3d(0, 0, 0);\n}\n\n.filter-btn:hover .icon {\n  transform: scale(1.1);\n}\n\n.filter-btn:active {\n  transform: scale(0.98) translate3d(0, 0, 0);\n  transition: transform 80ms ease-out;\n}\n\n/* Enhanced active filter button */\n.filter-btn.active {\n  background: rgba(99, 102, 241, 0.1);\n  color: #6366f1;\n  border-radius: 12px;\n  position: relative;\n  transform: scale(1.02) translate3d(0, 0, 0);\n  transition: all var(--transition-medium);\n}\n\n.filter-row.selected::after {\n  content: \"\";\n  position: absolute;\n  top: calc(100% + 6px);\n  left: 50%;\n  transform: translateX(-50%) translateY(-50%);\n  width: 20px;\n  height: 5px;\n  background: #6366f1;\n  border-radius: 9999px;\n  pointer-events: none;\n  transition: all var(--transition-smooth);\n  animation: indicator-slide var(--transition-spring) ease-out;\n}\n\n.filter-btn-clicked {\n  transition: transform var(--transition-fast);\n  transform: scale(0.95) translate3d(0, 0, 0);\n}\n\n.filter-row {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  width: auto;\n  min-width: 2rem;\n  flex-shrink: 0;\n  gap: 0;\n  position: relative;\n}\n\n.filter-row-wrapper {\n  display: flex;\n  flex-direction: row;\n  align-items: center;\n  flex: 1 1 auto;\n  min-width: 0;\n  width: 80%;\n  max-width: 275px;\n}\n\n.filter-label {\n  font-size: 1rem;\n  font-weight: bold;\n  text-transform: uppercase;\n  opacity: 0.6;\n  margin-top: 0;\n  text-align: center;\n  word-break: break-word;\n  white-space: normal;\n  line-height: 1.1;\n  display: none;\n}\n\n.filter-title {\n  font-size: 0.5rem;\n}\n\n.filter-icon {\n  position: relative;\n  height: 1.5rem;\n  width: 1.5rem;\n  cursor: pointer;\n}\n\n/* Ensure badge background appears behind the icon for selected filters */\n.filter-row.selected .filter-icon {\n  z-index: 2;\n  position: relative; \n}\n\n.filter-row.selected .filter-icon > svg {\n  stroke-width: 1.5;\n  scale: 1.2;\n  stroke: currentColor;\n}\n\nbody.theme-light .filter-row.selected .filter-icon > svg {\n  color: black;\n}\n\nbody.theme-dark .filter-row.selected .filter-icon > svg {\n  color: white;\n}\n\n.filter-row.selected .filter-badge {\n  z-index: 0;\n}\n\n  .filter-badge {\n  position: absolute;\n  top: -0.5em;\n  right: -0.9em;\n  width: 1.5em;\n  height: 1.25em;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  pointer-events: none;\n}\n.filter-row.selected .filter-icon::before {\n  content: \"\";\n  position: absolute;\n  top: -0.5em;\n  right: -0.9em;\n  width: 1.5em;\n  height: 1.25em;\n  background-color: var(--badge-bg, #6366f1);\n  border-radius: 9999px;\n  z-index: -10;\n}\n\n.filter-icon {\n  position: relative;\n}\n.filter-icon > svg {\n  scale: 1.15;\n  transform-origin: top left;\n  transition: transform var(--transition-fast);\n}\n\n\n.filter-badge-count {\n  position: relative;\n  z-index: 1;\n  font-size: 10px;\n  font-weight: bold;\n  color: white;\n}\n\n/* Make inactive filter badges smaller and faded */\n.filter-row:not(.selected) .filter-badge {\n  transform: scale(0.85);\n  opacity: 0.75;\n}\n\n/* Enhance the size of the selected filter's badge */\n.filter-row.selected .filter-badge {\n  transform: scale(1.1);\n  font-weight: 700;\n}\n\n.queue-wrapper {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  margin-left: 0.5em;\n  padding-left: 0.5em;\n  width: 48px;\n  position: relative;\n  border-left: 1px solid rgba(0, 0, 0, 0.08);\n}\n\nbody.theme-dark .queue-wrapper {\n  border-left: 1px solid rgba(255, 255, 255, 0.1);\n}\n\n.queue-btn {\n  border: none;\n  background: transparent;\n  box-shadow: none;\n  outline: none;\n  padding: 8px;\n  font-size: 1.2rem;\n  cursor: pointer;\n  opacity: 1;\n  border-radius: 8px;\n  transition: all var(--transition-fast);\n  transform: translate3d(0, 0, 0);\n}\n\n.queue-btn:hover {\n  background: rgba(99, 102, 241, 0.08);\n  transform: scale(1.05) translate3d(0, 0, 0);\n}\n\n.queue-btn:active {\n  transform: scale(0.95) translate3d(0, 0, 0);\n  transition: transform 80ms ease-out;\n}\n\n.settings-refresh-wrapper {\n  display: flex;\n  flex-direction: row;\n  align-items: center;\n  gap: 6px;\n  user-select: none;\n  -webkit-user-select: none;\n  flex-shrink: 0;\n}\n\n.icon-button {\n  border: none;\n  background: transparent;\n  box-shadow: none;\n  outline: none;\n  padding: 6px;\n  font-size: 1.2rem;\n  cursor: pointer;\n  user-select: none;\n  -webkit-user-select: none;\n  opacity: 0.7;\n  border-radius: 8px;\n  transition: all var(--transition-fast);\n  transform: translate3d(0, 0, 0);\n}\n\n.icon-button:hover {\n  background: rgba(0, 0, 0, 0.04);\n  opacity: 1;\n  transform: scale(1.05) translate3d(0, 0, 0);\n}\n\n.icon-button:active {\n  transform: scale(0.95) translate3d(0, 0, 0);\n  transition: transform 80ms ease-out;\n}\n\n \n/* ========== MODULE: Task ========== */\n/* ========== Enhanced Task Styles ========== */\n/* ================================\n   Modern Nesting: Task Styles\n   ================================ */\n .todoist-board .task {\n  background: transparent;\n  border-radius: 0;\n  border: 1px solid transparent;\n  padding-block: 0.75rem;\n  padding-inline: 1rem;\n  display: flex;\n  flex-direction: row;\n  justify-content: stretch;\n  gap: 0.375rem;\n  min-height: 2rem;\n  -webkit-user-select: none;\n  user-select: none;\n  position: relative;\n  outline: none;\n  transition: all var(--transition-spring);\n  will-change: transform, box-shadow;\n  transform: translate3d(0, 0, 0);\n\n  /* --- Modern Nesting for ::before, :focus, :hover, .selected-task --- */\n  &:not(:first-child)::before {\n    content: \"\";\n    position: absolute;\n    left: 42px;\n    right: 0;\n    top: 0;\n    height: 1px;\n    background: linear-gradient(90deg, rgba(0,0,0,0.06) 0%, rgba(0,0,0,0.02) 100%);\n    pointer-events: none;\n    transform: translate3d(0, 0, 0);\n  }\n  &:focus {\n    outline: none !important;\n    box-shadow: none !important;\n  }\n  @media (hover: hover) and (pointer: fine) {\n    &:hover:not(.selected-task) {\n      background: #f9fafb;\n      transform: translateY(-1px) translate3d(0, 0, 0);\n      box-shadow: var(--shadow-light);\n      transition: all var(--transition-fast);\n    }\n  }\n  &.no-transition::before {\n    transition: none !important;\n  }\n  &.freeze-transition {\n    transition: none !important;\n    transform: none !important;\n  }\n  /* --- Completed task row styling --- */\n  &.completed .task-content {\n    text-decoration: line-through;\n    opacity: 0.5;\n    transition: all 0.3s ease;\n  }\n}\n.task-inner p {\n  margin: 0;\n  display: inline;\n}\n .todoist-board .task-inner {\n  display: flex;\n  flex-direction: row;\n  align-items: stretch;\n  gap: 0.75rem;\n  width: 100%;\n  user-select: none;\n  -webkit-user-select: none;\n  -webkit-touch-callout: none;\n  -webkit-tap-highlight-color: transparent;\n  font-size: 0.9rem;\n  touch-action: pan-y;\n  min-height: 2.75rem;\n  position: relative;\n  z-index: 1;\n  /* transition: none !important;\n  animation: none !important; */\n}\n\n .todoist-board .task-content {\n  display: flex;\n  flex: 1;\n}\n\n .todoist-board .task-content-wrapper {\n  position: relative;\n  touch-action: pan-y;\n  display: flex;\n  flex-direction: column;\n  align-items: flex-start;\n  justify-content: flex-start;\n  width: 100%;\n  flex: 1;\n  overflow: visible;\n}\n\n .todoist-board .task-title {\n  position: relative;\n  padding-bottom: 0.85rem;\n  cursor: text;\n  font-size: 0.92rem;\n  will-change: auto;\n  line-height: 1.4;\n  display: block;\n  font-weight: 500;\n  word-break: break-word;\n  white-space: pre-line;\n  color: #111827;\n}\n\nbody.theme-dark .todoist-board .task-title {\n  color: #f9fafb;\n}\n\n .todoist-board .selected-task .task-title {\n  max-height: 1000px;\n  opacity: 1;\n  transition:\n    max-height 500ms cubic-bezier(0.33, 1, 0.68, 1),\n    opacity 280ms ease-in-out;\n}\n\n\n .todoist-board .task-deadline {\n  position: absolute;\n  top: 0.75rem;\n  right: 10px;\n  z-index: 5;\n  opacity: 0.7;\n}\n .todoist-board .selected-task .task-deadline  {\n  opacity: 1;\n  transition: fade-in 1300ms ease-in-out;\n}\n\n .todoist-board .deadline-label {\n  align-self: center;\n}\n/* ========== Enhanced Task Selection ========== */\n/* --- Modern Nesting: Selected Task --- */\n .todoist-board .selected-task {\n  display: flex;\n  flex-direction: row;\n  justify-content: stretch;\n  height: auto;\n  position: relative;\n  z-index: 0;\n  min-height: 4rem;\n  box-shadow:\n   rgba(6, 24, 44, 0.4) 0px 0px 0px 0.1px, \n   rgba(6, 24, 44, 0.65) 0px 4px 4px -3px,\n    rgba(255, 255, 255, 0.08) -3px 1px 0px 0px;\n  transform: scale(1.005) translateY(-2px);\n  border-radius: 12px;\n  border: 1px solid #e5e7eb;\n  margin-block-start: 1rem;\n  margin-block-end: 0.75rem;\n  margin-inline: auto;\n  transition:\n    box-shadow 420ms cubic-bezier(0.25, 0.8, 0.25, 1),\n    transform 400ms cubic-bezier(0.25, 1, 0.5, 1),\n    border 360ms ease,\n    border-radius 360ms ease;\n  /* Improve animation smoothness on mobile and hardware acceleration */\n  will-change: transform, box-shadow, opacity;\n  backface-visibility: hidden;\n  transform: translate3d(0, 0, 0) scale(1.005) translateY(-2px);\n  &::before {\n    display: none;\n  }\n  /* Modern Nesting: Hide ::before on next .task */\n  + .task::before {\n    display: none;\n  }\n}\n\n/* Dim other tasks when a task is selected */\nbody:has(.todoist-board .selected-task) .todoist-board .task:not(.selected-task):not(.subtask-row),\n.queue-focused .todoist-board .task:not(.selected-task):not(.subtask-row) {\n  opacity: 0.5;\n  transition: opacity var(--transition-medium);\n}\n\n\n .todoist-board .task-scroll-wrapper {\n  display: flex;\n  width: 100%;\n}\n/* --- Task Scroll Wrapper for selected-task --- */\n .todoist-board .selected-task .task-scroll-wrapper {\n  display: flex;\n  flex-direction: column;\n  flex: 1 1 auto;\n  overflow-y: auto;\n  max-height: 100%;\n  padding-bottom: 0.5rem;\n  position: relative;\n}\n\n .todoist-board .selected-task .task-inner {\n  flex: 0 0 auto;\n}\n\n\n .todoist-board .selected-task .task-content {\n  flex: 1 1 auto;\n  display: flex;\n  flex-direction: column;\n}\n\n .todoist-board .selected-task .task-content-wrapper {\n  flex: 1 1 auto;\n  display: flex;\n  justify-content: flex-start;\n  flex-direction: column;\n  align-items: stretch;\n  height: 100%;\n  min-height: unset;\n  overflow: visible;\n  padding-bottom: 0.5rem;\n}\n\n .todoist-board .selected-task .task-description,\n .todoist-board .selected-task .task-metadata {\n  flex-grow: 0;\n  flex-shrink: 0;\n  flex-basis: auto;\n}\n\n .todoist-board .selected-task .task-title {\n  flex-shrink: 0;\n}\n\n/* Enhanced selection background */\n\n/* Improved deselection */\n\n .todoist-board .task.no-transition::before {\n  transition: none !important;\n}\n\n/* ========== Enhanced Checkbox Styles ========== */\ninput.todoist-checkbox {\n  /* Hard reset to strip all default or theme-injected visuals */\n  appearance: none;\n  -webkit-appearance: none;\n  -moz-appearance: none;\n  background: none;\n  box-shadow: none;\n  width: 22px;\n  height: 22px;\n  border: 2.5px solid #d1d5db;\n  border-radius: 50%;\n  cursor: pointer;\n  margin-right: 4px;\n  align-self: flex-start;\n  position: relative;\n  display: inline-block;\n  vertical-align: middle;\n  backface-visibility: hidden;\n  z-index: 10;\n  box-shadow: inset 0 1px 2px rgba(0,0,0,0.05);\n}\n\n/* Hide browser default checkmark for all major engines */\ninput.todoist-checkbox::-webkit-checkmark,\ninput.todoist-checkbox::checkmark,\ninput.todoist-checkbox::-ms-check {\n  display: none !important;\n  background: none !important;\n  color: transparent !important;\n}\ninput.todoist-checkbox:checked {\n  background-color: #6366f1;\n  overflow: hidden;\n}\n/* Priority-based checkbox styling */\ninput.todoist-checkbox.priority-4 {\n  background-color: #fee2e2; /* Light red */\n  border-color: #dc2626;     /* Red border */\n}\ninput.todoist-checkbox.priority-3 {\n  background-color: #fef3c7; /* Light amber */\n  border-color: #d97706;     /* Amber border */\n}\ninput.todoist-checkbox.priority-2 {\n  background-color: #dbeafe; /* Light blue */\n  border-color: #2563eb;     /* Blue border */\n}\n\n .todoist-board .selected-task input.todoist-checkbox {\n  max-height: 1000px;\n  opacity: 1;\n  transition:\n    max-height 500ms cubic-bezier(0.33, 1, 0.68, 1),\n    opacity 280ms ease-in-out;\n}\n\n\ninput.todoist-checkbox:hover {\n  border-color: #6366f1;\n  animation: checkbox-check var(--transition-spring) ease-out;\n  transform: scale(1.05);\n  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);\n  z-index: 1000;\n}\n\ninput.todoist-checkbox:active {\n  transform: scale(0.95);\n  transition: transform 80ms ease-out;\n}\n\n\n\ninput.todoist-checkbox:checked::before {\n  content: \"\";\n  position: absolute;\n  transform-origin: center;\n  top: 0;\n  left: 0.5em;\n  width: 5px;\n  height: 10px;\n  border: solid currentColor;\n  border-width: 0 2px 2px 0;\n  transform: rotate(45deg);\n  z-index: 1000;\n}\n\nbody.theme-light input.todoist-checkbox:checked::before {\n  border-color: #1f2937;\n}\n\nbody.theme-dark input.todoist-checkbox:checked::before {\n  border-color: #f9fafb;\n}\n\n/* Always show the checkmark container, but only display the tick visually on hover or checked */\ninput.todoist-checkbox::after {\n  content: none;\n}\n\n/* ========== MODULE: Pills ========== */\n/* ========== Enhanced Pills ========== */\n/* ================================\n   Modern Nesting: Pill Styles\n   ================================ */\n.pill {\n  background: var(--pill-bg);\n  color: var(--pill-text);\n  border-radius: 12px;\n  padding-block: 0.25rem;\n  padding-inline: 0.625rem;\n  font-size: 0.625rem;\n  font-weight: 500;\n  display: inline-block;\n  white-space: nowrap;\n  user-select: none;\n  transition: all var(--transition-fast);\n  box-shadow: 0 1px 2px rgba(0,0,0,0.04);\n  /* Modern Nesting for variants */\n  &.deadline {\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    padding-block: 3px;\n    padding-inline: 8px;\n    font-size: 0.7rem;\n    line-height: 1;\n    min-height: 20px;\n    height: auto;\n    vertical-align: middle;\n  }\n  &.deadline-date {\n    font-weight: 700;\n    font-size: 0.55rem;\n    background: linear-gradient(135deg, #a78bfa, #8b5cf6);\n    color: #fff;\n    opacity: 0.9;\n    box-shadow: 0 2px 8px rgba(124, 58, 237, 0.25);\n    animation: fade-in-slide var(--transition-medium) ease-out;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    line-height: 1;\n    height: auto;\n    min-height: 16px;\n    vertical-align: middle;\n  }\n}\n\n/* --- Grouped Pill Variants with :is() for shared logic --- */\n.pill:is(.today, .overdue, .soon, .future) {\n  color: white;\n  padding-block: 0.2rem;\n  padding-inline: 0.5rem;\n  font-size: 0.6rem;\n  border-radius: 6px;\n  font-weight: 600;\n  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);\n}\n.pill.today {\n  background: linear-gradient(135deg, #3b82f6, #2563eb);\n  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);\n}\n.pill.overdue {\n  background: linear-gradient(135deg, #ef4444, #dc2626);\n  box-shadow: 0 2px 4px rgba(239, 68, 68, 0.3);\n  animation: pulse-urgent 2s ease-in-out infinite;\n}\n.pill.soon {\n  background: linear-gradient(135deg, #f59e0b, #d97706);\n  box-shadow: 0 2px 4px rgba(245, 158, 11, 0.3);\n}\n.pill.future {\n  background: linear-gradient(135deg, #10b981, #059669);\n  box-shadow: 0 2px 4px rgba(16, 185, 129, 0.3);\n}\n\n/* ========== Enhanced Task Metadata ========== */\n .todoist-board .task-description,\n .todoist-board .task-metadata {\n  overflow: hidden;\n  max-height: 0;\n  opacity: 0;\n  transition: \n    max-height var(--transition-medium) cubic-bezier(0.4, 0, 0.2, 1),\n    opacity var(--transition-medium);\n}\n\n .todoist-board .selected-task .task-description,\n .todoist-board .selected-task .task-metadata {\n  max-height: 1000px;\n  opacity: 1;\n  transition: \n    max-height var(--transition-smooth) cubic-bezier(0.4, 0, 0.2, 1),\n    opacity var(--transition-medium);\n}\n\n/* Restrict height and allow scrolling for long descriptions in selected task */\n .todoist-board .selected-task .task-description {\n  max-height: 80px;\n  padding-bottom: 0.5rem;\n  overflow-y: auto;\n  position: relative;\n  background: rgba(255, 239, 213, 0.07);\n}\n\n\n .todoist-board .task-metadata > .pill:not(:first-child):not(.deadline-date) {\n  position: relative;\n  margin-left: 12px;\n  font-weight: inherit;\n}\n\n .todoist-board .task-metadata > .pill:not(:first-child):not(.deadline-date)::before {\n  content: \"\";\n  background: var(--meta-text);\n  display: inline-block;\n  width: 1px;\n  height: 10px;\n  position: absolute;\n  left: -8px;\n  top: 50%;\n  transform: translateY(-50%);\n  margin: 0;\n  vertical-align: middle;\n  opacity: 0.3;\n}\n\n .todoist-board .label-separator {\n  opacity: 0.4;\n  margin: 0 4px;\n}\n\n/* ================================\n   Modern Nesting: Task Metadata\n   ================================ */\n .todoist-board .task-metadata {\n  display: flex;\n  flex-wrap: nowrap;\n  gap: 2px 2px;\n  line-height: 0.9;\n  row-gap: 1px;\n  font-size: 0.6rem;\n  align-items: center;\n  color: var(--meta-text);\n  opacity: 0.8;\n  font-weight: 400;\n  padding: 0.25rem 0 0.5rem 0;\n  position: relative;\n  z-index: 1;\n  white-space: nowrap;\n  overflow: visible;\n  pointer-events: none;\n  transform-origin: top left;\n  animation: fade-in-up var(--transition-spring) ease-out both;\n}\n\n .todoist-board .selected-task .task-metadata {\n  white-space: normal;\n  display: flex;\n  flex-wrap: nowrap;\n  /* Don't override padding-bottom here; let base .task-metadata rule apply */\n}\n\n .todoist-board .selected-task .pill.label-pill {\n  display: flex;\n  flex-wrap: wrap;\n  line-height: 1;\n  padding-right: 2px\n}\n .todoist-board .task-description {\n  position: relative;\n  display: flex;\n  flex-direction: column;\n  align-items: flex-start;\n  justify-content: flex-start;\n  width: 100%;\n  color: #6b7280;\n  font-size: 0.74rem;\n  font-style: italic;\n  opacity: 0.8;\n  max-width: 100%;\n  line-height: 1.4;\n  white-space: pre-line;\n}\n\n \n\n\n\n/* ========== Enhanced Deadline Styles ========== */\n .todoist-board .deadline-wrapper {\n  display: flex;\n  flex-direction: column;\n  align-items: stretch;\n  font-size: 0.6rem;\n  line-height: 1.1;\n  position: relative;\n}\n\n .todoist-board .deadline-label {\n  font-size: 0.5rem;\n  opacity: 0.6;\n  margin-bottom: 4px;\n  transition: opacity var(--transition-fast);\n}\n\n\n/* ========== MODULE: Toolbar & Chin ========== */\n/* ========== Enhanced Mini Toolbar ========== */\n.mini-toolbar {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  padding: 0.375rem 3rem 0.375rem 0.75rem;\n  height: 1.65rem;\n  border-radius: 18px;\n  background: rgba(31, 41, 55, 0.8);\n  color: white;\n  border: none;\n  box-shadow: \n    0 4px 12px rgba(0,0,0,0.15),\n    0 2px 4px rgba(0,0,0,0.1),\n    inset 0 1px 0 rgba(255,255,255,0.1);\n  font-size: 0.75rem;\n  transition: all var(--transition-fast);\n  animation: toolbar-slide-up var(--transition-spring) ease-out;\n  position: relative;\n  width: 60%;\n  max-width: 220px;\n}\n\n.selected-task .mini-toolbar {\n  position: absolute;\n  bottom: 0;\n  left: 50%;\n  transform: translateX(-50%);\n  z-index: 100;\n  pointer-events: auto;\n}\n\n.mini-toolbar-btn {\n  background: transparent;\n  border: none;\n  color: inherit;\n  opacity: 0.85;\n  font-size: 1rem;\n  padding: 4px 8px;\n  border-radius: 8px;\n  cursor: pointer;\n  transition: all var(--transition-fast);\n}\n\n.mini-toolbar-btn svg {\n  width: 16px;\n  height: 16px;\n}\n\n.mini-toolbar .mini-toolbar-btn-wrapper {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  padding: 0;\n  margin: 0;\n}\n\n.mini-toolbar-label {\n  position: absolute;\n  top: 4px;\n  font-size: 0.6rem;\n  opacity: 0.7;\n  text-align: center;\n  line-height: 1.1;\n  pointer-events: none;\n  transition: opacity var(--transition-fast);\n}\n\n.mini-toolbar-btn:hover {\n  opacity: 1;\n  background: rgba(99, 102, 241, 0.08);\n  transform: scale(1.05);\n}\n\n.mini-toolbar-btn:active {\n  transform: scale(0.95);\n  transition: transform 80ms ease-out;\n}\n\n.mini-toolbar-btn:hover + .mini-toolbar-label {\n  opacity: 0.9;\n}\n\n/* ========== Enhanced Dragging States ========== */\n.dragging-row {\n  z-index: 1000;\n  opacity: 0 !important;\n  touch-action: pan-y;\n  box-shadow: none !important;\n  transform: none !important;\n  visibility: hidden !important;\n  position: absolute !important;\n  top: -9999px !important;\n  left: -9999px !important;\n  animation: none !important;\n}\n\n.task-placeholder {\n  display: flex;\n  flex-direction: row;\n  gap: 0.375rem;\n  opacity: 0.4;\n  border: 2px solid rgba(99, 102, 241, 0.3);\n  background: rgba(99, 102, 241, 0.05);\n  border-radius: 8px;\n  pointer-events: none;\n  padding: 4px 12px 8px 22px;\n  transform: scale(0.97) translate3d(0, 0, 0);\n  transition: all var(--transition-medium);\n}\n\n.drag-scroll-block {\n  touch-action: none !important;\n  overflow: hidden !important;\n  -webkit-overflow-scrolling: auto !important;\n}\n\n/* ========== Enhanced Queue Mode ========== */\n.queue-dimmed {\n  opacity: 0.2;\n  will-change: opacity;\n  pointer-events: none;\n  filter: blur(0.5px);\n  transition: all var(--transition-smooth);\n}\n\n.queue-focused {\n  opacity: 1;\n  filter: none;\n  transition: all var(--transition-smooth);\n  will-change: opacity, filter;\n}\n\n.queue-focused-title {\n  font-weight: 550;\n  transform-origin: top left;\n  transform: scale(1.02);\n  color: #374151;\n  transition: all var(--transition-fast);\n  will-change: transform, font-weight, color;\n}\n\n/* ========== Enhanced Loading Overlay ========== */\n.loading-overlay {\n  position: absolute;\n  inset: 0;\n  background: rgba(255, 255, 255, 0.85);\n  backdrop-filter: blur(4px);\n  z-index: 10000;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  pointer-events: none;\n  font-size: 0.9rem;\n  font-weight: 500;\n  animation: fade-in var(--transition-medium) ease-out;\n}\n\n/* ========== Enhanced Settings Modal ========== */\n.filter-icon-row {\n  display: flex;\n  gap: 12px;\n  margin-bottom: 16px;\n  align-items: center;\n  justify-content: center;\n  flex-wrap: wrap;\n}\n\n.settings-label {\n  display: flex;\n  align-items: center;\n  margin-right: 12px;\n  font-weight: 600;\n  font-size: 0.85rem;\n}\n\n.settings-icon-wrapper {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n}\n\n.settings-icon-btn {\n  font-size: 2em;\n  background: transparent;\n  border: 2px solid #e5e7eb;\n  border-radius: 12px;\n  cursor: pointer;\n  width: 48px;\n  height: 48px;\n  transition: all var(--transition-fast);\n}\n\n.settings-icon-btn:hover {\n  transform: scale(1.05);\n  border-color: #d1d5db;\n  box-shadow: var(--shadow-light);\n}\n\n.settings-icon-btn:active {\n  transform: scale(0.98);\n  transition: transform 80ms ease-out;\n}\n\n.settings-icon-btn.active {\n  background: linear-gradient(135deg, #f3f4f6, #ffffff);\n  border: 2px solid #6366f1;\n  color: #6366f1;\n  transform: scale(1.02) translate3d(0, 0, 0);\n  box-shadow: \n    0 0 0 3px rgba(99, 102, 241, 0.1),\n    var(--shadow-medium);\n  animation: settings-select var(--transition-spring) ease-out;\n}\n\n.settings-input-row {\n  margin: 12px 0 8px 0;\n}\n\n.settings-input {\n  margin-left: 8px;\n  width: 60%;\n  padding: 8px 12px;\n  border: 2px solid #e5e7eb;\n  border-radius: 8px;\n  font-size: 0.9rem;\n  transition: all var(--transition-fast);\n  background: white;\n}\n\n.settings-input:focus {\n  outline: none;\n  border-color: #6366f1;\n  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);\n}\n\n.settings-action-row {\n  margin-top: 12px;\n}\n\n.settings-action-btn {\n  margin-right: 12px;\n  padding: 8px 16px;\n  border: 2px solid #e5e7eb;\n  border-radius: 8px;\n  background: white;\n  cursor: pointer;\n  font-weight: 500;\n  transition: all var(--transition-fast);\n  transform: translate3d(0, 0, 0);\n}\n\n.settings-action-btn:hover {\n  border-color: #6366f1;\n  color: #6366f1;\n  transform: translateY(-1px) translate3d(0, 0, 0);\n  box-shadow: var(--shadow-light);\n}\n\n.settings-action-btn:active {\n  transform: translateY(0) translate3d(0, 0, 0);\n  transition: transform 80ms ease-out;\n}\n\n.settings-save-row {\n  margin-top: 24px;\n}\n\n/* ========== MODULE: Filter Bar ========== */\n/* ========== Enhanced Filter Bar ========== */\n.filter-bar {\n  display: flex;\n  flex-direction: row;\n  align-items: center;\n  justify-content: space-between;\n  gap: 1em;\n  padding: 1rem 0.875rem 0.875rem 0.875rem;\n  flex-wrap: nowrap;\n  overflow-x: auto;\n  overflow-y: hidden;\n  width: 100%;\n  scrollbar-width: none;\n  -ms-overflow-style: none;\n}\n\n.filter-bar::-webkit-scrollbar {\n  display: none;\n}\n\n/* ========== Enhanced Utilities ========== */\n.hidden-datetime-picker {\n  position: fixed;\n  left: -9999px;\n  opacity: 0;\n  pointer-events: none;\n}\n\n.project-hash {\n  font-weight: 500;\n  font-size: 0.625rem;\n  display: inline-block;\n  white-space: nowrap;\n  user-select: none;\n  transition: all var(--transition-fast);\n}\n\n.icon-picker-wrapper {\n  display: none;\n}\n\n.icon-picker-wrapper.visible {\n  display: grid;\n  grid-template-columns: repeat(5, 36px);\n  justify-items: center;\n  align-items: center;\n  gap: 8px;\n  position: absolute;\n  z-index: 1000;\n  background: white;\n  border: 1px solid #e5e7eb;\n  border-radius: 12px;\n  padding: 12px;\n  box-shadow: var(--shadow-heavy);\n  top: 48px;\n  left: 50%;\n  transform: translateX(-50%);\n  min-width: 220px;\n  min-height: 360px;\n  overflow-y: auto;\n  animation: fade-in-scale var(--transition-spring) ease-out;\n}\n\n.task.freeze-transition {\n  transition: none !important;\n  transform: none !important;\n}\n\n/* ========== MODULE: Animations ========== */\n/* ========== Enhanced Sync Animation ========== */\n\n@keyframes toolbar-slide-up {\n  0% {\n    opacity: 0;\n    transform: translateX(-50%) translateY(12px) scale(0.95) translate3d(0, 0, 0);\n  }\n  100% {\n    opacity: 1;\n    transform: translateX(-50%) translateY(0) scale(1) translate3d(0, 0, 0);\n  }\n}\n\n@keyframes settings-select {\n  0% {\n    transform: scale(1) translate3d(0, 0, 0);\n  }\n  50% {\n    transform: scale(1.08) translate3d(0, 0, 0);\n  }\n  100% {\n    transform: scale(1.02) translate3d(0, 0, 0);\n  }\n}\n\n@keyframes fade-in {\n  0% {\n    opacity: 0;\n  }\n  100% {\n    opacity: 1;\n  }\n}\n\n\n\n@keyframes fade-in-scale {\n  from {\n    opacity: 0;\n    transform: translateX(-50%) scale(0.95) translate3d(0, 0, 0);\n  }\n  to {\n    opacity: 1;\n    transform: translateX(-50%) scale(1) translate3d(0, 0, 0);\n  }\n}\n\n\n\n@keyframes indicator-slide {\n  from {\n    opacity: 0;\n    transform: translateX(-50%) translateY(-50%) scale(0.8) translate3d(0, 0, 0);\n  }\n  to {\n    opacity: 1;\n    transform: translateX(-50%) translateY(-50%) scale(1) translate3d(0, 0, 0);\n  }\n}\n\n@keyframes pulse-urgent {\n  0%, 100% {\n    opacity: 0.9;\n    transform: scale(1);\n  }\n  50% {\n    opacity: 1;\n    transform: scale(1.02);\n  }\n}\n\n@keyframes spin {\n  0% {\n    transform: rotate(0deg);\n  }\n  100% {\n    transform: rotate(360deg);\n  }\n}\n\n.fade-in {\n  animation: fade-in-up var(--transition-fast) ease-out both;\n}\n\n/* ========== Mobile Responsiveness ========== */\n/* ========== MODULE: Mobile Responsiveness ========== */\n@media only screen and (max-width: 600px) {\n  .markdown-preview-section[data-language=\"todoist-board\"] {\n    padding: 0 !important;\n    margin: 0 !important;\n  }\n  \n  .todoist-board .task {\n    font-size: 0.85rem;\n    -webkit-user-select: none !important;\n    user-select: none !important;\n    -webkit-touch-callout: none !important;\n    padding: 0.875rem 0.125rem 0.5rem 1rem;\n  }\n  \n  .task-placeholder, .dragging-row {\n    -webkit-user-select: none;\n    user-select: none;\n    -webkit-touch-callout: none;\n  }\n  \n  .pill {\n    font-size: 0.6rem;\n    padding: 0.2rem 0.5rem;\n  }\n\n  .todoist-board .task-inner {\n    touch-action: pan-y !important;\n  }\n  \n  .list-toolbar {\n    border-radius: 12px;\n  }\n  \n  .filter-btn {\n    padding: 4px;\n  }\n  \n  .mini-toolbar {\n    border-radius: 16px;\n    padding: 0.25rem 0.625rem;\n    height: 2rem;\n  }\n\n  .list-view {\n    padding-left: 0;\n    padding-right: 0;\n  }\n  \n  /* Disable hover effects on mobile */\n  .todoist-board .task:hover:not(.selected-task) {\n    transform: translate3d(0, 0, 0);\n    background: transparent;\n    box-shadow: none;\n  }\n  \n  .filter-btn:hover,\n  .queue-btn:hover,\n  .icon-button:hover {\n    transform: translate3d(0, 0, 0);\n    background: transparent;\n  }\n\n\n  .todoist-board .selected-task .task-metadata {\n    padding-bottom: 0.5rem;\n    margin-bottom: 1rem;\n  }\n  .todoist-board .selected-task .task-description {\n    max-height: none;\n    overflow-y: visible;\n    margin-bottom: 0.5rem;\n  }\n}\n\n@media only screen and (max-width: 768px) {\n  .markdown-preview-view .cm-preview-code-block.cm-embed-block.cm-lang-todoist-board,\n  .markdown-source-view.mod-cm6 .block-language-todoist-board.todoist-board,\n  .markdown-rendered .block-language-todoist-board.todoist-board,\n  .cm-preview-code-block.cm-embed-block.markdown-rendered.cm-lang-todoist-board,\n  .view-content .block-language-todoist-board.todoist-board.cm-embed-block.cm-lang-todoist-board {\n    position: relative;\n    left: 50%;\n    transform: translateX(-50%);\n    transform-origin: top left;\n    width: 100vw !important;\n    max-width: 100vw !important;\n    padding: 0 !important;\n    margin: 0 !important;\n    border-radius: 0 !important;\n    box-sizing: border-box;\n    overflow-x: hidden;\n  }\n\n  /* Reading Mode: fix horizontal scroll and alignment */\n  .markdown-rendered .block-language-todoist-board.todoist-board.reading-mode {\n    position: relative;\n    left: 50%;\n    transform: translateX(-50%);\n    width: 100vw !important;\n    max-width: 100vw !important;\n    margin: 0 !important;\n    padding: 0 !important;\n    overflow-x: hidden;\n  }\n\n  .filter-button-wrapper {\n    display: flex;\n    flex-direction: column;\n    align-items: center;\n    width: 55%;\n    max-width: 60%;\n  }\n}\n\n/* ========== Accessibility & Motion ========== */\n@media (prefers-reduced-motion: reduce) {\n  *,\n  *::before,\n  *::after {\n    animation-duration: 0.01ms !important;\n    animation-iteration-count: 1 !important;\n    transition-duration: 0.01ms !important;\n  }\n  \n  .todoist-board .task:hover:not(.selected-task) {\n    transform: translate3d(0, 0, 0);\n  }\n  \n  \n  .pill.overdue {\n    animation: none;\n  }\n}\n\n/* ========== Focus Management ========== */\n .todoist-board .task:focus-visible {\n   outline: 2px solid #6366f1;\n   outline-offset: 2px;\n }\n\n.filter-btn:focus-visible,\n.queue-btn:focus-visible,\n.icon-button:focus-visible {\n  outline: 2px solid #6366f1;\n  outline-offset: 2px;\n}\n\n\n\n/* ========== MODULE: Dark Theme ========== */\nbody.theme-dark {\n  --pill-bg: #374151;\n  --pill-text: #d1d5db;\n  --meta-text: #9ca3af;\n}\n\nbody.theme-dark .list-toolbar {\n  background: transparent;\n  border: 1px solid rgba(55, 65, 81, 0.3);\n  /* Inset effect for dark theme toolbar */\n  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.05),\n              inset 0 -1px 2px rgba(0, 0, 0, 0.04);\n  transition: background-color 0.2s ease;\n}\nbody.theme-dark .list-toolbar.sticky {\n  background-color: #1e1e1e;\n  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.05),\n              inset 0 -1px 2px rgba(0, 0, 0, 0.04),\n              0 1px 4px rgba(0, 0, 0, 0.15);\n}\n\nbody.theme-dark .todoist-board .task {\n  color: #f9fafb;\n}\n\nbody.theme-dark .todoist-board .task:hover:not(.selected-task) {\n  background: #1f2937;\n}\n\n\nbody.theme-dark .todoist-board .task::before {\n  background: linear-gradient(90deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%);\n}\n\nbody.theme-dark .settings-input,\nbody.theme-dark .settings-action-btn {\n  background: #374151;\n  border-color: #4b5563;\n  color: #f9fafb;\n}\n\nbody.theme-dark .icon-picker-wrapper.visible {\n  background: #1f2937;\n  border-color: #374151;\n}\n\nbody.theme-dark .todoist-board .task {\n  background: transparent;\n  color: #f9fafb;\n}\n\nbody.theme-light .todoist-board .task {\n  color: #111827;\n}\n\nbody.theme-dark .todoist-board .task:hover:not(.selected-task) {\n  background: #1f2937;\n  box-shadow: 0 1px 3px rgba(0,0,0,0.4);\n}\n\n/* ========== iOS/Safari Fixes ========== */\n .todoist-board .task.dragging-row {\n   touch-action: none !important;\n   user-select: none !important;\n   -webkit-user-select: none !important;\n   -webkit-touch-callout: none !important;\n }\n\n.list-view.drag-scroll-block {\n  touch-action: none !important;\n  user-select: none !important;\n  -webkit-user-select: none !important;\n  -webkit-touch-callout: none !important;\n}\n\nbody.drag-disable {\n  position: fixed !important;\n  overflow: hidden !important;\n  touch-action: none !important;\n  -webkit-user-select: none !important;\n  user-select: none !important;\n  -webkit-touch-callout: none !important;\n}\n/* --- Checkbox completion animation --- */\n .todoist-board .task-checked-anim {\n   transition: transform 0.2s ease;\n   transform: scale(0.96);\n }\n /* --- Completed task row styling --- */\n .todoist-board .task.completed .task-content {\n   text-decoration: line-through;\n   opacity: 0.5;\n   transition: all 0.3s ease;\n }\n/* --- Icon grid for settings --- */\n/* Icon picker trigger and popup */\n.icon-trigger {\n  position: relative;\n  box-sizing: border-box;\n}\n\n/* --- Icon grid for settings --- */\n/* --- Improved Icon Picker Grid Layout --- */\n\n.icon-grid-btn {\n  width: 36px;\n  height: 36px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  padding: 0;\n  margin: 0;\n}\n.icon-picker-wrapper .icon-grid-btn {\n  background: none;\n  border: none;\n  cursor: pointer;\n  transition: transform 0.1s ease;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  overflow: visible;\n}\n.icon-picker-wrapper .icon-grid-btn:hover {\n  transform: scale(1.1);\n}\n.icon-picker-wrapper .icon-grid-btn.selected {\n  border-color: #007aff;\n  background-color: #e6f0ff;\n}\n.icon-grid-btn svg {\n  width: 20px;\n  height: 20px;\n  overflow: visible;\n}\n/* --- Icon color picker row --- */\n.icon-color-row {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 6px;\n  justify-content: center;\n  align-items: center;\n  padding: 6px 6px;\n  border-top: 1px solid #eee;\n  margin-top: 6px;\n  width: 100%;\n  box-sizing: border-box;\n  grid-column: 1 / -1;\n}\ninput .icon-color-picker {\n  width: 28px;\n  height: 24px;\n}\n\n/* --- Settings save row spacing --- */\n.settings-save-row {\n  display: flex;\n  gap: 8px;\n  align-items: center;\n  justify-content: flex-start;\n  margin-top: 12px;\n}\n\n/* --- Icon button style --- */\n.icon-button {\n  background: none;\n  border: none;\n  padding: 4px;\n  cursor: pointer;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.icon-color-swatch {\n  width: 20px;\n  height: 20px;\n  border-radius: 50%;\n  cursor: pointer;\n  border: 2px solid white;\n  box-shadow: 0 0 0 1px #ccc;\n}\n.icon-color-swatch:hover {\n  box-shadow: 0 0 0 2px #888;\n}\n/* ================================\n   Modern Nesting: Non-task Note\n   ================================ */\n/* ================================\n   Modern Nesting: Non-task Note\n   ================================ */\n.non-task-note, .non-task-note .task-title {\n  font-size: 1rem;\n  font-weight: 600;\n  color: #1f2937; /* dark gray for visibility */\n  padding-inline: 1rem;\n  margin-block: 0.5rem;\n  margin-inline: 0;\n  background: none;\n  border: none !important;\n  white-space: pre-wrap;\n  word-break: break-word;\n  opacity: 1;\n}\n\nbody.theme-dark .non-task-note {\n  color: #f9fafb;\n  border: none !important;\n}\n\n.non-task-note .chin-inner {\n  height: 0.1rem;\n}\n.non-task-note.selected-task { \n  border: none;\n  box-shadow: none;\n  margin-bottom: 2rem;\n}\n\n/* ========== Hide metadata and description for non-task notes ========== */\n.non-task-note .task-metadata,\n.non-task-note .task-description, .non-task-note .todoist-checkbox {\n  display: none !important;\n  max-height: 0 !important;\n  opacity: 0 !important;\n  padding: 0 !important;\n  margin: 0 !important;\n}\n\n.non-task-note {\n  min-height: 4rem;\n  padding-bottom: 0.5rem;\n}\n.non-task-note .task-content-wrapper {\nposition: absolute;\nbottom: -1rem;\n}\n.non-task-note .task-title {\n  color: #374151;\n}\n\n.task-placeholder .mini-toolbar {\n  display: none !important;\n}\n\n\n\n/* ========== Custom Mini Toolbar Layout ========== */\n\n/* ========== Custom Mini Toolbar Layout ========== */\n/* Mini-toolbar is centered in its wrapper, with delete button outside */\n\n#mini-toolbar-wrapper {\n  position: absolute;\n  bottom: 0;\n  left: 0;\n  width: 100%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  z-index: 100;\n  pointer-events: auto;\n  /* Prevents click-through, matches JS */\n}\n\n#mini-toolbar-wrapper .mini-toolbar {\n  margin: 0 auto;\n}\n\n/* Hide delete button by default, only show when selected-task is active */\n\n.selected-task .mini-toolbar-wrapper .circle-btn.delete-btn {\n  display: flex;\n  position: absolute;\n  right: 0;\n  transform-origin: center;\n  transform: scale(1.25);\n  z-index: 10;\n  color: #fefefe;\n  background-color: rgb(48, 48, 48);\n  opacity: 1;\n  border-radius: 999px;\n  padding: 4px 0;\n  transition: none !important;\n}\n.selected-task .mini-toolbar-wrapper .circle-btn.delete-btn:hover {\n  color: red;\n}\n.mini-toolbar-dates-wrapper {\n  display: flex;\n  gap: 0.5rem;\n}\n\n.mini-toolbar .date-btn {\n\n  border-radius: 6px;\n  padding: 4px 10px;\n  font-weight: 500;\n  font-size: 0.75rem;\n  transition: all var(--transition-fast);\n}\n\n.mini-toolbar .date-btn:hover {\n  background: rgba(99, 102, 241, 0.08);\n  transform: scale(1.05);\n}\n\n.mini-toolbar .circle-btn {\n  border-radius: 999px;\n  padding: 4px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  transition: all var(--transition-fast);\n}\n\n.mini-toolbar .circle-btn:hover {\n  background: rgba(99, 102, 241, 0.08);\n  transform: scale(1.05);\n}\n.mini-toolbar-wrapper {\n  position: relative;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  margin-top: 8px;\n  padding: 0 !important;\n}\n\n\n.icon-button.refresh-btn.syncing > svg {\n  animation: spin 1s linear infinite;\n  transform-origin: center;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n}\n/* ========== Chin-Style Mini Toolbar ========== */\n\n.fixed-chin {\n  display: none;\n  position: relative;\n  width: 100%;\n  padding: 0.5rem 1rem 0.5rem;\n  align-items: flex-end;\n  justify-content: flex-start;\n  flex-direction: column;\n}\n\n.selected-task .fixed-chin {\n  display: flex;\n  margin-top: 0.5rem;\n}\n\n\n.chin-inner {\n  display: none;\n}\n\n.selected-task .chin-inner {\n  display: flex;\n  gap: 0.25rem;\n  border-top: 1px solid rgba(0, 0, 0, 0.05);\n  margin-top: 1rem;\n  width: 100%;\n  justify-content: flex-start;\n  flex-wrap: wrap;\n  background-color: rgba(243, 244, 246, 0.2); /* light gray background */\n  border-radius: 6px;\n  padding: 0.5rem 0.75rem;\n}\nbody.theme-dark .selected-task .chin-inner {\n  background-color: var(--background-primary);\n  border-radius: 12px;\n}\n\n.chin-btn {\n  display: inline-flex;\n  align-items: center;\n  gap: 4px;\n  padding: 4px 8px;\n  border: 1px solid rgba(0, 0, 0, 0.1);\n  border-radius: 6px;\n  background: white;\n  color: #374151;\n  font-size: 0.7rem;\n  font-weight: 500;\n  cursor: pointer;\n  box-shadow: none !important;\n  transition: all var(--transition-fast);\n}\n\n\n.chin-btn:hover {\n  background: #f3f4f6;\n  border-color: #d1d5db;\n}\n\n.chin-btn:active {\n  background: #e5e7eb;\n  transform: scale(0.97);\n}\n\n.chin-btn:focus-visible {\n  outline: 2px solid #6366f1;\n  outline-offset: 2px;\n}\n\nbody.theme-dark .chin-btn {\n  background: #1f2937;\n  border-color: #374151;\n  color: #f9fafb;\n}\n\nbody.theme-dark .chin-btn:hover {\n  background: #374151;\n  border-color: #4b5563;\n}\n\n/* Chin-Style Button Customizations for Selected Task */\n.selected-task .mini-toolbar-wrapper .delete-btn {\n  color: red;\n  right: 0;\n  margin-left: auto;\n}\n.selected-task .mini-toolbar-wrapper .delete-btn .lucide {\n  stroke: red;\n}\n.selected-task .edit-btn svg {\n  stroke: #FDB600; \n}\n.selected-task .tomorrow-btn svg {\n  stroke: #a176e6;\n}\n.selected-task .today-btn svg {\n  stroke: #0764fa; \n}\n.selected-task .mini-toolbar .today-btn .date-subtitle {\n  font-size: 0.5rem;\n  color: #9ca3af;\n  margin-top: 2px;\n  display: block;\n}\n\n/*=========================== Misc. ===========================*/\n\n\n.selected-task .task-metadata {\n  animation: none;\n}\n/* ========== Always show trash/delete SVG icon in settings modal ========== */\n.settings-filter-table .icon-button svg {\n  width: 16px;\n  height: 16px;\n  fill: none;\n  display: inline-block;\n  opacity: 1;\n  visibility: visible;\n}\n/* ========== Filter Badge Z-Index Fix ========== */\n.filter-badge span,\n.filter-badge svg {\n  position: relative;\n  z-index: 2;\n}\n/* Container Query Example for .task */\n@container style (max-width: 500px) {\n  .task {\n    font-size: 0.8rem;\n  }\n}\n\n/* --- Settings filter table styling --- */\n.settings-filter-table th,\n.settings-filter-table td {\n  padding: 4px 6px;\n  vertical-align: middle;\n}\n\n.settings-filter-table input[type=\"text\"] {\n  padding: 3px 5px;\n  font-size: 0.85em;\n}\n\n.settings-filter-table td:nth-child(4) {\n  text-align: center;\n  vertical-align: middle;\n}\n.settings-filter-table input[type=\"radio\"] {\n  transform: scale(1.3);\n  margin: 0;\n}\n\n.settings-filter-table button {\n  padding: 4px 8px;\n  font-size: 1em;\n  cursor: pointer;\n}\n\n/* Constrain the width of the Title column in the settings filter table */\n.settings-filter-table td:nth-child(2) input[type=\"text\"] {\n  max-width: 160px;\n}\n\n/* --- Icon dropdown styling --- */\n.icon-dropdown {\n  margin-left: 6px;\n  font-size: 1.1em;\n  padding: 2px 4px;\n  border-radius: 5px;\n  border: 1px solid #ccc;\n  vertical-align: middle;\n  background: #fff;\n  min-width: 38px;\n}\n/* ========== Smooth Deselection Transition ========== */\n.deselecting {\n  opacity: 0.6;\n  transform: scale(0.99) translateY(1px);\n  transition:\n    opacity 300ms ease,\n    transform 300ms ease;\n  z-index: 0;\n}\n\n\n/* ========== Task Modal: Flatter Things 3 Style ========== */\n.todoist-edit-task-modal .modal-content {\n  display: flex;\n  justify-content: center;\n  padding: 0;\n  max-width: 100%;\n}\n\n.todoist-edit-task-modal .taskmodal-wrapper {\n  background: var(--modal-bg, #f9f9fb);\n  border-radius: 12px;\n  padding: 1rem;\n  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);\n  display: flex;\n  flex-direction: column;\n  gap: 1rem;\n  min-width: 260px;\n  font-size: 0.85rem;\n  width: 100%;\n}\nbody.theme-dark .todoist-edit-task-modal .taskmodal-wrapper {\n  background-color: #1e1e1e;\n}\n\n/* --- Task Modal Fields --- */\n\n.todoist-edit-task-modal .taskmodal-title-field,\n.todoist-edit-task-modal .taskmodal-description-field,\n.todoist-edit-task-modal .taskmodal-date-field,\n.todoist-edit-task-modal .taskmodal-project-field,\n.todoist-edit-task-modal .taskmodal-labels-field {\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n}\n\n.todoist-edit-task-modal .taskmodal-date-label,\n.todoist-edit-task-modal .taskmodal-project-label,\n.todoist-edit-task-modal .taskmodal-labels-label {\n  font-size: 0.65rem;\n  font-weight: 500;\n  color: #6b7280;\n}\n\n.todoist-edit-task-modal .taskmodal-title-input {\n  border: none;\n  background: #fff;\n  border-radius: 6px;\n  border-bottom: 1px solid #e0e0e0;\n  padding: 3px 3px;\n  font-size: 0.9rem;\n  width: 100%;\n}\n.todoist-edit-task-modal .taskmodal-title-input:focus {\n  outline: none;\n  border-color: #6366f1;\n}\n\n.todoist-edit-task-modal .taskmodal-description-input {\n  border: none;\n  background: #fff;\n  border-radius: 6px;\n  border-bottom: 1px solid #e0e0e0;\n  padding: 3px 3px;\n  font-size: 0.9rem;\n  resize: vertical;\n  min-height: 4rem;\n}\n.todoist-edit-task-modal .taskmodal-description-input:focus {\n  outline: none;\n  border-color: #6366f1;\n}\n\n.todoist-edit-task-modal .taskmodal-date-input {\n  border: none;\n  background: #fff;\n  border-radius: 6px;\n  border-bottom: 1px solid #e0e0e0;\n  padding: 3px 0;\n  font-size: 0.9rem;\n  text-align: center;\n}\n.todoist-edit-task-modal .taskmodal-date-input:focus {\n  outline: none;\n  border-color: #6366f1;\n}\n\n.todoist-edit-task-modal .taskmodal-labels-select {\n  padding: 4px 6px;\n  font-size: 0.8rem;\n  border: 1px solid #e5e7eb;\n  border-radius: 6px;\n  background: #fff;\n  min-height: 60px;\n  max-height: 120px;\n  overflow-y: auto;\n  resize: vertical;\n  box-shadow: inset 0 1px 2px rgba(0,0,0,0.05);\n}\n\n.todoist-edit-task-modal .taskmodal-label-list {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 0.25rem;\n}\n\n.todoist-edit-task-modal .taskmodal-label-checkbox {\n  background: #eee;\n  border-radius: 6px;\n  padding: 4px 8px;\n  font-size: 0.7rem;\n  display: flex;\n  align-items: center;\n  gap: 3px;\n}\n\n/* === Enhanced Date Input Styling for Task Modal === */\n.todoist-edit-task-modal .taskmodal-date-input-row {\n  display: flex;\n  align-items: center;\n  gap: 0.4rem;\n}\n\n.todoist-edit-task-modal .taskmodal-date-input-row input[type=\"date\"] {\n  flex: 1;\n  min-width: 0;\n  text-align: center;\n  height: 2rem;\n}\n\n.todoist-edit-task-modal .taskmodal-date-input-row input[type=\"date\"]:first-child {\n  border-radius: 6px 0 0 6px;\n}\n\n.todoist-edit-task-modal .taskmodal-date-input-row input[type=\"date\"]:last-child {\n  background-color: #ede9fe;\n  border-radius: 0 6px 6px 0;\n  color: #6b21a8;\n  font-weight: 600;\n}\n\n.todoist-edit-task-modal .taskmodal-date-input-row input[type=\"date\"]:hover {\n  background-color: hsl(0, 0, 0.3);\n}\n\n.todoist-edit-task-modal .taskmodal-button-row {\n  display: flex;\n  justify-content: flex-end;\n  gap: 0.25rem;\n  margin-top: 0.5rem;\n}\n\n.todoist-edit-task-modal .taskmodal-button-save {\n  background: linear-gradient(135deg, #6366f1, #4338ca);\n  color: white;\n  font-weight: 500;\n  padding: 0.4rem 0.75rem;\n  border-radius: 6px;\n  border: none;\n  font-size: 0.8rem;\n}\n\n.todoist-edit-task-modal .taskmodal-button-cancel {\n  color: #6b7280;\n  border: 1px solid #d1d5db;\n  background: #f9fafb;\n  border-radius: 6px;\n  padding: 0.4rem 0.75rem;\n  font-size: 0.8rem;\n}\n/* ========== Hamburger Dropdown Styles ========== */\n.menu-dropdown {\n  position: absolute;\n  top: 2.5rem;\n  right: 0;\n  background: white;\n  border: 1px solid #ddd;\n  border-radius: 8px;\n  box-shadow: var(--shadow-medium);\n  padding: 0.5rem 0;\n  min-width: 150px;\n  z-index: 2000;\n  animation: fade-in-scale var(--transition-spring) ease-out;\n}\n\n.menu-dropdown-item {\n  padding: 0.5rem 1rem;\n  font-size: 0.875rem;\n  cursor: pointer;\n  transition: background var(--transition-fast);\n  white-space: nowrap;\n}\n\n.menu-dropdown-item:hover {\n  background: rgba(99, 102, 241, 0.08);\n}\n\n.menu-dropdown.hidden {\n  display: none;\n}\n\nbody.theme-dark .menu-dropdown {\n  background: #1f2937;\n  border-color: #374151;\n}\n\nbody.theme-dark .menu-dropdown-item {\n  color: #f9fafb;\n}\n\nbody.theme-dark .menu-dropdown-item:hover {\n  background: rgba(255, 255, 255, 0.05);\n}\n\nbody > div.app-container > div.horizontal-main-container > div > div.workspace-split.mod-vertical.mod-root > div > div.workspace-tab-container > div > div > div.view-content > div.markdown-source-view.cm-s-obsidian.mod-cm6.node-insert-event.is-readable-line-width.is-live-preview.is-folding > div > div.cm-scroller > div.cm-sizer > div.cm-contentContainer > div > div.cm-preview-code-block.cm-embed-block.markdown-rendered.cm-lang-todoist-board {\n  border: none;\n  box-shadow: none;\n}\n/* ========== Enlarge and Thicken Focus/Queue and Add Task Icons ========== */\n.queue-btn svg,\n.add-task-btn svg {\n  width: 24px;\n  height: 24px;\n  stroke-width: 2;\n  stroke: currentColor;\n}\n\n.queue-btn,\n.add-task-btn {\n  color: #1f2937; /* dark gray for light theme */\n}\n\nbody.theme-dark .queue-btn,\nbody.theme-dark .add-task-btn {\n  color: #f9fafb; /* light gray for dark theme */\n}\n/* ========== Reading Mode Layout Fix ========== */\n.markdown-reading-view .block-language-todoist-board.todoist-board {\n  all: unset;\n  display: block;\n  padding: 0;\n  margin: 0;\n}\n.change-indicator {\n  display: inline-block;\n  position: absolute;\n  bottom: 4px;\n  right: 4px;\n  width: 8px;\n  height: 8px;\n  border-radius: 50%;\n  background-color: orange;\n  opacity: 0.8;\n  z-index: 10;\n  pointer-events: none;\n}\n\n@keyframes pulse {\n  0% {\n    transform: scale(1);\n    opacity: 0.7;\n  }\n  50% {\n    transform: scale(1.2);\n    opacity: 1;\n  }\n  100% {\n    transform: scale(1);\n    opacity: 0.7;\n  }\n}\n\n\n\n/* ========== Subtask Visual Hierarchy ========== */\n/* ========== Subtask Row Compact Design ========== */\n/* ========== Subtask Row Compact Design with Expansion Toggle ========== */\n/* ========== Subtask Row Compact Design ========== */\n.subtask-row {\n  padding: 0 !important;\n  margin: 0 0 0 1rem;\n  border: none;\n  background: transparent;\n  border-radius: 0;\n  line-height: 1.2;\n  max-height: 2.2rem;\n  display: flex;\n  align-items: center;\n}\n.subtask-row .task-metadata,\n.subtask-row .task-description {\n  display: none !important;\n  max-height: 0 !important;\n  opacity: 0 !important;\n  padding: 0 !important;\n  margin: 0 !important;\n}\n\n/* Compact subtask title and checkbox alignment */\n.subtask-row .task-title {\n  font-size: 0.78rem;\n  padding: 0;\n  margin: 0;\n}\n\n.subtask-row input.todoist-checkbox {\n  margin-right: 6px;\n  width: 18px;\n  height: 18px;\n}\n\n.subtask-row.expanded-subtask {\n  max-height: 5rem !important;\n}\n\n/* ========== Subtask Visibility ========== */\n.subtask-wrapper {\n  display: none;\n}\n\n.selected-task .subtask-wrapper {\n  display: flex;\n  flex-direction: column;\n  gap: 0;\n  margin-top: 0.25rem;\n  width: 95%;\n  overflow: visible;\n  max-height: unset;\n}\n.subtask-wrapper .task-scroll-wrapper {\n  overflow-y: hidden;\n}\n.subtask-row::before { \n  position: absolute;\n  top: -0.25rem;\n}\n\nbody.theme-dark .subtask-row {\n  border-left: 2px solid #374151;\n}\n/* Hide metadata in subtasks unless selected */\n.subtask-row .task-meta {\n  display: none;\n}\n\n.subtask-row.selected .task-meta {\n  display: flex;\n}\n/* Hide <small> elements in unselected subtasks */\n.subtask-row:not(.selected) small {\n  display: none;\n}\n\n/* ========== Parent Task Visual Distinction ========== */\n.task.parent-task {\n  position: relative;\n}\n\n.task.parent-task .parent-icon {\n  position: absolute;\n  padding-left: 0.5rem;\n  bottom: 0.75rem;\n  opacity: 0.3;\n  transition: opacity 0.3s ease;\n  width: 16px;\n  height: 16px;\n}\n\n.task.parent-task.selected-task .parent-icon {\n  opacity: 0;\n}\n\n .todoist-board .task-description:empty,\n .todoist-board .task-metadata:empty {\n   display: none !important;\n   max-height: 0 !important;\n   opacity: 0 !important;\n   padding: 0 !important;\n   margin: 0 !important;\n }\n .todoist-board .task-description .desc-empty {\n   display: none;\n }\n .todoist-board .date-subtitle {\n display: none;\n }\n\n.menu-dropdown-item {\n  display: flex;\n  align-items: center;\n}\n\n.menu-dropdown-item svg {\n  vertical-align: middle;\n  margin-right: 8px;\n}\n/* Subtask checkbox style */\n\n\n/* ========== Custom cursor for task, selected-task, and add-task-btn ========== */\n .todoist-board .task,\n .todoist-board .selected-task,\n .add-task-btn {\n   cursor: pointer;\n }\n.empty-filter {\n  font-size: 0.85rem;\n  font-style: italic;\n  color: #9ca3af;\n  text-align: center;\n  padding: 2rem 1rem;\n  opacity: 0.75;\n  max-width: 80%;\n  margin: 2rem auto;\n  line-height: 1.5;\n}\n\nbody.theme-dark .empty-filter {\n  color: #d1d5db;\n  opacity: 0.7;\n}\n\n/* Compact mode styles for todoist-board, including reading mode */\n/* Compact mode styles for todoist-board-list, including reading mode */\n/* Compact mode styles for list-wrapper, including reading mode */\n.list-wrapper.compact-mode .task:not(.selected-task) {\n  max-height: 3rem;\n  overflow: hidden;\n  border-left: 4px solid var(--project-color, #e5e7eb);\n  padding-left: 0.75rem;\n}\n.list-wrapper.compact-mode .task:not(.selected-task) .task-metadata,\n.list-wrapper.compact-mode .task:not(.selected-task) .task-description {\n  display: none !important;\n  max-height: 0 !important;\n  opacity: 0 !important;\n  padding: 0 !important;\n  margin: 0 !important;\n}\n.menu-dropdown-wrapper {\n  position: relative;\n  overflow: visible;\n}\n\n.menu-dropdown {\n  position: absolute;\n  z-index: 1000;\n  top: 100%;\n  right: 0;\n}\n/* For dark theme, apply to .taskmodal-wrapper and .taskmodal-labels-select */\nbody.theme-dark .todoist-edit-task-modal .taskmodal-labels-select {\n  background-color: transparent;\n  border-color: #4b5563;\n  color: #f9fafb;\n}\n\n/* ========== Task Modal: Project & Date Row Layout ========== */\n.todoist-edit-task-modal .taskmodal-row {\n  display: flex;\n  gap: 0.75rem;\n  width: 100%;\n}\n\n.todoist-edit-task-modal .taskmodal-project-field,\n.todoist-edit-task-modal .taskmodal-date-field {\n  flex: 1;\n}\n\n/* Match select-project height for the date picker */\ninput.taskmodal-date-input {\n  height: 2rem;\n}\n/* Dark mode: make the label pills use the dark bg/text vars */\nbody.theme-dark .todoist-edit-task-modal .taskmodal-label-checkbox {\n  background: var(--pill-bg);\n  color: var(--pill-text);\n}\n/* Mobile keyboard-safe modal alignment */\n  .todoist-edit-task-modal .modal-content {\n    /* push the wrapper toward the top */\n    align-items: flex-start;\n    justify-content: center;\n  }\n@media only screen and (max-width: 600px) {\n\n  /* 2. Anchor the modal itself to the bottom of that container */\n  body > div.modal-container.todoist-edit-task-modal.mod-dim > div.modal {\n    position: absolute;\n    top: 15%;\n    max-height: fit-content;\n    width: 100%;\n    max-width: 100%;\n    margin: 0;\n    box-sizing: border-box;\n  }\n\n  /* 3. Keep your scrolling and margin tweaks in the same block */\n  .todoist-edit-task-modal .modal-content {\n    align-items: flex-start;\n    justify-content: center;\n  }\n}\n/* 📘 Reading Mode Support */\n.todoist-board.reading-mode {\n  padding-bottom: 0 !important;\n  margin-bottom: 0 !important;\n  overflow: visible;\n  background: transparent;\n}\n\n.todoist-board.reading-mode .list-wrapper {\n  padding-bottom: 0;\n}\n\n.todoist-board.reading-mode .todoist-edit-task-modal,\n.todoist-board.reading-mode .todoist-add-task-modal {\n  position: fixed !important;\n  z-index: 9999;\n}\n\n.todoist-board.reading-mode .menu-dropdown-wrapper {\n  position: fixed !important;\n  z-index: 9999;\n}\n .todoist-board .task .repeat-icon {\n   position: absolute;\n   padding-left: 0.5rem;\n   bottom: 0.75rem;\n   opacity: 0.3;\n   width: 16px;\n   height: 16px;\n }\n\n .todoist-board .task.selected-task .repeat-icon {\n   opacity: 0;\n }\n/* === Hide Icons in Compact Mode === */\n/* === Hide Icons in Compact Mode === */\n/* === Hide Icons in Compact Mode for list-wrapper === */\n.list-wrapper.compact-mode .parent-icon,\n.list-wrapper.compact-mode .repeat-icon {\n  display: none !important;\n}\n/* ================================\n   Dark mode: Enhanced Task Modal Inputs & Fields\n   ================================ */\nbody.theme-dark .todoist-edit-task-modal .taskmodal-title-input,\nbody.theme-dark .todoist-edit-task-modal .taskmodal-description-input,\nbody.theme-dark .todoist-edit-task-modal .taskmodal-date-input {\n  background: #1f2937;\n  color: #f9fafb;\n  border-bottom: 1px solid #4b5563;\n}\n\nbody.theme-dark .todoist-edit-task-modal .taskmodal-title-input::placeholder,\nbody.theme-dark .todoist-edit-task-modal .taskmodal-description-input::placeholder {\n  color: #9ca3af;\n  opacity: 0.6;\n}\n\nbody.theme-dark .todoist-edit-task-modal .taskmodal-project-select,\nbody.theme-dark .todoist-edit-task-modal .taskmodal-labels-select {\n  background: #1f2937;\n  color: #f9fafb;\n  border-color: #4b5563;\n}\n\nbody.theme-dark .todoist-edit-task-modal .taskmodal-label-checkbox {\n  background: #374151;\n  color: #f9fafb;\n}\n\nbody.theme-dark .todoist-edit-task-modal .taskmodal-label-checkbox:hover {\n  background: #4b5563;\n}\n\nbody.theme-dark .todoist-edit-task-modal .taskmodal-date-input-row input[type=\"date\"] {\n  background: #1f2937;\n  color: #f9fafb;\n  border: 1px solid #4b5563;\n}\n\nbody.theme-dark .todoist-edit-task-modal .taskmodal-date-input-row input[type=\"date\"]::placeholder {\n  color: #9ca3af;\n  opacity: 0.6;\n}\n\ndiv.block-language-todoist-board.todoist-board > div.list-toolbar {\n  justify-content: flex-end;\n}";
styleInject(css_248z);

// @ts-ignore
// ======================= 🔄 Polling for Task Changes =======================
let lastFetchTime = Date.now();
let _todoistPollInterval;
function pollForTaskChanges(interval = 10000) {
    // Store the interval id for later cleanup
    _todoistPollInterval = window.setInterval(async () => {
        try {
            let api = window.todoistApi;
            if (!api && typeof distExports.TodoistApi !== "undefined") {
                const token = localStorage.getItem("todoistAccessToken") || "PLACEHOLDER";
                api = new distExports.TodoistApi(token);
                window.todoistApi = api;
            }
            if (!api)
                return;
            // Only fetch tasks that have changed since lastFetchTime
            // The API doesn't provide updatedSince, so fetch all and compare
            const allFilters = Array.from(new Set(Array.from(document.querySelectorAll('.todoist-board')).map(container => container.getAttribute('data-current-filter') || 'today')));
            let anyChanges = false;
            for (const filter of allFilters) {
                try {
                    // Use plugin.fetchFilteredTasksFromREST instead of direct api.getTasks
                    const plugin = window.app?.plugins?.plugins?.["todoist-board"];
                    const tasksResponse = await plugin.fetchFilteredTasksFromREST(plugin.settings.apiKey, filter);
                    const tasks = tasksResponse && tasksResponse.results ? tasksResponse.results : tasksResponse;
                    const cachedTasksRaw = localStorage.getItem(`todoistTasksCache:${filter}`) || "[]";
                    let cachedTasks;
                    try {
                        const parsed = JSON.parse(cachedTasksRaw);
                        if (Array.isArray(parsed)) {
                            cachedTasks = parsed;
                        }
                        else {
                            // console.error("cachedTasks is not an array", parsed);
                            cachedTasks = [];
                        }
                    }
                    catch (err) {
                        // console.error("Error parsing cachedTasks", err);
                        cachedTasks = [];
                    }
                    // Compare by id, updatedAt, and projectId, and also detect removed tasks
                    if (Array.isArray(cachedTasks)) {
                        const cachedMap = new Map(cachedTasks.map(t => [t.id, t.updatedAt ?? undefined]));
                        const cachedProjectMap = new Map(cachedTasks.map(t => [t.id, t.projectId]));
                        const tasksArr = Array.isArray(tasks) ? tasks : [];
                        const cachedTaskIds = new Set(cachedTasks.map(t => t.id));
                        const currentTaskIds = new Set(tasksArr.map(t => t.id));
                        const deletedTasksExist = [...cachedTaskIds].some(id => !currentTaskIds.has(id));
                        const tasksChanged = tasksArr.length !== cachedTasks.length ||
                            tasksArr.some((t) => cachedMap.get(t.id) !== t.updatedAt ||
                                cachedProjectMap.get(t.id) !== t.projectId) ||
                            deletedTasksExist;
                        if (tasksChanged) {
                            anyChanges = true;
                            // Log before saving to localStorage
                            // console.log("🧠 Caching to localStorage: ", tasksArr);
                            localStorage.setItem(`todoistTasksCache:${filter}`, JSON.stringify(tasksArr));
                            // Immediately update in-memory cache to match localStorage
                            plugin.taskCache[filter] = tasksArr;
                            // console.log("✅ Saved to localStorage:", tasksArr);
                            localStorage.setItem(`todoistTasksCacheTimestamp:${filter}`, String(Date.now()));
                        }
                    }
                    else {
                        // console.error("cachedTasks is not an array", cachedTasks);
                    }
                }
                catch (err) {
                    // console.error("Error fetching tasks for filter", filter, err);
                }
            }
            if (anyChanges) {
                lastFetchTime = Date.now();
                // Re-render all boards
                document.querySelectorAll('.todoist-board').forEach(async (container) => {
                    try {
                        const filter = container.getAttribute('data-current-filter') || 'today';
                        const cached = localStorage.getItem(`todoistTasksCache:${filter}`);
                        // console.log("📦 Loading tasks from localStorage:", cached);
                        const cachedTasks = JSON.parse(cached || "[]");
                        // console.log("📥 Parsed cached tasks:", cachedTasks);
                        const plugin = window.app?.plugins?.plugins?.["todoist-board"];
                        if (plugin && typeof plugin.renderTodoistBoard === "function") {
                            // Fetch fresh metadata
                            const metadata = await plugin.fetchMetadataFromSync(plugin.settings.apiKey);
                            plugin.projectCache = metadata.projects;
                            plugin.labelCache = metadata.labels;
                            plugin.projectCacheTimestamp = Date.now();
                            plugin.labelCacheTimestamp = Date.now();
                            // Logging
                            // console.log("📦 Live projectList from API:", metadata.projects);
                            // console.log("📦 Live labelList from API:", metadata.labels);
                            // console.log("📦 In-memory plugin.projectCache:", plugin.projectCache);
                            // console.log("📦 In-memory plugin.labelCache:", plugin.labelCache);
                            // console.log("📦 plugin.projectMap (keys):", [...plugin.projectMap.keys()]);
                            // Render updated board with explicit initialData to ensure projectMap is correct
                            // Log before rendering the board
                            // console.log("🎯 Rendering board with tasks:", cachedTasks);
                            await plugin.renderTodoistBoard(container, `filter: ${filter}`, {}, plugin.settings.apiKey, {
                                tasks: cachedTasks,
                                projects: metadata.projects,
                                labels: metadata.labels,
                                sections: []
                            });
                        }
                    }
                    catch (err) {
                        // console.error("Error rendering todoist board", err);
                    }
                });
            }
        }
        catch (error) {
            // console.error('Error polling for updates:', error);
        }
    }, interval);
}
// ======================= 🌟 Constants & Interfaces =======================
// --- Todoist Colors by Name to Hex ---
const TODOIST_COLORS = {
    berry_red: "#b8256f",
    red: "#db4035",
    orange: "#ff9933",
    yellow: "#fad000",
    olive_green: "#afb83b",
    lime_green: "#7ecc49",
    green: "#299438",
    mint_green: "#6accbc",
    teal: "#158fad",
    sky_blue: "#14aaf5",
    light_blue: "#96c3eb",
    blue: "#4073ff",
    grape: "#884dff",
    violet: "#af38eb",
    lavender: "#eb96eb",
    magenta: "#e05194",
    salmon: "#ff8d85",
    charcoal: "#808080",
    grey: "#b8b8b8",
    taupe: "#ccac93"
};
// --- Selected Filter Index State ---
let selectedFilterIndex = 0;
const DEFAULT_FILTERS = {
    "Today": {
        filter: {
            due_after: "{{today}}T00:00:00Z",
            due_before: "{{today}}T23:59:59Z",
            is_completed: false
        }
    },
    "Overdue": {
        filter: {
            due_before: "{{today}}T00:00:00Z",
            is_completed: false
        }
    }};
const TODOIST_BOARD_VIEW_TYPE = "todoist-board-view";
// ======================= 📋 TodoistBoardView =======================
// (Moved here for patch context)
class TodoistBoardView extends obsidian.ItemView {
    constructor(leaf, plugin) {
        super(leaf);
        this.plugin = plugin;
        this.icon = "list-todo";
    }
    getViewType() {
        return TODOIST_BOARD_VIEW_TYPE;
    }
    getDisplayText() {
        return "Todoist Board";
    }
    async onOpen() {
        let container = this.containerEl.querySelector(".view-content");
        if (!container) {
            container = this.containerEl.createDiv({ cls: "view-content" });
        }
        container.empty?.();
        container.classList.add("todoist-board", "plugin-view");
        container.setAttribute("id", "todoist-main-board");
        const plugin = this.plugin;
        const defaultFilter = plugin.settings.filters?.find((f) => f.isDefault)?.filter
            ?? plugin.settings.filters?.[0]?.filter
            ?? "today";
        // Set default filter on plugin instance directly
        plugin.settings.currentFilter = defaultFilter;
        // ✅ Set data-current-filter so that polling works properly
        container.setAttribute("data-current-filter", defaultFilter);
        // 🩹 Wait until container is visible before rendering
        await new Promise((resolve) => {
            const checkVisible = () => {
                if (container.offsetParent !== null)
                    return resolve(undefined);
                setTimeout(checkVisible, 100);
            };
            checkVisible();
        });
        // --- PATCH: Preload tasks if cache is empty, then force immediate fetch from API ---
        if (!plugin.taskCache[defaultFilter] || plugin.taskCache[defaultFilter].length === 0) {
            await plugin.preloadFilters();
        }
        // Force immediate fetch of tasks to avoid waiting for polling
        const response = await plugin.fetchFilteredTasksFromREST(plugin.settings.apiKey, defaultFilter);
        plugin.taskCache[defaultFilter] = response?.results ?? [];
        const cachedTasks = plugin.taskCache[defaultFilter];
        const projects = plugin.projectCache;
        const labels = plugin.labelCache;
        await plugin.renderTodoistBoard(container, `filter: ${defaultFilter}`, {}, plugin.settings.apiKey, {
            tasks: cachedTasks,
            projects,
            labels,
            sections: []
        });
        // --- PATCH: Explicitly persist cached data to localStorage after rendering ---
        localStorage.setItem(`todoistTasksCache:${defaultFilter}`, JSON.stringify(cachedTasks));
        localStorage.setItem("todoistProjectsCache", JSON.stringify(projects));
        localStorage.setItem("todoistLabelsCache", JSON.stringify(labels));
    }
    async onClose() {
        // Cleanup if needed
    }
}
const DEFAULT_SETTINGS = {
    apiKey: "",
    filters: [
        { icon: "star", filter: JSON.stringify(DEFAULT_FILTERS["Today"].filter), title: "Today" },
        { icon: "hourglass", filter: JSON.stringify(DEFAULT_FILTERS["Overdue"].filter), title: "Overdue" },
        { icon: "calendar-days", filter: "due after: today & due before: +4 days", title: "Next 3d" },
        { icon: "moon", filter: "due after: today & due before: +30 days", title: "upcoming" },
        { icon: "inbox", filter: "#inbox", title: "Inbox" },
    ],
    compactMode: false,
    useOAuth: false,
    defaultFilter: "Today",
};
const EMPTY_IMAGE = new Image(1, 1);
EMPTY_IMAGE.src =
    "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==";
function getProjectHexColor(task, projects) {
    const color = projects.find(p => p.id === task.projectId)?.color;
    return TODOIST_COLORS[color] || "#e5e7eb";
}
class TodoistBoardPlugin extends obsidian.Plugin {
    constructor() {
        super(...arguments);
        // =========== Plugin ready state and ensurePluginReady ==============
        this._ready = false;
        this.currentFilter = "";
        this._mutationObservers = [];
        // --- Cancellation token for filter rendering ---
        this.currentRenderToken = "";
        this.compactMode = false;
        this._globalClickListener = (e) => {
            const openDropdown = document.querySelector(".menu-dropdown:not(.hidden)");
            if (openDropdown)
                openDropdown.classList.add("hidden");
        };
        // --- Timezone tracking for cache invalidation ---
        this.lastKnownTimezone = null;
        this.htmlCache = {};
        this.taskCache = {};
        this.projectCache = [];
        this.sectionCache = [];
        this.labelCache = [];
        this.taskCacheTimestamps = {};
        this.projectCacheTimestamp = 0;
        this.labelCacheTimestamp = 0;
        // --- Project Map for id lookup ---
        this.projectMap = new Map();
        // ======================= 🚀 Plugin Load Lifecycle =======================
        this.onload = async () => {
            await (async () => {
                // Register the custom view before any command registration
                this.registerView(TODOIST_BOARD_VIEW_TYPE, (leaf) => new TodoistBoardView(leaf, this));
                // Register command to open Todoist Board in right sidebar (works on mobile and desktop)
                this.addCommand({
                    id: 'open-todoist-board-sidebar',
                    name: 'Open Todoist Board (Right Sidebar)',
                    callback: async () => {
                        // Force the view into the right sidebar
                        const rightLeaf = this.app.workspace.getRightLeaf(false) ||
                            this.app.workspace.getRightLeaf(true);
                        if (rightLeaf) {
                            await rightLeaf.setViewState({
                                type: TODOIST_BOARD_VIEW_TYPE,
                                active: true,
                            });
                        }
                    },
                });
                await this.loadSettings();
                const initialToken = this.settings.apiKey;
                this.todoistApi = new distExports.TodoistApi(initialToken);
                window.todoistApi = this.todoistApi;
                // 🧠 Load metadata from localStorage
                const projLocal = localStorage.getItem('todoistProjectsCache');
                const projTimestamp = parseInt(localStorage.getItem('todoistProjectsCacheTimestamp') || "0");
                if (projLocal) {
                    this.projectCache = JSON.parse(projLocal);
                    this.projectCacheTimestamp = projTimestamp;
                    this.projectMap.clear();
                    for (const project of this.projectCache) {
                        this.projectMap.set(String(project.id), project);
                    }
                }
                const labelLocal = localStorage.getItem('todoistLabelsCache');
                const labelTimestamp = parseInt(localStorage.getItem('todoistLabelsCacheTimestamp') || "0");
                if (labelLocal) {
                    this.labelCache = JSON.parse(labelLocal);
                    this.labelCacheTimestamp = labelTimestamp;
                }
                // ======================= 🔑 OAuth2 Authentication Setup =======================
                // Replace hardcoded API key logic with OAuth2 flow.
                // You must register your app with Todoist to get a clientId and clientSecret.
                const clientId = "YOUR_CLIENT_ID"; // <-- Replace with your Todoist OAuth clientId
                const state = distExports.getAuthStateParameter();
                distExports.getAuthorizationUrl(clientId, ["data:read", "task:add", "data:read_write"], state);
                // Use the stored token from plugin settings, not localStorage
                // No need to redeclare initialToken; just check it
                if (!initialToken) {
                    console.warn("[Todoist Board] No Todoist API token found. Set one in the plugin settings.");
                    // Still register the settings tab so the user can open settings even when not authenticated
                    this.addSettingTab(new TodoistBoardSettingTab(this.app, this));
                    return;
                }
                this.todoistApi = new distExports.TodoistApi(initialToken);
                window.todoistApi = this.todoistApi;
                this.addSettingTab(new TodoistBoardSettingTab(this.app, this));
                if (!this.settings.filters?.some(f => f.isDefault)) {
                    if (this.settings.filters && this.settings.filters.length > 0) {
                        this.settings.filters[0].isDefault = true;
                    }
                }
                if (this.settings.filters && !this.settings.filters.some(f => f.isDefault)) {
                    this.settings.filters.forEach((f, i) => f.isDefault = (i === 0));
                }
                // Set compactMode from settings or default to false
                this.compactMode = this.settings.compactMode ?? false;
                // --- Timezone cache invalidation logic ---
                const storedTimezone = localStorage.getItem("todoistTimezone");
                const deviceTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
                this.lastKnownTimezone = storedTimezone;
                if (storedTimezone && storedTimezone !== deviceTimezone) {
                    // Invalidate all cached task data if timezone changed
                    for (const key in localStorage) {
                        if (key.startsWith("todoistTasksCache:") || key.startsWith("todoistTasksCacheTimestamp:")) {
                            localStorage.removeItem(key);
                        }
                    }
                }
                this.loadingOverlay = document.createElement("div");
                this.loadingOverlay.className = "loading-overlay";
                const spinner = document.createElement("div");
                spinner.className = "spinner";
                this.loadingOverlay.appendChild(spinner);
                this.registerDomEvent(this.loadingOverlay, "click", (e) => e.stopPropagation());
                this.registerMarkdownCodeBlockProcessor("todoist-board", (source, el, ctx) => {
                    // Add classes for code block container
                    el.classList.add("block-language-todoist-board", "todoist-board");
                    const sourcePath = ctx.sourcePath || "reading-mode-placeholder";
                    let filter = "today";
                    // Parse block params for filter
                    function parseBlockParams(raw) {
                        const lines = raw.split("\n");
                        const params = {};
                        for (let line of lines) {
                            const m = line.match(/^([a-zA-Z0-9_]+):\s*(.*)$/);
                            if (m) {
                                params[m[1].trim()] = m[2].trim();
                            }
                        }
                        return params;
                    }
                    const parsed = parseBlockParams(source);
                    if (parsed.Filter && typeof parsed.Filter === "string") {
                        filter = parsed.Filter;
                    }
                    else {
                        const match = source.match(/filter:\s*(.*)/);
                        if (match) {
                            filter = match[1].trim();
                        }
                        else {
                            const defaultFilterObj = this.settings.filters?.find(f => f.isDefault);
                            if (defaultFilterObj)
                                filter = defaultFilterObj.filter;
                        }
                    }
                    el.setAttribute("data-current-filter", filter);
                    // --- NEW PATCHED LOGIC: preload from local, render, then fetch ---
                    const preloadFromLocal = () => {
                        let preloadTasks = this.taskCache[filter];
                        if (!Array.isArray(preloadTasks) || preloadTasks.length === 0) {
                            try {
                                const raw = localStorage.getItem(`todoistTasksCache:${filter}`);
                                preloadTasks = raw ? JSON.parse(raw) : [];
                                if (!Array.isArray(preloadTasks))
                                    preloadTasks = [];
                                this.taskCache[filter] = preloadTasks;
                            }
                            catch {
                                preloadTasks = [];
                            }
                        }
                        return preloadTasks;
                    };
                    const preloadTasks = preloadFromLocal();
                    this.renderTodoistBoard(el, `filter: ${filter}`, sourcePath, this.settings.apiKey, {
                        tasks: preloadTasks,
                        projects: this.projectCache || [],
                        labels: this.labelCache || [],
                        sections: [],
                    });
                    this.fetchFilteredTasksFromREST(this.settings.apiKey, filter).then((resp) => {
                        const tasks = resp?.results ?? [];
                        if (Array.isArray(tasks)) {
                            this.taskCache[filter] = tasks;
                            localStorage.setItem(`todoistTasksCache:${filter}`, JSON.stringify(tasks));
                            localStorage.setItem(`todoistTasksCacheTimestamp:${filter}`, String(Date.now()));
                        }
                    });
                });
                // Skip preloadFilters and initial metadata fetch
                // this.setupDoubleTapPrevention();
                // Ensure onLayoutReady is called with the correct `this` context (fixes TS/Rollup warning):
                setTimeout(this.onLayoutReady.bind(this), 1);
                // (Removed polling-based initial render block; handled in TodoistBoardView.onOpen)
                document.addEventListener("click", this._globalClickListener);
                // Start polling for task changes after initial rendering and setup
                pollForTaskChanges();
                // Store interval id for cleanup
                this._taskChangeInterval = _todoistPollInterval;
            })();
        };
    }
    async ensurePluginReady() {
        if (this._ready)
            return;
        if (!this.todoistApi) {
            const token = this.settings.apiKey;
            this.todoistApi = new distExports.TodoistApi(token);
            window.todoistApi = this.todoistApi;
        }
        if (!this.projectCache || this.projectCache.length === 0) {
            const metadata = await this.fetchMetadataFromSync(this.settings.apiKey);
            this.projectCache = metadata.projects;
            this.labelCache = metadata.labels;
            this.projectCacheTimestamp = Date.now();
            this.labelCacheTimestamp = Date.now();
        }
        await this.preloadFilters();
        this._ready = true;
    }
    setCurrentFilter(filter) {
        this.currentFilter = filter;
    }
    async fetchFilteredTasksFromREST(apiKey, args) {
        try {
            const api = this.todoistApi ??
                window.todoistApi ??
                new distExports.TodoistApi(apiKey, "https://api.todoist.com/api/v1");
            let filterQuery;
            if (typeof args === "string") {
                filterQuery = args;
            }
            else if (typeof args === "object" && args !== null) {
                try {
                    filterQuery = JSON.stringify(args);
                }
                catch (e) {
                    // console.error("Failed to stringify filter object", args);
                }
            }
            if (!filterQuery) {
                // console.warn("No valid filter query provided.");
                return { results: [] };
            }
            // Ensure filterQuery is a string
            const response = await api.getTasksByFilter({ query: filterQuery });
            if (response && Array.isArray(response.results)) {
                return response;
            }
            else if (Array.isArray(response)) {
                return { results: response };
            }
            else {
                return { results: [] };
            }
        }
        catch (error) {
            // console.error("Error fetching tasks via getTasksByFilter:", error);
            return { results: [] };
        }
    }
    async fetchMetadataFromSync(apiKey) {
        try {
            // Use SDK methods for all metadata fetches
            const raw = await this.todoistApi.getProjects();
            const projects = Array.isArray(raw) ? raw : raw.results || [];
            // 🗂️ Log all returned project IDs
            // console.log("🗂️ Projects returned:", projects.map(p => p.id));
            // For sections, you need a projectId; if not available, fetch for all projects
            // Here we fetch for all projects and flatten
            let sections = [];
            if (Array.isArray(projects) && projects.length > 0) {
                const allSections = await Promise.all(projects.map(async (proj) => {
                    try {
                        return await this.todoistApi.getSections({ projectId: proj.id });
                    }
                    catch {
                        return [];
                    }
                }));
                sections = [].concat(...allSections);
            }
            const labels = await this.todoistApi.getLabels();
            localStorage.setItem('todoistProjectsCache', JSON.stringify(projects));
            localStorage.setItem('todoistLabelsCache', JSON.stringify(labels));
            localStorage.setItem('todoistProjectsCacheTimestamp', String(Date.now()));
            localStorage.setItem('todoistLabelsCacheTimestamp', String(Date.now()));
            return {
                projects,
                sections,
                labels
            };
        }
        catch (err) {
            // console.error("Failed to fetch metadata from Todoist", err);
            return {
                projects: [],
                sections: [],
                labels: []
            };
        }
    }
    async loadSettings() {
        const saved = await this.loadData();
        this.settings = Object.assign({}, DEFAULT_SETTINGS, saved);
    }
    async saveSettings() {
        await this.saveData(this.settings);
    }
    async preloadFilters() {
        const now = Date.now();
        const cacheTTL = 24 * 60 * 60 * 1000;
        const filters = this.settings.filters || DEFAULT_SETTINGS.filters;
        await Promise.all(filters.map(async (f) => {
            try {
                const key = f.filter;
                const local = localStorage.getItem(`todoistTasksCache:${key}`);
                const timestamp = parseInt(localStorage.getItem(`todoistTasksCacheTimestamp:${key}`) || "0");
                if (local && now - timestamp < cacheTTL) {
                    this.taskCache[key] = JSON.parse(local);
                    // Insert safety check: ensure it's always an array
                    if (!Array.isArray(this.taskCache[key])) {
                        // console.error("Task cache for filter is not an array", key, this.taskCache[key]);
                        this.taskCache[key] = [];
                    }
                    this.taskCacheTimestamps[key] = timestamp;
                    // Fully await fetchFilteredTasksFromREST and handle changes synchronously
                    const tasksResponse = await this.fetchFilteredTasksFromREST(this.settings.apiKey, key);
                    const tasks = tasksResponse && tasksResponse.results ? tasksResponse.results : tasksResponse;
                    let oldTasks = this.taskCache[key];
                    if (!Array.isArray(oldTasks))
                        oldTasks = [];
                    const oldIds = new Set(oldTasks.map((t) => t.id));
                    const newIds = new Set(Array.isArray(tasks) ? tasks.map((t) => t.id) : []);
                    const hasChanges = oldTasks.length !== (Array.isArray(tasks) ? tasks.length : 0) ||
                        (Array.isArray(tasks) && tasks.some((t) => !oldIds.has(t.id))) ||
                        oldTasks.some((t) => !newIds.has(t.id));
                    if (hasChanges) {
                        this.taskCache[key] = Array.isArray(tasks) ? tasks : [];
                        this.taskCacheTimestamps[key] = Date.now();
                        localStorage.setItem(`todoistTasksCache:${key}`, JSON.stringify(Array.isArray(tasks) ? tasks : []));
                        localStorage.setItem(`todoistTasksCacheTimestamp:${key}`, String(Date.now()));
                    }
                    const currentFilter = document.querySelector(".todoist-board")?.getAttribute("data-current-filter");
                    if (hasChanges && currentFilter === key) {
                        const container = document.querySelector(".todoist-board");
                        if (container) {
                            container.innerHTML = "";
                            this.renderTodoistBoard(container, `filter: ${key}`, {}, this.settings.apiKey);
                        }
                    }
                }
                else {
                    const tasksResponse = await this.fetchFilteredTasksFromREST(this.settings.apiKey, key);
                    const tasks = tasksResponse && tasksResponse.results ? tasksResponse.results : tasksResponse;
                    this.taskCache[key] = Array.isArray(tasks) ? tasks : [];
                    this.taskCacheTimestamps[key] = now;
                    localStorage.setItem(`todoistTasksCache:${key}`, JSON.stringify(Array.isArray(tasks) ? tasks : []));
                    localStorage.setItem(`todoistTasksCacheTimestamp:${key}`, String(now));
                }
            }
            catch (err) {
                // console.error("Error preloading filter", f, err);
            }
        }));
    }
    async completeTask(taskId) {
        await this.todoistApi.closeTask(taskId);
        const currentFilter = document.querySelector(".todoist-board")?.getAttribute("data-current-filter") || "";
        const badge = document.querySelector(`.filter-row[data-filter="${currentFilter}"] .filter-badge-count`);
        if (badge) {
            const cache = JSON.parse(localStorage.getItem(`todoistTasksCache:${currentFilter}`) || "[]");
            badge.textContent = String(Math.max(0, cache.length - 1));
        }
    }
    // ======================= 🏁 Auto-render Default Filter on Startup =======================
    // This block ensures the default filter's board is rendered immediately after UI is ready.
    // Inserted at the end of onload().
    // It waits for DOM elements to be present, then triggers the default filter render.
    async onLayoutReady() {
        // Wait for DOM to be ready (filter bar and board container rendered)
        // We'll use a short interval to check for elements.
        const tryRenderDefault = () => {
            const defaultFilterEl = document.querySelector(".filter-icon[data-filter]");
            const container = document.querySelector(".todoist-board");
            if (defaultFilterEl && container) {
                let source = defaultFilterEl.getAttribute("data-filter") || "";
                if (source === "today") {
                    source = "today";
                }
                container.setAttribute("data-current-filter", source);
                container.innerHTML = "";
                this.renderTodoistBoard(container, "all", "", "", { tasks: [], sections: [], projects: [], labels: [] });
                defaultFilterEl.classList.add("filter-selected");
                return true;
            }
            return false;
        };
        // Try immediately, then poll for up to 1s.
        if (tryRenderDefault())
            return;
        let tries = 0;
        setTimeout(() => { if (this.onLayoutReady)
            this.onLayoutReady(); }, 1);
        const interval = setInterval(() => {
            if (tryRenderDefault() || ++tries > 20)
                clearInterval(interval);
        }, 50);
    }
    // ======================= 🧹 Persistence & Cleanup =======================
    async savePluginData() {
        await this.saveData(this.settings);
    }
    onunload() {
        // Remove global event listener
        document.removeEventListener("click", this._globalClickListener);
        // Clear dropdowns
        const allDropdowns = document.querySelectorAll(".menu-dropdown-wrapper");
        allDropdowns.forEach(dropdown => dropdown.remove());
        // Clear polling intervals
        if (this._pollInterval !== undefined) {
            clearInterval(this._pollInterval);
            this._pollInterval = undefined;
        }
        if (this._taskChangeInterval !== undefined) {
            clearInterval(this._taskChangeInterval);
            this._taskChangeInterval = undefined;
        }
        if (_todoistPollInterval !== undefined) {
            clearInterval(_todoistPollInterval);
            _todoistPollInterval = undefined;
        }
        // Remove any floating toolbars
        const toolbars = document.querySelectorAll("#mini-toolbar-wrapper");
        toolbars.forEach(toolbar => toolbar.remove());
        // Remove loading overlay
        if (this.loadingOverlay?.parentElement) {
            this.loadingOverlay.remove();
        }
        // Remove UI injected elements (e.g., .todoist-board, .todoist-plugin-ui if any)
        document.querySelectorAll('.todoist-plugin-ui').forEach(el => el.remove());
        // Remove menu dropdowns that might have been appended to body
        document.querySelectorAll('.menu-dropdown-wrapper').forEach(el => el.remove());
        // Disconnect mutation observers if any
        if (this._mutationObservers && this._mutationObservers.length > 0) {
            this._mutationObservers.forEach(obs => obs.disconnect());
            this._mutationObservers = [];
        }
        // Remove all .todoist-board elements from DOM
        document.querySelectorAll('.todoist-board').forEach(el => el.remove());
    }
    // ======================= 🧱 Board Renderer =======================
    async render(...args) {
        // --- Ensure projectMap is rebuilt from projectCache at the beginning ---
        this.projectMap.clear();
        this.projectCache.forEach((p) => this.projectMap.set(p.id, p));
        await this.renderTodoistBoard(...(args ?? []));
    }
    renderTodoistBoard(...args) {
        // Extract parameters for backwards compatibility
        let [container, source, ctx, apiKey, initialData = { }] = args;
        if (container.getAttribute("data-rendering") === "true")
            return;
        container.setAttribute("data-rendering", "true");
        try {
            // --- Ensure projectMap is rebuilt from projectCache at the beginning ---
            this.projectMap.clear();
            for (const project of this.projectCache || []) {
                this.projectMap.set(String(project.id), project);
            }
            // --- Always proceed with rendering, even if same filter and task count ---
            const currentFilter = container.getAttribute("data-current-filter") || "";
            let tasks = [];
            let projects = [];
            // If initialData provided, prefer its projects; else use this.projectCache
            if (initialData && Array.isArray(initialData.projects)) {
                projects = initialData.projects;
            }
            else if (Array.isArray(this.projectCache)) {
                projects = this.projectCache;
            }
            // --- PATCH: If projectMap is empty, try to load from localStorage cache as fallback ---
            if (this.projectMap.size === 0) {
                const localProjects = localStorage.getItem("todoistProjectsCache");
                if (localProjects) {
                    try {
                        const parsed = JSON.parse(localProjects);
                        if (Array.isArray(parsed)) {
                            this.projectCache = parsed;
                            this.projectMap.clear();
                            for (const project of parsed) {
                                this.projectMap.set(String(project.id), project);
                            }
                        }
                    }
                    catch (e) {
                        // console.error("Failed to parse project cache fallback", e);
                    }
                }
            }
            // --- PATCH: Update projectMap before rendering ---
            this.projectMap.clear();
            for (const project of projects) {
                this.projectMap.set(String(project.id), project);
            }
            // 🔍 Debug: Inspect task-to-project mapping
            if (initialData && Array.isArray(initialData.tasks) && initialData.tasks.length > 0) {
                const task = initialData.tasks[0];
                // console.log("🔍 Sample task → projectId:", task.projectId, "→ mapped:", this.projectMap.get(String(task.projectId)));
            }
            // --- PATCH: Use tasks from initialData, not from localStorage or cache ---
            const taskList = initialData.tasks || [];
            // --- PATCH: Fallback to localStorage for tasks if needed ---
            if ((!Array.isArray(taskList) || taskList.length === 0) && currentFilter) {
                const local = localStorage.getItem(`todoistTasksCache:${currentFilter}`);
                let fallback = [];
                try {
                    fallback = JSON.parse(local || "[]");
                }
                catch { }
                this.taskCache[currentFilter] = fallback;
                // console.warn("⚠️ Fallback to localStorage tasks for filter:", currentFilter, fallback);
                tasks = fallback;
            }
            else {
                tasks = taskList;
            }
            container.innerHTML = "";
            const currentKey = `${currentFilter}:${tasks?.length || 0}`;
            container.setAttribute("data-prev-render-key", currentKey);
            // Sync in-memory cache with current tasks
            this.taskCache[currentFilter] = tasks;
            // PATCH: If no tasks or not an array, skip render and warn
            if (!tasks || !Array.isArray(tasks)) {
                return;
            }
            if (this.loadingOverlay) {
                this.loadingOverlay.style.display = "flex";
            }
            let cachedTasks = tasks;
            let defaultFilter = currentFilter;
            try {
                this.setupContainer(container);
                container.classList.toggle("compact-mode", this.compactMode);
                // 🧪 Log compact mode application
                // console.log("🧪 Compact mode applied?", this.compactMode, "→ container:", container, "→ has class?", container.classList.contains("compact-mode"));
                const filterOptions = this.getFilterOptions();
                const rawSource = source;
                const hideToolbar = /\btoolbar:\s*false\b/i.test(rawSource);
                source = this.getSourceOrDefault(rawSource, filterOptions);
                // Insert reading mode class logic after root .todoist-board element is created
                const todoistBoardEl = container;
                // Add class to handle reading mode layout
                if (container.closest(".markdown-reading-view")) {
                    todoistBoardEl.classList.add("reading-mode");
                }
                const { toolbar, listWrapper } = this.createLayout(container);
                // PATCH: Hide the filter-row-wrapper if rendering from a code block (block-language-todoist-board)
                const isCodeblock = container.classList.contains("block-language-todoist-board");
                // --- PATCH: Add hasInlineFilter for inline codeblock with filter: ---
                const hasInlineFilter = /\bfilter:\s*.+/i.test(source);
                if (isCodeblock && hasInlineFilter) {
                    requestAnimationFrame(() => {
                        const filterBarWrapper = toolbar.querySelector(".filter-row-wrapper");
                        if (filterBarWrapper)
                            filterBarWrapper.style.setProperty("display", "none", "important");
                    });
                }
                // PATCH: Toggle compact-mode class on container after layout creation
                container.classList.toggle("compact-mode", this.compactMode);
                if (hideToolbar) {
                    toolbar.classList.add("hide-toolbar");
                    toolbar.style.display = "none";
                }
                // --- PATCH: Always renderToolbar if not hideToolbar ---
                if (!hideToolbar) {
                    this.renderToolbar(toolbar, filterOptions, source, container, ctx, apiKey, listWrapper);
                }
                // Use tasks from initialData to drive the rendering
                // (Pass as initialData so renderTaskList uses them)
                // Also ensure we pass the latest metadata if available
                const meta = {
                    sections: [],
                    projects: projects,
                    labels: this.labelCache || []
                };
                // 🧪 Log tasks right before rendering
                // console.log("🧪 Tasks for render:", tasks);
                // --- Debug log: tasks before filter ---
                // console.log("🔍 Tasks before filter:", tasks.length);
                // If you have filtering logic, insert here:
                // For demonstration, if you filter tasks, do:
                // const filtered = tasks.filter(...);
                // console.log("🔎 Tasks after filter:", filtered.length);
                this.renderTaskList(listWrapper, source, apiKey, { tasks, ...meta });
                // PATCH: Fetch metadata in background if stale, then re-render
                const now = Date.now();
                const metadataCacheTTL = 5 * 60 * 1000;
                const metadataFresh = this.projectCache && (now - this.projectCacheTimestamp < metadataCacheTTL);
                if (!metadataFresh) {
                    this.fetchMetadataFromSync(apiKey).then(metadata => {
                        this.projectCache = metadata.projects;
                        this.labelCache = metadata.labels;
                        this.projectCacheTimestamp = now;
                        this.labelCacheTimestamp = now;
                        // Re-render the board with fresh metadata
                        this.renderTodoistBoard(container, source, ctx, apiKey);
                    });
                }
                this.setupGlobalEventListeners();
                this.setupMutationObserver(container);
                // --- PATCH: Save the rendered tasks to localStorage after successful render ---
                if (Array.isArray(cachedTasks)) {
                    try {
                        localStorage.setItem(`todoistTasksCache:${defaultFilter}`, JSON.stringify(cachedTasks));
                    }
                    catch (e) {
                        // console.error("Error saving rendered tasks to localStorage", e);
                    }
                }
            }
            finally {
                if (this.loadingOverlay) {
                    this.loadingOverlay.style.display = "none";
                }
            }
        }
        finally {
            container.removeAttribute("data-rendering");
        }
    }
    setupContainer(container) {
        container.classList.add("todoist-board");
        container.onpointerup = () => {
            window.getSelection()?.removeAllRanges();
        };
        if (this.loadingOverlay && !container.contains(this.loadingOverlay)) {
            container.appendChild(this.loadingOverlay);
        }
        // Ensure compact mode class is toggled according to this.compactMode
        container.classList.toggle("compact-mode", this.compactMode);
    }
    createLayout(container) {
        container.empty();
        const listToolbar = document.createElement("div");
        listToolbar.className = "list-toolbar";
        container.appendChild(listToolbar);
        const listView = document.createElement("div");
        listView.classList.add("list-view");
        const listWrapper = document.createElement("div");
        listWrapper.className = "list-wrapper";
        // Ensure compact-mode class is toggled based on this.compactMode immediately after creation
        listWrapper.classList.toggle("compact-mode", this.compactMode);
        // console.log("🎯 Applied compact-mode to listWrapper?", this.compactMode);
        listView.appendChild(listWrapper);
        container.appendChild(listView);
        return { toolbar: listToolbar, listWrapper };
    }
    getFilterOptions() {
        return (this.settings.filters && this.settings.filters.length > 0)
            ? this.settings.filters
            : DEFAULT_SETTINGS.filters;
    }
    getSourceOrDefault(source, filterOptions) {
        if (!source || !source.trim()) {
            const defaultFilterObj = filterOptions.find(f => f.isDefault) || filterOptions[0];
            return `filter: ${defaultFilterObj?.filter}`;
        }
        // Remove any 'toolbar:' line from the source
        return source
            .split("\n")
            .filter(line => !line.trim().toLowerCase().startsWith("toolbar:"))
            .join("\n");
    }
    // ======================= 🛠️ Toolbar Rendering =======================
    renderToolbar(toolbar, filterOptions, source, container, ctx, apiKey, listWrapper) {
        // Utility for div creation
        const createDiv = (opts = {}) => {
            const el = document.createElement("div");
            if (opts.cls)
                el.className = opts.cls;
            return el;
        };
        // Outer wrapper for the filter row
        const filterWrapper = createDiv({ cls: "filter-row-wrapper" });
        // Ensure filterBar is created with the proper class
        const filterBar = createDiv({ cls: "filter-bar" });
        // Try to match source string, fallback to isDefault, fallback to 0
        const matchIdx = filterOptions.findIndex((opt) => {
            if (opt.filter === "today" && source.includes("due date is"))
                return true;
            return source.trim() === `filter: ${opt.filter}`;
        });
        if (matchIdx !== -1) {
            selectedFilterIndex = matchIdx;
        }
        else if (typeof filterOptions.findIndex((f) => f.isDefault) === "number") {
            filterOptions.findIndex((f) => f.isDefault);
        }
        // Render all .filter-row elements (buttons)
        filterOptions.forEach((opt, idx) => {
            const filterRow = document.createElement("div");
            filterRow.className = "filter-row";
            filterRow.innerHTML = `<span class="filter-icon"></span><span class="filter-title">${opt.title}</span>`;
            filterRow.setAttribute("data-filter", opt.filter);
            const iconEl = filterRow.querySelector(".filter-icon");
            obsidian.setIcon(iconEl, opt.icon || "star");
            // --- Begin updated badge code with background and count layering ---
            const badge = document.createElement("span");
            badge.className = "filter-badge";
            const badgeBg = document.createElement("span");
            badgeBg.className = "filter-badge-bg";
            const badgeCount = document.createElement("span");
            badgeCount.className = "filter-badge-count";
            // Use localStorage to get the latest count for this filter
            const badgeTasksKey = `todoistTasksCache:${opt.filter}`;
            const badgeTasks = JSON.parse(localStorage.getItem(badgeTasksKey) || "[]");
            badgeCount.textContent = String(badgeTasks.length);
            badge.appendChild(badgeBg);
            badge.appendChild(badgeCount);
            // Assign the background color to the icon container instead
            if (opt.color) {
                filterRow?.style.setProperty('--badge-bg', opt.color);
                badge.style.color = 'white';
            }
            if (iconEl)
                iconEl.appendChild(badge);
            // --- End badge code ---
            // --- Begin conditional badge display logic ---
            if (idx !== selectedFilterIndex) {
                badge.style.display = "none";
            }
            // --- End conditional badge display logic ---
            if (idx === selectedFilterIndex) {
                filterRow.classList.add("selected");
            }
            // --- PATCH: Use addEventListener for click, with event handling for reading/live preview ---
            filterRow.addEventListener("click", (e) => {
                e.preventDefault();
                e.stopPropagation();
                // Clear selected class from all
                container.querySelectorAll(".filter-row").forEach(el => el.classList.remove("selected"));
                // Mark this one selected
                filterRow.classList.add("selected");
                // Update data-current-filter attribute
                const todoistBoardEl = container.closest(".todoist-board");
                if (todoistBoardEl) {
                    todoistBoardEl.dataset.currentFilter = opt.filter;
                }
                // Re-render with the selected filter
                this.renderTodoistBoard(container, `filter: ${opt.filter}`, {}, this.settings.apiKey);
            });
            filterBar.appendChild(filterRow);
        });
        // Add queue and settings/refresh buttons
        const queueWrapper = this.createQueueButton(listWrapper);
        const settingsRefreshWrapper = this.createSettingsRefreshButtons(container, source, ctx, apiKey);
        // filterBar.appendChild(queueWrapper); // Move queueWrapper out of filterBar
        // --- Wrap the filterBar with filterWrapper ---
        filterWrapper.appendChild(filterBar);
        // --- Begin: Add Capture (+) Button before settings/refresh buttons ---
        // Create Capture (+) Button using Obsidian icon
        const captureBtn = createSpan({ cls: "add-task-btn clickable-icon" });
        obsidian.setIcon(captureBtn, "circle-plus");
        captureBtn.title = "Add Task";
        captureBtn.style.marginRight = "6px";
        captureBtn.onclick = () => {
            this.openAddTaskModal();
        };
        // --- End: Add Capture (+) Button ---
        // Set queue icon color to black
        queueWrapper.querySelector(".queue-btn");
        toolbar.appendChild(filterWrapper);
        toolbar.appendChild(queueWrapper);
        toolbar.appendChild(captureBtn);
        toolbar.appendChild(settingsRefreshWrapper);
    }
    // ======================= ➕ Task Modal Content Builder =======================
    /**
     * Build a .taskmodal element for add/edit task.
     * @param fields - {title, description, due, projectId, labels}
     * @param submitLabel - string for submit button
     * @param onSubmit - callback({title, description, due, projectId, labels})
     * @returns HTMLElement (.taskmodal)
     */
    buildTaskModalContent(fields, submitLabel, onSubmit) {
        // Utility functions with taskmodal- prefix
        const createEl = (tag, opts = {}) => {
            const el = document.createElement(tag);
            if (opts.cls)
                el.className = opts.cls;
            if (opts.text)
                el.textContent = opts.text;
            if (opts.type)
                el.type = opts.type;
            if (opts.value !== undefined)
                el.value = opts.value;
            if (opts.attr)
                for (const k in opts.attr)
                    el.setAttribute(k, opts.attr[k]);
            return el;
        };
        const createDiv = (cls) => {
            if (typeof cls === "string") {
                return createEl("div", { cls });
            }
            return createEl("div");
        };
        // Outer wrapper
        const wrapper = createDiv("taskmodal-wrapper");
        // Title field
        const titleField = createDiv("taskmodal-title-field");
        const titleInput = createEl("input", { cls: "taskmodal-title-input", type: "text", value: fields.title ?? "" });
        titleInput.placeholder = "Task title";
        titleField.appendChild(titleInput);
        wrapper.appendChild(titleField);
        // Description field
        const descField = createDiv("taskmodal-description-field");
        const descInput = createEl("textarea", { cls: "taskmodal-description-input" });
        descInput.placeholder = "Description";
        descInput.value = fields.description ?? "";
        descField.appendChild(descInput);
        wrapper.appendChild(descField);
        // Date row
        const dateField = createDiv("taskmodal-date-field");
        const dateLabel = createEl("label", { cls: "taskmodal-date-label", text: "📅 Due Date" });
        const dateRow = createDiv("taskmodal-date-input-row");
        const dueInput = createEl("input", { cls: "taskmodal-date-input", type: "date", value: fields.due ?? "" });
        dueInput.placeholder = "Due date";
        const clearDateBtn = createEl("button", { cls: "taskmodal-clear-date", text: "✕" });
        clearDateBtn.title = "Clear Due Date";
        clearDateBtn.onclick = () => { dueInput.value = ""; };
        dateRow.appendChild(dueInput);
        dateRow.appendChild(clearDateBtn);
        dateField.appendChild(dateLabel);
        dateField.appendChild(dateRow);
        // Project select
        const projectField = createDiv("taskmodal-project-field");
        const projectLabel = createEl("label", { cls: "taskmodal-project-label", text: "🗂️ Project" });
        const projectSelect = createEl("select", { cls: "taskmodal-project-select" });
        const projects = Array.isArray(this.projectCache) ? this.projectCache : [];
        for (const project of projects) {
            const option = createEl("option");
            option.value = project.id;
            option.textContent = project.name;
            if (fields.projectId && project.id == fields.projectId) {
                option.selected = true;
            }
            projectSelect.appendChild(option);
        }
        projectField.appendChild(projectLabel);
        projectField.appendChild(projectSelect);
        // --- Group project and date fields into a row ---
        const projectAndDateRow = createDiv("taskmodal-row");
        projectAndDateRow.appendChild(projectField);
        projectAndDateRow.appendChild(dateField);
        wrapper.appendChild(projectAndDateRow);
        // Labels (checkbox list to match edit modal)
        const labelField = createDiv("taskmodal-labels-field");
        const labelLabel = createEl("label", { cls: "taskmodal-labels-label", text: "🏷️ Labels" });
        const labelList = createDiv("taskmodal-label-list");
        const labelListData = Array.isArray(this.labelCache)
            ? this.labelCache
            : Array.isArray(this.labelCache?.results)
                ? this.labelCache.results
                : [];
        labelListData.forEach((label) => {
            const labelCheckbox = createEl("label", { cls: "taskmodal-label-checkbox" });
            const checkbox = createEl("input", { type: "checkbox", attr: { value: label.name } });
            checkbox.checked = Array.isArray(fields.labels) && fields.labels.includes(label.name);
            labelCheckbox.appendChild(checkbox);
            labelCheckbox.append(label.name);
            labelList.appendChild(labelCheckbox);
        });
        labelField.appendChild(labelLabel);
        labelField.appendChild(labelList);
        wrapper.appendChild(labelField);
        // Button row
        const buttonRow = createDiv("taskmodal-button-row");
        const cancelBtn = createEl("button", { cls: "taskmodal-button-cancel", text: "Cancel" });
        // Cancel action is set by modal logic, not here
        const saveBtn = createEl("button", { cls: "taskmodal-button-save", text: submitLabel });
        saveBtn.onclick = async () => {
            const title = titleInput.value.trim();
            const description = descInput.value.trim();
            const due = dueInput.value;
            const projectId = projectSelect.value;
            const labels = Array.from(wrapper.querySelectorAll("input[type='checkbox']:checked")).map(input => input.value);
            if (!title)
                return;
            onSubmit({ title, description, due, projectId, labels });
        };
        buttonRow.appendChild(cancelBtn);
        buttonRow.appendChild(saveBtn);
        wrapper.appendChild(buttonRow);
        // Expose for modal logic: { titleInput, descInput, dueInput, projectSelect }
        wrapper._fields = {
            titleInput, descInput, dueInput, projectSelect
        };
        wrapper._cancelBtn = cancelBtn;
        return wrapper;
    }
    // --- Add Task Modal ---
    async openAddTaskModal() {
        const Modal = require("obsidian").Modal;
        const modal = new Modal(this.app);
        modal.containerEl.classList.add("todoist-edit-task-modal");
        const inboxId = this.projectCache?.find((p) => p.name === "Inbox")?.id;
        const content = this.buildTaskModalContent({
            title: "",
            description: "",
            due: "",
            projectId: inboxId || undefined,
            labels: []
        }, "Add Task", async ({ title, description, due, projectId, labels }) => {
            await this.todoistApi.addTask({
                content: title,
                description,
                projectId: projectId || inboxId,
                ...(due ? { due_date: due } : {}),
                ...(labels && labels.length > 0 ? { labels } : {})
            });
            modal.close();
            await this.preloadFilters();
            this.app.workspace.trigger("markdown-preview-rendered");
        });
        content._cancelBtn.onclick = () => modal.close();
        modal.contentEl.appendChild(content);
        setTimeout(() => {
            content._fields.titleInput?.focus();
        }, 10);
        modal.open();
        if (!this.projectCache || !this.labelCache) {
            this.fetchMetadataFromSync(this.settings.apiKey).then(metadata => {
                const rawProjects = metadata.projects;
                this.projectCache = Array.isArray(rawProjects)
                    ? rawProjects
                    : Array.isArray(rawProjects?.results)
                        ? rawProjects.results
                        : [];
                if (!Array.isArray(this.projectCache))
                    this.projectCache = [];
                const rawLabels = metadata.labels;
                if (Array.isArray(rawLabels)) {
                    this.labelCache = rawLabels;
                }
                else if (rawLabels && Array.isArray(rawLabels.results)) {
                    this.labelCache = rawLabels.results;
                }
                else {
                    this.labelCache = [];
                }
                this.projectCacheTimestamp = Date.now();
                this.labelCacheTimestamp = Date.now();
                // If modal is still open, update dropdowns
                const projectSelect = modal.contentEl.querySelector(".taskmodal-project-select");
                if (projectSelect && Array.isArray(this.projectCache)) {
                    projectSelect.innerHTML = "";
                    for (const project of this.projectCache) {
                        const option = document.createElement("option");
                        option.value = project.id;
                        option.textContent = project.name;
                        projectSelect.appendChild(option);
                    }
                }
                const labelList = modal.contentEl.querySelector(".taskmodal-label-list");
                if (labelList && Array.isArray(this.labelCache)) {
                    labelList.innerHTML = "";
                    this.labelCache.forEach((label) => {
                        const labelCheckbox = document.createElement("label");
                        labelCheckbox.className = "taskmodal-label-checkbox";
                        const checkbox = document.createElement("input");
                        checkbox.type = "checkbox";
                        checkbox.value = label.name;
                        labelCheckbox.appendChild(checkbox);
                        labelCheckbox.append(label.name);
                        labelList.appendChild(labelCheckbox);
                    });
                }
            });
        }
    }
    // The createFilterGroup function is now unused in the new filter bar implementation.
    // ======================= 👀 Mutation Observer Setup =======================
    setupMutationObserver(container) {
        const observer = new MutationObserver((mutations) => {
            // You can handle DOM changes if needed
        });
        observer.observe(container, { childList: true, subtree: true });
    }
    // ======================= 🔄 Filter Click Handling =======================
    async handleFilterClick(opt, container, ctx, apiKey) {
        const now = Date.now();
        // --- Render token logic to ensure only latest filter click is processed ---
        const renderToken = Date.now().toString();
        this.currentRenderToken = renderToken;
        const confirmedFilter = opt.filter;
        // --- Always trigger a full re-render, even if filter unchanged and task count same ---
        const local = localStorage.getItem(`todoistTasksCache:${opt.filter}`);
        let localTasks = local ? JSON.parse(local) : [];
        // Render from localStorage first (if available) for instant feedback
        this.taskCache[opt.filter] = localTasks;
        // Fallback: if no localTasks, keep previous cache
        if (!localTasks || localTasks.length === 0) {
            localTasks = this.taskCache[opt.filter] || [];
        }
        this.renderTodoistBoard(container, `filter: ${opt.filter}`, ctx, apiKey, {
            tasks: localTasks,
            sections: [],
            projects: this.projectCache || [],
            labels: this.labelCache || []
        });
        container.setAttribute("data-current-filter", opt.filter);
        // Immediately call the manual sync logic (force refresh)
        // --- Use parser for string filters ---
        let parsedQuery = opt.filter;
        if (typeof opt.filter === "string") {
            try {
                parsedQuery = JSON.parse(opt.filter);
            }
            catch (e) {
                parsedQuery = opt.filter;
            }
        }
        const tasksResponse = await this.fetchFilteredTasksFromREST(apiKey, parsedQuery);
        const tasks = tasksResponse && tasksResponse.results ? tasksResponse.results : tasksResponse;
        // --- Guarded block: check for stale render or filter switch ---
        if (this.currentRenderToken !== renderToken ||
            container.getAttribute("data-current-filter") !== confirmedFilter) {
            return;
        }
        this.taskCache[opt.filter] = Array.isArray(tasks) ? tasks : [];
        const badge = document.querySelector(`.filter-row[data-filter="${opt.filter}"] .filter-badge-count`);
        if (badge)
            badge.textContent = String(Array.isArray(tasks) ? tasks.length : 0);
        this.taskCacheTimestamps[opt.filter] = now;
        localStorage.setItem(`todoistTasksCache:${opt.filter}`, JSON.stringify(Array.isArray(tasks) ? tasks : []));
        localStorage.setItem(`todoistTasksCacheTimestamp:${opt.filter}`, String(now));
        this.renderTodoistBoard(container, `filter: ${opt.filter}`, ctx, apiKey, {
            tasks: Array.isArray(tasks) && tasks.length > 0 ? tasks : (this.taskCache[opt.filter] || []),
            sections: [],
            projects: this.projectCache || [],
            labels: this.labelCache || []
        });
        const metadata = await this.fetchMetadataFromSync(apiKey);
        this.projectCache = metadata.projects;
        this.labelCache = metadata.labels;
        this.projectCacheTimestamp = now;
        this.labelCacheTimestamp = now;
    }
    createQueueButton(listWrapper) {
        let queueActive = false;
        // Use Obsidian's icon system for the queue button (use "list" as example)
        const queueBtn = createSpan({ cls: "queue-btn clickable-icon" });
        obsidian.setIcon(queueBtn, "focus");
        queueBtn.title = "Queue tasks";
        queueBtn.onclick = () => {
            queueActive = !queueActive;
            this.updateQueueView(queueActive, listWrapper);
        };
        const queueWrapper = document.createElement("div");
        queueWrapper.className = "queue-wrapper";
        queueWrapper.appendChild(queueBtn);
        return queueWrapper;
    }
    createSettingsRefreshButtons(container, source, ctx, apiKey) {
        // Create a hamburger menu button
        const menuBtn = document.createElement("button");
        obsidian.setIcon(menuBtn, "menu");
        menuBtn.title = "Menu";
        menuBtn.classList.add("icon-button");
        // Create dropdown
        const menuDropdown = document.createElement("div");
        menuDropdown.className = "menu-dropdown hidden";
        // Settings option
        const settingsOption = document.createElement("div");
        // Insert icon span before text
        const settingsIcon = document.createElement("span");
        obsidian.setIcon(settingsIcon, "settings");
        settingsIcon.style.marginRight = "8px";
        settingsOption.appendChild(settingsIcon);
        settingsOption.className = "menu-dropdown-item";
        settingsOption.onclick = () => {
            menuDropdown.classList.add("hidden");
            this.openSettingsModal();
        };
        // Use append() instead of textContent to avoid overwriting icon
        settingsOption.append("Settings");
        // Manual Sync option
        const syncOption = document.createElement("div");
        // Insert icon span before text
        const syncIcon = document.createElement("span");
        obsidian.setIcon(syncIcon, "refresh-cw");
        syncIcon.style.marginRight = "8px";
        syncOption.appendChild(syncIcon);
        syncOption.className = "menu-dropdown-item";
        syncOption.onclick = async () => {
            menuDropdown.classList.add("hidden");
            // Manual Sync: Clear cache for the current filter, clear list view, trigger fresh render from API
            const currentFilter = container.getAttribute("data-current-filter") || "";
            // Remove cached tasks and timestamp for current filter
            localStorage.removeItem(`todoistTasksCache:${currentFilter}`);
            localStorage.removeItem(`todoistTasksCacheTimestamp:${currentFilter}`);
            // Find the list wrapper inside the container
            const listWrapper = container.querySelector(".list-wrapper");
            if (listWrapper) {
                listWrapper.innerHTML = "";
                const tasksResponse = await this.fetchFilteredTasksFromREST(this.settings.apiKey, currentFilter);
                const tasks = tasksResponse && tasksResponse.results ? tasksResponse.results : tasksResponse;
                // --- Fetch and update project/label metadata as part of manual sync ---
                const metadata = await this.fetchMetadataFromSync(this.settings.apiKey);
                this.projectCache = metadata.projects;
                this.labelCache = metadata.labels;
                this.projectCacheTimestamp = Date.now();
                this.labelCacheTimestamp = Date.now();
                // ---
                this.taskCache[currentFilter] = Array.isArray(tasks) ? tasks : [];
                const badge = document.querySelector(`.filter-row[data-filter="${currentFilter}"] .filter-badge-count`);
                if (badge)
                    badge.textContent = String(Array.isArray(tasks) ? tasks.length : 0);
                this.taskCacheTimestamps[currentFilter] = Date.now();
                localStorage.setItem(`todoistTasksCache:${currentFilter}`, JSON.stringify(Array.isArray(tasks) ? tasks : []));
                localStorage.setItem(`todoistTasksCacheTimestamp:${currentFilter}`, String(Date.now()));
                const projects = this.projectCache || [];
                const labels = this.labelCache || [];
                this.renderTaskList(listWrapper, `filter: ${currentFilter}`, this.settings.apiKey, {
                    tasks: Array.isArray(tasks) ? tasks : [],
                    projects,
                    labels
                });
            }
            else {
                // Also refresh metadata if not using a listWrapper
                const metadata = await this.fetchMetadataFromSync(this.settings.apiKey);
                this.projectCache = metadata.projects;
                this.labelCache = metadata.labels;
                this.projectCacheTimestamp = Date.now();
                this.labelCacheTimestamp = Date.now();
                this.renderTodoistBoard(container, source, ctx, this.settings.apiKey);
            }
        };
        // Use append() instead of textContent to avoid overwriting icon
        syncOption.append("Manual Sync");
        menuDropdown.appendChild(settingsOption);
        menuDropdown.appendChild(syncOption);
        const divider = document.createElement("div");
        divider.className = "menu-divider";
        menuDropdown.appendChild(divider);
        const compactOption = document.createElement("div");
        compactOption.className = "menu-dropdown-item";
        const compactIcon = document.createElement("span");
        obsidian.setIcon(compactIcon, "align-justify");
        compactIcon.style.marginRight = "8px";
        compactOption.appendChild(compactIcon);
        // Set the initial label based on this.compactMode
        compactOption.textContent = this.compactMode ? "Show Details" : "Compact Mode";
        compactOption.prepend(compactIcon);
        compactOption.onclick = () => {
            this.compactMode = !this.compactMode;
            this.settings.compactMode = this.compactMode;
            this.savePluginData();
            // --- PATCH: Update DOM class for compact mode in real-time ---
            const block = document.querySelector(".block-language-todoist-board");
            if (block) {
                if (this.settings.compactMode) {
                    block.classList.add("compact-mode");
                }
                else {
                    block.classList.remove("compact-mode");
                }
            }
            // Updated logic: choose correct board instance for compact mode toggle
            const isSidebarBoard = container.id === "todoist-main-board";
            const currentBoard = isSidebarBoard
                ? document.getElementById("todoist-main-board")?.querySelector(".list-wrapper")
                : container.querySelector(".list-wrapper");
            if (currentBoard) {
                currentBoard.classList.toggle("compact-mode", this.compactMode);
                // Find the correct board container for getting the filter
                const boardContainer = isSidebarBoard
                    ? document.getElementById("todoist-main-board")
                    : container;
                const currentFilter = boardContainer?.getAttribute("data-current-filter") || "";
                const cachedTasks = JSON.parse(localStorage.getItem(`todoistTasksCache:${currentFilter}`) || "[]");
                const board = boardContainer;
                if (board) {
                    board.innerHTML = "";
                    const currentFilterStr = `filter: ${currentFilter}`;
                    localStorage.setItem(`todoistTasksCache:${currentFilter}`, JSON.stringify(cachedTasks));
                    this.renderTodoistBoard(board, currentFilterStr, {}, this.settings.apiKey, {
                        tasks: cachedTasks,
                        projects: this.projectCache,
                        labels: this.labelCache,
                        sections: []
                    });
                }
            }
            compactOption.textContent = this.compactMode ? "Show Details" : "Compact Mode";
            compactOption.prepend(compactIcon);
            // Hide the menu after toggling compact mode
            // @ts-ignore
            const menu = {
                hideAtMouseEvent: (evt) => {
                    menuDropdown.classList.add("hidden");
                }
            };
            menu.hideAtMouseEvent(new MouseEvent("click"));
        };
        menuDropdown.appendChild(compactOption);
        // --- PATCH: Wrap menuDropdown in a menu-dropdown-wrapper to prevent clipping ---
        const menuDropdownWrapper = document.createElement("div");
        menuDropdownWrapper.className = "menu-dropdown-wrapper";
        menuDropdownWrapper.appendChild(menuDropdown);
        // --- Move menuDropdownWrapper outside settingsRefreshWrapper and append to body ---
        // We'll store a reference for event handling.
        document.body.appendChild(menuDropdownWrapper);
        // --- By default, hide the dropdown ---
        menuDropdown.classList.add("hidden");
        // Toggle dropdown on menu button click, position absolutely below the button
        menuBtn.onclick = (e) => {
            e.stopPropagation();
            const rect = menuBtn.getBoundingClientRect();
            menuDropdownWrapper.style.position = "absolute";
            menuDropdownWrapper.style.top = `${rect.bottom + window.scrollY}px`;
            menuDropdownWrapper.style.left = `${rect.left + window.scrollX}px`;
            menuDropdown.classList.toggle("hidden");
        };
        // Hide dropdown on outside click
        // This event listener is global and should be cleaned up if needed
        // (Consider registering and removing if you want to be extra clean)
        document.addEventListener("click", (e) => {
            if (!menuDropdown.classList.contains("hidden")) {
                menuDropdown.classList.add("hidden");
            }
        });
        // Prevent click inside dropdown from closing  it
        menuDropdown.addEventListener("click", (e) => {
            e.stopPropagation();
        });
        // --- Only the menuBtn is inside the wrapper now ---
        const settingsRefreshWrapper = document.createElement("div");
        settingsRefreshWrapper.className = "settings-refresh-wrapper";
        settingsRefreshWrapper.appendChild(menuBtn);
        // menuDropdownWrapper is now outside, not appended here
        // PATCH: Use the container argument instead of querying for .todoist-board
        // Find and replace:
        // const board = document.querySelector(".todoist-board") as HTMLElement;
        // with:
        // const board = container;
        // (This block is in compactOption.onclick)
        // Find the currentBoard and update as before, but use container directly for re-render
        // (No changes needed to the rest of the logic, as container is already passed and used)
        return settingsRefreshWrapper;
    }
    createRefreshButton(container, source, ctx, apiKey) {
        const refreshBtn = document.createElement("button");
        refreshBtn.type = "button";
        obsidian.setIcon(refreshBtn, "refresh-cw");
        refreshBtn.title = "Force refresh cache";
        refreshBtn.classList.add("icon-button", "refresh-btn");
        refreshBtn.onclick = () => {
            requestAnimationFrame(() => {
                refreshBtn.classList.add("syncing");
                const selectedRow = document.querySelector(".filter-row.selected");
                selectedRow?.classList.add("syncing");
                requestAnimationFrame(async () => {
                    await this.preloadFilters();
                    setTimeout(() => {
                        refreshBtn.classList.remove("syncing");
                        selectedRow?.classList.remove("syncing");
                        this.renderTodoistBoard(container, source, ctx, apiKey);
                    }, 4000); // Delay to allow animation to register
                });
            });
        };
        return refreshBtn;
    }
    createSettingsButton() {
        const settingsBtn = document.createElement("span");
        obsidian.setIcon(settingsBtn, "settings");
        settingsBtn.title = "Edit toolbar filters";
        settingsBtn.className = "icon-button";
        settingsBtn.onclick = () => this.openSettingsModal();
        return settingsBtn;
    }
    async openSettingsModal() {
        let Modal;
        try {
            ({ Modal } = await import('obsidian'));
        }
        catch (e) {
            Modal = require("obsidian").Modal;
        }
        const modal = new Modal(this.app);
        modal.containerEl.classList.add("settings-modal");
        modal.titleEl.setText("Customize Toolbar Filters");
        if (!this.settings.filters)
            this.settings.filters = [];
        if (this.settings.filters.length === 0) {
            this.settings.filters.push({ icon: "⭐", filter: "today", title: "Today" });
        }
        // --- Table-based settings UI ---
        const renderSettingsUI = () => {
            const c = modal.contentEl;
            c.empty();
            const table = c.createEl("table", { cls: "settings-filter-table" });
            const thead = table.createEl("thead");
            const headRow = thead.createEl("tr");
            ["Icon", "Title", "Filter", "Default", "Delete"].forEach(text => {
                headRow.createEl("th", { text });
            });
            const tbody = table.createEl("tbody");
            // --- Helper to render a single filter row ---
            const renderFilterRow = (f, idx) => {
                const thisFilter = this.settings.filters[idx];
                const row = tbody.createEl("tr");
                // Icon picker trigger and popup
                const iconCell = row.createEl("td");
                // Trigger div
                const iconTrigger = iconCell.createDiv({ cls: "icon-trigger" });
                iconTrigger.innerHTML = "";
                obsidian.setIcon(iconTrigger, f.icon || "star");
                iconTrigger.style.cursor = "pointer";
                iconTrigger.style.fontSize = "1.6em";
                iconTrigger.style.border = "1px solid #ccc";
                iconTrigger.style.borderRadius = "6px";
                iconTrigger.style.width = "36px";
                iconTrigger.style.height = "36px";
                iconTrigger.style.display = "flex";
                iconTrigger.style.alignItems = "center";
                iconTrigger.style.justifyContent = "center";
                iconTrigger.style.position = "relative";
                // Picker wrapper (popup)
                const iconPickerWrapper = iconCell.createDiv({ cls: "icon-picker-wrapper" });
                iconPickerWrapper.classList.remove("visible");
                // --- Scroll styling for icon picker ---
                iconPickerWrapper.style.maxHeight = "160px";
                iconPickerWrapper.style.overflowY = "auto";
                // --- Color Picker Row ---
                const colorRow = iconPickerWrapper.createDiv({ cls: "icon-color-row" });
                // 24 handpicked, aesthetically pleasing and commonly used colors
                const colors = [
                    "#FF6B6B", "#F06595", "#CC5DE8", "#845EF7", "#5C7CFA", "#339AF0",
                    "#22B8CF", "#20C997", "#51CF66", "#94D82D", "#FCC419", "#FF922B",
                    "#FF6B00", "#FFD43B", "#A9E34B", "#69DB7C", "#38D9A9", "#4DABF7",
                    "#748FFC", "#9775FA", "#DA77F2", "#F783AC", "#FF8787", "#FF9F40"
                ];
                colors.forEach(color => {
                    const swatch = document.createElement("div");
                    swatch.className = "icon-color-swatch";
                    swatch.style.background = color;
                    swatch.onclick = () => {
                        iconTrigger.querySelector("svg")?.setAttribute("stroke", color);
                        thisFilter.color = color;
                    };
                    colorRow.appendChild(swatch);
                });
                // Add a final "custom" swatch (color input)
                const customColor = document.createElement("input");
                customColor.type = "color";
                customColor.className = "icon-color-picker";
                customColor.style.padding = "0";
                customColor.style.border = "2px solid #ccc";
                customColor.style.background = "conic-gradient(red, orange, yellow, green, cyan, blue, violet, red)";
                customColor.style.cursor = "pointer";
                customColor.oninput = () => {
                    iconTrigger.querySelector("svg")?.setAttribute("stroke", customColor.value);
                    thisFilter.color = customColor.value;
                };
                colorRow.appendChild(customColor);
                // Use extended Obsidian icon set for icon picker (100 icons)
                const obsidianIcons = [
                    "check", "calendar", "star", "heart", "search", "plus", "trash", "pencil", "folder", "document",
                    "file-plus", "anchor", "zap", "settings", "book-open", "box", "bug", "camera", "cast", "cloud",
                    "command", "compass", "database", "download", "eye", "flag", "globe", "image", "key", "layers",
                    "link", "list", "lock", "map", "mic", "moon", "music", "pause", "phone", "refresh-cw", "save",
                    "scissors", "send", "share", "shield", "shopping-cart", "sliders", "sun", "terminal", "thumbs-up",
                    "toggle-left", "trash-2", "trending-up", "upload", "user", "video", "watch", "wifi", "x-circle",
                    "alarm-clock", "bell", "briefcase", "clipboard", "coffee", "credit-card", "disc", "dollar-sign",
                    "edit-2", "fast-forward", "file-text", "film", "gift", "hand", "home", "inbox", "info", "layout",
                    "lightbulb", "list-checks", "loader", "log-in", "log-out", "menu", "message-circle", "navigation",
                    "notebook", "package", "palette", "paperclip", "play", "printer", "repeat", "rss", "server", "shopping-bag",
                    "sidebar", "smile", "timer", "target", "toggle-right", "swords", "truck", "umbrella", "wallet", "zap-off"
                ];
                // Move colorRow to the top of the picker UI (before icon grid)
                iconPickerWrapper.appendChild(colorRow);
                obsidianIcons.forEach(iconName => {
                    const iconBtn = document.createElement("span");
                    iconBtn.className = "icon-grid-btn";
                    obsidian.setIcon(iconBtn, iconName);
                    iconBtn.title = iconName;
                    if (f.icon === iconName)
                        iconBtn.classList.add("selected");
                    iconBtn.onclick = (e) => {
                        e.preventDefault();
                        thisFilter.icon = iconName;
                        iconTrigger.innerHTML = "";
                        obsidian.setIcon(iconTrigger, iconName);
                        iconPickerWrapper.classList.remove("visible");
                        iconPickerWrapper.querySelectorAll(".icon-grid-btn").forEach((b) => b.classList.remove("selected"));
                        iconBtn.classList.add("selected");
                    };
                    iconPickerWrapper.appendChild(iconBtn);
                });
                iconTrigger.onclick = (e) => {
                    e.stopPropagation();
                    // Close all other pickers
                    document.querySelectorAll(".icon-picker-wrapper.visible").forEach((el) => {
                        if (el !== iconPickerWrapper)
                            el.classList.remove("visible");
                    });
                    // Toggle this one
                    iconPickerWrapper.classList.toggle("visible");
                };
                // Title input
                const titleCell = row.createEl("td");
                const titleInput = titleCell.createEl("input", { type: "text" });
                titleInput.value = f.title || "";
                titleInput.oninput = () => f.title = titleInput.value;
                // Filter input
                const filterCell = row.createEl("td");
                const filterInput = filterCell.createEl("input", { type: "text" });
                // Always display valid JSON for the filter input
                filterInput.value = typeof f.filter === "string" ? f.filter : JSON.stringify(f.filter ?? {});
                filterInput.oninput = () => {
                    // No assignment here; handled on save
                    // Optionally, you could live-parse and validate, but we only validate on save
                };
                // Default radio
                const defaultCell = row.createEl("td");
                const defaultInput = defaultCell.createEl("input", { type: "radio" });
                defaultInput.name = "default-filter";
                defaultInput.checked = !!f.isDefault;
                defaultInput.onchange = () => {
                    this.settings.filters.forEach((_, i) => this.settings.filters[i].isDefault = (i === idx));
                };
                // Delete button
                const deleteCell = row.createEl("td");
                const deleteBtn = deleteCell.createEl("button");
                obsidian.setIcon(deleteBtn, "trash-2");
                deleteBtn.querySelector("svg")?.removeAttribute("fill"); // Ensure it's stroke-only
                deleteBtn.className = "icon-button";
                deleteBtn.onclick = () => {
                    this.settings.filters.splice(idx, 1);
                    row.remove(); // Just remove the row instead of rerendering everything
                };
            };
            // Render all filter rows
            this.settings.filters.forEach((f, idx) => {
                renderFilterRow(f, idx);
            });
            // Add button
            const addRow = c.createEl("div", { cls: "settings-action-row" });
            const addBtn = addRow.createEl("button", { text: "➕ Add Filter" });
            addBtn.onclick = () => {
                const newFilter = { icon: "❔", title: "", filter: "" };
                this.settings.filters.push(newFilter);
                renderFilterRow(newFilter, this.settings.filters.length - 1);
            };
            // Save and Clear buttons
            const saveRow = c.createEl("div", { cls: "settings-save-row" });
            const saveBtn = saveRow.createEl("button", { text: "Save" });
            saveBtn.onclick = async () => {
                // Allow any string filter without validating JSON format
                // The filter input fields are in the table; find them
                const filterRows = Array.from(modal.contentEl.querySelectorAll("tbody tr"));
                filterRows.forEach((row, i) => {
                    const filterRow = row;
                    const filterInput = filterRow.querySelector("td:nth-child(3) input");
                    if (!filterInput)
                        return;
                    const filterInputValue = filterInput.value.trim();
                    // Accept string as-is, or parse JSON if possible
                    try {
                        this.settings.filters[i].filter = JSON.parse(filterInputValue);
                    }
                    catch {
                        this.settings.filters[i].filter = filterInputValue;
                    }
                });
                if (!this.settings.filters.some(f => f.isDefault)) {
                    this.settings.filters[0].isDefault = true;
                }
                // Ensure the filters array is updated (including color)
                this.settings.filters = [...this.settings.filters];
                await this.savePluginData();
                // Reset filter index state to reflect the first/default filter after changes
                selectedFilterIndex = 0;
                // Optionally trigger markdown rendering again
                this.app.workspace.trigger("markdown-preview-rendered");
                // --- PATCH: Force all todoist-board containers to rerender before closing modal ---
                document.querySelectorAll(".todoist-board").forEach((el) => {
                    const container = el;
                    const source = container.getAttribute("data-current-filter") || "";
                    container.innerHTML = "";
                    this.renderTodoistBoard(container, source, {}, (this.settings && this.settings.apiKey) || "");
                });
                modal.close();
                // After closing the modal, force rerender of all matching code blocks after a slight delay
                setTimeout(() => {
                    const markdownEls = document.querySelectorAll("pre > code.language-todoist-board");
                    markdownEls.forEach((el) => {
                        const pre = el.parentElement;
                        const container = document.createElement("div");
                        pre.replaceWith(container);
                        const source = el.textContent?.trim() || "";
                        this.renderTodoistBoard(container, source, {}, this.settings.apiKey);
                    });
                }, 100);
            };
            const clearCacheBtn = saveRow.createEl("button");
            clearCacheBtn.style.padding = "6px 6px";
            clearCacheBtn.style.marginTop = "4px";
            const iconSpan = document.createElement("span");
            iconSpan.style.marginRight = "6px";
            obsidian.setIcon(iconSpan, "x-circle");
            clearCacheBtn.appendChild(iconSpan);
            clearCacheBtn.append("Clear Cache");
            clearCacheBtn.onclick = () => {
                // Only clear task/project/label caches, not UI/layout or icon settings
                for (const key in localStorage) {
                    if (key.startsWith("todoistTasksCache:") ||
                        key.startsWith("todoistTasksCacheTimestamp:") ||
                        key.startsWith("todoistProjectsCache") ||
                        key.startsWith("todoistLabelsCache")) {
                        localStorage.removeItem(key);
                    }
                }
                // Notification to user (Obsidian-compatible, fallback-safe)
                // @ts-ignore
                new window.Notice("Todoist task cache cleared. Plugin will re-fetch data.");
            };
            // After saveRow is created and appended, add the global click handler for icon picker wrappers
            modal.containerEl.addEventListener("mousedown", (e) => {
                document.querySelectorAll(".icon-picker-wrapper.visible").forEach((el) => {
                    const trigger = el.previousElementSibling;
                    if (!el.contains(e.target) && !trigger?.contains(e.target)) {
                        el.classList.remove("visible");
                    }
                });
            });
        };
        renderSettingsUI();
        modal.open();
    }
    // ======================= 📋 Task List Rendering =======================
    async renderTaskList(listWrapper, source, apiKey, preloadData) {
        const match = source.match(/filter:\s*(.*)/);
        const filters = match
            ? match[1].split(",").map(f => f.trim())
            : ["today", "overdue", "next 7 days", "inbox"];
        // --- PATCH: preloadData block ---
        if (preloadData) {
            const { tasks, projects, labels } = preloadData;
            // Ensure tasks is an array before sorting
            if (!Array.isArray(tasks)) {
                console.error("cachedTasks is not an array", tasks);
                return;
            }
            // Ensure projects and labels are arrays
            const projectList = Array.isArray(projects) ? projects : [];
            const labelList = Array.isArray(labels) ? labels : [];
            const projectMap = Object.fromEntries(projectList.map((p) => [p.id, p.name]));
            const labelMap = Object.fromEntries((labelList ?? []).map((l) => [l.id, l.name]));
            const labelColorMap = Object.fromEntries((labelList ?? []).map((l) => [l.id, l.color]));
            const orderKey = `todoistBoardOrder:${filters.join(",")}`;
            const savedOrder = JSON.parse(localStorage.getItem(orderKey) || "[]");
            tasks.sort((a, b) => {
                const idxA = savedOrder.indexOf(a.id);
                const idxB = savedOrder.indexOf(b.id);
                return (idxA === -1 ? Number.MAX_SAFE_INTEGER : idxA) -
                    (idxB === -1 ? Number.MAX_SAFE_INTEGER : idxB);
            });
            // --- Group subtasks by parentId ---
            const taskList = Array.isArray(tasks) ? tasks : [];
            const subtasksByParentId = {};
            taskList.forEach((task) => {
                if (task.parentId) {
                    if (!subtasksByParentId[task.parentId])
                        subtasksByParentId[task.parentId] = [];
                    subtasksByParentId[task.parentId].push(task);
                }
            });
            // --- Only render parent tasks and their subtasks ---
            taskList.map((task) => {
                if (task.parentId)
                    return; // skip subtasks in top-level loop
                // --- Get project info using projectMap (by id) ---
                const project = this.projectMap.get(String(task.projectId));
                // Debug logs for mapping task to project
                // console.log(`🔍 Task ${task.id} → Project ID: ${task.projectId}`);
                // console.log("📘 Mapped project:", project);
                const projectName = project ? project.name : "Unknown Project";
                // Use string key for color mapping
                let projectColor = "#808080";
                if (project && typeof project.color !== "undefined") {
                    projectColor = TODOIST_COLORS[project.color] || "#808080";
                }
                if (task.content?.trim().startsWith("* ")) {
                    const clonedTask = { ...task, content: task.content.trim().substring(2) };
                    const row = this.createTaskRow(clonedTask, projectMap, labelMap, labelColorMap, projectList, apiKey, listWrapper, filters);
                    // Set project name/color in rendering logic (if used in createTaskRow)
                    row.classList.add("non-task-note");
                    this.setupTaskDragAndDrop(row, listWrapper, filters);
                    listWrapper.appendChild(row);
                    return;
                }
                const row = this.createTaskRow(task, projectMap, labelMap, labelColorMap, projectList, apiKey, listWrapper, filters);
                // --- PATCH: Set project name and color as data attributes for use in createTaskRow or CSS ---
                row.setAttribute("data-project-name", projectName);
                row.setAttribute("data-project-color", projectColor);
                // Only setup drag-and-drop for parent tasks
                this.setupTaskDragAndDrop(row, listWrapper, filters);
                listWrapper.appendChild(row);
                // --- PATCH: fallback to global subtask lookup if not found in subtasksByParentId ---
                let allSubtasks = [];
                try {
                    allSubtasks = Object.values(this.taskCache).flat().filter((t) => t.parentId === task.id);
                }
                catch (err) {
                    console.error("Error flattening taskCache for subtasks", err);
                }
                const subtasks = allSubtasks.length > 0 ? allSubtasks : (subtasksByParentId[task.id] || []);
                // --- Render subtasks directly nested inside parent row, INSIDE task-content-wrapper ---
                if (Array.isArray(subtasks) && subtasks.length > 0) {
                    const subtaskWrapper = document.createElement("div");
                    subtaskWrapper.className = "subtask-wrapper";
                    for (const sub of subtasks) {
                        const subProject = this.projectMap.get(sub.projectId);
                        const subProjectName = subProject ? subProject.name : "Unknown Project";
                        let subProjectColor = "#808080";
                        if (subProject && typeof subProject.color !== "undefined") {
                            subProjectColor = TODOIST_COLORS[subProject.color] || "#808080";
                        }
                        const subRow = this.createTaskRow(sub, projectMap, labelMap, labelColorMap, projectList, apiKey, listWrapper, filters);
                        subRow.classList.add("subtask-row");
                        subRow.setAttribute("data-project-name", subProjectName);
                        subRow.setAttribute("data-project-color", subProjectColor);
                        // Clean up subtask UI (remove metadata, chin, description)
                        const meta = subRow.querySelector(".task-metadata");
                        if (meta)
                            meta.remove();
                        const desc = subRow.querySelector(".task-description");
                        if (desc)
                            desc.remove();
                        const chin = subRow.querySelector(".fixed-chin");
                        if (chin)
                            chin.remove();
                        subtaskWrapper.appendChild(subRow);
                    }
                    // PATCH: Insert into task-content-wrapper if exists, else fallback to row
                    const contentWrapper = row.querySelector('.task-content-wrapper');
                    if (contentWrapper) {
                        contentWrapper.appendChild(subtaskWrapper);
                    }
                    else {
                        row.appendChild(subtaskWrapper);
                    }
                }
            });
            // --- Insert empty quote if no tasks ---
            if (taskList.length === 0) {
                const quoteDiv = document.createElement("div");
                quoteDiv.className = "empty-filter";
                quoteDiv.textContent = "No tasks found for this filter.";
                listWrapper.appendChild(quoteDiv);
            }
            return;
        }
        const now = Date.now();
        const cacheTTL = 24 * 60 * 60 * 1000;
        let projects = [];
        let labels = [];
        let metadata;
        const metadataCacheTTL = 24 * 60 * 60 * 1000;
        const metadataTimestamp = this.projectCacheTimestamp;
        const metadataFresh = this.projectCache && (now - metadataTimestamp < metadataCacheTTL);
        if (metadataFresh) {
            projects = Array.isArray(this.projectCache) ? this.projectCache : [];
            labels = Array.isArray(this.labelCache) ? this.labelCache : [];
            metadata = { projects, sections: [], labels };
        }
        else {
            metadata = await this.fetchMetadataFromSync(apiKey);
            projects = metadata.projects;
            labels = metadata.labels;
            this.projectCache = projects;
            this.labelCache = labels;
            this.projectCacheTimestamp = now;
            this.labelCacheTimestamp = now;
        }
        let tasks = [];
        const filter = filters[0];
        const taskTimestamp = this.taskCacheTimestamps[filter] || 0;
        const useCache = this.taskCache[filter] && (now - taskTimestamp < cacheTTL);
        if (useCache) {
            tasks = this.taskCache[filter];
        }
        else {
            // PATCH: check if filter is empty or invalid, fallback to all tasks if so
            const query = filter?.trim();
            let tasksResponse;
            if (query) {
                tasksResponse = await this.fetchFilteredTasksFromREST(apiKey, query);
            }
            else {
                // fallback to all tasks
                tasksResponse = await this.fetchFilteredTasksFromREST(apiKey, {});
            }
            tasks = tasksResponse && tasksResponse.results ? tasksResponse.results : tasksResponse;
            this.taskCache[filter] = Array.isArray(tasks) ? tasks : [];
            this.taskCacheTimestamps[filter] = now;
        }
        const projectMap = Array.isArray(projects)
            ? Object.fromEntries(projects.map((p) => [p.id, p.name]))
            : {};
        const labelMap = Array.isArray(labels)
            ? Object.fromEntries((labels ?? []).map((l) => [l.id, l.name]))
            : {};
        const labelColorMap = Array.isArray(labels)
            ? Object.fromEntries((labels ?? []).map((l) => [l.id, l.color]))
            : {};
        const orderKey = `todoistBoardOrder:${filters.join(",")}`;
        const savedOrder = JSON.parse(localStorage.getItem(orderKey) || "[]");
        const taskList = Array.isArray(tasks) ? tasks : [];
        taskList.sort((a, b) => {
            const idxA = savedOrder.indexOf(a.id);
            const idxB = savedOrder.indexOf(b.id);
            return (idxA === -1 ? Number.MAX_SAFE_INTEGER : idxA) -
                (idxB === -1 ? Number.MAX_SAFE_INTEGER : idxB);
        });
        // --- Group subtasks by parentId for non-preloadData path ---
        const subtasksByParentId = {};
        taskList.map((task) => {
            if (task.parentId) {
                if (!subtasksByParentId[task.parentId])
                    subtasksByParentId[task.parentId] = [];
                subtasksByParentId[task.parentId].push(task);
            }
        });
        // Removed local date comparison due to timezone mismatch issues (see GitHub issue #timezone-bug)
        // If any previous logic filtered tasks based on local date (e.g., new Date(task.due.date)), it is now removed.
        // --- Only render parent tasks and their subtasks, do not filter by local date ---
        taskList.map((task) => {
            // Do not skip tasks based on local date comparison
            if (task.parentId)
                return; // skip subtasks in top-level loop
            if (task.content?.trim().startsWith("* ")) {
                const clonedTask = { ...task, content: task.content.trim().substring(2) };
                const row = this.createTaskRow(clonedTask, projectMap, labelMap, labelColorMap, projects, apiKey, listWrapper, filters);
                row.classList.add("non-task-note");
                this.setupTaskDragAndDrop(row, listWrapper, filters);
                listWrapper.appendChild(row);
                return;
            }
            const row = this.createTaskRow(task, projectMap, labelMap, labelColorMap, projects, apiKey, listWrapper, filters);
            // Only setup drag-and-drop for parent tasks
            this.setupTaskDragAndDrop(row, listWrapper, filters);
            listWrapper.appendChild(row);
            // --- PATCH: fallback to global subtask lookup if not found in subtasksByParentId ---
            let allSubtasks = [];
            try {
                allSubtasks = Object.values(this.taskCache).flat().filter((t) => t.parentId === task.id);
            }
            catch (err) {
                console.error("Error flattening taskCache for subtasks", err);
            }
            const subtasks = allSubtasks.length > 0 ? allSubtasks : (subtasksByParentId[task.id] || []);
            // --- Render subtasks directly nested inside parent row ---
            if (Array.isArray(subtasks) && subtasks.length > 0) {
                const subtaskWrapper = document.createElement("div");
                subtaskWrapper.className = "subtask-wrapper";
                for (const sub of subtasks) {
                    const subRow = this.createTaskRow(sub, projectMap, labelMap, labelColorMap, projects, apiKey, listWrapper, filters);
                    subRow.classList.add("subtask-row");
                    // Clean up subtask UI (remove metadata, chin, description)
                    const meta = subRow.querySelector(".task-metadata");
                    if (meta)
                        meta.remove();
                    const desc = subRow.querySelector(".task-description");
                    if (desc)
                        desc.remove();
                    const chin = subRow.querySelector(".fixed-chin");
                    if (chin)
                        chin.remove();
                    subtaskWrapper.appendChild(subRow);
                }
                row.appendChild(subtaskWrapper);
            }
        });
        // --- Insert empty quote if no tasks ---
        if (taskList.length === 0) {
            const quoteDiv = document.createElement("div");
            quoteDiv.className = "empty-filter";
            quoteDiv.textContent = "No tasks found for this filter.";
            listWrapper.appendChild(quoteDiv);
        }
        try {
            if (source && source.trim().startsWith("filter:")) {
                localStorage.setItem("todoistBoardLastFilter", source.trim());
            }
        }
        catch (e) { }
    }
    // ======================= 🧩 Task Row Creation =======================
    createTaskRow(task, projectMap, labelMap, labelColorMap, projects, apiKey, listWrapper, filters) {
        const row = document.createElement("div");
        // --- PATCH: Apply .non-task-note class if original content starts with "* " ---
        if (task.content?.trim().startsWith("* ")) {
            row.classList.add("non-task-note");
        }
        row.classList.add("task");
        row.dataset.id = task.id;
        // PATCH: Set the row id to the task id for later DOM removal
        row.id = task.id;
        // Set project color CSS variable
        row.style.setProperty("--project-color", getProjectHexColor(task, projects));
        // --- PATCH: Add "parent-task" class if task has children (by parentId) ---
        const hasChildren = Object.values(this.taskCache).flat().some((t) => t.parentId === task.id);
        if (hasChildren) {
            row.classList.add("parent-task");
        }
        // --- PATCH: Add repeating task icon if task is recurring ---
        const isRepeating = !!task.due?.is_recurring;
        if (isRepeating) {
            const repeatIcon = document.createElement("span");
            repeatIcon.classList.add("repeat-icon");
            obsidian.setIcon(repeatIcon, "repeat");
            row.appendChild(repeatIcon);
        }
        // --- PATCH: Replace task-inner with scroll wrapper and fixed chin ---
        const scrollWrapper = document.createElement("div");
        scrollWrapper.className = "task-scroll-wrapper";
        const taskInner = document.createElement("div");
        taskInner.className = "task-inner";
        const fixedChin = document.createElement("div");
        fixedChin.className = "fixed-chin";
        scrollWrapper.appendChild(taskInner);
        scrollWrapper.appendChild(fixedChin);
        // Determine if this is a non-task note (content starts with '* ')
        const isNote = task.content?.trim().startsWith("* ");
        if (isNote) {
            const noteContent = document.createElement("div");
            noteContent.className = "task-content";
            const titleSpan = document.createElement("span");
            titleSpan.className = "task-title";
            titleSpan.textContent = task.content.trim().substring(2);
            noteContent.appendChild(titleSpan);
            taskInner.appendChild(noteContent);
            row.appendChild(scrollWrapper);
        }
        else {
            this.setupTaskInteractions(row, task, taskInner, apiKey, listWrapper, filters);
            const rowCheckbox = this.createPriorityCheckbox(task.priority, async () => {
                if (rowCheckbox.checked) {
                    await this.completeTask(task.id);
                    const taskRow = document.getElementById(task.id);
                    if (taskRow)
                        taskRow.remove();
                    await this.savePluginData();
                    this.handleQueueCompletion(listWrapper);
                }
            });
            rowCheckbox.classList.add(`priority-${task.priority}`);
            // PATCH: Move checkbox out of .task-inner and into .task before scrollWrapper
            row.appendChild(rowCheckbox);
            // --- PATCH: Insert parent-icon using setIcon if hasChildren, after checkbox, before scrollWrapper ---
            if (hasChildren) {
                const icon = document.createElement("span");
                icon.classList.add("parent-icon");
                obsidian.setIcon(icon, "list-tree");
                row.appendChild(icon);
            }
            row.appendChild(scrollWrapper);
            const left = this.createTaskContent(task, projectMap, labelMap, labelColorMap, projects);
            taskInner.appendChild(left);
            const deadline = this.createTaskDeadline(task);
            row.appendChild(deadline);
        }
        return row;
    }
    setupTaskInteractions(row, task, taskInner, apiKey, listWrapper, filters) {
        let tapStartX = 0;
        let tapStartY = 0;
        row.addEventListener("pointerdown", (e) => {
            if (row.classList.contains("subtask-row"))
                return;
            tapStartX = e.clientX;
            tapStartY = e.clientY;
        });
        row.addEventListener("pointerup", (e) => {
            const isCheckbox = e.target.closest('input[type="checkbox"]');
            if (isCheckbox)
                return;
            const dx = Math.abs(e.clientX - tapStartX);
            const dy = Math.abs(e.clientY - tapStartY);
            if (dx > 5 || dy > 5)
                return;
            e.stopPropagation();
            // --- Subtask expand/collapse logic ---
            if (row.classList.contains("subtask-row")) {
                const alreadyExpanded = row.classList.contains("expanded-subtask");
                document.querySelectorAll(".subtask-row.expanded-subtask").forEach(el => {
                    el.classList.remove("expanded-subtask");
                });
                if (!alreadyExpanded) {
                    row.classList.add("expanded-subtask");
                }
                return;
            }
            // Instead of handling subtask-row here, let handleTaskSelection handle it with event
            this.handleTaskSelection(row, task, apiKey, e);
        });
        this.setupTaskDragAndDrop(row, listWrapper, filters);
    }
    handleTaskSelection(row, task, apiKey, event) {
        // If the event originated from within a subtask-row, skip parent selection/deselection
        if (event) {
            const target = event.target;
            if (target.closest(".subtask-row"))
                return;
        }
        // If already selected, deselect on second click
        if (row.classList.contains("selected-task")) {
            this.deselectTask(row);
            return;
        }
        const titleSpan = row.querySelector(".task-title");
        const rowCheckbox = row.querySelector("input[type='checkbox']");
        const metaSpan = row.querySelector(".task-metadata");
        // Add no-transition and freeze-transition classes as per new logic
        document.querySelectorAll('.task').forEach(t => {
            t.classList.add('no-transition');
            if (!t.classList.contains('selected-task')) {
                t.classList.add('freeze-transition');
            }
        });
        // Updated deselection logic to allow simultaneous deselect and select transitions
        document.querySelectorAll(".selected-task").forEach(el => {
            if (el !== row) {
                el.classList.add("task-deselecting");
                el.classList.remove("selected-task");
                setTimeout(() => {
                    el.classList.remove("task-deselecting");
                    const titleSpan = el.querySelector(".task-title");
                    const rowCheckbox = el.querySelector("input[type='checkbox']");
                    const metaSpan = el.querySelector(".task-metadata");
                    const desc = el.querySelector(".task-description");
                    if (titleSpan)
                        titleSpan.classList.remove("task-title-selected");
                    if (rowCheckbox)
                        rowCheckbox.classList.remove("task-checkbox-selected");
                    if (metaSpan)
                        metaSpan.classList.remove("task-meta-selected");
                    if (desc)
                        desc.classList.remove("show-description");
                    const toolbar = document.getElementById("mini-toolbar");
                    if (toolbar)
                        toolbar.remove();
                }, 300);
            }
        });
        // Apply new selection immediately
        row.classList.add("selected-task");
        if (row.classList.contains("selected-task")) {
            this.selectTask(row, task, titleSpan, rowCheckbox, metaSpan, apiKey);
            // Remove transition classes after selecting the new task
            requestAnimationFrame(() => {
                document.querySelectorAll('.task').forEach(t => {
                    t.classList.remove('no-transition');
                    t.classList.remove('freeze-transition');
                });
            });
        }
        else {
            this.deselectTask(row);
            // Remove transition classes after frame if deselecting
            requestAnimationFrame(() => {
                document.querySelectorAll('.task').forEach(t => {
                    t.classList.remove('no-transition');
                    t.classList.remove('freeze-transition');
                });
            });
        }
    }
    // ======================= ✴️ Task Selection Logic =======================
    selectTask(row, task, titleSpan, rowCheckbox, metaSpan, apiKey) {
        titleSpan.classList.add("task-title-selected");
        rowCheckbox.classList.add("task-checkbox-selected");
        metaSpan.classList.add("task-meta-selected");
        row.classList.add("selected-task");
        // Removed code that adds .show-description to .task-description
        this.createMiniToolbar(row, task, apiKey);
        // No dynamic transform here; handled by CSS.
    }
    deselectTask(row) {
        // row.classList.add("task-deselecting"); // Removed as per instructions
        const toolbar = document.getElementById("mini-toolbar");
        if (toolbar)
            toolbar.remove();
        setTimeout(() => {
            row.classList.remove("selected-task", "task-deselecting");
            const titleSpan = row.querySelector(".task-title");
            const rowCheckbox = row.querySelector("input[type='checkbox']");
            const metaSpan = row.querySelector(".task-metadata");
            const desc = row.querySelector(".task-description");
            if (titleSpan)
                titleSpan.classList.remove("task-title-selected");
            if (rowCheckbox)
                rowCheckbox.classList.remove("task-checkbox-selected");
            if (metaSpan) {
                metaSpan.classList.remove("task-meta-selected");
                // Remove transform reset; handled by CSS now.
            }
            if (desc)
                desc.classList.remove("show-description");
        }, 200);
    }
    // ======================= 🧰 Mini Toolbar =======================
    createMiniToolbar(row, task, apiKey) {
        const oldWrapper = document.getElementById("mini-toolbar-wrapper");
        if (oldWrapper)
            oldWrapper.remove();
        const wrapper = document.createElement("div");
        wrapper.id = "mini-toolbar-wrapper";
        wrapper.className = "mini-toolbar-wrapper fixed-chin";
        const chinContainer = document.createElement("div");
        chinContainer.className = "chin-inner";
        // Today button
        const todayBtn = document.createElement("button");
        todayBtn.className = "chin-btn today-btn";
        obsidian.setIcon(todayBtn, "calendar");
        todayBtn.append("Today");
        todayBtn.setAttribute("data-index", "0");
        todayBtn.onclick = () => this.setTaskToToday(task.id, apiKey, chinContainer, todayBtn);
        // Add date subtitle after SVG icon
        const subtitle = document.createElement("p");
        subtitle.className = "date-subtitle";
        // Show today's date as just the day of the month
        subtitle.textContent = String(new Date().getDate());
        todayBtn.appendChild(subtitle);
        chinContainer.appendChild(todayBtn);
        // Tomorrow button
        const tmrwBtn = document.createElement("button");
        tmrwBtn.className = "chin-btn tomorrow-btn";
        obsidian.setIcon(tmrwBtn, "sunrise");
        tmrwBtn.append("Tmrw");
        tmrwBtn.setAttribute("data-index", "1");
        tmrwBtn.onclick = () => this.deferTask(task.id, apiKey, chinContainer);
        chinContainer.appendChild(tmrwBtn);
        // Edit button
        const editBtn = document.createElement("button");
        editBtn.className = "chin-btn edit-btn";
        obsidian.setIcon(editBtn, "pencil");
        editBtn.append("Edit");
        editBtn.setAttribute("data-index", "2");
        editBtn.onclick = () => {
            let filters = [];
            const board = row.closest(".todoist-board");
            if (board && board.hasAttribute("data-current-filter")) {
                filters = [board.getAttribute("data-current-filter")];
            }
            if (!filters.length)
                filters = ["today"];
            this.openEditTaskModal(task, row, filters);
        };
        chinContainer.appendChild(editBtn);
        // Delete button
        const deleteBtn = document.createElement("button");
        deleteBtn.className = "chin-btn delete-btn";
        obsidian.setIcon(deleteBtn, "trash");
        deleteBtn.setAttribute("data-index", "3");
        deleteBtn.onclick = () => this.deleteTask(task.id, apiKey, chinContainer);
        chinContainer.appendChild(deleteBtn);
        wrapper.appendChild(chinContainer);
        row.appendChild(wrapper);
        wrapper.addEventListener("click", (e) => e.stopPropagation());
    }
    // ======================= ✏️ Edit Task Modal =======================
    // --- Edit Task Modal ---
    openEditTaskModal(task, row, filters) {
        // At the very start, replace task with latest version from localStorage if available
        const currentFilter = filters.join(",");
        const cachedTasksKey = `todoistTasksCache:${currentFilter}`;
        const cachedTasks = JSON.parse(localStorage.getItem(cachedTasksKey) || "[]");
        const latestTask = cachedTasks.find((t) => t.id === task.id);
        if (latestTask)
            task = latestTask;
        // Utility functions with taskmodal- prefix
        const createEl = (tag, opts = {}) => {
            const el = document.createElement(tag);
            if (opts.cls)
                el.className = opts.cls;
            if (opts.text)
                el.textContent = opts.text;
            if (opts.type)
                el.type = opts.type;
            if (opts.value !== undefined)
                el.value = opts.value;
            if (opts.attr)
                for (const k in opts.attr)
                    el.setAttribute(k, opts.attr[k]);
            return el;
        };
        const createDiv = (cls) => {
            if (typeof cls === "string") {
                return createEl("div", { cls });
            }
            return createEl("div");
        };
        // Modal from Obsidian
        let Modal;
        try {
            ({ Modal } = require("obsidian"));
        }
        catch (e) {
            Modal = window.Modal;
        }
        const modal = new Modal(this.app);
        modal.containerEl.classList.add("todoist-edit-task-modal");
        // --- Ensure project and label metadata is loaded before building dropdown ---
        (async () => {
            if (!this.projectCache || this.projectCache.length === 0) {
                const metadata = await this.fetchMetadataFromSync(this.settings.apiKey);
                this.projectCache = metadata.projects;
                this.labelCache = metadata.labels;
            }
            // After preloading filters, update badge count for current filter
            await this.preloadFilters();
            const currentFilter = document.querySelector(".todoist-board")?.getAttribute("data-current-filter") || "";
            const badge = document.querySelector(`.filter-row[data-filter="${currentFilter}"] .filter-badge-count`);
            if (badge) {
                const cache = JSON.parse(localStorage.getItem(`todoistTasksCache:${currentFilter}`) || "[]");
                badge.textContent = String(cache.length);
            }
            // Outer wrapper
            const wrapper = createDiv("taskmodal-wrapper");
            // Title field
            const titleField = createDiv("taskmodal-title-field");
            const titleLabel = createEl("label", { cls: "taskmodal-label", text: "Task Title" });
            const titleInput = createEl("input", { cls: "taskmodal-title-input", type: "text", value: task.content });
            titleField.appendChild(titleLabel);
            titleField.appendChild(titleInput);
            wrapper.appendChild(titleField);
            // Description field
            const descField = createDiv("taskmodal-description-field");
            const descLabel = createEl("label", { cls: "taskmodal-label", text: "Description" });
            const descInput = createEl("textarea", { cls: "taskmodal-description-input" });
            descInput.value = task.description ?? "";
            descField.appendChild(descLabel);
            descField.appendChild(descInput);
            wrapper.appendChild(descField);
            // Date row
            const dateField = createDiv("taskmodal-date-field");
            const dateLabel = createEl("label", { cls: "taskmodal-date-label", text: "📅 Due Date" });
            const dateRow = createDiv("taskmodal-date-input-row");
            const dueInput = createEl("input", { cls: "taskmodal-date-input", type: "date", value: task.due?.date ?? "" });
            const clearDateBtn = createEl("button", { cls: "taskmodal-clear-date", text: "✕" });
            clearDateBtn.title = "Clear Due Date";
            clearDateBtn.onclick = () => { dueInput.value = ""; };
            dateRow.appendChild(dueInput);
            dateRow.appendChild(clearDateBtn);
            dateField.appendChild(dateLabel);
            dateField.appendChild(dateRow);
            // Project select
            const projectField = createDiv("taskmodal-project-field");
            const projectLabel = createEl("label", { cls: "taskmodal-project-label", text: "🗂️ Project" });
            const projectSelect = createEl("select", { cls: "taskmodal-project-select" });
            const projects = Array.isArray(this.projectCache) ? this.projectCache : [];
            for (const project of projects) {
                const option = createEl("option");
                option.value = project.id;
                option.textContent = project.name;
                // Use string comparison for project id selection
                if (String(task.projectId) === String(project.id)) {
                    option.selected = true;
                }
                projectSelect.appendChild(option);
            }
            projectField.appendChild(projectLabel);
            projectField.appendChild(projectSelect);
            // --- Group project and date fields into a row ---
            const projectAndDateRow = createDiv("taskmodal-row");
            projectAndDateRow.appendChild(projectField);
            projectAndDateRow.appendChild(dateField);
            wrapper.appendChild(projectAndDateRow);
            // Labels
            const labelField = createDiv("taskmodal-labels-field");
            const labelLabel = createEl("label", { cls: "taskmodal-labels-label", text: "🏷️ Labels" });
            const labelList = createDiv("taskmodal-label-list");
            // --- PATCH: Robust label cache handling ---
            const labelListData = Array.isArray(this.labelCache)
                ? this.labelCache
                : Array.isArray(this.labelCache?.results)
                    ? this.labelCache.results
                    : [];
            labelListData.forEach((label) => {
                const labelCheckbox = createEl("label", { cls: "taskmodal-label-checkbox" });
                const checkbox = createEl("input", { type: "checkbox" });
                checkbox.value = label.name;
                checkbox.checked = task.labels.includes(label.name);
                labelCheckbox.appendChild(checkbox);
                labelCheckbox.append(label.name);
                labelList.appendChild(labelCheckbox);
            });
            labelField.appendChild(labelLabel);
            labelField.appendChild(labelList);
            wrapper.appendChild(labelField);
            // Button row
            const buttonRow = createDiv("taskmodal-button-row");
            const cancelBtn = createEl("button", { cls: "taskmodal-button-cancel", text: "Cancel" });
            cancelBtn.onclick = () => modal.close();
            const saveBtn = createEl("button", { cls: "taskmodal-button-save", text: "Save" });
            saveBtn.onclick = async () => {
                const newTitle = titleInput.value.trim();
                const newDesc = descInput.value.trim();
                const newDue = dueInput.value;
                const newProjectId = projectSelect.value;
                if (!newTitle)
                    return;
                // Save the original projectId and labels before mutating task
                const originalProjectId = task.projectId;
                const originalLabels = [...task.labels];
                // Gather checked labels from custom checkbox list
                const selectedLabels = Array.from(labelList.querySelectorAll("input:checked")).map(cb => cb.value);
                // Immediately replace the task in cache with edited version (but do NOT mutate task yet)
                const editedTask = {
                    ...task,
                    content: newTitle,
                    description: newDesc,
                    due: newDue ? { date: newDue } : null,
                    projectId: Number(newProjectId),
                    labels: selectedLabels
                };
                // Do NOT mutate task here. (Moved mutation to after fetch.)
                // task.content = editedTask.content;
                // task.description = editedTask.description;
                // task.due = editedTask.due;
                // task.projectId = editedTask.projectId;
                // task.labels = editedTask.labels;
                // Save to localStorage
                const updatedTasks = cachedTasks.map((t) => t.id === task.id ? editedTask : t);
                localStorage.setItem(cachedTasksKey, JSON.stringify(updatedTasks));
                localStorage.setItem(`todoistTasksCacheTimestamp:${currentFilter}`, String(Date.now()));
                // Show pulsing orange sync indicator (sync in progress) - DELAYED VERSION
                setTimeout(() => {
                    const updatedRow = document.getElementById(task.id);
                    if (!updatedRow) {
                        console.warn("❌ Could not find row for sync indicator", task.id);
                        return;
                    }
                    const oldIndicator = updatedRow.querySelector(".change-indicator");
                    if (oldIndicator)
                        oldIndicator.remove();
                    const newIndicator = document.createElement("span");
                    newIndicator.className = "change-indicator";
                    newIndicator.style.position = "absolute";
                    newIndicator.style.bottom = "4px";
                    newIndicator.style.right = "4px";
                    newIndicator.style.width = "8px";
                    newIndicator.style.height = "8px";
                    newIndicator.style.borderRadius = "50%";
                    newIndicator.style.backgroundColor = "orange";
                    newIndicator.style.opacity = "0.8";
                    newIndicator.style.zIndex = "10";
                    newIndicator.style.animation = "pulse 1s infinite";
                    newIndicator.title = "Syncing...";
                    updatedRow.style.position = "relative";
                    updatedRow.appendChild(newIndicator);
                    // console.log("✅ Appended sync indicator (delayed)");
                }, 100);
                // Rerender from updated localStorage
                document.querySelectorAll(".todoist-board").forEach((el) => {
                    const container = el;
                    const source = container.getAttribute("data-current-filter") || "";
                    container.innerHTML = "";
                    this.renderTodoistBoard(container, source, {}, this.settings.apiKey);
                });
                // Now close the modal after UI and storage updates
                modal.close();
                setTimeout(async () => {
                    // --- PATCH: Use conditional update body and POST as per new instructions ---
                    const updateBody = {};
                    if (newTitle !== task.content)
                        updateBody.content = newTitle;
                    if (newDesc !== task.description)
                        updateBody.description = newDesc;
                    if (newDue !== (task.due?.date ?? "")) {
                        if (newDue)
                            updateBody.due_date = newDue;
                        else
                            updateBody.due_string = "no date";
                    }
                    // Removed projectId update from updateBody here
                    if (JSON.stringify(selectedLabels) !== JSON.stringify(originalLabels)) {
                        updateBody.labels = selectedLabels;
                    }
                    // --- Ensure at least one accepted field for Todoist API ---
                    const requiredFields = ["content", "description", "due_date", "due_string", "labels"];
                    const updateKeys = Object.keys(updateBody);
                    const hasRequiredField = updateKeys.some(k => requiredFields.includes(k));
                    if (!hasRequiredField) {
                        updateBody.content = task.content; // Add fallback to satisfy API
                    }
                    // Log the constructed update body before sending the fetch request
                    console.log("Sending update to Todoist:", updateBody);
                    const result = await fetch(`https://api.todoist.com/rest/v2/tasks/${task.id}`, {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${this.settings.apiKey}`,
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(updateBody)
                    });
                    const data = await result.text();
                    console.log("Todoist update response:", result.status, data);
                    // After updating content/description/due/labels, move project if needed
                    if (Number(newProjectId) !== Number(originalProjectId)) {
                        await fetch("https://api.todoist.com/sync/v9/sync", {
                            method: "POST",
                            headers: {
                                Authorization: `Bearer ${this.settings.apiKey}`,
                                "Content-Type": "application/x-www-form-urlencoded"
                            },
                            body: new URLSearchParams({
                                sync_token: "*",
                                resource_types: '["items"]',
                                commands: JSON.stringify([
                                    {
                                        type: "item_move",
                                        uuid: crypto.randomUUID(),
                                        args: {
                                            id: task.id,
                                            projectId: Number(newProjectId)
                                        }
                                    }
                                ])
                            })
                        });
                        // PATCH: update project dropdown to reflect new project in case the modal is still open
                        const selectedOption = [...projectSelect.options].find(o => o.value === String(newProjectId));
                        if (selectedOption)
                            selectedOption.selected = true;
                    }
                    // --- Now, after the updateBody and fetch, mutate the task object properties ---
                    task.content = newTitle;
                    task.description = newDesc;
                    task.due = newDue ? { date: newDue } : null;
                    task.projectId = Number(newProjectId);
                    task.labels = selectedLabels;
                    await this.savePluginData();
                    // PATCH: rerender all code blocks after save
                    const markdownEls = document.querySelectorAll("pre > code.language-todoist-board");
                    markdownEls.forEach((el) => {
                        const pre = el.parentElement;
                        const container = document.createElement("div");
                        pre.replaceWith(container);
                        this.renderTodoistBoard(container, `filter: ${filters.join(",")}`, {}, this.settings.apiKey);
                    });
                    // --- PATCH: After modal is closed and DOM is updated, refresh metadata and rerender boards ---
                    const refreshedMetadata = await this.fetchMetadataFromSync(this.settings.apiKey);
                    this.labelCache = refreshedMetadata.labels;
                    // Optionally rerender all todoist-board containers with fresh metadata
                    document.querySelectorAll(".todoist-board").forEach((el) => {
                        const container = el;
                        const source = container.getAttribute("data-current-filter") || "";
                        container.innerHTML = "";
                        this.renderTodoistBoard(container, source, {}, this.settings.apiKey);
                    });
                    // --- NEW: Sync indicator logic ---
                    const updatedIndicator = document.getElementById(task.id)?.querySelector(".change-indicator");
                    if (result.ok) {
                        // --- PATCH: Update localStorage with the edited task after confirmed sync ---
                        const tasksKey = `todoistTasksCache:${currentFilter}`;
                        const storedTasks = JSON.parse(localStorage.getItem(tasksKey) || "[]");
                        const updatedTasksAfterSync = storedTasks.map((t) => t.id === task.id
                            ? {
                                ...t,
                                content: newTitle,
                                description: newDesc,
                                due: newDue ? { date: newDue } : null,
                                projectId: Number(newProjectId),
                                labels: selectedLabels
                            }
                            : t);
                        localStorage.setItem(tasksKey, JSON.stringify(updatedTasksAfterSync));
                        localStorage.setItem(`todoistTasksCacheTimestamp:${currentFilter}`, String(Date.now()));
                        if (updatedIndicator) {
                            updatedIndicator.style.animation = "none";
                            updatedIndicator.style.backgroundColor = "limegreen";
                            updatedIndicator.title = "Synced";
                            setTimeout(() => updatedIndicator.remove(), 1000);
                        }
                    }
                    else if (updatedIndicator) {
                        updatedIndicator.style.animation = "none";
                        updatedIndicator.style.backgroundColor = "red";
                        updatedIndicator.title = "Failed to sync";
                    }
                }, 0);
            };
            buttonRow.appendChild(cancelBtn);
            buttonRow.appendChild(saveBtn);
            wrapper.appendChild(buttonRow);
            modal.contentEl.appendChild(wrapper);
        })();
        modal.open();
        if (!this.projectCache || !this.labelCache) {
            this.fetchMetadataFromSync(this.settings.apiKey).then(metadata => {
                this.projectCache = Array.isArray(metadata.projects)
                    ? metadata.projects
                    : Array.isArray(metadata.projects?.results)
                        ? metadata.projects.results
                        : [];
                this.labelCache = Array.isArray(metadata.labels)
                    ? metadata.labels
                    : Array.isArray(metadata.labels?.results)
                        ? metadata.labels.results
                        : [];
                this.projectCacheTimestamp = Date.now();
                this.labelCacheTimestamp = Date.now();
                const projectSelect = modal.contentEl.querySelector(".taskmodal-project-select");
                if (projectSelect && Array.isArray(this.projectCache)) {
                    projectSelect.innerHTML = "";
                    for (const project of this.projectCache) {
                        const option = document.createElement("option");
                        option.value = project.id;
                        option.textContent = project.name;
                        if (project.id === task.projectId)
                            option.selected = true;
                        projectSelect.appendChild(option);
                    }
                }
                const labelList = modal.contentEl.querySelector(".taskmodal-label-list");
                if (labelList && Array.isArray(this.labelCache)) {
                    labelList.innerHTML = "";
                    const labelListData = Array.isArray(this.labelCache)
                        ? this.labelCache
                        : Array.isArray(this.labelCache?.results)
                            ? this.labelCache.results
                            : [];
                    labelListData.forEach((label) => {
                        const labelCheckbox = document.createElement("label");
                        labelCheckbox.className = "taskmodal-label-checkbox";
                        const checkbox = document.createElement("input");
                        checkbox.type = "checkbox";
                        checkbox.value = label.name;
                        checkbox.checked = Array.isArray(task.labels) && task.labels.includes(label.name);
                        labelCheckbox.appendChild(checkbox);
                        labelCheckbox.append(label.name);
                        labelList.appendChild(labelCheckbox);
                    });
                }
            });
        }
    }
    // ======================= 📆 Quick Actions (Today, Tmrw, Delete) =======================
    async setTaskToToday(taskId, apiKey, toolbar, btn) {
        if (btn?._busy)
            return;
        btn._busy = true;
        const oldText = btn.innerText;
        btn.innerText = "⏳";
        try {
            const today = new Date();
            const iso = today.toISOString().split("T")[0];
            const resp = await fetch(`https://api.todoist.com/rest/v2/tasks/${taskId}`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${apiKey}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ due_date: iso })
            });
            if (resp.ok) {
                btn.innerText = "🎉";
                setTimeout(() => {
                    this.taskCache = {};
                    this.taskCacheTimestamps = {};
                    const taskRow = document.getElementById(taskId);
                    if (taskRow)
                        taskRow.remove();
                }, 900);
            }
            else {
                btn.innerText = "❌";
                alert("Failed to update task.");
            }
        }
        catch (err) {
            btn.innerText = "❌";
            alert("Error: " + String(err));
        }
        finally {
            setTimeout(() => {
                btn._busy = false;
                btn.innerText = oldText;
            }, 900);
        }
    }
    async deferTask(taskId, apiKey, toolbar) {
        const btn = toolbar.querySelector('.chin-btn[data-index="1"]');
        if (btn._busy)
            return;
        btn._busy = true;
        const oldText = btn.innerText;
        btn.innerText = "⏳";
        try {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            const iso = tomorrow.toISOString().split("T")[0];
            const resp = await fetch(`https://api.todoist.com/rest/v2/tasks/${taskId}`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${apiKey}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ "due_date": iso })
            });
            if (resp.ok) {
                btn.innerText = "🎉";
                setTimeout(() => {
                    this.taskCache = {};
                    this.taskCacheTimestamps = {};
                    // PATCH: Remove the task element from the DOM manually
                    const taskRow = document.getElementById(taskId);
                    if (taskRow)
                        taskRow.remove();
                    // Will trigger re-render on next filter click
                }, 900);
            }
            else {
                btn.innerText = "❌";
                alert("Failed to update task. Try again.");
            }
        }
        catch (err) {
            btn.innerText = "❌";
            alert("Error updating task: " + String(err));
        }
        finally {
            setTimeout(() => {
                btn._busy = false;
                btn.innerText = oldText;
            }, 900);
        }
    }
    async deleteTask(taskId, apiKey, toolbar) {
        if (!confirm("Delete this task? This action cannot be undone."))
            return;
        const btn = toolbar.querySelector('.chin-btn[data-index="3"]');
        if (btn._busy)
            return;
        btn._busy = true;
        btn.innerText = "⏳";
        try {
            const resp = await fetch(`https://api.todoist.com/rest/v2/tasks/${taskId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${apiKey}`
                }
            });
            if (resp.ok) {
                btn.innerText = "✅";
                setTimeout(() => {
                    this.taskCache = {};
                    this.taskCacheTimestamps = {};
                    // PATCH: Remove the task element from the DOM manually
                    const taskRow = document.getElementById(taskId);
                    if (taskRow)
                        taskRow.remove();
                    // Will trigger re-render on next filter click
                }, 900);
            }
            else {
                btn.innerText = "❌";
                alert("Failed to delete task.");
            }
        }
        catch (err) {
            btn.innerText = "❌";
            alert("Error deleting task: " + String(err));
        }
        finally {
            setTimeout(() => {
                btn._busy = false;
                btn.innerText = "🗑";
            }, 900);
        }
    }
    handleQueueCompletion(listWrapper) {
        const tasks = Array.from(listWrapper.querySelectorAll(".task"))
            .filter(el => {
            const elHtml = el;
            return !elHtml.classList.contains("completed") && elHtml.offsetParent !== null;
        });
        const next = tasks[0];
        if (next) {
            // Remove queue-dimmed
            next.classList.remove("queue-dimmed");
            // Select the task as if clicked
            requestAnimationFrame(() => {
                next.scrollIntoView({ behavior: "smooth", block: "center" });
                requestAnimationFrame(() => {
                    next.dispatchEvent(new PointerEvent("pointerup", { bubbles: true }));
                });
            });
        }
    }
    // ======================= 🧱 Task Content Building =======================
    createTaskContent(task, projectMap, labelMap, labelColorMap, projects) {
        const left = document.createElement("div");
        left.className = "task-content";
        const titleSpan = document.createElement("span");
        titleSpan.innerHTML = "";
        obsidian.MarkdownRenderer.renderMarkdown(task.content, titleSpan, "", this);
        titleSpan.className = "task-title";
        const metaSpan = document.createElement("small");
        metaSpan.className = "task-metadata";
        const pills = this.createTaskPills(task, projectMap, labelMap, labelColorMap, projects);
        pills.forEach(pill => metaSpan.appendChild(pill));
        const descEl = document.createElement("div");
        descEl.className = "task-description";
        if (typeof task.description === "string" && task.description.trim()) {
            descEl.textContent = task.description;
        }
        else {
            descEl.textContent = " ";
            descEl.classList.add("desc-empty");
        }
        const contentWrapper = document.createElement("div");
        contentWrapper.className = "task-content-wrapper";
        contentWrapper.appendChild(titleSpan);
        contentWrapper.appendChild(descEl);
        if (metaSpan)
            contentWrapper.appendChild(metaSpan);
        left.appendChild(contentWrapper);
        return left;
    }
    createTaskPills(task, projectMap, labelMap, labelColorMap, projects) {
        const pills = [];
        // Due date pill
        const duePill = this.createDuePill(task.due?.date);
        if (duePill)
            pills.push(duePill);
        // Project pill
        const projectPill = this.createProjectPill(task.projectId, projectMap, projects);
        if (projectPill)
            pills.push(projectPill);
        // Label pill
        const labelPill = this.createLabelPill(task.labels, labelMap, labelColorMap);
        if (labelPill)
            pills.push(labelPill);
        return pills.filter(pill => pill.style.display !== "none");
    }
    createDuePill(dueDate) {
        if (!dueDate)
            return null;
        const duePill = document.createElement("span");
        duePill.className = "pill";
        duePill.setAttribute("data-type", "due");
        const due = new Date(dueDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        const diffDays = Math.floor((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays < 0)
            duePill.classList.add("overdue");
        else if (diffDays === 0)
            duePill.classList.add("today");
        else if (diffDays <= 2)
            duePill.classList.add("soon");
        else
            duePill.classList.add("future");
        if (due.toDateString() === today.toDateString()) {
            duePill.textContent = "Today";
        }
        else if (due.toDateString() === tomorrow.toDateString()) {
            duePill.textContent = "Tomorrow";
        }
        else {
            duePill.textContent = due.toLocaleDateString("en-US", { month: "short", day: "numeric" });
        }
        return duePill;
    }
    createProjectPill(projectId, projectMap, projects) {
        if (!projectId)
            return null;
        const projectPill = document.createElement("span");
        projectPill.className = "pill project-pill";
        projectPill.setAttribute("data-type", "project");
        const projName = projectMap[projectId] || "Unknown Project";
        const projectColorId = projects.find((p) => p.id === projectId)?.color;
        const projectHexColor = TODOIST_COLORS[projectColorId];
        projectPill.innerHTML = projName === "Inbox"
            ? `<span class="project-hash" style="color:${projectHexColor};">#</span> 📥 Inbox`
            : `<span class="project-hash" style="color:${projectHexColor};">#</span> ${projName}`;
        return projectPill;
    }
    createLabelPill(labels, labelMap, labelColorMap) {
        if (!labels || labels.length === 0)
            return null;
        const labelPill = document.createElement("span");
        labelPill.className = "pill label-pill";
        labelPill.setAttribute("data-type", "label");
        labelPill.innerHTML = labels.map((id) => {
            const name = labelMap[id] || id;
            const color = labelColorMap[id] || "#9333ea";
            return `<span><span style="color:${color}; font-size: 1.05em;">@ </span>${name}</span>`;
        }).join(`<span class="label-separator">,</span>`);
        return labelPill;
    }
    createTaskDeadline(task) {
        const right = document.createElement("div");
        right.className = "task-deadline";
        const deadline = task.deadline?.date;
        if (!deadline)
            return right;
        const deadlineWrapper = document.createElement("div");
        deadlineWrapper.className = "deadline-wrapper";
        const deadlineLabel = document.createElement("div");
        deadlineLabel.textContent = "🎯 deadline";
        deadlineLabel.className = "deadline-label";
        const deadlinePill = document.createElement("div");
        deadlinePill.className = "pill deadline-date";
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const deadlineDate = new Date(deadline);
        deadlineDate.setHours(0, 0, 0, 0);
        const diffTime = deadlineDate.getTime() - today.getTime();
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
        let deadlineText = "";
        if (diffDays === 0) {
            deadlineText = "Today";
        }
        else if (diffDays === 1) {
            deadlineText = "Tomorrow";
        }
        else if (diffDays > 1 && diffDays <= 5) {
            deadlineText = `In ${diffDays} days`;
        }
        else {
            const options = { month: "short", day: "numeric" };
            deadlineText = deadlineDate.toLocaleDateString("en-US", options);
        }
        deadlinePill.textContent = deadlineText;
        deadlineWrapper.appendChild(deadlineLabel);
        deadlineWrapper.appendChild(deadlinePill);
        right.appendChild(deadlineWrapper);
        return right;
    }
    // ======================= 🖱️ Drag & Drop =======================
    setupTaskDragAndDrop(row, listWrapper, filters) {
        let lastTap = 0;
        row.onpointerdown = (ev) => {
            // PATCH: Ignore pointerdown if it's on the mini-toolbar/fixed-chin
            if (ev.target?.closest(".fixed-chin"))
                return;
            // console.log("🔽 pointerdown", ev.pointerType, ev.clientX, ev.clientY);
            const tapNow = Date.now();
            if (tapNow - lastTap < 300)
                return;
            if (ev.target.closest('input[type="checkbox"]')) {
                return;
            }
            const isTouch = ev.pointerType === "touch" || ev.pointerType === "pen";
            const startX = ev.clientX;
            const startY = ev.clientY;
            let longPressTimer = null;
            let dragging = false;
            let pid = ev.pointerId;
            // NEW:
            const beginDrag = (e) => {
                // console.log("🏁 beginDrag");
                if (dragging)
                    return;
                // console.log("🎯 drag initialized");
                dragging = true;
                const listView = listWrapper.closest(".list-view");
                if (listView) {
                    listView.classList.add("drag-scroll-block");
                    listView.style.touchAction = "none";
                }
                // NOW prevent default since we're starting a drag
                if (e && e.cancelable) {
                    e.preventDefault();
                    e.stopPropagation();
                }
                // NOW set these drag properties
                row.style.touchAction = "none";
                document.body.classList.add("drag-disable");
                document.body.style.overflow = 'hidden';
                document.body.style.position = 'fixed';
                document.body.style.width = '100%';
                document.body.style.height = '100%';
                // PATCH: Prevent select on iOS during drag
                document.body.style.webkitUserSelect = 'none';
                document.body.style.userSelect = 'none';
                listWrapper.style.touchAction = 'none';
                // NEW (reuse the existing listView variable):
                if (listView) {
                    listView.style.touchAction = "none";
                    listView.style.overflow = "hidden";
                }
                // PATCH: Also block touchAction on .list-view
                if (listWrapper.closest(".list-view")) {
                    listWrapper.closest(".list-view").style.touchAction = "none";
                }
                document.body.style.overflow = 'hidden'; // Prevent page scroll too
                if (e)
                    e.preventDefault();
                window.getSelection()?.removeAllRanges();
                row.classList.add("dragging-row");
                // PATCH: Add classes to block drag/scroll globally
                document.body.classList.add("drag-disable");
                listWrapper.classList.add("drag-scroll-block");
                // PATCH: block scroll in list-view while dragging
                if (listView) {
                    listView.classList.add("drag-scroll-block");
                    listView.style.touchAction = "none";
                }
                const obsidianContainers = [
                    document.querySelector('.workspace-leaf-content'),
                    document.querySelector('.markdown-preview-view'),
                    document.querySelector('.cm-editor'),
                    document.querySelector('.view-content')
                ];
                obsidianContainers.forEach(container => {
                    if (container) {
                        const el = container;
                        el.style.touchAction = 'none';
                        el.style.overflow = 'hidden';
                        // Store original values to restore later
                        el.dataset.originalTouchAction = el.style.touchAction;
                        el.dataset.originalOverflow = el.style.overflow;
                    }
                });
                if (e)
                    e.preventDefault();
                if (e)
                    e.stopPropagation();
                window.getSelection()?.removeAllRanges();
                row.classList.add("dragging-row");
                // Add global drag classes
                document.body.classList.add("drag-disable");
                listWrapper.classList.add("drag-scroll-block");
                if (listView) {
                    listView.classList.add("drag-scroll-block");
                }
                // console.log("📦 Placeholder inserted");
                if (navigator.vibrate) {
                    navigator.vibrate([30, 20, 30]);
                }
                const placeholder = row.cloneNode(true);
                placeholder.id = "todoist-placeholder";
                placeholder.className = "task-placeholder";
                const rowRect = row.getBoundingClientRect();
                startY - rowRect.top;
                listWrapper.insertBefore(placeholder, row);
                const moveWhileDragging = (e) => {
                    // console.log("📍 pointermove during drag", e.clientY);
                    if (e.pointerId !== pid)
                        return;
                    e.preventDefault();
                    e.stopPropagation();
                    const rows = Array.from(listWrapper.children).filter(c => c !== row && c !== placeholder);
                    for (let i = 0; i < rows.length; i++) {
                        const other = rows[i];
                        const otherRect = other.getBoundingClientRect();
                        if (e.clientY < otherRect.top + otherRect.height / 2) {
                            listWrapper.insertBefore(placeholder, other);
                            break;
                        }
                        if (i === rows.length - 1) {
                            listWrapper.appendChild(placeholder);
                        }
                    }
                };
                const finishDrag = (e) => {
                    // console.log("✅ finishDrag");
                    if (e.pointerId !== pid)
                        return;
                    row.releasePointerCapture(pid);
                    row.removeEventListener("pointermove", moveWhileDragging);
                    row.removeEventListener("pointerup", finishDrag);
                    row.removeEventListener("pointercancel", finishDrag);
                    row.removeEventListener("lostpointercapture", finishDrag);
                    row.classList.remove("dragging-row");
                    // PATCH: unblock scroll in list-view after dragging
                    document.body.style.overflow = '';
                    document.body.style.position = '';
                    document.body.style.width = '';
                    document.body.style.height = '';
                    document.body.style.webkitUserSelect = '';
                    document.body.style.userSelect = '';
                    // PATCH: unblock scroll in list-view after dragging
                    if (listView)
                        listView.classList.remove("drag-scroll-block");
                    if (listView)
                        listView.style.touchAction = "";
                    listWrapper.style.touchAction = '';
                    if (listView) {
                        listView.style.touchAction = "";
                        listView.style.overflow = "";
                        listView.classList.remove("drag-scroll-block");
                    }
                    const obsidianContainers = [
                        document.querySelector('.workspace-leaf-content'),
                        document.querySelector('.markdown-preview-view'),
                        document.querySelector('.cm-editor'),
                        document.querySelector('.view-content')
                    ];
                    obsidianContainers.forEach(container => {
                        if (container) {
                            const el = container;
                            el.style.touchAction = el.dataset.originalTouchAction || '';
                            el.style.overflow = el.dataset.originalOverflow || '';
                            delete el.dataset.originalTouchAction;
                            delete el.dataset.originalOverflow;
                        }
                    });
                    listWrapper.insertBefore(row, placeholder);
                    placeholder.remove();
                    // console.log("📤 Drag completed and placeholder removed");
                    // PATCH: Also restore touchAction on .list-view after drag
                    if (listWrapper.closest(".list-view")) {
                        listWrapper.closest(".list-view").style.touchAction = "";
                    }
                    document.body.style.overflow = '';
                    // PATCH: Restore iOS select after drag
                    document.body.style.webkitUserSelect = '';
                    row.style.touchAction = '';
                    // PATCH: Remove drag-disable and drag-scroll-block classes
                    document.body.classList.remove("drag-disable");
                    listWrapper.classList.remove("drag-scroll-block");
                    row.style.touchAction = '';
                    document.body.classList.remove("drag-disable");
                    listWrapper.classList.remove("drag-scroll-block");
                    const newOrder = Array.from(listWrapper.children)
                        .map(c => c.getAttribute("data-id"))
                        .filter(id => id);
                    localStorage.setItem(`todoistBoardOrder:${filters.join(",")}`, JSON.stringify(newOrder));
                    this.savePluginData();
                };
                row.setPointerCapture(pid);
                row.addEventListener("pointermove", moveWhileDragging);
                row.addEventListener("pointerup", finishDrag);
                row.addEventListener("pointercancel", finishDrag);
                row.addEventListener("lostpointercapture", finishDrag);
            };
            if (isTouch) {
                let moved = false;
                const moveThreshold = 25;
                const onTouchMove = (e) => {
                    // console.log("👣 onTouchMove", e.clientX, e.clientY);
                    const dx = Math.abs(e.clientX - startX);
                    const dy = Math.abs(e.clientY - startY);
                    if (dx > moveThreshold || dy > moveThreshold) {
                        moved = true;
                        cleanup();
                    }
                };
                const cleanup = () => {
                    // console.log("🧹 Cleanup triggered");
                    if (longPressTimer !== null)
                        clearTimeout(longPressTimer);
                    row.removeEventListener('pointermove', onTouchMove);
                    row.removeEventListener('pointerup', cleanup);
                    row.removeEventListener('pointercancel', cleanup);
                    // Remove drag-scroll-block from .list-view after drag/touch cleanup
                    const listView = listWrapper.closest(".list-view");
                    if (listView) {
                        listView.classList.remove("drag-scroll-block");
                    }
                    if (listView)
                        listView.style.touchAction = "";
                    row.style.touchAction = "";
                    // PATCH: Remove drag-disable and drag-scroll-block classes
                    document.body.classList.remove("drag-disable");
                    listWrapper.classList.remove("drag-scroll-block");
                };
                // PATCH: passive: false for pointermove
                row.addEventListener('pointermove', onTouchMove, { passive: true });
                row.addEventListener('pointerup', cleanup, { passive: true });
                row.addEventListener('pointercancel', cleanup, { passive: true });
                longPressTimer = window.setTimeout(() => {
                    // console.log("⏳ Long press timer fired");
                    if (!moved) {
                        if (ev.cancelable)
                            ev.preventDefault();
                        beginDrag(ev);
                    }
                }, 150);
            }
            else if (ev.pointerType === "mouse") {
                const moveCheck = (e) => {
                    const dx = Math.abs(e.clientX - startX);
                    const dy = Math.abs(e.clientY - startY);
                    if (dx > 5 || dy > 5) {
                        row.removeEventListener("pointermove", moveCheck);
                        beginDrag(e);
                    }
                };
                row.addEventListener("pointermove", moveCheck);
                row.addEventListener("pointerup", () => {
                    row.removeEventListener("pointermove", moveCheck);
                });
            }
        };
        row.addEventListener("pointercancel", () => {
            // console.log("⚠️ pointercancel triggered");
            window.getSelection()?.removeAllRanges();
        });
    }
    setupGlobalEventListeners() {
        document.addEventListener("click", (e) => {
            const target = e.target;
            // Updated logic: if inside .fixed-chin, do nothing
            if (target.closest(".fixed-chin"))
                return;
            if (!target.closest(".task-inner")) {
                this.clearSelectedTaskHighlight();
            }
        });
    }
    clearSelectedTaskHighlight() {
        document.querySelectorAll(".selected-task").forEach((el) => {
            el.classList.remove("selected-task");
            void el.offsetWidth; // force reflow
            setTimeout(() => {
                const toolbar = el.querySelector("#mini-toolbar-wrapper");
                if (toolbar)
                    toolbar.remove();
            }, 0); // delay toolbar removal until next frame
        });
    }
    createPriorityCheckbox(priority, onChange) {
        const priorityColors = {
            4: "#d1453b", // P1 - red
            3: "#eb8909", // P2 - orange
            2: "#246fe0", // P3 - blue
            1: "#808080", // P4 - grey
        };
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "todoist-checkbox";
        const rowPrioColor = priorityColors[priority] || "#999";
        checkbox.style.borderColor = rowPrioColor;
        checkbox.style.background = `${rowPrioColor}0D`;
        // Prevent task selection when clicking checkbox
        checkbox.addEventListener("click", async (e) => {
            e.stopPropagation(); // Prevents selecting the task when checking
        });
        checkbox.addEventListener("change", async () => {
            // Find the row (task container)
            const row = checkbox.closest('.task');
            await onChange();
            // Animation and haptic feedback when marking complete
            if (checkbox.checked && row) {
                if (navigator.vibrate)
                    navigator.vibrate([20]);
                row.classList.add("task-checked-anim");
                // Add completed class and fade out
                row.classList.add("completed");
                // TypeScript fix: cast row to HTMLElement for .style
                const rowEl = row;
                rowEl.style.transition = "opacity 0.2s ease-out";
                rowEl.style.opacity = "0.4";
                setTimeout(() => {
                    // Optionally remove from DOM after 300ms
                    if (rowEl.parentElement)
                        rowEl.parentElement.removeChild(rowEl);
                }, 300);
                setTimeout(() => rowEl.classList.remove("task-checked-anim"), 200);
            }
        });
        return checkbox;
    }
    updateQueueView(active, listWrapper) {
        const rows = Array.from(listWrapper.children);
        rows.forEach((r, i) => {
            const titleSpan = r.querySelector(".task-title");
            if (!titleSpan)
                return;
            if (active) {
                if (i === 0) {
                    r.classList.remove("queue-dimmed");
                    r.classList.add("queue-focused");
                    titleSpan.classList.add("queue-focused-title");
                    r.scrollIntoView({ behavior: "smooth", block: "center", inline: "start" });
                }
                else {
                    r.classList.add("queue-dimmed");
                    r.classList.remove("queue-focused");
                    titleSpan.classList.remove("queue-focused-title");
                }
            }
            else {
                r.classList.remove("queue-dimmed", "queue-focused");
                titleSpan.classList.remove("queue-focused-title");
            }
        });
    }
}
// --- Inject task description show/hide CSS ---
const descStyle = document.createElement('style');
descStyle.textContent = `
.task-description {
  display: none;
  /* Optional for animation:
  opacity: 0;
  max-height: 0;
  transition: opacity 0.2s, max-height 0.2s;
  */
}
.selected-task .task-description,
.task-description.show-description {
  display: block;
  /* Optional for animation:
  opacity: 1;
  max-height: 200px;
  */
}
.desc-empty {
  color: #999;
  font-style: italic;
}
`;
if (!document.head.querySelector('style[data-todoist-board-desc-css]')) {
    descStyle.setAttribute('data-todoist-board-desc-css', 'true');
    document.head.appendChild(descStyle);
}
// ======================= ⚙️ Settings Tab =======================
class TodoistBoardSettingTab extends obsidian.PluginSettingTab {
    constructor(app, plugin) {
        super(app, plugin);
        this.plugin = plugin;
    }
    display() {
        const { containerEl } = this;
        containerEl.empty();
        containerEl.createEl("h2", { text: "Todoist Board Settings" });
        new obsidian.Setting(containerEl)
            .setName("🔑 Todoist API Key")
            .setDesc("Enter your Todoist API key to enable the plugin.")
            .addText((text) => {
            text
                .setPlaceholder("API Key")
                .setValue(this.plugin.settings.apiKey);
            const submitBtn = document.createElement("button");
            submitBtn.textContent = "Submit";
            submitBtn.style.marginLeft = "8px";
            const indicator = document.createElement("span");
            indicator.style.marginLeft = "8px";
            indicator.style.fontWeight = "bold";
            submitBtn.onclick = async () => {
                indicator.textContent = "⏳";
                try {
                    const res = await fetch("https://api.todoist.com/sync/v9/sync", {
                        method: "POST",
                        headers: {
                            "Authorization": `Bearer ${text.inputEl.value}`,
                            "Content-Type": "application/x-www-form-urlencoded"
                        },
                        body: new URLSearchParams({
                            sync_token: "*",
                            resource_types: JSON.stringify(["projects"])
                        })
                    });
                    if (!res.ok)
                        throw new Error("Invalid");
                    this.plugin.settings.apiKey = text.inputEl.value;
                    indicator.textContent = "✅";
                    await this.plugin.savePluginData();
                }
                catch {
                    indicator.textContent = "❌";
                }
            };
            text.inputEl.parentElement?.appendChild(submitBtn);
            text.inputEl.parentElement?.appendChild(indicator);
        });
        // --- Support My Work Button ---
        new obsidian.Setting(containerEl)
            .setName("👯‍♀️ Support My Work")
            .setDesc("If you like how this plugin is shaping up, please consider supporting my work by buying me a coffee or TEN!")
            .addButton((button) => {
            button.setButtonText("☕ Coffee Season");
            button.buttonEl.style.backgroundColor = "var(--interactive-accent)";
            button.buttonEl.style.color = "white";
            button.onClick(() => {
                window.open("https://ko-fi.com/jamiedaghaim", "_blank");
            });
        });
    }
}

exports.default = TodoistBoardPlugin;
//# sourceMappingURL=main.js.map
