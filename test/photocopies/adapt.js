require('../../')
var t = require('../test-functions')



t.fn.adapt(upper)('input', t.done)

t.fn('input', t.fn2.adapt(upper).use(t.done) )

t.fn.adapt(getArgs)('original input', t.done)

function upper(text) {
	return text.toUpperCase()
}

function getArgs(result, original_input) {
	return result + ' from ' + original_input
}


