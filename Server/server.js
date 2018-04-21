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

// set up min
var min = 60;

//bool to check if i need to find cycles
var checkForCycles = false;

//set up body parser for JSON
const bodyParser = require('body-parser');

//database
var db = require('./database.js');

//set up JSON of currencies:
currencies = {};

//set up a JSON of volatility
volatility = {};

//set up a json of last changes
changes = {};

function init() {
  currencies["USD"] = 1;
  currencies["EUR"] = 1.23;
  currencies["JPY"] = 0.0093;
  currencies["GBP"] = 1.40;
  currencies["AUD"] = 0.77;
  currencies["CAD"] = 0.78;
  currencies["CHF"] = 1.03;
  currencies["CNY"] = 0.16;
  currencies["SEK"] = 0.12;
  currencies["MXN"] = 0.054;
  currencies["NZD"] = 0.72;
  currencies["SGD"] = 0.76;
  currencies["HKD"] = 0.13;
  currencies["NOK"] = 0.13;
  currencies["KRW"] = 0.00094;
  currencies["TRY"] = 0.25;
  currencies["INR"] = 0.015;
  currencies["RUB"] = 0.016;
  currencies["BRL"] = 0.29;
  currencies["ZAR"] = 0.083;
  currencies["DKK"] = 0.16;
  currencies["PLN"] =0.29 ;
  currencies["TWD"] = 0.034;
  currencies["THB"] = 0.032;
  currencies["MYR"] = 0.26;


  changes["USD"] = 0;
  changes["EUR"] = 0;
  changes["JPY"] = 0;
  changes["GBP"] = 0;
  changes["AUD"] = 0;
  changes["CAD"] = 0;
  changes["CHF"] = 0;
  changes["CNY"] = 0;
  changes["SEK"] = 0;
  changes["MXN"] = 0;
  changes["NZD"] = 0;
  changes["SGD"] = 0;
  changes["HKD"] = 0;
  changes["NOK"] = 0;
  changes["KRW"] = 0;
  changes["TRY"] = 0;
  changes["INR"] = 0;
  changes["RUB"] = 0;
  changes["BRL"] = 0;
  changes["ZAR"] = 0;
  changes["DKK"] = 0;
  changes["PLN"] = 0;
  changes["TWD"] = 0;
  changes["THB"] = 0;
  changes["MYR"] = 0;


  volatility["USD"] = 0;
  volatility["EUR"] = 0.7;
  volatility["JPY"] = 1;
  volatility["GBP"] = 0.85;
  volatility["AUD"] = 0.71;
  volatility["CAD"] = 0.04;
  volatility["CHF"] = 0.56;
  volatility["CNY"] = 0.25;
  volatility["SEK"] = 0.78;
  volatility["MXN"] = 0.68;
  volatility["NZD"] = 0.12;
  volatility["SGD"] = 0.90;
  volatility["HKD"] = 0.20;
  volatility["NOK"] = 0.41;
  volatility["KRW"] = 0.36;
  volatility["TRY"] = 0.91;
  volatility["INR"] = 0.84;
  volatility["RUB"] = 0.75;
  volatility["BRL"] = 0.91;
  volatility["ZAR"] = 0.83;
  volatility["DKK"] = 0.16;
  volatility["PLN"] =0.29 ;
  volatility["TWD"] = 0.84;
  volatility["THB"] = 0.52;
  volatility["MYR"] = 0.90;
}

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

//default handler
app.get('/', function(req, res) {
  console.log('In default / fn');
  res.send('Hello');
})

//jwt making function
function makeJWT (payload) {
  var token =  jwt.sign(payload, app.get('secret'), {
    'expiresIn': 60*60
  });
  return token;
}

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
      var token = makeJWT(payload);
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
});

//register handler
app.post('/REGISTER', function (req, res) {
  console.log(req.body);
  var email = req.body.email;
  var password = req.body.password;
  var flag = true;
  if(email == '') {
    res.json({
      'status': false,
      'message': 'email field is empty'
    })
    flag = false;
  }
  if(password == '' && flag) {
    res.json({
      'status': false,
      'message': 'password field is empty'
    })
    flag = false;
  }
  if(flag) {
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
  }
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
        const payload = {
          'email': decoded.email
        }
        var token = makeJWT(payload);
        res.json({
          'status': true,
          'message': 'Successfully refreshed token',
          'token': token
        });
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

//verify token
app.post('/VERIFY-TOKEN', function (req, res) {
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
        res.json({
          'status': true,
          'message': 'Token verified'
        });
      }
    })
  }
  else {
    res.status(404).json({
      'status': false,
      'message': 'token not found'
    })
  }
})

//route to update things:
app.post('/UPDATE-THINGS', function (req, res) {
  console.log(req.body);
  min = req.body.min;
  checkForCycles = req.body.checkForCycles;
  res.json({
    'status': true,
    'min': min,
    'checkForCycles': checkForCycles
  })
})

//reset password
app.post('/RESET-PASSWORD', function (req, res) {
  console.log(req.body);
  var email = req.body.email;
  var password = req.body.password;
  database.reset(email, password);
  res.json({
    'status': true,
    'message': 'password updated successfully'
  })
})

//get latest value
app.post('/GET-LATEST-VALUE', function (req, res) {
  res.json({
    "currencies": currencies,
    "volatility": volatility,
    "changes": changes
  });
})

//get currency values
app.post('/GET-GRAPH-VALUES', function (req, res) {
  console.log(req.body);
  var currency = req.body.currency;
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
        database.graph(currency, (x) => {
          x["status"] = true
          res.send(x);
        })
      }
    })
  }
  else {
    res.status(404).json({
      'status': false,
      'message': 'token not found'
    })
  }
})

//sleep for
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

//async fn to update all values
async function update() {
  var i = 1;
  while (true) {
    console.log(i);
    i++;
    await sleep(1000*min);
  }
}

//main fn
app.listen(port, function() {
  console.log("server starts on port:");
  console.log(port);
  console.log('connecting to sql database');
  db.connect();
  console.log('Successfully connected to sql database');
  console.log('initialising values:');
  console.log('done init');
  console.log('start updating values');
  update();
  console.log('it should be updating now');
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
