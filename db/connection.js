var mysql = require("mysql");

var connection;

// Sets up db to connect locally or on JAWSDB if deployed
if (process.env.JAWSDB_URL) {
  connection = mysql.createConnection(process.env.JAWSDB_URL);
} else {
  connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "ycmZ@0927",
    database: "restaurant_db"
  });
}

// Turns BOOLEAN 0s and 1s returned from the db into true and false
connection.config.typeCast = function(field, next) {
  if (field.type == "TINY" && field.length == 1) {
    return field.string() == "1"; // 1 = true, 0 = false
  }
  return next();
};

// Export the connection so it's available in other parts of the app
module.exports = connection;
