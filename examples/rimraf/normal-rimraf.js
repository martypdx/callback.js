/* Simple rimraf. Currently no special handling for links */

var fs = require('fs')
 ,	path = require('path')

module.exports = function rimraf(d, cb) {  

	if(!d.isDirectory) {
		return fs.lstat(d, function(err, s) {
			s.path = d
			rimraf(s, cb)
		})
	}

	(d.isDirectory() ? dir : fs.unlink)(d.path, cb)

	function dir(d, cb) {		

		function fullPath(f) { return path.join(d, f) }

		fs.readdir(d, function(err, result) {
			if(err) return cb(err)
			var count = result.length
			if(count === 0) return fs.rmdir(d, cb)

			var	errState = null
			 ,	results = []
			 ,	done = function(err, eachResult) {
					if (errState) return
					if (err) return cb(errState = err)
					if (results.push(eachResult) === count) {
						fs.rmdir(d, cb)
					}
	 			}

			result.forEach(function(each) {
				rimraf(path.join(d, each), done)
			})
		})
		
	}
}
