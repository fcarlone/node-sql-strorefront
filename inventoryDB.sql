-- Drops the inventory_db if it exists currently --
DROP DATABASE IF EXISTS inventory_db; 

CREATE DATABASE inventory_db;

USE inventory_db;

-- Customer view table --
CREATE TABLE products
(
  item_id INTEGER NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(50) NOT NULL,
  department_name VARCHAR(50) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  product_sales DECIMAL(10,2) DEFAULT 0.00,
  PRIMARY KEY(item_id)
);

-- Supervisor view table --
CREATE TABLE departments
(
  department_id INTEGER(2) NOT NULL AUTO_INCREMENT,
  department_name VARCHAR(50) NOT NULL,
  over_head_costs DECIMAL(10,2) NOT NULL,
  PRIMARY KEY(department_id)
);
ALTER TABLE departments AUTO_INCREMENT = 01;

-- Insert seed data for products --
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("HDTV","Electronics",599.99,5),
("socks","Clothing",4.50,20),
("clock radio","Electronics",25.14,3),
("frying pan","Households",17.99,2),
("dish detergent","Households",7.15,6),
("spatula","Households",5.50,6),
("t-shirts","Clothing",7.99,8),
("9-volt batteries","Households",5.35,8),
("banana","Grocery",0.25,10),
("apples","Grocery",1.00,5);

-- Insert seed data for departments --
INSERT INTO departments (department_name, over_head_costs)
VALUES("Electronics", 7500),
("Clothing", 5000),
("Households", 2000),
("Grocery", 6000);


SELECT * FROM products;
SELECT * FROM departments;

SELECT department_name, SUM(product_sales) FROM products GROUP BY department_name;


SELECT departments.department_id, products.department_name, departments.over_head_costs, SUM(products.product_sales) AS product_sales, (departments.over_head_costs - SUM(products.product_sales)) AS total_profit
FROM products 
LEFT JOIN departments
ON products.department_name = departments.department_name
GROUP BY products.department_name, departments.department_id
ORDER BY departments.department_id;


SELECT departments.department_id, departments.department_name, departments.over_head_costs, SUM(products.product_sales) AS product_sales, (departments.over_head_costs - SUM(products.product_sales)) AS total_profit
FROM products 
RIGHT JOIN departments
ON products.department_name = departments.department_name
GROUP BY products.department_name, departments.department_id
ORDER BY departments.department_id;
