
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
//Updating the account information
function updateAccount(userId, fName, lName, email, uName, newPassword){
  var info = readDocument('users',userId);
  info.first_name = fName;
  info.last_name = lName;
  info.email = email;
  info.user_name = uName;
  info.password = newPassword;
  writeDocument('users',info);
  return info;
}

function changeFirstName(userId, newFirstName) {
  var info = readDocument('users', userId);
  info.first_name = newFirstName;
  writeDocument('users', info);
  // emulateServerReturn(userId);
  return info;
}
app.put('./user/:users', function(req,res){
  var fromUser = getUserIdFromToken('Authrization');
  var body = req.body;
  if(fromUser === body.userId){
    var fname = changeFirstName(req.params.userId,body.fname);
    res.status(201);
    res.send(fname);
  }else{
    res.status(401).end();
  }
})

app.put('/user/:users', function(req,res){
  var fromUser = getUserIdFromToken('Autorization');
  var body = req.body;
  if(fromUser === body.userId){
    var account = updateAccount(req.params.userId, body.fName,body.lName, body.email, body.uName, body.newPassword);
    res.status(201);
    res.send(account);
  }else{
    res.status(401).end();
  }
});


//BEGIN REGION HTTP ROUTES PUT THEM ALL HERE





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
