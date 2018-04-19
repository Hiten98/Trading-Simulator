//set up express
const express = require('express');
const app = express();

//set up morgan
const morgan = require('morgan');

//set up jwt
const jwt = require('jsonwebtoken');

//config:
const config = require('./config.js');

//set up secret
app.set('secret', config.secret);

//use morgan to log everything
app.use(morgan('dev'));

//set up port
var port = (process.env.PORT || 9090 || 443);

//set up body parser for JSON
const bodyParser = require('body-parser');

//database
var db = require('./database.js');

//setting up CORS
//app.use(express.methodOverride());
// ## CORS middleware
//
// see: http://stackoverflow.com/questions/7067966/how-to-allow-cors-in-express-nodejs
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.send(200);
    }
    else {
      next();
    }
};
app.use(allowCrossDomain);

//set bodyParser
app.use(bodyParser.json());

var token2 = '';

//default handler
app.get('/', function(req, res) {
  console.log('In default / fn');
  res.send('Hello');
})

//login handler
app.post('/LOGIN', function (req, res) {
  console.log('login req recieved');
  console.log(req.body);
  var email = req.body.email;
  var password = req.body.password;
  db.login(email, password, (x) => {
    if (x == 'SUCCESS') {
      const payload = {
        'email': email
      }
      var token = jwt.sign(payload, app.get('secret'), {
        'expiresIn': 60*60
      });
      token2 = token;
      res.json({
        'status': true,
        'message': 'Successfully logged in',
        'token': token
      });
    }
    else {
      res.json({
        'status': false,
        'message': x
      });
    }
  });
})

//register handler
app.post('/REGISTER', function (req, res) {
  console.log(req.body);
  var email = req.body.email;
  var password = req.body.password;
  db.register(email, password, (x) => {
    if(x == 'SUCCESS') {
      res.json({
        'status': true,
        'message': 'Registered Successfully'
      });
    }
    else {
      res.json({
        'status': false,
        'message': 'email already exists'
      })
    }
  })
});

//refresh jwt:
app.post('/REFRESH-TOKEN', function (req, res) {
  console.log(req.body);
  var token = req.body.token;
  if (token) {
    jwt.verify(token, app.get('secret'), function(err, decoded) {
      if(err) {
        res.json({
          'status': false,
          'message': 'token could not be verified'
        })
      }
      else {
        console.log(decoded);
        req.decoded = decoded;
      }
    })
  }
  else {
    res.json({
      'status': false,
      'message': 'token not found'
    })
  }
})

//main fn
app.listen(port, function() {
  console.log("server starts on port:");
  console.log(port);
  console.log('connecting to sql database');
  db.connect();
  console.log('Successfully connected to sql database');
})

//error handler
app.use(function (err, req, res, next) {
  console.error(err);
  res.json({
    "status": false,
    "error": 'Something failed, plz check server for more details',
    "details": err
  });
});
