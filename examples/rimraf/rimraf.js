/* Simple rimraf. Currently no special handling for links */

var fs = require('fs')
 ,	path = require('path')
 ,	cb = require('../../')



module.exports = function rimraf(d, cb) {  

	if(!d.isDirectory) {
		return stat(d, rimraf.use(cb) )
	}

	dir.if(d.isDirectory()).else(fs.unlink)(d.path, cb)

	function dir(d, cb) {		
		readdir(d, rimraf.each(fs.rmdir.pass(d, cb)))
	}
}



var stat = fs.stat.adapt(function(stat, path) {
	stat.path = path
	return stat
})

var readdir = fs.readdir.adapt(function(files, d){
	return files.map(function(f){
		return path.join(d, f) 
	})
})