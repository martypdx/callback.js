require('../../')
var t = require('../test-functions')

console.log.if(true)('true') 
console.log.if(false)('false') 

t.fn.if(true)('input', t.done)
t.fn.if(false)('input', t.done)

t.err.if(true)('input', t.done)
t.err.if(false)('input', t.done)


t.fn.if(true).else(t.elseFn)('input', t.done)
t.fn.if(false).else(t.elseFn)('input', t.done)


t.err.if(true).else(t.elseErr)('input', t.done)
t.err.if(false).else(t.elseErr)('input', t.done)