require('../callback')
var t = require('./test-functions')




console.log.if(true)('true')
console.log.if(false)('false')

t.fn.if(true).else(t.elseFn)('input', t.done)
t.fn.if(false).else(t.elseFn)('input', t.done)
