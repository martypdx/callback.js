require('../../')
var t = require('../test-functions')


t.multiplex('input', t.fn.each(t.done))
t.multiplex('input', t.err.each(t.done))

function transform(r) {
	return r + ' transformed'
}

t.multiplex('input', t.fn.each(transform, t.done))
t.multiplex('input', t.err.each(transform, t.done))


t.multiplex('input', console.log.each())
t.multiplex('input', console.log.each(transform))

