require('../../')
var t = require('../test-functions')


t.fn('input', console.log.cb)

var cb = function(err, result) {
	try { 
		console.log.cb(err, result) 
	} catch(e) {
		console.log(e)
	}	
}
t.err('input', cb)


t.fn('input', console.log.cb(upper))

var cb = function(err, result) {
	try { 
		console.log.cb(upper)(err, result) 
	} catch(e) {
		console.log(e)
	}	
}
t.err('input', cb)

function upper(text) {
	return text.toUpperCase()
}