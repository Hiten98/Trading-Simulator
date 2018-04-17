
	module.exports = {
		connect,
		useOnce,
		use,
		register,
		login,
		addValue,
		graph,
		getUser
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

	function useOnce(sql, callback) {
		connection.connect(function(err) {
			if (err) throw err;
			connection.query(sql, function(err, result) {
				if(err) throw err;
				callback(result);
			});
		});
	}

	function use(sql, callback) {
		connection.query(sql, function(err, result) {
			if(err) throw err;
			// console.log(result);
			callback(result);
		});
	}

	function register(email, password, callback) {
		var sql = "SELECT * FROM Users WHERE email = \"" + email + "\"";
		use(sql, (x) => {
			if(x.length == 1) {
				console.log("Register: Email already exists");
				callback("FAILURE");
			}
			else {
				sql = "INSERT INTO Users(email, pass) VALUES(\"" + email + "\", \"" + password + "\")";
				use(sql, (y) => {
					console.log("Register: Success");
					callback("SUCCESS");
				});
			}
		});
	}

	function login(email, password, callback) {
		var sql = "SELECT * FROM Users WHERE email = \"" + email + "\"";
		use(sql, (x) => {
			if(x.length == 0) {
				console.log("Login: No such user");
				callback("INCORRECT-EMAIL");
			}
			else if(password == x[0].pass) {
				console.log("Login: Success");
				callback("SUCCESS");
			}
			else {
				console.log("Login: Incorrect password");
				callback("INCORRECT-PASSWORD");
			}
		});
	}

	function addValue(currency, value) {
		var sql = "SELECT * FROM " + currency.toUpperCase() + " WHERE NUMBER = (SELECT MAX(NUMBER) FROM " + currency.toUpperCase() + ")";
		use(sql, (x) => {
			var number = x[0].number + 1;
			var percent = (value / x[0].value) * 100 - 100;
			var diff = value - x[0].value;
			sql = "INSERT INTO " + currency.toUpperCase() + "(number, value, diff, percent) VALUES(" + number + ", " + value + ", " + diff + "," + percent + ")";
			use(sql, (y) => { console.log("Add Value: Add uccess"); });
			if(number > 200) {
				sql = "DELETE FROM " + currency.toUpperCase() + " ORDER BY number LIMIT 1";
				use(sql, (z) => { console.log("Add Value: Delete success"); });
			}
		});
	}

	function graph(currency, callback) {
		var sql = "SELECT value FROM " + currency.toUpperCase();
		use(sql, (x) => {
			console.log("Graph: Success");
			callback(x);
		});
	}

	function getUser(email, callback) {
		var sql = "SELECT * FROM Users WHERE email = \"" + email + "\"";
		use(sql, (x) => {
			var size = Object.keys(x[0]).length;
			Object.keys(x[0]).forEach(function(key) {
				if(x[0].hasOwnProperty(key) && x[0][key] == 0)
					delete x[0][key];
			});
			console.log("Get User: Success");
			callback(x);
		});
	}

	function trade(email, currency, value) {
		
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

