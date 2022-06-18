const inquirer = require('inquirer');
const connection = require('./config/connection');

//roles for inquirer
var roleArr = [];
var deptArr = [];
var empArr = [];
var managerArr = [];

//fill function to get and run roles
const getRoles = () => {
    const roles = `SELECT title FROM role;`;
    connection.query(roles, (err, rows) => {
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

const getDepts = () => {
    const depts = `SELECT name, id FROM department;`;
    connection.query(depts, (err, rows) => {
        if (err) {
            console.log(err);
            return;
        }
        for (let i = 0; i < rows.length; i++) {
            let name = rows[i].name;
            let id = rows[i].id;
            deptArr.push({ name, id });
        }
    }) 
    return deptArr;
};
deptArr = getDepts();

const getEmps = () => {
    const sql = 'SELECT first_name, last_name FROM employee;';
    connection.query(sql, (err, rows) => {
        if (err) {
            console.log(err);
            return;
        }
        for (let i = 0; i < rows.length; i++) {
            let empName = rows[i].first_name + " " + rows[i].last_name;
            empArr.push(empName);
        }
    })
    return empArr;
};
empArr = getEmps();

const getManagers = () => {
    const query = `SELECT first_name, last_name FROM employee WHERE manager_id IS NULL`;
    connection.query(query, (err, res) => {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            managerArr.push(res[i].first_name + " " + res[i].last_name);
        }
    });
    return managerArr;
};
managerArr = getManagers();

// view / select all from department or log error
const viewDepts = () => {
    const query = `SELECT * FROM department;`;

    connection.query(query, (err, rows) => {
        if (err) {
            console.log(err);
            return;
        }
        console.table(rows);
    });

};

const viewRoles = () => {
    const query = `SELECT * FROM role`;

    connection.query(query, (err, rows) => {
        if (err) {
            console.log(err);
            return;
        }
        console.table(rows);
    });
};

const viewEmps = () => {
    const query = `SELECT * FROM employee`;

    connection.query(query, (err, rows) => {
        if (err) {
            console.log(err);
            return;
        }
        console.table(rows);
    });
};

const addDept = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'dept',
            message: 'What is the name of the new department?'
        }
    ]).then(deptTitle => {
        deptArr.push(deptTitle.name);
        const newName = deptTitle.dept;

        const query1 = `INSERT INTO department (name) VALUES ('${newName}');`;
        const query2 = `SELECT * FROM department;`;

        connection.query(query1, (err) => {
            if (err) {
                console.log(err);
                return;
            }
            console.log('Successfully added new Department. Updated list:');
        });

        connection.query(query2, (err, rows) => {
            if (err) {
                console.log(err);
                return;
            }
            console.table(rows);
        });
    })
};
//add role with inquirer prompt
const addRole = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'title',
            message: 'What is the title of the new role?',
            validate: nameInput => {
                if (!nameInput) {
                    console.log('Please enter a title!')
                    return false;
                }
                return true;
            }
        },
        {
            type: 'input',
            name: 'salary',
            message: 'Enter their salary as a number. (Do not include currency symbols.)',
            validate: function (nameInput) {
                if (isNaN(nameInput) || !nameInput) {
                    console.log("Invalid input");
                    return false;
                }
                return true;
            }
        },
        {
            type: 'list',
            name: 'department_name',
            message: 'Select the department this role will belong to.',
            choices: deptArr
        }
    ]).then(roleInfo => {
        
        const { title, salary, department_name } = roleInfo;
        roleArr.push(title);

        const query = `INSERT INTO role (title, salary, department_id) VALUES ('${title}', ${salary}, (SELECT id FROM department WHERE name='${department_name}'));`;
        connection.query(query, (err) => {
            if (err) {
                console.log(err);
                console.log("Failed! Current list: ")
                return;
            }
            console.log('Successfully added new Role. Updated list:');
        });

        const query2 = `SELECT * FROM role;`;
        connection.query(query2, (err, rows) => {
            if (err) {
                console.log(err);
                return;
            }
            console.table(rows);
        });
    })
};

const addEmp = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'first_name',
            message: 'Enter employee first name',
            validate: nameInput => {
                if (!nameInput) {
                    console.log('First name is required.')
                    return false;
                }
                return true;
            }
        },
        {
            type: 'input',
            name: 'last_name',
            message: 'Enter employee last name',
            validate: nameInput => {
                if (!nameInput) {
                    console.log('Last name is required.')
                    return false;
                }
                return true;
            }
        },
        {
            type: 'list',
            name: 'role',
            message: 'Select employee role in the company',
            choices: roleArr,
        },
        {
            type: 'list',
            name: 'managerName',
            message: 'Select employee manager',
            choices: managerArr
        }
    ]).then(empInfo => {
        const { first_name, last_name, role, managerName } = empInfo;
        
        const manager_first_name = managerName.split(' ')[0];
        const manager_last_name = managerName.split(' ')[1];
        
        const sql = `SELECT id FROM employee WHERE first_name='${manager_first_name}' AND last_name='${manager_last_name}';`

        var empName = empInfo.first_name + " " + empInfo.last_name;
        empArr.push(empName);

        connection.promise().query(sql).then((rows) => {
            const manager_id = rows[0][0].id;
            return manager_id;
        })
        .then(manager_id => {
            const sql2 = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${first_name}', '${last_name}', (SELECT id FROM role WHERE title='${role}'), ${manager_id});`;
            connection.query(sql2, (err) => {
                if (err) {
                    console.log(err);
                    return;
                }
                console.log('Successfully added new Role.');
            })             
        });
    })
};

const updateEmpRole = () => {
    inquirer.prompt([
        {
            type: 'list',
            name: 'employeeName',
            message: 'Choose employee name you wish to update',
            choices: empArr
        },
        {
            type: 'list',
            name: 'newRole',
            message: 'Select the employee new role',
            choices: roleArr
        }
    ]).then(updatedInfo => {
        const { employeeName, newRole } = updatedInfo;
        const emp_first_name = employeeName.split(' ')[0];
        const emp_last_name = employeeName.split(' ')[1];

        const query = `UPDATE employee SET role_id = (SELECT id FROM role WHERE title='${newRole}') WHERE first_name='${emp_first_name}' AND last_name='${emp_last_name}';`;
        connection.query(query, (err) => {
            if (err) {
                console.log(err);
                console.log("Error: Current list: ")
                return;
            }
            console.log('Employee data updated successfully! Updated list:');
        });

        const query2 = `SELECT * FROM employee;`;
        connection.query(query2, (err, rows) => {
            if (err) {
                console.log(err);
                return;
            }
            console.table(rows);
        });
    })
};

// Delete a Department
const removeDepartment = () => {
    let sql =   `SELECT department.id, department.department_name FROM department`;
    connection.promise().query(sql, (error, response) => {
      if (error) throw error;
      let departmentNamesArray = [];
      response.forEach((department) => {departmentNamesArray.push(department.department_name);});

      inquirer
        .prompt([
          {
            name: 'chosenDept',
            type: 'list',
            message: 'Which department would you like to delete?',
            choices: departmentNamesArray
          }
        ])
        .then((answer) => {
          let departmentId;

          response.forEach((department) => {
            if (answer.chosenDept === department.department_name) {
              departmentId = department.id;
            }
          });

          let sql =     `DELETE FROM department WHERE department.id = ?`;
          connection.promise().query(sql, [departmentId], (error) => {
            if (error) throw error;

            viewAllDepartments();
          });
        });
    });
};

module.exports = {viewDepts, viewRoles, viewEmps, addDept, addRole, addEmp, updateEmpRole, removeDepartment};