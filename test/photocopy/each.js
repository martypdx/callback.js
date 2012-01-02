require('../callback')
var t = require('./test-functions')


var multiplex = function(input, cb) {
	console.log('multiplex called with', input)
	setTimeout(function(){ cb(null, ['output1', 'output2', 'output3']) }, 1)
}

multiplex('input', t.fn.each(t.done))
multiplex('input', t.err.each(t.done))

var transform = function(result) {
	return result + ' transformed'
}

multiplex('input', t.fn.each(transform, t.done))
multiplex('input', t.err.each(transform, t.done))
