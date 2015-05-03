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
// you�ll have to convert any incoming strings to ObjectIDs if they�re to be
// used when comparing against an �_id� field.
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
			obj.created_at = new Date(); // add a field to the records the
											// date it was created
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
			obj.updated_at = new Date(); // add fields update_at : data to
											// object that have just been
											// updated
			the_collection.save(obj,function(error,doc){ // replace the old
															// object with the
															// new one
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

// Calculate distance between 2 coordinates
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

// Bỏ dấu tiếng việt nhằm phục vụ cho viec tim kiem vd: chả lụi -> cha lui
function change_alias( alias )
{
    var str = alias;
    str= str.toLowerCase(); 
    str= str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ  |ặ|ẳ|ẵ/g,"a"); 
    str= str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g,"e"); 
    str= str.replace(/ì|í|ị|ỉ|ĩ/g,"i"); 
    str= str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ  |ợ|ở|ỡ/g,"o"); 
    str= str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g,"u"); 
    str= str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g,"y"); 
    str= str.replace(/đ/g,"d"); 
    str= str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'| |\"|\&|\#|\[|\]|~|$|_/g,"-");
    /* tìm và thay thế các kí tự đặc biệt trong chuỗi sang kí tự - */
    str= str.replace(/-+-/g,"-"); // thay thế 2- thành 1-
    str= str.replace(/^\-+|\-+$/g,""); 
    // cắt bỏ ký tự - ở đầu và cuối chuỗi
    return str;
}

function check_date(dateFrom,dateTo,dateCheck){
	// var dateFrom = "01/10/2014";
	// var dateTo = "02/01/2015";
	// var dateCheck = "05/01/2015";

	var d1 = dateFrom.split("/");
	var d2 = dateTo.split("/");
	var c = dateCheck.split("/");

	var from = new Date(d1[2], d1[1]-1, d1[0]);  // -1 because months are
													// from 0 to 11
	var to   = new Date(d2[2], d2[1]-1, d2[0]);
	var check = new Date(c[2], c[1]-1, c[0]);

	return (check > from && check < to);
}

// Perform a collection query
CollectionDriver.prototype.query = function(collectionName, query, callback) { // 1
	
    this.getCollection(collectionName, function(error, the_collection) { // 2
      if( error ) callback(error)
      else {
    	  if( (query.dsh != null) && (query.lat == null) ){ // tim kiem dia diem
															// theo ten mon an
    		  
    		  the_collection.find().toArray(function(error,results){
      			 if(error) callback(error)
      			 else{
      				 // callback(null,results)
      				 
      				 var countdsh = 0; // biến đếm món ăn
      				 
      				 var resultJSONdsh = "["; // chuỗi json trả về địa điểm
												// khi có món ăn
      				 
      				 for (var i = 0; i < results.length; i++) {
      						
      						if(query.dsh != null) // ktra xem có querystring
													// dsh hay k?
      							for (var j = 0; j < results[i].dishes.length; j++) {
      								if(change_alias(results[i].dishes[j].name.toLowerCase()).search(change_alias(query.dsh.toLowerCase())) != -1 ){ // ham
																																					// so
																																																																// sai
      									countdsh++;
      									resultJSONdsh += JSON.stringify(results[i])+",";
      								}
      							}
      					}
  					}
      				
      				if(countdsh != 0){
      					console.log(resultJSONdsh.substring(0,resultJSONdsh.length-1)+"]");
      					callback(null,JSON.parse(resultJSONdsh.substring(0,resultJSONdsh.length-1)+"]"));
         			}else {
         				callback(null,"");
         			}
      				
      			 
      		  });
    		  
    	  }else if(query.locname != null){ // tim kiem dia diem theo ten dia
											// diem
    		  
    		  the_collection.find().toArray(function(error,results){
      			 if(error) callback(error)
      			 else{
      				 
    				 var count = 0; // biến đếm địa điểm
    				 
    				 var resultJSON = "["; // chuỗi json trả về địa điểm
    				 
    				 for (var i = 0; i < results.length; i++) {
    					 if(change_alias(results[i].name.toLowerCase()).search(change_alias(query.locname.toLowerCase())) != -1 ){
    						count++;
							resultJSON += JSON.stringify(results[i])+",";
    					 }
    				 }
    				 
     				if(count != 0){
     					console.log(resultJSON.substring(0,resultJSON.length-1)+"]");
     					callback(null,JSON.parse(resultJSON.substring(0,resultJSON.length-1)+"]"));
     				}else {
     					callback(null,"");
     				}
     				
      				 
      			 }
    		  });
    	  
    		  
    	  // Nếu là request lấy các dia diem gan do
      	  }else if( (query.lat != null) && (query.lon != null) && (query.radius != null) ){
    		  
    		  
    		  the_collection.find().toArray(function(error,results){
     			 if(error) callback(error)
     			 else{
     				 // callback(null,results)
     				 
     				 var countdsh = 0; // biến đếm món ăn
     				 var count = 0; // biến đếm địa điểm
     				 
     				 var resultJSON = "["; // chuỗi json trả về địa điểm
     				 var resultJSONdsh = "["; // chuỗi json trả về địa điểm
												// khi có món ăn
     				 
     				 for (var i = 0; i < results.length; i++) {
     					var result = calDistance(parseFloat(query.lat), parseFloat(query.lon),
     							parseFloat(results[i].location.lat), parseFloat(results[i].location.lon));
     					if( result <= parseInt(query.radius) ){
     						count++;
     						console.log(results[i].name + " : " + result);
     						resultJSON += JSON.stringify(results[i])+",";
     						
     						if(query.dsh != null){ // ktra xem có querystring
													// dsh hay k?
     							for (var j = 0; j < results[i].dishes.length; j++) {
     								if(change_alias(results[i].dishes[j].name.toLowerCase()).search(change_alias(query.dsh.toLowerCase())) != -1 ){ // ham
																																					// so
																																					// sanh
																																					// chuoi
																																					// bi
																																					// sai
     									countdsh++;
     									resultJSONdsh += JSON.stringify(results[i])+",";
     								}
     							}
     						}
     						
     					}
 					}
     				
     				 if(query.dsh != null ){ // truog hop co querystring dsh
												// (món ăn)
     					 if(countdsh != 0){
     						 console.log(resultJSONdsh.substring(0,resultJSONdsh.length-1)+"]");
     						 callback(null,JSON.parse(resultJSONdsh.substring(0,resultJSONdsh.length-1)+"]"));
        				  	}else {
        				  		 callback(null,"");
        				  	}
     				 }else { // truog hop k co querystring dsh
     					 if(count != 0){
     						 console.log(resultJSON.substring(0,resultJSON.length-1)+"]");
     						 callback(null,JSON.parse(resultJSON.substring(0,resultJSON.length-1)+"]"));
     					 }else {
     						 callback(null,"");
     					 }
     				
     				 }
     				
     			 }
     		  });
    		  
    		  
    	  }else if(query.dsh != null){ // query string : dsh -> get locs by dsh
										// name
    		  
    		  the_collection.find().toArray(function(error, results) { // 3
    			  if( error ) callback(error);
    			  else{ 
    				  var resultJSON = "[";
    				  var count = 0;
    				  
    				  // GET LOCS BY FOOD
    				  for (var i = 0; i < results.length; i++) {
    					  for (var j = 0; j < results[i].dishes.length; j++) {
    						  if(results[i].dishes[j].name.toLowerCase() == query.dsh.toLowerCase()){ // ham
																										// so
																										// sanh
																										// chuoi
																										// bi
																										// sai
    							  count++;
    							  resultJSON += JSON.stringify(results[i])+",";
    						  }
    					  }
    				  }
    				  
    				  if(count != 0){
    					  console.log(resultJSON.substring(0,resultJSON.length-1)+"]");
    					  callback(null,JSON.parse(resultJSON.substring(0,resultJSON.length-1)+"]"));
    				  }else {
    					  callback(null,"");
    				  }
			  
    			  }
    		  });
    		  
			  
    	  }else if( (query.usr != null) && (query.cmt != null) && (query.id != null) ){
    		  the_collection.find().toArray(function(error, results) { // 3
    			  if( error ) callback(error)
    			  else{ 
    				  callback(null,results);
    				  var obj;
    				  var text = '{ "'+query.usr+'" : "'+query.cmt+'" }';
    				  for (var i = 0; i < results.length; i++) {
    					  if(results[i]._id == query.id){ 
    						  obj = results[i];
    						  break;
    					  }
    				  }
    				  // obj._id = results[0]._id; // convert to real object
						// id
    				  // var text = '{ "'+query.usr+'" : "'+cmt+'" }';
    				  // console.log(text);
    				  obj.comments.push(JSON.parse(text));
    				  console.log(obj.name);
    				  the_collection.save(obj,function(error,doc){ // replace
																	// the old
																	// object
																	// with the
																	// new one
    						if(error)
    							callback(error);
    						else
    							callback(null,obj);
    				  });
    			  }
    		  });
    	  }else if(query.date != null){ // lấy news
    		  
    		  the_collection.find().toArray(function(error,results){
       			 if(error) callback(error)
       			 else{
       				 
       				 var countdsh = 0; // biến đếm món ăn
       				 
       				 var resultJSONdsh = "["; // chuỗi json trả về địa điểm
 												// khi có món ăn
       				 
       				 for (var i = 0; i < results.length; i++) {
       					 if(check_date(results[i].datestart, results[i].dateend ,query.date)){ // ham
       						 countdsh++;
       						 resultJSONdsh += JSON.stringify(results[i])+",";
       					 }
       				 }
       				 
   				}
       				
       			if(countdsh != 0){
       				callback(null,JSON.parse(resultJSONdsh.substring(0,resultJSONdsh.length-1)+"]"));
          		}else {
          			callback(null,"");
          		}
       				
       		  });
    		  
    	  }else if(query.test != null){ // Test database
    		  
    		  the_collection.find().toArray(function(error, results) { // 3
    			  if( error ) callback(error)
    			  else{ 
    				  callback(null,results);
    				  
    				  // GET ARRAY ELEMENTS
    				  /*
						 * console.log(JSON.stringify(results[0].name));
						 * console.log(JSON.stringify(results[0].location.lat));
						 * console.log(JSON.stringify(results[0].location.lon));
						 * console.log(JSON.stringify(results[0].comments[0].username));
						 * console.log(JSON.stringify(results[0].comments[0].detail));
						 */
    				  
    				  /*
						 * results[0].comments.push("{test:test}");
						 * console.log(JSON.stringify(results[0].comments));
						 */
    				  
    				  // INSERT ARRAY ELEMENTS
    				  /*
						 * var obj = results[0]; obj._id = results[0]._id; //
						 * convert to real object id var text = '{ "employees" :
						 * "test" }'; obj.comments.push(JSON.parse(text));
						 * the_collection.save(obj,function(error,doc){ //
						 * replace the old object with the new one if(error)
						 * callback(error); else callback(null,obj); });
						 */
    				  
    				  // UPDATE ARRAY ELEMENTS
    				  /*
						 * var obj = results[0]; obj._id = results[0]._id; //
						 * convert to real object id var text = '{ "employees" :
						 * "test" }'; obj.comments[0] = JSON.parse(text);
						 * the_collection.save(obj,function(error,doc){ //
						 * replace the old object with the new one if(error)
						 * callback(error); else callback(null,obj); });
						 */
    				  
    				  // DELETE ARRAY ELEMENTS
    				 /*
						 * var obj = results[0]; obj._id = results[0]._id; //
						 * convert to real object id var text = '{ "employees" :
						 * "test" }'; obj.comments.splice(0,1);
						 * the_collection.save(obj,function(error,doc){ //
						 * replace the old object with the new one if(error)
						 * callback(error); else callback(null,obj); });
						 */
    					
    			  }
        	  });
    		  
    		  /*
				 * collection.find(query).toArray(function(error, results) { //3
				 * if( error ) callback(error) else callback(null, results) });
				 */
    		  
    		  
    	  } else{ // Nếu là request lấy tất cả (k có query)
    		  console.log(query);
    		  the_collection.find(query).toArray(function(error, results) { // 3
        		if( error ) callback(error)
        		else callback(null, results)
        	  });
    	  }
    	  
    	
      }
    });
};

// This line declares the exposed, or exported, entities to other applications
// that list collectionDriver.js as a required module.
exports.CollectionDriver = CollectionDriver;