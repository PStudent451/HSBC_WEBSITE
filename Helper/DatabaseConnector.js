var config = require('../config.json');
var pgp = require('pg-promise')(/*options*/);
var cn = {
    user:  config.user,
    port: config.port,
    database: config.db,
    host: config.host,
    ssl: true,
    password: config.password
};

// Constructor
function DatabaseConnector() {
	this.connection = pgp(cn); 
}

var db = new DatabaseConnector();

// export the class
module.exports = db;