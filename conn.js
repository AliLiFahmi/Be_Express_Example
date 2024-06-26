var mysql = require('mysql2');

// untuk model developmen => buka comentar kode dibawah
// #
// ##
const config = require('./config/config.json').development;

// untuk model production => buka comentar kode dibawah
// #
// ##
// const config = require('./config/config.json').production;

console.log(config);

var connection = mysql.createConnection({
  host: config.host,     // hostname atau IP server database
  port: config.port || 3306,  // port server database, default adalah 3306
  database: config.database,  // nama database
  user: config.username,      // username untuk database
  password: config.password,  // password untuk database
});

const connect = async () => {
  try {
    connection.connect(function (err) {
      if (err) {
        console.error('Error connecting: ' + err.stack);
        return;
      }
      console.log('Connected as id ' + connection.threadId);
    });
  } catch (error) {
    console.error('Connection error:', error);
  }
};

module.exports = { connect, connection };
