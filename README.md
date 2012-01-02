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
			return stat(d, rimraf.use(cb) )
		}

		dir.if(d.isDirectory()).else(fs.unlink)(d.path, cb)

		function dir(d, cb) {		
			readdir(d, rimraf.each(fs.rmdir.pass(d, cb)))
		}
	}

	var stat = fs.stat.adapt(function(stat, path) {
			stat.path = path
			return stat
		})
	 ,	readdir = fs.readdir.adapt(function(files, d){
			return files.map(function(f){
				return path.join(d, f) 
			})
		})

or:

	fs.readFile( __filename, 'utf-8', console.log.cb(upper) )

	function upper(data) {
	  return data.toUpperCase()
	}

*callback* doesn't assume or dictate any particular coding style. 
Doesn't require creating library objects to manage your functions
or try to pretend you're writing synchronous code.

Use as much or as little as you like.

## Install

	npm install callback

# Functions for Asynchronous Functions

These functions are used with asynchronous functions of type:

    function async([arg1, [arg2, [...]],] cb)

which are wrapped to be used as callbacks:

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

	f(input, cb)

For functions that have no input arguments, or more than one argument, 
see `pass` and `add`. If you need to modify the results passed on input 
parameters to the original asynchronous function, see `adapt`.

## then ( [f1, [f2, [...]],] cb )

Since `use` can be combined to do sequential callbacks:

	f1(input, f2.use( f2.use(cb) ) )

`then` offers a short-hand way to accomplish the same thing:

	f1(input, f2.then(f2, cb))

Assuming they are all of type `f(input, cb)`, `then` can take multiple async functions
before the final callback function:

	f(input, f2.then(f3, f4, f5, f6, cb)) 

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

Use `pass` to indicate the _exact_ arguments to be passed to the async function being used for the callback. 
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
Results are combined into an array which is passed as the result to `cb` after all invocations of the 
underlying function have completed:

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

## adapt (transform)

Modifies the invocation of the callback of an asynchronous function:

	f.adapt(upper)(input, cb)

is equivalent to:

	f(input, function(err, result){
		cb(err, upper(result, input))
	})

Note that any (and all) arguments passed to `f` are added to the tranformation 
function. Useful for modifying callback results with original input
arguments:

	var readdir = fs.readdir.adapt(function(files, d){
		return files.map(function(f){
			return path.join(d, f) 
		})
	})

# Functions for Synchronous Functions

These functions are used with synchronous functions that have no callback,
of signature type:

    function sync([arg1, [arg2, [...]],])

such as

	console.log.cb

Typically, these would be used as endpoints for asynchronous function chains.	

These functions will throw any err received on callback. 
See `err` to provide an alternative behavior.

## cb [ (transform) ]

Adapts a synchronous function by passing the callback 
results as the first argument. Note that the version without a transformation
_is a property getter_ and not a method:

	console.log.cb

Optionally accepts a transformation:

	fs.readFile(__filename, console.log.cb(upper))
	function upper(text) { 
		return text.toUpperCase() 
	}

`cb` will throw any `err` received on the callback. See `err` to modify the error
handling of the callback.

## with ( [arg1, [arg2, [...]],] )

Like `cb`, except that `with` allows the specification of arguments *before*
the callback result:

	fs.readFile( __filename, console.log.with('%s') )

Useful for specifying the template on response render:

	app.get('/user/:id', function (req, res) {
	    getUser( req.params.id, res.render.with('user') )
	})

`with` will throw any err received on the callback. See `err` to modify the error
handling of the callback.

# Functions for Callback Functions

These functions modify existing callback functions but still retain the callback signature.

## err (handler)

Causes an err to be routed to the supplied function for handling:

	function errHandler(err) {...}
	f(input, cb.err(errHandler))

The callback chain is aborted, the modified callback is not called. 

Useful for synchronous methods adapted for callback:

	res.render.with('template').err(function(err) { ... })

or:

	function error(err) {
		console.log('error:', err)
	}
	console.log.cb.err(error)

## xform (transform)

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

	f.if(condition).else(f2)(input, cb)

# Housekeeping

Looking for feedback on api and which functions are most useful.
Don't want to bloat the api with speculative functionality.

Currently thinking of adding:

* `map` function that collects multiple async function callback
results:

		f(input, target.map(f1, f2, f3, cb))
		//calls:
		target(f1result, f2result, f3result, cb)

* possibly a filter for each:

		target.each(cb).filter(filter)	

## Tests

You can run the tests with

	callback.js> make

The tests are done using a bit of a work-in-progress technique called
_photocopy testing_. The tests work great, they're just a bit more difficult
to maintain without some tooling that I have planned.

## Benchmarks
 
In the _examples_ _rimraf_ directory is a benchmark that runs both 
a _callback_ rimraf and a "normal" rimraf. The variations in file i/o
seem greater than any difference.

The overhead of additional functions does not seem significant. However,
I plan on expanding with some faux async functions to compare any added
overhead directly.

## Platform

I'm currently developing on Windows, though I had cygwin installed 
prior to v0.6.4 - so I have POSIX like functionality even though
I'm running from DOS cmd.

Let me know if something doesn't work, either DOS or POSIX.

## License 

(The MIT License)

Copyright (c) 2011-2012 Marty Nelson <@martypdx>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.