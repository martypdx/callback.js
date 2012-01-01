require('../callback')

var fs = require('fs')
 ,	path = require('path')
 ,	d = './rimrafdir'

function done(err) {
	if(err) return console.log('done erred with ', err)
	console.log('done')
}

function rimraf(d, cb) {  

	if(!d.isDirectory) {
		function addPath(s) { s.path = d; return s }
		return fs.lstat(d, rimraf.use(addPath, cb))
	}

	dir.if(d.isDirectory()).else(fs.unlink)(d.path, cb)

	function dir(d, cb) {		
		function fullPath(f) { return path.join(d, f) }
		fs.readdir(d, rimraf.each(fullPath, fs.rmdir.useOnly(d, cb) ) )
	}
}

rimraf(d, done)

/*
	function upper(text) {
	    return text.toUpperCase();
  	}

	fs.readFile(__filename, console.log.cb(upper));

	fs.readdir( __dirname, fs.readFile.adapt(upper).each(console.log.cb) );

	fs.readdir( __dirname, fs.readFile.adapt(upper).each(console.log.cb) );
	
	fs.readdir( __dirname, fs.readFile.each(console.log.cb.xform) );


	function rimraf(d, cb) {  

		if(!d.isDirectory) {
			function addPath(s) { s.path = d; return s }
			return fs.lstat(d, rimraf.cb(addPath, cb)) 
		}

		dir.if(d.isDirectory()).else(fs.unlink)(d.path, cb)

		function dir(d, cb) {		
			function fullPath(f) { return path.join(d, f) }
			fs.readdir(d, rimraf.each(fullPath, fs.rmdir.with(d, cb) ) )
		}
	}
*/