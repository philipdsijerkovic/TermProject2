"use strict";
const db = require("./db-conn");
// Get all products, used for homepage and product page
function getAll() {
  let sql = "SELECT * FROM products;";
  const data = db.all(sql);
  return data;
}
// Get all products by one attribute, used for product page
function getAllByOneAttribute(attribute, value) {
  const validColumns = getColumnNames();
  if (validColumns.includes(attribute)) {
    let sql = "SELECT * FROM products WHERE " + attribute + " =? ;";
    const data = db.all(sql, value);
    return data;
  }
}
// Get one product by id, used for product details page
function getOneById(id) {
  let sql = "SELECT * FROM products WHERE products_id =? ;";
  const item = db.get(sql, id);
  return item;
}
// Deletes the product by id
function deleteProduct(id) {
  db.run("DELETE FROM cart_products WHERE product_id = ?", id);
  let sql = "DELETE FROM products WHERE products_id = ?;";
  const info = db.run(sql, id);
  return info;
}
// Creates a new product, used for admin products
function createNew(params) {
  let sql = "INSERT INTO products " +
    "(products_name, products_description, products_image_url, products_price, products_category_id, featured) " +
    "VALUES(?, ?, ?, ?, ?, ?); ";
  const info = db.run(sql, params);
  return info;
}
// Repurposed function from in class example for getting product column names
function getColumnNames() {
  let sql = "select name from pragma_table_info('products');";
  const columns = db.all(sql);
  let result = columns.map(a => a.name);
  return result;
}

// Adds a product to the cart
function addCart(cartId, productId, quantity) {
  let sql = "INSERT INTO cart_products " +
    "(cart_id, product_id, quantity) " +
    "VALUES(?, ?, ?); ";
  const data = db.run(sql, [cartId, productId, quantity]);
  return data;
}
// Gets all items in the cart
function getCartItems(cartId) {
  const sql = `
    SELECT cp.*, p.products_name, p.products_image_url, p.products_price
    FROM cart_products cp
    JOIN products p ON cp.product_id = p.products_id
    WHERE cp.cart_id = ?
  `;
  return db.all(sql, cartId);
}
// Updates a product, used for admin products
function updateProduct(productId, params) {
  const { // get the data from the params
    products_name = null,
    products_description = null,
    products_image_url = null,
    products_price = null,
    products_category_id = null,
    featured = null,
  } = params;
 // our sql query
  const sql = `
    UPDATE products
    SET 
      products_name = ?,
      products_description = ?,
      products_image_url = ?,
      products_price = ?,
      products_category_id = ?,
      featured = ?
    WHERE products_id = ?;
  `;
  // Pass the new fields to the SQL query, I made sure to do it in the right order 
  const data = db.run(sql, [
    products_name,
    products_description,
    products_image_url,
    products_price,
    products_category_id,
    featured,
    productId
  ]);

  return data; 
}
// This is the checkout function, clears the entire cart
function clearCart(cartId) {
  return db.run("DELETE FROM cart_products WHERE cart_id = ?", cartId);
}
// Deletes a specific product from the cart
function removeCartItem(cartId, productId) {
  return db.run("DELETE FROM cart_products WHERE cart_id = ? AND product_id = ?", cartId, productId);
}

module.exports = {
  getAll,
  getAllByOneAttribute,
  getOneById,
  deleteProduct,
  createNew, 
  addCart,
  updateProduct,
  getCartItems,
  removeCartItem,
  clearCart
};