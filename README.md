# callback

Expressive, terse, functions for asynchronous and callback functions.

The real issue with asynchronous coding isn't flow control, 
it's mediating between asynchronous functions with signature:

	function async([arg1, [arg2, [...]],] cb) { ... }

and the callback signature:

	function callback(err, result) { ... }

*callback* extends `Function.prototype` and allows you to write code like:

	function rimraf(d, cb) {  

		if(!d.isDirectory) {
			function addPath(s) { s.path = d; return s }
			return fs.lstat(d, rimraf.use(addPath, cb)) 
		}

		dir.if(d.isDirectory()).else(fs.unlink)(d.path, cb)

		function dir(d, cb) {		
			function fullPath(f) { return path.join(d, f) }
			fs.readdir(d, rimraf.each(fullPath, fs.rmdir.pass(d, cb) ) )
		}
	}

*callback* doesn't assume or dictate any particular coding style. 
Doesn't require creating library objects to manage your functions
or try to pretend you're writing snychronous code.

Use as much or as little as you like.

## Install

	npm install callback

# Functions for Asynchronous Functions

These functions are used with asynchronous functions of type:

    function async([arg1, [arg2, [...]],] cb)

and wrap them to be used as callbacks:

	async.use(cb)

## use ( [transform,] cb )

Turns an asynchronous function into a callback and includes the 
results of the callback in the invocation of the function:

	f1(input, f2.use(cb))
	
is equivalent to:

	f1('input', function(err, result) {
		if(err) return cb(err)
		f2(result, cb)
	})

An optional transformation can be included that should be a *synchronous* 
function that accepts the results and returns the transformed results:

	function addText(result) { return result + ' added text'  }

The transformation is included *before* the cb argument:

	f1(input, f2.use(addText, cb))

is equivalent to:

	f1('input', function(err, result) {
		if(err) return cb(err)
		f2(addText(result), cb)
	})

`use` is intended for asynchronous functions that have one input argument:

	function asynch(input, cb)

For functions that have no input arguments, or more than one argument, see `with` and `pass`.


## then ( [f1, [f2, [...]],] cb )

Since `use` can be combined to do sequencial callbacks:

	f1(input, f2.use( f2.use(cb) ) )

`then` offers a short-hand way to accomplish the same thing:

	f1(input, f2.then(f2, cb))

Assuming they are all of type `f(input, cb)`, then can take multiple async functions
before the final callback function:

	f(input, f2.then(f3, f4, f5, f6, cb))

Assuming 

## add ( [arg1, [arg2, [...]],] cb )

Use `add` to add arguments *in addition to* the callback result argument
which will be included as the first argument:

	someFn( 'input', fs.open.add('a', cb) )

is equivalent to:

	someFn( 'input', function(err, result) {
		if(err) return cb(err)
		fs.open(result, 'a', cb)
	})

Calling `add` with only the callback: `asyncFn.add(cb)` is equivalent to calling `asyncFn.use(cb)`.

Unlike `use`, add does not take a transformation. You can add `adapt` or `xform` to achieve the same results.

`add` uses `apply` on the target function, so currently it is not useful on functions that require `this` context.

## pass ( [arg1, [arg2, [...]],] cb )

Use `pass` to indicate the arguments to be passed to the async function being used for the callback. 
Unlike `add` or `use`, the callback result is discarded:

	someFn( 'input', fs.rmdir.pass(dir, cb) )

is equivelent to:

	someFn( 'input', function(err, result) {
		if(err) return cb(err)
		fs.rmdir(dir, cb)
	})

`pass` can also be used for async functions that take no input except for a callback 
(whereas `use` and `add` will always pass the result as the first argument).

`pass` uses `apply` on the target function, so currently it is not useful on functions that require `this` context.

## each ( [transform,] cb )

`each` calls an asynchronous function in parallel based on a callback result that can be called with `forEach`. 
Results are combined into an array which is passed as the result to `cb`:

	fs.readdir(dir, fs.open.each(cb))

is equivalent to:

	fs.readdir(dir, function(err, result) {
		if(err) return cb(err)
		var count = result.length
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
			fs.open(each, done)
		})
	})

## adapt (transformFn)

Modifies the invocation of the callback of an ansyncronous function:

	f.adapt(upper)(input, cb)

is equivalent to:

	f(input, function(err, result){
		cb(err, upper(result))
	})

Also equivalent in this case to:

	f(input, cb.xform(upper))

See `xform` for more detail on its use.

# Functions for Synchronous Functions

These functions are used with synchronous functions that have no callback of type:

    function async([arg1, [arg2, [...]],])

Typically, these would be used as endpoints for asynchronous functions:

	console.log.cb

The functions will throw any err received on callback. 
See `err` to provide an alternative behavior.

## cb[(transform)]

Adapts a synchronous function by passing the callback 
results as the first argument. Note that the version without a tranformation
is a property getter and not a method:

	console.log.cb

Optionally accepts a transformation:

	fs.readFile(__filename, console.log.cb(upper))
	function upper(text) { 
		return text.toUpperCase() 
	}

`cb` will throw any err received on the callback. See `err` to modify the error
handling of the callback.

## with ( [arg1, [arg2, [...]],] )

Like `cb`, except that `with` allows the specification of arguments *before*
the callback result:

	fs.readFile( __filename, console.log.with('%s') )

Useful for specifying the template on response render:

	app.get('/user/:id', function (req, res) {
	    getUser(req.params.id, res.render.with('user')
	})

`with` will throw any err received on the callback. See `err` to modify the error
handling of the callback.

# Functions for Callback Functions

These functions modify existing callback functions but still retain the callback signature.

## err (errFn)

Causes an err to be routed to the supplied function for handling:

	function errHandler(err) {...}
	f(input, cb.err(errHandler))

The callback chain is aborted, the modified callback is not called. 

Useful for synchronous methods adpated for callback:

	res.render.with('template').err(function(err) { ... })

or:

	function error(err) {
		console.log('error:', err)
	}
	console.log.cb.err(error)

## xform (transformFn)

Calls the supplied transformation function of signature:

	f(result) {...}

with the callback result and uses the return value as the result argument for 
the underlying callback:

	f(input, cb.xform(function(r) {
		return r.data
	}))

is equivalent to:

	f(input, function(err, result){
		cb(err, result.data)
	})

More useful when combined with other functions like `then` that don't directly 
take a transform argument:

	f(input, f2.then(f3.xform(upper), f4, cb))
	function upper(text) {
		return text.toUpperCase()
	}

Or along with `with`:

	fs.readFile( __filename, console.log.with('%s')
		.xform(function(f) {
			return f.toUpperCase()
		}))

# Conditionals

These apply to any type of function:

	f.if(condition)(input)

is equivalent to:

	if(condition) {
		f(input)
	}

technically is:

	(condition ? f : noop)(input)

Can also include an else function:

	f.if(condition).else(f2)(input)


