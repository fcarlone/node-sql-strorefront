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
  console.log(`\n\nbamazonSupervisor file Connected as id ${connection.threadId}\n`)
  supervisorMenu();
});

const supervisorMenu = () => {
  inquirer
    .prompt([
      {
        type: 'list',
        choices: ["View Product Sales by Department", "Create New Department", "Exit Menu"],
        name: 'supervisorSelection',
        messages: "Select a command"
      }
    ])
    .then(answers => {
      (answers.supervisorSelection)
      handleSupervisorOption(answers.supervisorSelection);
    });
};

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

const displayProductSales = () => {
  connection.query("SELECT departments.department_id, departments.department_name, departments.over_head_costs, SUM(products.product_sales) AS product_sales, (SUM(products.product_sales) - departments.over_head_costs) AS total_profit FROM products RIGHT JOIN departments ON products.department_name = departments.department_name GROUP BY products.department_name, departments.department_id ORDER BY departments.department_id",
    function (err, res) {
      if (err) throw (err);
      console.log(`\nList of bamazon departments:\n`.bold.underline.cyan)
      console.table(res)
      supervisorMenu();
    })
};

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
        message: 'Enter department over-head costs'
      }
    ])
    .then(answers => {
      console.log(answers.departmentName);
      console.log(answers.departmentCosts)
      connection.query("INSERT INTO departments SET ?", {
        department_name: answers.departmentName,
        over_head_costs: answers.departmentCosts
      }, function (err, res) {
        if (err) throw (err);
        console.log(`\n${res.affectedRows} new department added\n`.bold.underline.cyan);
        supervisorMenu();
      })
    });
};

const handleMenuExit = () => {
  console.log('\nExited Supervisor Menu\n'.bold.underline.red)
  connection.end();
};

