"use strict";
const db = require("./db-conn");

function getAll() {
  let sql = "SELECT * FROM products;";
  const data = db.all(sql);
  return data;
}

function getAllByOneAttribute(attribute, value) {
  const validColumns = getColumnNames();
  if (validColumns.includes(attribute)) {
    let sql = "SELECT * FROM products WHERE " + attribute + " =? ;";
    const data = db.all(sql, value);
    return data;
  }
}

function getOneById(id) {
  let sql = "SELECT * FROM products WHERE products_id =? ;";
  const item = db.get(sql, id);
  return item;
}

function deleteProduct(id){
  let sql = "DELETE FROM products WHERE products_id =?; ";
  const info = db.run(sql, id);
return info;
}

function createNew(params) {
  let sql = "INSERT INTO products " +
    "(products_name, products_description, products_image_url, products_price, products_category_id, featured) " +
    "VALUES(?, ?, ?, ?, ?, ?); ";
  const info = db.run(sql, params);
  return info;
}

function getColumnNames() {
  let sql = "select name from pragma_table_info('fish');";
  const columns = db.all(sql);
  let result = columns.map(a => a.name);
  return result;
}

function checkout() {
  let sql = "DELETE FROM cart_products WHERE cart_id = ?;";
  const data = db.run(sql, cartId);
  return data;
}

function addCart(cartId, productId, quantity) {
  let sql = "INSERT INTO cart_products " +
    "(cart_id, product_id, quantity) " +
    "VALUES(?, ?, ?); ";
  const data = db.run(sql, [cartId, productId, quantity]);
  return data;
}

function updateProduct(productId, params) {
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
  // Default values
  const defaultValues = {
    products_name = null,
    products_description = null,
    products_image_url = null,
    products_price = null,
    products_category_id = null,
    featured = null,
  } = params;
  // Run the query
  const data = db.run(sql, [
    productId,
    products_name,
    products_description,
    products_image_url,
    products_price,
    products_category_id,
    featured,

  ]);

  return data; 
}

module.exports = {
  getAll,
  getAllByOneAttribute,
  getOneById,
  deleteProduct,
  createNew, 
  checkout,
  addCart,
  updateProduct,
};