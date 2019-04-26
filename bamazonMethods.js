const mysql = require("mysql");
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
  console.log(`\n\nbamazonMethods file Connected as id ${connection.threadId}\n`)

});

const handelInventoryList = () => {
  connection.query("SELECT * FROM products", function (err, res) {
    if (err) throw (err);
    console.log(`\nAvailable Inventory\n`)
    // console.log(res);
    res.forEach((product) => {
      console.log(`Product ID: ${product.item_id}  ||  Product Name: ${product.product_name}  ||  Price: $${product.price.toFixed(2)}  ||  Quantity: ${product.stock_quantity}`);

    })
  })
};

const handleLowInventory = () => {
  connection.query("SELECT * FROM products WHERE stock_quantity < 5", function (err, res) {
    if (err) throw (err);
    console.log(`\nList of products with quantity less than five\n`.red.bold);
    res.forEach((product) => {
      console.log(`Product ID: ${product.item_id}  ||  Product Name: ${product.product_name}  ||  Price: $${product.price.toFixed(2)}  ||  Quantity: ${product.stock_quantity}`);

    })
  })
  connection.end()
}

const handleAddInventory = (id, quantity) => {
  console.log('invoke handle low inventory', id, quantity)
  // Get the product to increase the quantity
  connection.query("SELECT * FROM products WHERE item_id=?", [id], function (err, res) {
    console.log(res);
  })

  // connection.query("UPDATE products SET ? WHERE ?", [], function (err, res) {

  // })
  connection.end();
}

// Export functions
module.exports = {
  handelInventoryList: handelInventoryList,
  handleLowInventory: handleLowInventory,
  handleAddInventory: handleAddInventory
};
