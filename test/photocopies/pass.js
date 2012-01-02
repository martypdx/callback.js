require('../../')
var t = require('../test-functions')


var fn = function(input, cb) {
	t.fn(input, t.fn2.pass('input', cb))
}
fn('input', t.done)

var nifn = function(input, cb) {
	t.fn(input, t.noinputFn.pass(cb))
}
nifn('input', t.done)

var multifn = function(input, cb) {
	t.fn(input, t.multiinputFn.pass('pass', 'is', 'nice', cb) )
}
multifn('input', t.done)

var fnErr = function(input, cb) {
	t.err(input, t.multiinputFn.pass('pass', 'is', 'nice', cb) )
}
fnErr('input', t.done)

var fn2Err = function(input, cb) {
	t.fn(input, t.multiinputErr.pass('pass', 'is', 'nice', cb) )
}
fn2Err('input', t.done)


//t.done will not be called!
t.fn('input', t.noargsFn.pass(t.done))

