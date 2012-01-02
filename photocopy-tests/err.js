require('../callback')
var t = require('./test-functions')

Object.defineProperty(Function.prototype, 'err', {
  set: function(){},
  get: function(){
	
	return function err_fn(errHandler) {
		var fn = this

		return function err_cb(err, result) {
			if (err) return errHandler(err)
			fn(err, result)
		}
	}

  },
  configurable: true
})


function error(err) {
	console.log('error is', err)
}

t.fn( 'input', console.log.cb.err(error) )
t.err( 'input', console.log.cb.err(error) )
t.fn( 'input', console.log.with('output is %s').err(error) )
t.err( 'input', console.log.with('output is %s').err(error) )
