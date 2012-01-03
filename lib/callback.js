
// Callback
// Copyright (c) 2011-2012 Marty Nelson <@martypdx>
// MIT Licensed

module.exports = { version: '0.0.1' }

var isDev = ( process.env.NODE_ENV !== 'production' )

Object.defineProperty(Function.prototype, 'use', {
  set: function(){},
  get: function(){
	
	if(isDev && ( this._wrapFn ? this._wrapFn.length : this.length ) < 2) {
		throw new Error('`use` is only for async functions with signature f(input, cb). Consider using `with` instead.')
	}

	var fn = this
	
	return function use_fn(transform, cb) {
		if(!cb) {
			cb = transform
			transform = null
		}
	
		return function use_cb(err, result) {
			//custom err if cb is not fn ?
			if (err) { return cb(err) }
			fn(transform ? transform(result) : result, cb)
		}
	}

  },
  configurable: true
})

Object.defineProperty(Function.prototype, 'then', {
  set: function(){},
  get: function(){

	if(isDev && this.length === 0) {
		throw new Error('`then` must be called with at least one function, if only one function it must be a callback of signature f(err, results).')
	}

	var fn = this
	
	return function then_fn() {

		var fns = Array.prototype.slice.call(arguments)
		var next = fns.pop()
		 ,	use
		while( use = fns.pop()) {
			next = use.use(next)
		}

		return fn.use(next)
	}

  },
  configurable: true
})

Object.defineProperty(Function.prototype, 'add', {
  set: function(){},
  get: function(){

	if(isDev && this.length === 0) {
		throw new Error('`add` is for async functions with signature f([arg1, [arg2, [...]],] cb) that have a cb argument at minimum.')
	}

	return function add_fn() {

		var fn = this
		 ,	args = Array.prototype.slice.call(arguments)
		 ,	cb = arguments[arguments.length-1]

		return function add_cb(err, result) {
			//check if cb is fn ?
			if (err) return cb(err)

		 	args.splice(0, 0, result)
			
			var ctx = null
			fn.apply(ctx, args)
		}
	}

  },
  configurable: true
})

Object.defineProperty(Function.prototype, 'pass', {
  set: function(){},
  get: function(){
	
	//guess that this is synchronous function with no cb
	if( ( this._wrapFn ? this._wrapFn.length : this.length ) < 2) {
		return function pass_sync_fn() {

			var fn = this
			 ,	args = arguments
			 ,	cb = arguments[arguments.length-1]

			return function pass_sync_cb(err, result) {
				if(err) throw err
				
				var ctx = null
				fn.apply(ctx, args)
			}
		}
	}

	//if(isDev && this.length === 0) {
	//	throw new Error('`pass` is for async functions with signature f([arg1, [arg2, [...]],] cb) that have a cb argument at minimum.')
	//}

	return function pass_fn() {

		var fn = this
		 ,	args = arguments
		 ,	cb = arguments[arguments.length-1]

		return function pass_cb(err, result) {
			if (err) return cb(err)
			
			var ctx = null
			fn.apply(ctx, args)
		}
	}

  },
  configurable: true
})

Object.defineProperty(Function.prototype, 'each', {
  set: function(){},
  get: function(){
	
	//guess that this is synchronous function with no cb
	if( ( this._wrapFn ? this._wrapFn.length : this.length ) < 2) {
		return function each_sync_fn(transform) {
			var fn = this
			
			return function each_sync_cb(err, result) {
				if(err) throw err
				result.forEach(function(each) {
					fn(transform ? transform(each) : each)
				})
			}
		}

	}

	return function each_fn(transform, cb) {
		var fn = this
		if(!cb) {
			cb = transform
			transform = null
		}

		return function each_cb(err, result) {
			if(err) return cb(err)
			var count = result.length // || 0 ? Or return cb(null, result) ?
			if(count === 0) return cb(null, [])

			var	errState = null
			 ,	results = []
			 ,	done = function(err, eachResult) {
					if (errState) return
					if (err) return cb(errState = err)
					if (results.push(eachResult) === count) {
						cb(null, results)	
					}
	 			}

			result.forEach(function(each) {
				fn(transform ? transform(each) : each, done)
			})
			
		}
	}

  },
  configurable: true
})

//add .filter to each return

/* cb adapters */

Object.defineProperty(Function.prototype, 'err', {
  set: function(){},
  get: function(){
	
	return function err_fn(errHandler) {
		var fn = this

		return function err_cb(err, result) {
			if (err) return errHandler(err)
			fn(err, result)
		}
	}

  },
  configurable: true
})

/* Synchronous to cb */

Object.defineProperty(Function.prototype, 'with', {
  set: function(){},
  get: function(){
	
	return function with_fn() {

		var fn = this
		 ,	args = Array.prototype.slice.call(arguments)

		return function with_cb(err, result) {
			if (err) throw err
				
		 	if(result) args.push(result)
			
			var ctx = null
			fn.apply(ctx, args)
		}
	}

  },
  configurable: true
})

Object.defineProperty(Function.prototype, 'cb', {
  set: function(){},
  get: function(){

	var fn = this

	return function cb_cb(err, result) {
		if (typeof err === 'function') {
			var transform = err
			return function cb_xform_cb(err, result) {
				if (err) throw err
				fn(transform(result))
			}

			
		} else {
			if (err) throw err
			fn(result)
		}
	}

  },
  configurable: true
})

/* adapters */

Object.defineProperty(Function.prototype, 'xform', {
  set: function(){},
  get: function(){
	
	return function xform_fn(transform) {
		var fn = this

		return function xform_cb(err, result) {
			if (err) return fn(err)
			fn(null, transform(result))
		}
	}

  },
  configurable: true
})

Object.defineProperty(Function.prototype, 'adapt', {
  set: function(){},
  get: function(){
	
	return function adapt_fn(transform) {
		var fn = this

		var adaptFn = function adapt_cb() {
			var args = Array.prototype.slice.call(arguments, 0, arguments.length-1)
		 	,	cb = arguments[arguments.length-1]
		 	, 	newcb = function(err, result){
					if (err) return cb(err)
					var targs = args.slice()
					targs.splice(0, 0, result)
					cb(null, transform.apply(null, targs))
				}

			args.push(newcb)

			var ctx = null
			fn.apply(ctx, args)
		}
		adaptFn._wrapFn = this
		return adaptFn
	}

  },
  configurable: true
})

/*
Object.defineProperty(Function.prototype, 'filter', {
  set: function(){},
  get: function(){

	var fn = this
	return function filter_fn(filter) {
		var filterFn = function filter_cb(result) {
			if( filter(result) === true ) {
				var ctx = null
				fn.apply(ctx, arguments)
			} else {
				cb = arguments[arguments.length-1]
				if(typeof cb === 'function') {
					return cb()
				}
			}
		}
		filterFn._wrapFn = this
		return filterFn
	}

  },
  configurable: true
})
*/

/* Conditional */


Object.defineProperty(Function.prototype, 'if', {
  set: function(){},
  get: function(){
	
	var fn = this

	return function if_fn(condition) {

		if (condition) {
			var pass = this
			this.else = function(){
				return pass
			}
			return pass
		} else {
			var fail = function(){}
			fail.else = function(fn){
				return fn
			}
			return fail
		}
	}

	
  },
  configurable: true
})
//consider .iif for shorter/more peformant when no else?