DROP DATABASE IF EXISTS employee_tracker_DB;
CREATE DATABASE employee_tracker_DB;

USE employee_tracker_DB;

CREATE TABLE employee (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR (30),
    last_name VARCHAR (30),
    role_id INT,
    manager_id INT
);

CREATE TABLE employee_role(
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR (30),
    salary DECIMAL (10, 2),
    department_id INT
);

CREATE TABLE department(
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR (30)
);

SELECT * FROM employee;
SELECT * FROM employee_role;
SELECT * FROM department;