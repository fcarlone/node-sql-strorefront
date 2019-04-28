const mysql = require("mysql");
const inquirer = require('inquirer');
const colors = require('colors');
// const methods = require("./bamazonMethods.js");

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
  console.log(`bamazonManger file Connected as id ${connection.threadId}\n`)
  managerMenu();
  // connection.end()
});

const managerMenu = () => {
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
      return methods.handelInventoryList();
    case 'View Low Inventory':
      return methods.handleLowInventory();
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


const displayAddInventory = () => {
  console.log('invoke handle add inventory')
  // methods.handelInventoryList()
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
  console.log('invoke handle low inventory', id, quantity)
  // Get the product to increase the quantity
  connection.query("SELECT * FROM products WHERE item_id=?", [id], function (err, res) {
    console.log(res);
    // Get item current stock quantity
    const currentQuantity = res[0].stock_quantity;
    // Calculate new stock quantity
    const updateQuantity = parseInt(currentQuantity) + parseInt(quantity);
    console.log('updated quantity', updateQuantity);

    // Update database stock quantity
    connection.query("UPDATE products SET ? WHERE ?", [{ stock_quantity: updateQuantity }, { item_id: id }], function (err, res) {
      console.log('stock been updated')
      handelInventoryList();
      // connection.end();
    });
  })
};

const handleAddNewProduct = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "productName",
        message: "Enter Product Name:"
      },
      {
        type: "list",
        choices: ["Electronics", "Clothing", "Households", "Grocery"],
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

      methods.handleAddNewProductDatabase(productName, productDepartment, productPrice, productQuantity);
      console.log("I'm back in bamzonManage JS");

      const handleMenu = () => {
        setTimeout(() => {
          managerMenu();
        }, 1500)
      }
      handleMenu();
    });
}





const handelInventoryList = () => {
  connection.query("SELECT * FROM products", function (err, res) {
    if (err) throw (err);
    console.log(`\nAvailable Inventory\n`)
    // console.log(res);
    res.forEach((product) => {
      console.log(`Product ID: ${product.item_id}  ||  Product Name: ${product.product_name}  ||  Price: $${product.price.toFixed(2)}  ||  Quantity: ${product.stock_quantity}`);
    })
    console.log('\nProduct inventory been updated.\n'.bold.underline.cyan)
    managerMenu();
  })

};


// const handelInventoryList = () => {
//   connection.query("SELECT * FROM products", function (err, res) {
//     if (err) throw (err);
//     console.log(`\nAvailable Inventory\n`)
//     // console.log(res);
//     res.forEach((product) => {
//       console.log(`Product ID: ${product.item_id}  ||  Product Name: ${product.product_name}  ||  Price: $${product.price.toFixed(2)}`);
//     })

//   })
// }


const handleMenuExit = () => {
  console.log('\nExited Manger Menu\n'.bold.underline.cyan)
  connection.end();
}
