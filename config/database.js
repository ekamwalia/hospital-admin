const mysql = require('mysql');

// MySql configuration
const databaseConfig = {
	host: 'localhost',
	user: 'dbs',
	password: 'dbs123',
	database: 'hospitaldb'
};

module.exports = mysql.createConnection(databaseConfig);
