const mysql = require("mysql");
const dbConfig = require("../config/db.config");

//Create new connection 
var connection = mysql.createPool({
    host: dbConfig.HOST,
    user: dbConfig.USER,
    password: dbConfig.PASSWORD,
    database: dbConfig.DB
});

//Connect database
connection.getConnection(error => {
    if (error) {
    };
    console.log("Successfully connected to the database.");
});

module.exports = connection;
