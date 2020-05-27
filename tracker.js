const inquirer = require("inquirer");
const mysql = require("mysql");
require("dotenv").config();


// Set up connection to port and database
const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: process.env.DB_PASSWORD,
    database: "employee_tracker_DB"
});

// Initial question where user can decide what they want to do
connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected");
    baseQuestion();
});

function baseQuestion() {
    inquirer.prompt({
        name: "Base",
        type: "rawlist",
        message: "What would you like to do?",
        choices: [
            "View All Employees",
            "View All Employees by Department",
            "View All Employees by Manager",
            "Add Employee",
            "Remove Employee",
            "Exit"
        ]
    })
    .then(function(answer) {
        switch(answer.Base){
        //   Need to create all case functions
            case "View All Employees":
                showEmployees();
                break;
            
            case "View All Employees by Department":
                showAllByDept();
                break;

            case "View All Employees by Manager":
                showAllByManager();
                break;

            case "Add Employee":
                addEmployee();
                break;

            case "Remove Employee":
                removeEmployee();
                break;

            default:
                return process.exit();
        }
    })
};

// displays all employees
async function showEmployees(){
    console.log("Viewing all employees");
    const query = "SELECT * FROM employee"
    connection.query(query, function (err, res) {
        if (err) throw err;
        console.table(res);
        baseQuestion();
    });
};

// Shows all employees based on what department they work in
function showAllByDept(){
    inquirer.prompt({
        name: "deptSearch",
        type: "input",
        message: "What department would you like to search by?"
    })
    .then(function(answer) {
        connection.query("SELECT * FROM employee LEFT JOIN employee_role ON employee.role_id = employee_role.id LEFT JOIN department ON employee_role.department_id = department.id WHERE department.id = ?;", answer.deptSearch, function(err, res) {
            if (err) throw err;
            for(var i = 0; i < res.length; i++) {
                console.table(
                    "ID: " +
                    res[i].id +
                    " || First Name: " +
                    res[i].first_name +
                    " || Last Name: " +
                    res[i].last_name
                );                
            };
            baseQuestion();
        })
      });
    };

    // Function to show all employees based on who their mananger is
    function showAllByManager() {
        inquirer.prompt({
            name: "manager",
            type: "input",
            message: "What manager id would you like to search by?"
        })
        .then(function(answer) {
            connection.query("SELECT * FROM employee LEFT JOIN employee_role ON employee.role_id = employee_role.id LEFT JOIN department ON employee_role.department_id = department.id WHERE manager_id=?", answer.manager, function(err, res) {
                if (err) throw err;
                for(var i = 0; i < res.length; i++) {
                    console.table(
                        "ID: " +
                        res[i].ID +
                        " || First Name: " +
                        res[i].first_name +
                        " || Last Name: " +
                        res[i].last_name
                    );
                };
                baseQuestion();
            })
          });
    };

    // Function to allow the user to create a new employee
    function addEmployee(){
        inquirer.prompt([
            {
                name: "empID",
                type: "input",
                message: "What is the employee's ID?"
            },
            {
                name: "firstName",
                type: "input",
                message: "What is the employee's first name?"
            },
            {
                name: "lastName",
                type: "input",
                message: "What is the employee's last name?"
            },
        //  add question for role ID
        ])
        .then(function(answer) {
            connection.query(
                "INSERT INTO employee SET ?",
                {
                    ID: answer.empID,
                    first_Name: answer.firstName,
                    last_name: answer.lastName,
                    // add role ID
                },

                function(err) {
                    if(err) throw err;

                    console.log("New employee added successfully.");
                    
                    baseQuestion();
                }
            );
        });
    };

    // Function where the user can remove any employee
    function removeEmployee(){
        inquirer.prompt({
            type: "input",
            name: "removal",
            message: "What is the id of the employee you would like to remove?"
        })
        .then(function(answer) {
            connection.query(
                "DELETE FROM employee WHERE id = ?", answer.removal, function(err, res) {
                    if (err) throw err;
                    console.log("Employee Deleted");
                    baseQuestion();
                }
            )
        })
    };