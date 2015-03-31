var fetchUrl = require("fetch").fetchUrl;
var phantom = require('phantom');
var MongoClient = require('mongodb').MongoClient

phantom.create(function (ph) {
	  ph.createPage(function (page) {
	    page.open("http://harvard.transloc.com/", function (status) {
		    // Check for page load success
	        if (status !== "success") {
	            // TODO alert error
	            console.log("Unable to access network for page.");
	        } else {
	        	console.log("On site, grabbing requests");
	        	setTimeout(
				  function() 
				  {
				    ph.exit();
				  }, 86400000);
	        }
	    });
	    page.set('onResourceReceived', function(response){
	    	if(response['url'].indexOf("feeds.transloc.com") != -1){
	    		// console.log(response['url']);
	    		// TODO check error status
	    		fetchUrl(response['url'], function(error, meta, body){
				    // console.log(body.toString());
				    var re = /(\().+?(?=\);)/g;
	                var content = body.toString().match(re);
	                // console.log('Content: ' + String(content).substring(1));
	                var json = JSON.parse(String(content).substring(1));
	                if(json['success'] && json['vehicles']){
	                    json['vehicles'].forEach(function(bus){
	                        // Filter by Harvard Busses
	                        if(bus['agency_id'] == 52){
	                            // TODO Only add a new data point if timestamp updates
	                            // TODO Current stop id is null, until the bus is at a stop (can possibly use this as target for prediction)
	                            // TODO store so as to prevent double storage (on timestamp bus id combo) (or filter later to prevent double storage)
	                            console.log('Route '+bus['route_id']+', Bus '+bus['call_name']+','+bus['id']+','+bus['timestamp']+": " + bus['position'][0] + ',' + bus['position'][0] + ' at '+ bus['current_stop_id']);
	                        }
	                    });
					}
	    		});
	    	}
	    });
	});
});


// var server = http.createServer(function(req, res) {
	

//   	res.writeHead(200);
//   	res.end('Hello Http');
// });
// server.listen(8080);