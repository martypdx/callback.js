 var spawn = require('child_process').spawn

function output(child) {
	child.stderr.on('data', function(data){
	    process.stderr.write(data)
	})
	child.stdout.on('data', function(data){
    	process.stdout.write(data)
	})
}

console.log('normal')
output(spawn('node', ['run-normal.js']).on('exit', function () {
	console.log('callback')
	output(spawn('node', ['run-callback.js']))
}))




