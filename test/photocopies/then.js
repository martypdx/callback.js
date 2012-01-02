require('../../')
var t = require('../test-functions')

t.fn( 'input', t.fn2.then( t.elseFn, t.done ) )

/* same result as */
//t.fn( 'input', t.fn2.use ( t.elseFn.use(t.done) ) )

t.fn( 'input', t.fn2.then(t.fn, t.fn2, t.elseFn, t.done) )

t.fn( 'input', t.fn2.then(t.done) )


