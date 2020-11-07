var mysql = require('mysql');

//import dotenv
let dotenv = require('dotenv');
dotenv.config("./config.env");

//setup server port
let password = process.env.PASSWORD || '';
let database = process.env.DATABASE;

function Connection() {
  this.pool = null;

  this.init = function () {
    this.pool = mysql.createPool({
      connectionLimit: 99,
      host: 'localhost',
      user: 'root',
      password: password,
      database: database,
      waitForConnections: true,
      multipleStatements: true
    });
  };

  this.acquire = function (callback) {
    this.pool = mysql.createPool({
      connectionLimit: 99,
      host: 'localhost',
      user: 'root',
      password: password,
      database: database,
      waitForConnections: true,
      multipleStatements: true
    });
    this.pool.getConnection(function (err, connection) {
      callback(err, connection);
    });
  };
}

module.exports = new Connection();