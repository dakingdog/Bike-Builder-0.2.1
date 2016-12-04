// Imports the express Node module.
var express = require('express');
var readDocument = require('./database.js').readDocument
var validate = require('express-jsonschema').validate;
var writeDocument = require('./database.js').writeDocument;
var bodyParser = require('body-parser')
var addDocument = require('./database.js').addDocument;
var database = require('./database.js');

// Creates an Express server.
var app = express();

// Support receiving text in HTTP request bodies
app.use(bodyParser.text());
// Support receiving JSON in HTTP request bodies
app.use(bodyParser.json());

// You run the server from `server`, so `../client/build` is `server/../client/build`.
// '..' means "go up one directory", so this translates into `client/build`!
app.use(express.static('../client/build'));

/**
* Get the user ID from a token. Returns -1 (an invalid ID)
* if it fails.
*/
function getUserIdFromToken(authorizationLine) {
  try {
    // Cut off "Bearer " from the header value.
    var token = authorizationLine.slice(7);
    // Convert the base64 string to a UTF-8 string.
    var regularString = new Buffer(token, 'base64').toString('utf8');
    // Convert the UTF-8 string into a JavaScript object.
    var tokenObj = JSON.parse(regularString);
    var id = tokenObj['id'];
    // Check that id is a number.
    if (typeof id === 'number') {
      return id;
    } else {
      // Not a number. Return -1, an invalid ID.
      return -1;
    }
  } catch (e) {
    // Return an invalid ID.
    return -1;
  }
}

function getParts(){
  var parts = [];
  for (var i = 30; i <= 44; i++){
    var part = readDocument('parts', i);
    parts.push(part);
  }
  return parts;
}

function getBuilds(userId){
  var user = readDocument('users', userId);
  var builds =[];
  for(var i = 0; i < user.buildList.length; i++){
    var build = readDocument('builds', user.buildList[i]);
    builds.push(build);
  }
  return builds;
}

//BEGIN REGION HTTP ROUTES PUT THEM ALL HERE

/**
* Get the whole parts list
*/
app.get('/parts_default', function(req, res) {
    res.send(getParts());
});

/**
* Get the build list data for a particular user.
*/
app.get('/builds/:userid', function(req, res) {
  var userid = req.params.userid;
  var fromUser = getUserIdFromToken(req.get('Authorization'));
  // userid is a string. We need it to be a number.
  // Parameters are always strings.
  var useridNumber = parseInt(userid, 10);
  if (fromUser === useridNumber) {
    // Send response.
    res.send(getBuilds(userid));
  } else {
    // 401: Unauthorized request.
    res.status(401).end();
  }
});

// Reset database.
app.post('/resetdb', function(req, res) {
  console.log("Resetting database...");
  // This is a debug route, so don't do any validation.
  database.resetDatabase();
  // res.send() sends an empty response with status code 200
  res.send();
});


//END REGION HTTP ROUTES

/**
  * Translate JSON Schema Validation failures into error 400s.
  Must go after all routes
  */
  app.use(function(err, req, res, next) {
    if (err.name === 'JsonSchemaValidation') {
      // Set a bad request http response status
      res.status(400).end();
    } else {
      // It's some other sort of error; pass it to next error middleware handler
      next(err);
    }
  });

  // Starts the server on port 3000!
  app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
  });
