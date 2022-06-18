const inquirer = require('inquirer');
const db = require('./config/connection');

//roles for inquirer
var roleArr = [];
var deptArr = [];
var empArr = [];
var managerArr = [];

//fill function to get and run roles
const getRoles = () => {
    const roles = `SELECT title FROM role;`;
    db.query(roles, (err, rows) => {
        if (err) {
            console.log(err);
            return;
        }
        for (let i = 0; i < rows.length; i++) {
            roleArr.push(rows[i].title);
        }
    })
    return roleArr;
};
roleArr = getRoles();

