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
 ,	pin = process.argv.length > 3 && process.argv[3] === '-p'

child.stderr.on('data', function(data){
    buf.push(data)
    process.stderr.write(data)

})

child.stdout.on('data', function(data){
    buf.push(data)
    process.stdout.write(data)
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

child.on('exit', function (code) {
  	var actual = buf.join('')
  	 ,	adjFile = fileToTest.replace(/\\/g, '/')
	 ,	dir = path.dirname(adjFile)
	 ,	file = path.basename(adjFile, '.js') + '.txt'
	 ,  fPath = path.join(dir, file)

	if(pin) { pinOutcome(fPath, actual) }

	testOutcome(fPath, actual)
})

function pinOutcome(file, actual) {
	fs.writeFileSync(file, actual)
	console.log('pinned'.yellow, fileToTest, 'outcome to'.yellow, file)	
}

function testOutcome(file, actual) {
	var outcome = fs.readFileSync(file).toString()
	if(actual === outcome) {
		console.log('----------'.underline) 
		console.log('passed'.green)
	} else {
		console.log('\nfailed!\n'.red)
		console.log('Expected>>'.red + outcome + '<<'.red)
		console.log('Actual  >>'.red + actual + '<<'.red)
	}
	console.log('----------'.underline) 
}