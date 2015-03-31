// Requires Phantom JS file system
var fs = require('fs');
// Requires JQuery 2.0.3 and above
require('./../jquery-2.0.3.js');

function csvWrite(path, data){
	console.log("writing data to file: "+path);
	fs.write(path, data, 'a');	
	console.log("data written");
}

function mongoWrite(collection, data){
	console.log("writing data to mongo: "+collection);
	// TODO write to offiste mongo
	console.log("data written");
}


// Expose these functions to other files when imported
// module.exports = {
//   foo: function () {
//     // whatever
//   },
//   bar: function () {
//     // whatever
//   }
// };