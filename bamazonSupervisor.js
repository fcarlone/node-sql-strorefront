const mysql = require("mysql");
const inquirer = require('inquirer');

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "Fodder165*",
  database: "inventory_db"
})

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
  console.log('invoke display product sales');

  connection.query("SELECT departments.department_id, products.department_name, departments.over_head_costs, SUM(products.product_sales) AS product_sales, (departments.over_head_costs - SUM(products.product_sales)) AS total_profit FROM products LEFT JOIN departments ON products.department_name = departments.department_name GROUP BY products.department_name, departments.department_id ORDER BY departments.department_id",
    function (err, res) {
      console.log('\ndisplay products sales', res)

    })
};



