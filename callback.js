
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
	
	if(this.length < 2) {
		throw new Error('`cb` should be used on async functions with signature f(input, cb). Consider using `with` instead.')
	}

	var fn = this
	
	return function(transform, cb) {
		if(!cb) {
			cb = transform
			transform = null
		}
	
		return function(err, result) {
			//custom err if cb is not fn ?
			if (err) { return cb(err) }
			fn(transform ? transform(result) : result, cb)
		}
	}

  },
  configurable: true
})



Function.prototype.use = function() {

	var fn = this
	 ,	args = Array.prototype.slice.call(arguments)
	 ,	cb = arguments[arguments.length-1]

	
	return function(err, result) {
		//check if cb is fn ?
		if (err) return cb(err)

	 	if(result) { args.splice(0, 0, result) }
		var ctx = null //can this be improved?
		fn.apply(ctx, args)
	}
}

Function.prototype.useOnly = function() {

	var fn = this
	 ,	args = arguments
	 ,	cb = arguments[arguments.length-1]


	return function(err, result) {
		//check if cb is fn ?
		if (err) return cb(err)

		var ctx = null //can this be improved?
		fn.apply(ctx, args)
	}
}

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


Function.prototype.each = function(transform, cb) {

	var fn = this
	if(!cb) {
		cb = transform
		transform = null
	}

	return function(err, result) {
		//check if cb is fn ?
		if (err) { return cb(err) }

		//throw if no length ?
		var count = result.length // || 0 ?

		if(count === 0) { cb() }

		var	errState = null
		 ,	results = []
		 ,	done = function(err, eachResult) {
				if (errState) return
				if (err) return cb(errState = err)
				if (eachResult) results.push(eachResult)
				if (-- count === 0) {
					cb(null, results.length === 0 ? undefined : results)	
				}
 			}

		result.forEach(function(each) {
			fn(transform ? transform(each) : each, done)
		})
		
	}

}