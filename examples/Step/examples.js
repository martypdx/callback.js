/*
Step(
  function readSelf() {
    fs.readFile(__filename, this);
  },
  function capitalize(err, text) {
    if (err) throw err;
    return text.toUpperCase();
  },
  function showIt(err, newText) {
    if (err) throw err;
    console.log(newText);
  }
);
*/

var fs = require('fs')
 ,  cb = require('../../')

fs.readFile( __filename, 'utf-8', console.log.cb(function(data) {
      return data.toUpperCase()
    }) )

