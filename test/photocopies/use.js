require('../../')
var t = require('../test-functions')

/* single cb argument */

var fn = function(input, cb) {
	t.fn(input, t.fn2.use(cb))
}
fn('input', t.done)

var fnErr = function(input, cb) {
	t.err(input, t.fn2.use(cb))
}
fnErr('input', t.done)

var fn2Err = function(input, cb) {
	t.fn(input, t.err.use(cb))
}
fn2Err('input', t.done)

var niFn1 = function(input, cb) {
	t.noinputFn(t.fn2.use(cb))
}
niFn1('input', t.done)

//this fails because cb expects 
//async function to take a results param
//use 'with(cb)' instead
var niFn2 = function(input, cb) {
	t.fn(t.noinputFn.use(cb))
}
try {
	niFn2('input', t.done)
} catch(e) {
	console.log(e)
}

/* tranform and cb arguments */

function addText(result) { return result + ' added Text' }

var fn = function(input, cb) {
	t.fn(input, t.fn2.use(addText, cb))
}
fn('input', t.done)

var fnErr = function(input, cb) {
	t.err(input, t.fn2.use(addText, cb))
}
fnErr('input', t.done)

var fn2Err = function(input, cb) {
	t.fn(input, t.err.use(addText, cb))
}
fn2Err('input', t.done)

var niFn1 = function(input, cb) {
	t.noinputFn(t.fn2.use(addText, cb))
}
niFn1('input', t.done)

//this fails because cb expects 
//async function to take a results param
//use 'with(cb)' instead
var niFn2 = function(input, cb) {
	t.fn(t.noinputFn.use(addText, cb))
}
try {
	niFn2('input', t.done)
} catch(e) {
	console.log(e)
}
