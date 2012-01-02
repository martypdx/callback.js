require('../../')
var t = require('../test-functions')


t.fn( 'input', console.log.cb.xform(upper) )

function upper(text) {
	return text.toUpperCase()
}

var err = function(err, result) {
	try {	
		console.log.cb.xform(upper)(err, result)
	} catch(e) {
		console.log(e)
	}	
}
t.err( 'input', err )


