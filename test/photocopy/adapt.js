require('../callback')
var t = require('./test-functions')


t.fn.adapt(upper)('input', t.done)
t.fn('input', t.fn2.adapt(upper).use(t.done) )

function upper(text) {
	return text.toUpperCase()
}

