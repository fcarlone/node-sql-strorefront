-- Drops the inventory_db if it exists currently --
-- DROP DATABASE IF EXISTS inventory_db; 

CREATE DATABASE inventory_db;

USE inventory_db;

CREATE TABLE products
(
  item_id INTEGER NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(50) NOT NULL,
  department_name VARCHAR(50) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock_quantity INTEGER NOT NULL,
  PRIMARY KEY(item_id)
);

-- Insert seed data --
INSERT INto products (product_name, department_name, price, stock_quantity)
VALUES ("HDTV","Electronics",599.99,5),
("socks","Clothing",4.50,10),
("clock radio","Electronics",25.14,3),
("frying pan","Households",17.99,2),
("dish detergent","Households",7.15,6),
("spatula","Households",5.50,6),
("t-shirts","Clothing",7.99,8),
("9-volt batteries","Households",5.35,8),
("banana","Grocery",0.25,10),
("apples","Grocery",1.00,5);

select * from products;
