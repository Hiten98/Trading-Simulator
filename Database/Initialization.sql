USE tradingsim;
CREATE TABLE Users (
    email VARCHAR(50) PRIMARY KEY NOT NULL,
    pass VARCHAR(32) NOT NULL,
    usd FLOAT(20,2) DEFAULT 1000.00,
	eur FLOAT(20,2) DEFAULT 0.00,
    jpy FLOAT(20,2) DEFAULT 0.00,
    gbp FLOAT(20,2) DEFAULT 0.00,
    aud FLOAT(20,2) DEFAULT 0.00,
    cad FLOAT(20,2) DEFAULT 0.00,
    chf FLOAT(20,2) DEFAULT 0.00,
    cny FLOAT(20,2) DEFAULT 0.00,
    sek FLOAT(20,2) DEFAULT 0.00,
    mxn FLOAT(20,2) DEFAULT 0.00,
    nzd FLOAT(20,2) DEFAULT 0.00,
    sgd FLOAT(20,2) DEFAULT 0.00,
    hkd FLOAT(20,2) DEFAULT 0.00,
    nok FLOAT(20,2) DEFAULT 0.00,
    krw FLOAT(20,2) DEFAULT 0.00,
    try FLOAT(20,2) DEFAULT 0.00,
    rub FLOAT(20,2) DEFAULT 0.00,
    inr FLOAT(20,2) DEFAULT 0.00,
    brl FLOAT(20,2) DEFAULT 0.00,
    zar FLOAT(20,2) DEFAULT 0.00,
    dkk FLOAT(20,2) DEFAULT 0.00,
    pln FLOAT(20,2) DEFAULT 0.00,
    twd FLOAT(20,2) DEFAULT 0.00,
    thb FLOAT(20,2) DEFAULT 0.00,
    myr FLOAT(20,2) DEFAULT 0.00
);
INSERT INTO Users(email, pass) VALUES("darwinfvaz@gmail.com", "something");
INSERT INTO Users(email, pass) VALUES("hitenrathod98@gmail.com", "something");
INSERT INTO Users(email, pass) VALUES("sinha33@purdue.edu", "something");
SELECT * FROM Users;