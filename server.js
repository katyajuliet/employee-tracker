//requirements for starting command line with connection.js
const inquirer = require('inquirer');
const db = require('./config/connection');
const cTable = require('console.table');
//connecting roles functionality with server.js
const {viewDepts, viewRoles, viewEmps, addDept, addRole, addEmp, updateEmpRole} = require('./roles.js'); 
//inquiries for command line - prompts
const promptMenu = () => {
    return inquirer
        .prompt([
            {
                type: 'list',
                name: 'menu',
                message: 'What would you like to do?',
                choices: [
                    'View All Departments',
                    'View All Roles',
                    'View All Employees',
                    'Add a Department',
                    'Add a Role',
                    'Add an Employee',
                    'Update an Employee Role'
                ]
            }
        ])
        .then(answer => {
            switch (answer.menu) {
                case 'View All Departments':
                    viewDepts();
                    break;
                case 'View All Roles':
                    viewRoles();
                    break;
                case 'View All Employees':
                    viewEmps();
                    break;
                case 'Add a Department':
                    addDept();
                    break;
                case 'Add a Role':
                    addRole();
                    break;
                case 'Add an Employee':
                    addEmp();
                    break;
                case 'Update an Employee Role':
                    updateEmpRole();
                    break;
            }
        })
};