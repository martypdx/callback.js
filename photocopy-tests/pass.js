require('../callback')
var t = require('./test-functions')

var fn = function(input, cb) {
	t.fn(input, t.fn2.pass(cb))
}
fn('input', t.done)

var multifn = function(input, cb) {
	t.fn(input, t.multiinputFn.pass('is', 'nice', cb) )
}
multifn('input', t.done)

var fnErr = function(input, cb) {
	t.err(input, t.multiinputFn.pass('is', 'nice', cb) )
}
fnErr('input', t.done)

var fn2Err = function(input, cb) {
	t.fn(input, t.multiinputErr.pass('is', 'nice', cb) )
}
fn2Err('input', t.done)

var naFn2 = function(input, cb) {
	t.fn(t.noargsFn.pass(cb))
}

try {
	naFn2('input', t.done)
} catch(e) {
	console.log(e)
}
