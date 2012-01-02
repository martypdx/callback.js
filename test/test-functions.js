
module.exports = {
	fn: function(input, cb){
		console.log('fn called with', input)
		setTimeout(function(){ cb(null, 'fn output') }, 1)
	}
 ,	fn2: function(input, cb){
		console.log('fn2 called with', input)
		setTimeout(function(){ cb(null, 'fn2 output') }, 1)
	}
 ,	noinputFn: function(cb){
		console.log('noinputFn called')
		setTimeout(function(){ cb(null, 'noinputFn output') }, 1)
	}
 ,	noargsFn: function(){
		console.log('noargsFn called')
	}
 , 	multiinputFn: function(input1, input2, input3, cb) {
		console.log('multiinputFn called with', input1, input2, input3)
		setTimeout(function() { cb( null, 'multiinputFn output' ) }, 1)
	}
 ,	err: function(input, cb){
		console.log('err called with', input)
		setTimeout(function(){ cb(new Error('fail')) }, 1)
	}
 ,	multiinputErr: function(input1, input2, input3, cb) {
		console.log('multiinputErr called with', input1, input2, input3)
		setTimeout(function(){ cb(new Error('multiinputErr fail')) }, 1)
	}
 ,	done: function(err, result){
		if(err) {
			console.log('done erred with', err)
			if(result) {
				console.log('!!! and result', result)
			}
		} else {
			console.log('done called with', result)
		}
	}
 ,	elseFn: function(input, cb){
		console.log('elseFn called with', input)
		setTimeout(function(){ cb(null, 'else output') }, 1)
	}
 ,	elseErr: function(input, cb){
		console.log('elseErr called with', input)
		setTimeout(function(){ cb(new Error('else fail')) }, 1)
	}
 ,	multiplex: function(input, cb) {
		console.log('multiplex called with', input)
		setTimeout(function(){ cb(null, ['output1', 'output2', 'output3']) }, 1)
	}
}
