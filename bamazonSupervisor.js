const mysql = require("mysql");
const inquirer = require('inquirer');
const colors = require('colors');
const cTable = require('console.table');

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "Fodder165*",
  database: "inventory_db"
});

connection.connect(function (err) {
  if (err) throw (err);
  supervisorMenu();
});

const supervisorMenu = () => {
  inquirer
    .prompt([
      {
        type: 'list',
        choices: ["View Product Sales by Department", "Create New Department", "Exit Menu"],
        name: 'supervisorSelection',
        message: "Select a command"
      }
    ])
    .then(answers => {
      (answers.supervisorSelection)
      handleSupervisorOption(answers.supervisorSelection);
    });
};

// Switch statment base on supervisor choice
const handleSupervisorOption = (input) => {
  switch (input) {
    case 'View Product Sales by Department':
      return displayProductSales();
    case 'Create New Department':
      return handleAddNewDepartment();
    case 'Exit Menu':
      return handleMenuExit();
    default:
      console.log("Incorrect command")
  }
};

// Handle menu option 1
const displayProductSales = () => {
  connection.query("SELECT departments.department_id, departments.department_name, departments.over_head_costs, SUM(products.product_sales) AS product_sales, (SUM(products.product_sales) - departments.over_head_costs) AS total_profit FROM products RIGHT JOIN departments ON products.department_name = departments.department_name GROUP BY products.department_name, departments.department_id ORDER BY departments.department_id",
    function (err, res) {
      if (err) throw (err);
      console.log(`\nList of bamazon departments:\n`.bold.underline.cyan)
      console.table(res)
      supervisorMenu();
    })
};

// Handle menu option 2
const handleAddNewDepartment = () => {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'departmentName',
        message: 'Enter name of new department'
      },
      {
        type: 'input',
        name: 'departmentCosts',
        message: 'Enter department over-head costs',
        validate: function (value) {
          let valid = !isNaN(parseFloat(value));
          return valid || "Please enter a number".red.bold;
        },
        filter: Number
      }
    ])
    .then(answers => {
      connection.query("INSERT INTO departments SET ?", {
        department_name: answers.departmentName,
        over_head_costs: answers.departmentCosts
      }, function (err, res) {
        if (err) throw (err);
        console.log(`\n${res.affectedRows} new department added: ${answers.departmentName}\n`.bold.underline.cyan);
        supervisorMenu();
      })
    });
};

// Handle menu option 3
const handleMenuExit = () => {
  console.log('\nExited Supervisor Menu\n'.bold.underline.red)
  connection.end();
};

