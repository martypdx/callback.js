

Function.prototype.if = function(passed) {

	var fail = function(){}
	fail.else = function(fn){
		return fn
	}

	if (passed) {
		var pass = this
		this.else = function(){
			return pass
		}
		return pass
	} else {
		return fail
	}
}
