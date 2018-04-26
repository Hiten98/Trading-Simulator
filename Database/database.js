
	var functions = require('./functions.js');

    // functions.addValue();
    functions.connect();
    // functions.register("rathod@purdue.com", "something", (x) => {console.log(x); });
    // functions.register("dvaz@gmail.com", "something");
    // functions.login("darwinfvaz@gmail.com", "something", (x) => { console.log(x); });
    // functions.addValue("eur", 1);
    // functions.graph("eur", (x) => {
    //     console.log(x);
    // });
    // functions.getUser("darwinfvaz@gmail.com", (x) => { console.log(x); });
    // functions.trade("darwinfvaz@gmail.com", "EUR", 30);
    // functions.trade("darwinfvaz@gmail.com", "inr", 70);
    // functions.trade("darwinfvaz@gmail.com", "brl", 500);
    // functions.trade("darwinfvaz@gmail.com", "usd", 950);
    // functions.latestValue((x) => { console.log(x); });

    // functions.getUser("darwinfvaz@gmail.com", (x) => {
    //     console.log(x);
    // });
    // functions.clear();
    functions.headlines("The Blink - Far Reach News", (x) =>{
        console.log(x);
    });
    // functions.makeNews("The Blink - Far Reach News", "Great stuff happens: EUR goes negative!")
    // console.log(Date.now());
    // console.log(new Date().toLocaleString());