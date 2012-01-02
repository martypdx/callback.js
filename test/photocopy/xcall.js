require('../callback')
var t = require('./test-functions')



Function.prototype.xcall = function(transform) {
	var fn = this
	return function(err, results) {
		if(err) return fn(err)
		fn(null, transform.call(results))
	}
}

var upper = String.prototype.toUpperCase

t.fn('adapt input', t.done.xcall(upper))
