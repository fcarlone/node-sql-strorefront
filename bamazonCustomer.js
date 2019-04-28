const mysql = require("mysql");
const inquirer = require("inquirer");
const colors = require('colors');
// let methods = require("./bamazonSQLQueries.js");

let connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "Fodder165*",
  database: "inventory_db"
});

connection.connect(function (err) {
  if (err) throw (err);
  handleDisplayInventory();
})

const handleDisplayInventory = () => {
  connection.query("SELECT * FROM products", function (err, res) {
    if (err) throw (err);
    console.log('\nAvailable Inventory\n'.bold.underline.cyan)
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
      handleProductIdSearch(answers.id)
    });
};

const handleProductIdSearch = (id) => {
  connection.query("SELECT * FROM products WHERE item_id=?", [id], function (err, res) {
    if (err) throw (err);

    if (res.length === 0) {
      console.log(`Product ID: ${id} does not exists.  Please select a different Product ID.`);
      // Rerun inventory list and prompt select product id question
      return handleDisplayInventory()
    } else {
      const productName = res[0].product_name;
      return handlePurchaseQuantity(id, productName)
    }
  })
};

const handlePurchaseQuantity = (id, productName) => {
  console.log('\n');
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'quantity',
        message: `You selected ${productName}.\n Enter the quantity you want to purchase?`,
      }
    ])
    .then(answers => {
      handleQuantityInput(id, answers.quantity);
    });
};

const handleQuantityInput = (id, userQuantity) => {
  connection.query("SELECT * FROM products WHERE item_id=?", [id], function (err, res) {
    if (err) throw (err);
    // Get product quantity
    const productQuantity = res[0].stock_quantity
    // Get Unit Price
    const productName = res[0].product_name;
    const productPrice = res[0].price;
    if (userQuantity > productQuantity) {
      console.log(colors.cyan.bold(`\nSorry.  Insufficient quantity!\nOnly ${productQuantity} ${productName} currently in stock\n`));
      handleExitStore();
    } else {
      console.log('\nPurchase Completed:\n'.bold.green)
      handleTransaction(id, productName, productPrice, productQuantity, userQuantity);
    }
  });
};

const handleTransaction = (id, productName, productPrice, productQuantity, userQuantity) => {
  // Calculate sale amount;
  const saleAmount = (productPrice * userQuantity).toFixed(2);
  console.log(`Your purchase of ${userQuantity} ${productName} at $${productPrice.toFixed(2)} per item total: $${saleAmount}\n`.bold.green)
  handleUpdateInventory(id, productQuantity, userQuantity);
};

const handleUpdateInventory = (id, productQuantity, userQuantity) => {
  const newQuantity = (productQuantity - userQuantity);

  connection.query("UPDATE products SET ? WHERE ?", [{ stock_quantity: newQuantity }, { item_id: id }], function (err, res) {
  });
  handleCheckInventory()
  handleExitStore();
}

const handleExitStore = () => {
  inquirer
    .prompt([
      {
        type: 'list',
        choices: ['Yes', 'No'],
        name: 'continue',
        message: 'Do you want to continue shopping?'
      }
    ])
    .then(answers => {
      console.log(answers.continue);
      if (answers.continue === 'No') {
        console.log('\nThank you for shopping!!!\n'.green.bold);
        connection.end();
      } else {
        handleDisplayInventory();
      }
    });
};

const handleCheckInventory = () => {
  connection.query("SELECT * FROM products", function (err, res) {
    // console.log('Updated Inventory', res)
  })
};
