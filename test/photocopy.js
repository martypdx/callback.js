var colors = require('colors')
 ,	fileToTest = process.argv.length > 2 ? process.argv[2] : undefined

if(!fileToTest) {
    console.log('File must be specified!'.red)
		console.log('node outcomes.js <file.js> [-p: pin outcome]')
    process.exit(1)
}

var fs = require('fs')
 ,  path = require('path')
 ,  buf = []
 ,  spawn = require('child_process').spawn
 ,  child = spawn('node', [ fileToTest ])
 //time for Commander!!!
 ,	pin = process.argv.length > 3 && process.argv[3] === '-p'
 ,	quiet = process.argv.length > 3 && process.argv[3] === '-q'


child.stderr.on('data', function(data){
    buf.push(data)
    if(!quiet) {
    	process.stderr.write(data)
	}

})

child.stdout.on('data', function(data){
    buf.push(data)
    if(!quiet) {
    	process.stdout.write(data)
    }
})


/*
function write(data) {
    process.stdout.write(data)
    buf.push(data)
    child.stdin.write(data) 
}
function writeLine(data) {
    write(data + '\n')
}
*/
var passed = false
 
process.on('exit', function(){
	if(!passed) process.exit(1)
})

child.on('exit', function (code) {
  	var actual = buf.join('')
  	 ,	adjFile = fileToTest.replace(/\\/g, '/')
	 ,	dir = path.dirname(adjFile)
	 ,	file = path.basename(adjFile, '.js') + '.txt'
	 ,  fPath = path.join(dir, file)

	if(pin) { pinOutcome(fPath, actual) }

	if(!testOutcome(fPath, actual)) {
		
		
	}
})

function pinOutcome(file, actual) {
	fs.writeFileSync(file, actual)
	console.log('pinned'.yellow, fileToTest, 'outcome to'.yellow, file)	
}

function testOutcome(file, actual) {
	var outcome = fs.readFileSync(file).toString()
	 ,	name = path.basename(file, '.txt')
	
	passed = (actual === outcome)
	
	if(passed) {
		if(!quiet) {
			console.log('----------'.underline) 
		}
		console.log(name, 'passed'.green)
	} else {
		console.log(name, 'failed!'.red)
		console.log('Expected>>'.red + outcome + '<<'.red)
		console.log('Actual  >>'.red + actual + '<<'.red)
	}
	if(!quiet) {
		console.log('----------'.underline) 
	}

	return passed
}