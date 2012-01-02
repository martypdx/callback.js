require('../')
var should = require('should')

var test = {
	input: 'input'
 ,	result: 'result'
 ,	err: new Error('fail')
}



describe('conditionals', function(){
	
	describe('if', function(){
		describe('asynchronous', function(){
			var normal = function(cb){
					return function() { cb(null, test.result) }
				}
			 ,	err = function(cb) {
			 		return function() { cb(test.err) }
			 	}
			 ,	fn = function(kind) {
			 		kind = kind || normal
					return function target(input, cb) {
						target.called = true
						target.input = input
						setTimeout(kind(cb), 1)
					}
				}			

			it('should call on true', function(done){
				var target = fn()
				target.if(true)(test.input, function(err, result){
					should.exist(result)
					result.should.equal(test.result)	
					done()				
				})
				target.input.should.equal(test.input)
			})
			it('should pass err', function(done){
				var target = fn(err)
				target.if(true)(test.input, function(err, results){
					should.exist(err)
					err.should.equal(test.err)	
					done()				
				})
				target.input.should.equal(test.input)
			})
			it('should not call on false', function(done){
				var target = fn()
				target.if(false)(test.input, function(){
					throw new Error('target should not be called')				
				})
				should.not.exist(target.called)
				setTimeout(done, 2)
			})
		})

		describe('synchronous', function(){
			var fn = function() {
				return function target(input) {
					target.called = true
					target.input = input
				}
			}
			it('should call on true', function(){
				var target = fn()
				target.if(true)(test.input)
				should.exist(target.input)
				target.input.should.equal(test.input)
				
			})
			it('should not call on false', function(){
				var target = fn()
				target.if(false)('input')
				should.not.exist(target.called)
			})
		})
	})

})




