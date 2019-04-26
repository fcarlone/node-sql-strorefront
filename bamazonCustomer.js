let mysql = require("mysql");
let inquirer = require("inquirer");
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
      handleProductIdSearch(answers.id)
    });
};

const handleProductIdSearch = (id) => {
  connection.query("SELECT * FROM products WHERE item_id=?", [id], function (err, res) {
    console.log(res)
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
  console.log(`ask quantity for product id ${id, productName}`)
  console.log('\n');
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'quantity',
        message: `You selected ${productName}.\n Enter the quantity you want to purchase?`,
        // validate: function (input) {
        //   if (typeof input !== 'number') {
        //     console.log('\nYou need to provide a number')
        //        return
        //   }
        // }
      }
    ])
    .then(answers => {
      console.log(answers.quantity)
      handleQuantityInput(id, answers.quantity);
    });
};

const handleQuantityInput = (id, userQuantity) => {
  console.log('handle quantity function', id, userQuantity)
  connection.query("SELECT * FROM products WHERE item_id=?", [id], function (err, res) {
    if (err) throw (err);

    // Get product quantity
    const productQuantity = res[0].stock_quantity
    console.log('quantity', productQuantity)

    if (userQuantity > productQuantity) {
      console.log('not enough product in stock')
    } else {
      console.log('approve purchase')
    }

  })
  connection.end()
};
