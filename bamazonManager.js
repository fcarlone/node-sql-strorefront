const mysql = require("mysql");
const inquirer = require('inquirer');
const colors = require('colors');

// Connnect to database
const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "Fodder165*",
  database: "inventory_db"
});

connection.connect(function (err) {
  if (err) throw (err);
  managerMenu();
});

const managerMenu = () => {
  console.log('\n')
  inquirer
    .prompt([
      {
        type: 'list',
        choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product', 'Exit Menu'],
        name: 'managerSelection',
        message: 'Select a command'
      }
    ])
    .then(answers => {
      handleManagerOption(answers.managerSelection)
    });
};

// Switch statment base on manager choice
const handleManagerOption = (input) => {
  switch (input) {
    case 'View Products for Sale':
      return handleInventoryList();
    case 'View Low Inventory':
      return handleLowInventory();
    case 'Add to Inventory':
      return displayAddInventory();
    case 'Add New Product':
      return handleAddNewProduct();
    case 'Exit Menu':
      return handleMenuExit();
    default:
      console.log("Incorrect command")
  };
};

// Handle menu option 1
const handleInventoryList = () => {
  connection.query("SELECT * FROM products", function (err, res) {
    if (err) throw (err);
    console.log('\nAvailable Inventory\n'.bold.underline.cyan)
    res.forEach((product) => {
      console.log(`Product ID: ${product.item_id}  ||  Product Name: ${product.product_name}  ||  Price: $${product.price.toFixed(2)}  ||  Quantity: ${product.stock_quantity}`);
    })
    console.log('\n')
    managerMenu();
  })
};

// handle menu option 2
const handleLowInventory = () => {
  connection.query("SELECT * FROM products WHERE stock_quantity < 5", function (err, res) {
    if (err) throw (err);
    console.log(`\nList of products with quantity less than five\n`.cyan.bold.underline);
    res.forEach((product) => {
      console.log(`Product ID: ${product.item_id}  ||  Product Name: ${product.product_name}  ||  Price: $${product.price.toFixed(2)}  ||  Quantity: ${product.stock_quantity}`);
    })
    console.log('\n')
    managerMenu();
  })
};

// handle menu option 3
const displayAddInventory = () => {
  console.log('\n')
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'productID',
        message: 'Select a product ID number',
      },
      {
        type: 'input',
        name: 'productQuantity',
        message: "Enter Quantity"
      }
    ])
    .then(answers => {
      console.log(answers.productID)
      console.log(answers.productQuantity)
      handleAddInventory(answers.productID, answers.productQuantity)
    })
};

const handleAddInventory = (id, quantity) => {
  // Get the product to increase the quantity
  connection.query("SELECT * FROM products WHERE item_id=?", [id], function (err, res) {
    // Get item current stock quantity
    const currentQuantity = res[0].stock_quantity;
    // Calculate new stock quantity
    const updateQuantity = parseInt(currentQuantity) + parseInt(quantity);
    // Update database stock quantity
    connection.query("UPDATE products SET ? WHERE ?", [{ stock_quantity: updateQuantity }, { item_id: id }], function (err, res) {
      if (err) throw (err);
      handleInventoryList();
      console.log('\nProduct inventory has been updated.\n'.bold.underline.cyan)
    });
  })
};

// Handle menu option 4
const handleAddNewProduct = () => {
  let departmentList = [];
  // Get list of departments from departments table
  connection.query("SELECT department_name FROM departments", function (err, res) {
    if (err) throw (err);
    res.forEach((department) => {
      departmentList.push(department.department_name)
    })
  });

  inquirer
    .prompt([
      {
        type: "input",
        name: "productName",
        message: "Enter Product Name:"
      },
      {
        type: "list",
        choices: departmentList,
        name: "productDepartment",
        message: "Enter Product Department:"
      },
      {
        type: "input",
        name: "productPrice",
        message: "Enter Product Unit Price:"
      }, {
        type: "input",
        name: "productQuantity",
        message: "Enter Product Quantity:"
      }
    ])
    .then(answers => {
      const productName = answers.productName;
      const productDepartment = answers.productDepartment;
      const productPrice = answers.productPrice;
      const productQuantity = answers.productQuantity;

      handleAddNewProductDatabase(productName, productDepartment, productPrice, productQuantity);
    });
};

const handleAddNewProductDatabase = (name, department, price, quantity) => {
  console.log(name, department, price, quantity)
  connection.query("INSERT INTO products SET ?",
    {
      product_name: name,
      department_name: department,
      price: price,
      stock_quantity: quantity
    },
    function (err, res) {
      console.log(`\n${res.affectedRows} product added:`.bold.underline.cyan);
      console.log(`Product name: ${name} || Deparment: ${department} || Price: ${price} || Quantity: ${quantity}\n`.bold.underline.cyan)
    });
  handleInventoryList();
};

// Handle menu option 5
const handleMenuExit = () => {
  console.log('\nExited Manager Menu\n'.bold.underline.red)
  connection.end();
};


