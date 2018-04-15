#USE tradingsim;
CREATE TABLE Users (
    Email VARCHAR(50) PRIMARY KEY NOT NULL,
    Pass VARCHAR(32) NOT NULL,
    Amount FLOAT(20,2) DEFAULT 1000.00,
	Currency VARCHAR(3) DEFAULT 'USD'
);
INSERT INTO Users(Email, Pass) VALUES("darwinfvaz@gmail.com", "something");
SELECT 
    *
FROM
    Users;