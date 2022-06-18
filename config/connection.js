//requirements to start connection to server
const mysql = require('mysql2');
//.env requirement in development environment
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
  }

//db for referencing these below data
const connection = mysql.createConnection(
    {   
        host: 'localhost',
        port: 3600,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME},
        console.log("Successful connection")
);
//export db 
module.exports = connection;