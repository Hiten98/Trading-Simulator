
	module.exports = {
		register
	}

	function register(email, password) {
		connection.connect(function(err) {
		  if (err) throw err;
		  console.log("Connected!");
		});
	}