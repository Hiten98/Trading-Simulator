
	var mysql = require('mysql');
	var connection = mysql.createConnection({
	  host     : 'tradingsim.cj7tvixlpjsb.us-east-2.rds.amazonaws.com',
	  user     : 'dvaz',
	  password : 'simonanoodles',
	  database : 'tradingsim'
	});


    var functions = require('./functions.js');

	// connection.connect(function(err) {
	//   if (err) throw err;
	//   console.log("Connected!");
	// });

    functions.register("a", "B")

