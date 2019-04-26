let mysql = require("mysql");
let inquirer = require("inquirer");

let connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "Fodder165*",
  database: "inventory_db"
});

connection.connect(function (err) {
  if (err) throw (err);
  console.log(`Connected as id ${connection.threadId}\n`)
  handleDisplayInventory();
})

const handleDisplayInventory = () => {
  connection.query("SELECT * FROM products", function (err, res) {
    if (err) throw (err);
    console.log(`\nAvailable Inventory\n`)
    // console.log(res);
    res.forEach((product) => {
      console.log(`Product ID: ${product.item_id} || Product Name: ${product.product_name} || Price: $${product.price.toFixed(2)}`);
    })
    handleInquirer();
  })
};

const handleInquirer = () => {
  console.log('\n')
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'id',
        message: 'To purchase an item, please select a Product ID number.',
        validate: function (value) {
          return value !== '';
        }
      }
    ])
    .then(answers => {
      console.log(answers.id)
    });

  connection.end()
}

