
var isDev = ( process.env.NODE_ENV !== 'production' )

Function.prototype.if = function(passed) {

	if (passed) {
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
//consider .iif for shorter/more peformant when no else?

Object.defineProperty(Function.prototype, 'use', {
  set: function(){},
  get: function(){
	
	if(isDev && this.length < 2) {
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

Object.defineProperty(Function.prototype, 'add', {
  set: function(){},
  get: function(){
	//console.log('pass called on f with length', this.length)
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
	
	if(isDev && this.length === 0) {
		throw new Error('`pass` is for async functions with signature f([arg1, [arg2, [...]],] cb) that have a cb argument at minimum.')
	}

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
	
	if(isDev && this.length !== 2) {
		throw new Error('`each` is for async functions with signature f(input, cb). Use `apply` or `xform` first.')
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

/* Synchronous to cb */


Object.defineProperty(Function.prototype, 'with', {
  set: function(){},
  get: function(){
	
	return function with_fn() {

		var fn = this
		 ,	args = Array.prototype.slice.call(arguments)

		return function with_cb(err, result) {
			if (err) throw err
				
		 	args.push(result)
			
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
		if (err) throw err
		fn(result)
	}

  },
  configurable: true
})

/* adapters */

Function.prototype.xform = function(transform) {
	var fn = this
	return function(err, results) {
		if(err) return fn(err)
		fn(null, transform(results))
	}
}

Function.prototype.adapt = function(transform) {

	var fn = this
	
	return function() {
		var args = Array.prototype.slice.call(arguments, 0, arguments.length-1)
		 ,	cb = arguments[arguments.length-1]
		 , 	newcb = function(err, results){
				if (err) return cb(err)
				cb(null, transform(results))
			}

		args.push(newcb)

		var ctx = null //can this be improved?
		fn.apply(ctx, args)
	}
}
