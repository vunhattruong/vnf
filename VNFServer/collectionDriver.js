// Lóp này tuong ứng các database helper,database driver có nhvụ tuong tác vói database 
var ObjectID = require('mongodb').ObjectID; 

// Constructor
CollectionDriver = function(db){
	this.db = db;
}

CollectionDriver.prototype.getCollection = function(collectionName,callback){
	this.db.collection(collectionName,function(error,the_collection){
		if(error)
			callback(error);
		else
			callback(null,the_collection);
	});
}

// get all docs in db
CollectionDriver.prototype.findAll = function(collectionName,callback){
	this.getCollection(collectionName,function(error,the_collection){
		if(error)
			callback(error);
		else{
			the_collection.find().toArray(function(error,results){
				if(error)
					callback(error);
				else 
					callback(null,results);
			});
		}
	});
}

// Get document from db by id
// * Since ObjectID is a BSON type and not a JSON type, 
// you all have to convert any incoming strings to ObjectIDs if they are to be used when comparing against an �_id� field.
CollectionDriver.prototype.get = function(collectionName,id,callback){
	this.getCollection(collectionName,function(error,the_collection){
		if(error)
			callback(error);
		else{
			the_collection.findOne({'_id':ObjectID(id)},function(error,doc){
				if(error)
					callback(error);
				else 
					callback(null,doc);
			});
		}
	});
}

// save new object
CollectionDriver.prototype.save = function(collectionName,obj,callback){
	this.getCollection(collectionName,function(error,the_collection){
		if(error){
			callback(error);
		}else{
			obj.created_at = new Date(); // add a field to the records the date it was created
			the_collection.insert(obj,function(){
				callback(null,obj);
			});
		}
	});
}

CollectionDriver.prototype.update = function(collectionName,obj,entityId,callback){
	this.getCollection(collectionName,function(error,the_collection){
		if(error)
			callback(error);
		else{
			obj._id = ObjectID(entityId); // convert to real object id
			obj.updated_at = new Date(); // add fields update_at : data to object that have just been updated
			the_collection.save(obj,function(error,doc){ // replace the old object with the new one
				if(error)
					callback(error);
				else
					callback(null,obj);
			});
		}
	});
}

CollectionDriver.prototype.delete = function(collectionName,entityId,callback){
	this.getCollection(collectionName,function(error,the_collection){
		if(error)
			callback(error);
		else{
			the_collection.remove({'_id': ObjectID(entityId)},function(error,doc){
				if(error)
					callback(error);
				else
					callback(null,doc);
			});
		}
	});
}

//Calculate distance between 2 coordinates
function calDistance(lat1, lon1, lat2, lon2) {
	/** Converts numeric degrees to radians */
	if (typeof (Number.prototype.toRad) === "undefined") {
		Number.prototype.toRad = function() {
			return this * Math.PI / 180;
		}
	}

	var R = 6371; // km
	var dLat = (lat2 - lat1).toRad();
	var dLon = (lon2 - lon1).toRad();
	var lat1 = lat1.toRad();
	var lat2 = lat2.toRad();

	var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.sin(dLon / 2)
			* Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	var d = R * c; // Unit: km
	return d * 1000; // Unit: km*1000 = m
}

//Perform a collection query
CollectionDriver.prototype.query = function(collectionName, query, callback) { //1
    this.getCollection(collectionName, function(error, the_collection) { //2
      if( error ) callback(error)
      else {
    	  // Nếu là request lấy các dia diem gan do
    	  if( (query.lat != null) && (query.lon != null) && (query.radius != null) ){
    		  the_collection.find().toArray(function(error,results){
    			 if(error) callback(error)
    			 else{
    				 //callback(null,results)
    				 console.log(query.radius);
    				 var resultJSON = "[";
    				     				 
    				 for (var i = 0; i < results.length; i++) {
    					var result = calDistance(parseFloat(query.lat), parseFloat(query.lon),
    							parseFloat(results[i].lat), parseFloat(results[i].lon));
    					console.log("***"+results[i].name + " : "+result);
    					if( result <= parseInt(query.radius) ){
    						console.log(results[i].name + " : " + result);
    						resultJSON += JSON.stringify(results[i])+",";
    					}
					}
    				console.log(resultJSON.substring(0,resultJSON.length-1)+"]");
    				callback(null,JSON.parse(resultJSON.substring(0,resultJSON.length-1)+"]"));
    			 }
    		  });
    	  } else{ // Nếu là request lấy tất cả (k có query)
    		  console.log("Dzo");
    		  console.log(query);
        	the_collection.find(query).toArray(function(error, results) { //3
        		if( error ) callback(error)
        		else callback(null, results)
        	});
    	  }
    	
      }
    });
};

// This line declares the exposed, or exported, entities to other applications that list collectionDriver.js as a required module.
exports.CollectionDriver = CollectionDriver;