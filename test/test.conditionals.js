require('../callback')
require('should')

var test = {
	results: 'results'
 ,	err: new Error('fail')
}

var targets = {
	testResults: function(cb) {
		return function(results){
		    results.should.equal(test.results)
		    setTimeout(cb, 10)
		}
	}
 ,	noop: function(){}
}

var isCalledFn = function() {
	
	var target = function() {
		target.called = true
	}

	return target
}


describe('conditionals', function(){
	
	describe('if', function(){
		it('should execute on true', function(done){
			var target = isCalledFn()
			target.if(true)()
			target.called.should.be.ok
			done()
		})
		it('should not execute on false', function(done){
			var target = isCalledFn()
			target.if(false)()
			target.called.should.not.be.ok
			done()
		})

	})

})




