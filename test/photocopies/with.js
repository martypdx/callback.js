require('../../')
var t = require('../test-functions')


t.fn('input', console.log.with())

var render = function(template, data){
	console.log('render', template, 'with', data)
}

t.fn('input', render.with('template'))

var cb = function(err, result) {
	try { 
		render.with('template')(err, result) 
	} catch(e) {
		console.log(e)
	}	
}
t.err('input', cb)


