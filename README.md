# callback.js

Expressive, terse, functions for aynchronous and callback functions.

You don't need flow control, the real issue with asynchronous 
coding is mediating between asynchronous functions with signature:

	function async([arg1, [arg2, [...]],] cb)

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
		fs.readdir(d, rimraf.each(fullPath, fs.rmdir.with(d, cb) ) )
	}
}
```

## Install

	npm install callback

# Functions for asynchronous functions

These functions are meant to be used with asynchronous functions of type:

    function async([arg1, [arg2, [...]],] cb)

and are meant to adapt them as callbacks:

	async.use(cb)

## .use([transform,] cb)

Turns an asynchronous function into a callback and includes the 
results of the callback in the invocation of the function:

	f1(input, f2.use(cb))
	
is equivelent to:

	f1('input', function(err, result) {
		if(err) return cb(err)
		f2(result, cb)
	})

An optional transformation can be included that should be a *synchronous* 
function that accepts the results and returns the transformed results:

	function addText(result) { return result + ' added text'  }

The transformation is included *before* the cb argument:

	f1(input, f2.use(addText, cb))

is equivelent to:

	f1('input', function(err, result) {
		if(err) return cb(err)
		f2(addText(result), cb)
	})

`use` is intended for asynchronous functions that have one input argument:

	function asynch(input, cb)

For functions that have no input arguments, or more than one argument, see `with` and `pass`.

## pass([arg1, [arg2, [...]],] cb)

Use `pass` to include arguments *in addition to* the callback results argument
which will still be included as the first argument:

	someFn( 'input', fs.open.pass('a', cb) )

is equivelent to:

	someFn( 'input', function(err, result) {
		if(err) return cb(err)
		fs.open(result, 'a', cb)
	})

Calling `pass` with only the callback: `asyncFn.pass(cb)` is equivelent to calling `asyncFn.use(cb)`.

Unlike `use`, pass does not take a transformation. You can add `adapt` or `xform` to achieve the same result.

`pass` uses `apply` on the target function, so currently it is not useful on functions that require `this` context.


## with([arg1, [arg2, [...]],] cb)

Use `pass` to indicate the arguments to be passed to the async function being used for the callback. 
Unlike `pass` or `use`, the result passed to the callback is discarded:

	someFn( 'input', fs.rmdir.with(dir, cb) )

is equivelent to:

	someFn( 'input', function(err, result) {
		if(err) return cb(err)
		fs.rmdir(dir, cb)
	})

`with` can also be used for async functions that take no input except for a callback
 (whereas `use` and `pass` will always pass the result as the first argument).

`with` uses `apply` on the target function, so currently it is not useful on functions that require `this` context.

## each([transform,] cb)

`each` calls an asynchronous function in parallel based on a callback result that can be called with `forEach`. 
Results are combined into an array passed as the result to `cb`:

	fs.readdir(dir, fs.open.each(cb))

is equivelent to:

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



# Conditionals

