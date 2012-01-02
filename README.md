# callback

Expressive, terse, functions for asynchronous and callback functions.

The real issue with asynchronous coding isn't flow control, 
it's mediating between asynchronous functions with signature:

	function async([arg1, [arg2, [...]],] cb) { ... }

and the callback signature:

	function callback(err, result) { ... }

Callback.js extends `Function.prototype` and allows you to write code like:

``` javascript
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
```

## Install

	npm install callback

# Functions for asynchronous functions

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

# Functions for synchronous functions

These functions are used with synchronous functions that have no callback of type:

    function async([arg1, [arg2, [...]],])

Typically, these would be used as endpoints for asynchronous functions:

	console.log.cb

The functions will throw any err received on callback. 
See `err` to provide an alternative behavior.

# cb

A simple property getter (not a method) that adapts a synchronous function 
by passing the callback results as the first argument:

	console.log.cb

`cb` will throw any err received on the callback.

# with ( [arg1, [arg2, [...]],] )

Like `cb`, except that `with` allows the specification of arguments *before*
the callback result:

	fs.readFile( 'run.js', console.log.with('%s') )

Useful for specifying the template on response.render:

	app.get('/user/:id', function (req, res) {
	    getUser(req.params.id, res.render.with('user')
	})


# Conditionals


