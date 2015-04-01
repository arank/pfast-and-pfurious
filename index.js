var fetchUrl = require("fetch").fetchUrl;
var phantom = require('phantom');
var MongoClient = require('mongodb').MongoClient
var config = require('./config.json');
var passwords = require('./passwords.json');

// TODO 
// Use connect method to connect to the Server (mongo double stores so a cache in front is nessecary)
function mongoWrite(uri, collection_name, dataPointList){
	console.log("writing "+dataPointList.length+" data points to Mongo Server.");
	MongoClient.connect(uri, function(error, db) {
		if(error){
			// TODO alert error
			console.log("Failed to connect to mongo server: "+error);
			return;
		}

		var collection = db.collection(collection_name);
		collection.insert(dataPointList, function(err, result){
			// TODO figure out real error since it writes but still fills error and returns no result
		});
		db.close();
	});
}

//buffer to stick in front of mongo and do batch writes (cut down on new connections to server)
// transloc sends all bus data every second even if there is no update, so this also heuristically cuts down on double logging points
// TODO this has potential race conditions however there is no data loss possible due to them so it isn't worth fixing.
var pointBuffer = [];
function queueForWrite(dataPoint){
	// Check if point is a duplicate or original
	var orig = true;
	for(var i=0; i<pointBuffer.length; i++){
		var point = pointBuffer[i];
		if(dataPoint['bus_id']==point['bus_id']&&dataPoint['timestamp']==point['timestamp']){
			// This is a duplicate point
			orig = false;
			break;
		}
	}

	// Write original points to buffer
	if(orig){
		pointBuffer.push(dataPoint)
		// Flush earlist half of buffer when it is over the max buffer size
		if(pointBuffer.length>20){	
			mongoWrite(passwords['mongo-uri'], passwords['mongo-collection'], pointBuffer.splice(0,10));
		}
	}
}

phantom.create(function (ph) {
	ph.createPage(function (page) {
	    page.open("http://harvard.transloc.com/", function (status) {
		    // Check for page load success
	        if (status !== "success") {
	            // TODO alert error
	            console.log("Unable to access network for page: "+status);
	            return;
	        } else {
	        	console.log("On site, grabbing requests");
	        	setTimeout(
				  function() 
				  {
				  	// TODO flush queue for writing before exit
				    ph.exit();
				  }, 86400000);
	        }
	    });

	    page.set('onResourceReceived', function(response){
	    	if(response['url'].indexOf("feeds.transloc.com") != -1){
	    		// console.log(response['url']);
	    		// TODO check error status
	    		fetchUrl(response['url'], function(error, meta, body){
	    			if(error){
	    				// TODO alert error
                		console.log("Unable to access network for json: "+error);
                		return;
	    			}
				    // Parse out json from JSONP wrapper with simple regex
				    var re = /(\().+?(?=\);)/g;
	                var content = body.toString().match(re);
	                var json = JSON.parse(String(content).substring(1));
	                if(json['success'] && json['vehicles']){
	                    json['vehicles'].forEach(function(bus){
	                        // Filter by Harvard Busses (agency id 52)
	                        if(bus['agency_id'] == 52){
	                            // TODO Only add a new data point if timestamp updates
	                            // TODO Current stop id is null, until the bus is at a stop (can possibly use this as target for prediction)
	                            // TODO store so as to prevent double storage (on timestamp bus id combo) (or filter later to prevent double storage)
	                            // console.log('Route '+bus['route_id']+', Bus '+bus['call_name']+','+bus['id']+','+bus['timestamp']+": " + bus['position'][0] + ',' + bus['position'][0] + ' at '+ bus['current_stop_id']);
	                        	// mongoWrite(passwords['mongo-uri'], passwords['mongo-collection'], [{
	                        	// 	"route_id":bus['route_id'],
	                        	// 	"call_name":bus["call_name"],
	                        	// 	"bus_id":bus['id'],
	                        	// 	"timestamp":bus['timestamp'],
	                        	// 	"position_lat":bus['position'][0],
	                        	// 	"position_long":bus['position'][1],
	                        	// 	"current_stop_id":bus['current_stop_id']
	                        	// }]);
	                        	queueForWrite({
	                        		"route_id":bus['route_id'],
	                        		"call_name":bus["call_name"],
	                        		"bus_id":bus['id'],
	                        		"timestamp":bus['timestamp'],
	                        		"position_lat":bus['position'][0],
	                        		"position_long":bus['position'][1],
	                        		"current_stop_id":bus['current_stop_id']
	                        	});
	                        }
	                    });
					}
	    		});
	    	}
	    });

	});
});