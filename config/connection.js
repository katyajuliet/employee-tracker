//requirements to start connection to server
const mysql = require("mysql2");
//.env requirement in development environment
require("dotenv").config();

//Connection for referencing these below data
const connection = mysql.createConnection(
  {
    host: "localhost",
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
  console.log("Successful connection")
);
//export connection
module.exports = connection;
