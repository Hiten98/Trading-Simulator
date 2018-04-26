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

// set up a json of base probabilities.
prob = {};

var potentialStories = ['Employment rate has fallen/risen ', 'President did something stupid/great', 'Natural disaster', 'miraculous invention', 'scientific discovery', 'immigration laws set to change', 'more people going to country X than to country Y for higher education', 'terrorist attacks' ,'infighting amongst ruling party', 'corruption charges against clergy/counsel/senate/cabinet', 'country supported company with unethical means'];

function init() {
  currencies["USD"] = 1;
  currencies["EUR"] = 0.81;
  currencies["JPY"] = 107.66;
  currencies["GBP"] = 0.71;
  currencies["AUD"] = 1.30;
  currencies["CAD"] = 1.28;
  currencies["CHF"] = 0.97;
  currencies["CNY"] = 6.30;
  currencies["SEK"] = 8.45;
  currencies["MXN"] = 18.53;
  currencies["NZD"] = 1.39;
  currencies["SGD"] = 1.32;
  currencies["HKD"] = 7.84;
  currencies["NOK"] = 7.84;
  currencies["KRW"] = 1071.09;
  currencies["TRY"] = 4.08;
  currencies["INR"] = 66.21;
  currencies["RUB"] = 61.39;
  currencies["BRL"] = 3.41;
  currencies["ZAR"] = 12.10;
  currencies["DKK"] = 6.06;
  currencies["PLN"] = 3.40;
  currencies["TWD"] = 29.47;
  currencies["THB"] = 31.36;
  currencies["MYR"] = 3.90;


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

  prob["USD"] = 0.5;
  prob["EUR"] = 0.5;
  prob["JPY"] = 0.5;
  prob["GBP"] = 0.5;
  prob["AUD"] = 0.5;
  prob["CAD"] = 0.5;
  prob["CHF"] = 0.5;
  prob["CNY"] = 0.5;
  prob["SEK"] = 0.5;
  prob["MXN"] = 0.5;
  prob["NZD"] = 0.5;
  prob["SGD"] = 0.5;
  prob["HKD"] = 0.5;
  prob["NOK"] = 0.5;
  prob["KRW"] = 0.5;
  prob["TRY"] = 0.5;
  prob["INR"] = 0.5;
  prob["RUB"] = 0.5;
  prob["BRL"] = 0.5;
  prob["ZAR"] = 0.5;
  prob["DKK"] = 0.5;
  prob["PLN"] = 0.5;
  prob["TWD"] = 0.5;
  prob["THB"] = 0.5;
  prob["MYR"] = 0.5;
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
    res.json({
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
  db.reset(email, password);
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
  db.graph(currency, (x) => {
    // x["status"] = true
    y = {};
    y["values"] = x;
    y["status"] = true;
    y["volatility"] = volatility[currency.toUpperCase()];
    y["change"] = changes[currency.toUpperCase()];
      res.send(y);
  })
})

//get user
app.post('/GET-USER', function (req, res) {
  var token = req.body.token;
  console.log(req.body);
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
        db.getUser(decoded.email, (x) => {
          // x["status"] = true
          y = {};
          y["status"] = true;
          x = x[0]; //["status"] = true;
          y["currencies"] = x;
          y["email"] = decoded.email;
          y["volatility"] = volatility;
          y["changes"] = changes;
          y["values"] = currencies;
          res.send(y);
        })
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

// trade to see if it is valid
function validTrade (email, currA, currB, amt, callback) {
  currA = currA.toLowerCase();
  currB = currB.toLowerCase();
  db.getUser(email, (x) =>{
    x = x[0];
    if(x[currA] === undefined) {
      callback(false);
    }
    if (parseFloat(x[currA]) > amt) {
      var amt1 =  parseFloat(x[currA]) - amt;
      db.trade(email, currA, amt1);
      var amt2 = amt*currencies[currB.toUpperCase()]/currencies[currA.toUpperCase()];
      if (!(x[currB] === undefined)) {
        amt2 = amt2 + parseFloat(x[currB]);
      }
      db.trade(email, currB, amt2);
      callback(true);
    }
    else {
      callback(false);
    }
  })
}

// trade to see if it is valid and NOT Trade
function validTradeOnly (email, currA, currB, amt, callback) {
  currA = currA.toLowerCase();
  currB = currB.toLowerCase();
  db.getUser(email, (x) =>{
    x = x[0];
    if(x[currA] === undefined) {
      callback([0,-1]);   //user does not have currA
    }
    if (parseFloat(x[currA]) > amt) {
      var amt1 =  parseFloat(x[currA]) - amt;
      // db.trade(email, currA, amt1);
      var amt2 = amt*currencies[currB.toUpperCase()]/currencies[currA.toUpperCase()];
      if (!(x[currB] === undefined)) {
        // amt2 = amt2 + parseFloat(x[currB]);
      }
      // db.trade(email, currB, amt2);
      callback([amt1, amt2]);
    }
    else {
      callback([parseFloat(x[currA]), -1]);    //user does not have ENOUGH of currA;
    }
  })
}

//verify trade
app.post('/VERIFY-TRADE', function (req, res) {
  var token = req.body.token;
  var flag = false;
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
        var email = decoded.email;
        var currA = req.body.currA;
        var currB = req.body.currB;
        var amt = req.body.amt;
        validTradeOnly(email, currA, currB, amt, (x) => {
          if (x[1] == -1) {
            var message = "Trade not succeeded. You have: " + String(x[0]);
            message = message + ". You tried trading: " + String(amt);
            console.log(message);
            console.log(currA);
            console.log(currB);
            console.log('sending response with message: ' + message);
            temp = {
              "status": false,
              'message': message
            };
            if(!flag){
              res.send(temp);
              flag = true;
            }
          }
          else {
            console.log('sending the message that trade succeeded');
            res.json({
              'status': true,
              'message': 'Trade succeeded: You now have ' + String(x[0]) + " of " + currA + " and " + String(x[1]) + " of " + currB,
              'amt': String(x[1])
            })
          }
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

// trade once currency:
app.post('/TRADE-ONE', function (req, res) {
  console.log(req.body);
  var token = req.body.token;
  console.log(req.body);
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
        var currA = req.body.currA;
        var currB = req.body.currB;
        var amt = req.body.amt;
        validTrade(decoded.email, currA, currB, amt, (x) => {
          res.json({
            'status': x
          })
        })
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

//trade things
app.post('/TRADE', function (req, res) {
  console.log(req.body);
  var token = req.body.token;
  let flag = false;
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
        // req.decoded = decoded;
        var flag = true;
        var email = decoded.email;
        var trades = [];
        var index = 0;
        for (number in req.body) {
          if(isNan(number)) {
            continue;
          }
          trades[index] = req.body.number;
          index++;
        }
        for (let i = 0, p = Promise.resolve(); i < trades.length; i++) {
          p = p.then(_ => new Promise(resolve =>
            setTimeout(function () {
              var flag2 = validTrade(email, trades[i].currA, trades[i].currB, trades[i].amt, function (flag2) {
                if(!flag2) {
                  flag = false;
                }
              });
          })
        ));
          if(!flag) {
            res.json({
              'status': false,
              'error': 'trade could not be completed'
            });
            break;
          }
        }
        if(flag) {
          res.json({
            'status': true,
            'message': "trade completed successfully"
          })
        }
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

//convert
app.post('/CONVERT', function (req, res) {
  console.log(req.body);
  var currA = req.body.currA;
  var currB = req.body.currB;
  var amt = req.body.amt;
  var amt2 = amt*currencies[currB.toUpperCase()]/currencies[currA.toUpperCase()];
  res.json({
    'status': true,
    'amt': amt2
  })
})


//sleep for
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

//get %change
function change(currency) {
  var mod = prob[currency.toUpperCase()];
  if (currencies[currency] > 5000) {
    mod = 0.8;
  }
  if (currencies[currency] < 0.05) {
    mod = 0.2;
  }
  var direction;
  if (Math.random() > mod) {
    direction = 1;
  }
  else {
    direction = -1;
  }

  var value = Math.random() * currencies[currency] * volatility[currency];
  value = Math.ceil(value);
  value = value/100;
  if (value < 0.01) {
    value = 0.01;
  }
  value = value * direction;
  // console.log(value);
   prob[currency.toUpperCase()] = 0.5;
  return value;
}

//async fn to update all values
async function update() {
  var i = 1;
  while (true) {
    for (var currency in currencies) {
      if (currency == 'USD') {
        continue;
      }
      var change2 = change(currency);
      changes[currency] = change2/currencies[currency];
      var finalAmt = change2 + currencies[currency];
      if (finalAmt < 0) {
        finalAmt = finalAmt + 2* change2;
      }
      currencies[currency] = finalAmt;
      // console.log(currency);
      // console.log(finalAmt);
      db.addValue(currency, finalAmt);
    }
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
  console.log('clearing the database to start anew');
  // db.clear();
  console.log('database cleared');
  console.log('initialising values:');
  init()
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
