
	module.exports = {
		connect,
		register,
		login,
		test
	}

	var mysql = require('mysql');
	var connection = mysql.createConnection({
	  host     : 'tradingsim.cj7tvixlpjsb.us-east-2.rds.amazonaws.com',
	  user     : 'dvaz',
	  password : 'simonanoodles',
	  database : 'tradingsim'
	});

	function connect() {
		connection.connect(function(err) {
			if (err) console.log("Failed to connect");
			else console.log("Connected!");
		});
	}

	function register(email, password) {
		connection.connect(function(err) {
			if (err) throw err;
			console.log("Connected!");
		});
	}

	function login(email, password) {
		connection.connect(function(err) {
			if (err) throw err;
			var sql = "SELECT * FROM Users WHERE email = " + email;
			connection.query(sql, function(err, result) {
				if(err) throw err;
				console.log(result);
			});
		});
	}

	function test() {
		connection.connect(function(err) {
			if (err) throw err;
			connection.query("SELECT * FROM Users", function (err, result, fields) {
				if (err) throw err;
				console.log(result);
			});
		});
	}

