

INSERT INTO department (name)
VALUES ("Sales"),
       ("Engineering"),
       ("Legal"),
       ("HR");

INSERT INTO role (title, salary, department_id)
VALUES ("Salesman", 65000.00, 1),
       ("Sales Manager", 100000.00, 1),
       ("Junior Developer", 80000.00, 2),
       ("Senior Developer", 125000.00, 2),
       ("Legal Consultant", 90000.00, 3),
       ("HR Rep", 85000.00, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Christopher", "Jann", 1, 6),
       ("Alex", "Cohen", 2, null),
       ("Jessica", "Nelson", 3, null),
       ("Dayna", "Jones", 4, 5),
       ("Sarah", "Emery", 5, null),
       ("David","Thorpe", 6, null);