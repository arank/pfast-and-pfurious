var MongoClient = require('mongodb').MongoClient

module.exports = {
  	mongoWrite: function (uri, collection_name, dataPointList) {
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
};
