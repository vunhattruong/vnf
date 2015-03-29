var http = require('http'),
express = require('express'),
path = require('path'),
MongoClient = require('mongodb').MongoClient,
Server = require('mongodb').Server,
CollectionDriver = require('./collectionDriver').CollectionDriver;

// Create express app
var app = express();

// set default port to 3000
app.set('port',process.env.PORT || 3000);

// set the route to views
app.set('views',path.join(__dirname,'views'));
// set view engine = jade
app.set('view engine','jade');

// tell express to parse the incoming data, if it's json -> create json object
// This way req.body can be passed directly to the driver code as a JavaScript
// object.
app.use(express.bodyParser());

var mongoHost = 'localHost';
var mongoPort = 27017;
var collectionDriver;

// create mongoclient and etablish a connection
var mongoClient = new MongoClient(new Server(mongoHost,mongoPort));
mongoClient.open(function(err,mongoClient){
	if(!mongoClient){
		console.error('Error! Exiting... Must start MongoDB first');
		process.exit(1);
	}
	var db = mongoClient.db('MyDatabase');
	collectionDriver = new CollectionDriver(db);
});

// tells Express to use the middleware express.static which serves up static
// files in response to incoming requests.
// path.join(__dirname, 'public') maps the local subfolder public to the base
// route /;
// it uses the Node.js path module to create a platform-independent subfolder
// string.
app.use(express.static(path.join(__dirname,'public')));

app.get('/', function (req, res) {
  res.send('<html><body><h1>Node Server</h1></body></html>');
});
	
app.get('/:collection/:entity',function(req,res){
	var params = req.params;
	var entity = params.entity;
	var collection = params.collection;
	if(entity){
		collectionDriver.get(collection,entity,function(error,objs){
			if(error)
				res.send(400,error);
			else
				res.send(200,objs);
		});
	}else{
		res.send(400,{error:'bad url',url:req.url});
	}
});

app.get('/:collection', function(req, res, next) {  
	var params = req.params;
	var query = req.query; // 1 (query is in JSON type)
	if (query) {
		collectionDriver.query(req.params.collection, query, returnCollectionResults(req,res)); // 3
	} else {
	    collectionDriver.findAll(req.params.collection, returnCollectionResults(req,res)); // 4
	}
});
	 
function returnCollectionResults(req, res) {
    return function(error, objs) { // 5
        if (error) { res.send(400, error); }
	        else { 
                    if (req.accepts('html')) { // 6
//                      res.render('data',{objects: objs, collection:
//						req.params.collection});
                    	 res.set('Content-Type','application/json');
                         res.send(200, objs);
                    } else {
                        res.set('Content-Type','application/json');
                        res.send(200, objs);
                }
        }
    };
};

// insert
app.post('/:collection',function(req,res){
	var object = req.body; // phần body đã dc parse thành json object rồi
	var collection = req.params.collection;
	collectionDriver.save(collection,object,function(err,docs){
		if(err){			
			res.send(400,err);
		}else 
			res.send(201,docs); // create resource successfully
	});
});

// update
app.put('/:collection/:entity',function(req,res){
	var params = req.params;
	var entity = params.entity;
	var collection = params.collection;
	if(entity){
		collectionDriver.update(collection,req.body,entity,function(error,objs){
			if(error)
				res.send(400,error);
			else
				res.send(200,objs);
		});
	}else{
		res.send(400,error);
	}
});

// delete
app.delete('/:collection/:entity',function(req,res){
	var params = req.params;
	var entity = params.entity;
	var collection = params.collection;
	if(entity){
		collectionDriver.delete(collection,entity,function(error,objs){
			if(error)
				res.send(400,error);
			else
				res.send(200,objs);
		});
	}else{
		var error = {'message':'Can not DELETE the whole collection'};
		res.send(400,error);
	}
});

app.use(function (req,res) {
    res.render('404', {url:req.url});
});

http.createServer(app).listen(app.get('port'),function(){
	console.log('Express server is running on port '+app.get('port'));
});

// Insert
// curl -H "Content-Type: application/json" -X POST -d "{\"title\":\"Hello
// World\"}" http://localhost:3000/items

// Update (thay id vào {_id})
// curl -H "Content-Type: application/json" -X PUT -d "{\"title\":\"Good Golly
// Miss Molly\"}" http://localhost:3000/items/{_id}

// Delete (thay id vào {_id})
// curl -H "Content-Type: application/json" -X DELETE
// http://localhost:3000/items/{_id}
