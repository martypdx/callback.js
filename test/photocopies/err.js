require('../../')
var t = require('../test-functions')


function error(err) {
	console.log('error is', err)
}

t.fn( 'input', console.log.cb.err(error) )
t.err( 'input', console.log.cb.err(error) )
t.fn( 'input', console.log.with('output is %s').err(error) )
t.err( 'input', console.log.with('output is %s').err(error) )
