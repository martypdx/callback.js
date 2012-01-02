var fs = require('fs')
 ,	path = require('path')
 ,	photocopies = path.join(__dirname, 'photocopies')
 ,	photocopier = path.join(__dirname, 'photocopy.js')
 ,  spawn = require('child_process').spawn
 ,	colors = require('colors')
 ,	cb = require('../')

function jsFile(f) {
	return f.filter(function(each) {
		return path.extname(each) === '.js'
	})
}

var done = function(err, result) {
	var total = result.length
	 ,	passed = result.filter(function(each){
	 		return each === 0
	 	}).length
	 ,	result = '%d/%d passed'

	 result = passed===total ? result.green : result.red
	 console.log('-------------------')
	 console.log(result, passed, total)
}

fs.readdir.adapt(jsFile)(photocopies, test.each(done))

function test(f, cb) {
	var fileToTest = path.join(photocopies, f)
	var child = spawn('node', [ photocopier, fileToTest, '-q' ])

	child.stderr.on('data', function(data){
	    process.stderr.write(data)
	})
	child.stdout.on('data', function(data){
    	process.stdout.write(data)
	})

	child.on('exit', function (code) {
  		cb(null, code)
	})
}
