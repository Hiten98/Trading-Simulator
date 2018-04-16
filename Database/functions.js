
	module.exports = {
		connect,
		use,
		register,
		login,
		addValue,
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

	function use(sql, callback) {
		connection.connect(function(err) {
			if (err) throw err;
			connection.query(sql, function(err, result) {
				if(err) throw err;
				callback(result);
			});
		});
	}

	function useNext(sql, callback) {
		connection.query(sql, function(err, result) {
			if(err) throw err;
			callback(result);
		});
	}

	function register(email, password) {
		var sql = "SELECT * FROM Users WHERE email = \"" + email + "\"";
		use(sql, (x) => {
			if(x.length == 1) {
				console.log("Register: Email already exists");
				// callback(false);
				return false;
			}
			else {
				sql = "INSERT INTO Users(email, pass) VALUES(\"" + email + "\", \"" + password + "\")";
				useNext(sql, (y) => {
					console.log("Register: Success");
					// callback(true);
					return true;
				});
			}
		});
	}

	function login(email, password) {
		var sql = "SELECT * FROM Users WHERE email = \"" + email + "\"";
		use(sql, (x) => {
			console.log(x[0].Email);
		});
	}

	function addValue(currency, value) {
		var sql = "INSERT INTO " + currency + " VALUES(" + value + ")";
		use(sql, (x) => {
			console.log(x);
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

