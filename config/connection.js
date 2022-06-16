const mysql = require('mysql');
const chalk = require('chalk');

connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'employee_db',
});