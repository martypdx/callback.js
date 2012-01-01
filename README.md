# callback.js

Expressive, terse, functions for aynchronous and callback functions.

You don't need flow control, the real issue with asynchronous 
coding is mediating between asynchronous functions with signature:

    function asynch([arg1, [arg2, [...]],] cb)

as the callback signature:

	function callback(err, result) { ... }

Callback.js extends `Function.prototype` and allows you to write code like:

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

# Functions for asynchronous functions

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

