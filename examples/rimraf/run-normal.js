var rimraf = require('./normal-rimraf')
 , 	d = './rimrafdir'
 ,	cb = require('../../')
 ,  spawn = require('child_process').spawn
 //could be better than this...
 ,	create = (process.platform==='win32') ? 'create-rimraf-dir.bat' : './create-rimraf-dir.sh'

spawn(create).on('exit', function (code) {
	console.log(d, 'created')
	var start = new Date()
	rimraf(d, function(err, results) {
		var time = new Date() - start
		if(err) return console.log(err)
		console.log(d, 'deleted in', time, 'ms')	
	})
})

