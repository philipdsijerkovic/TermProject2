"use strict";
const model = require("../models/fish_model");
// Get all products, used for homepage and product page
function getAll(req, res, next) {
  try {
    res.json(model.getAll());
  } catch (err) {
    console.error("Error while getting product list: ", err.message);
    next(err);
  }
}
// Get all products by one attribute, used for product page
function getAllByOneAttribute(req, res, next) {
  let attribute = req.query.attribute;
  let value = req.query.value;
  if (attribute && value) {
    try {
      res.json(model.getAllByOneAttribute(attribute, value));
    } catch (err) {
      console.error("Error while getting products: ", err.message);
      next(err);
    }
  }
  else {
    res.status(400).send("Invalid Request");
  }
}
// Get one product by id, used for product details page
function getOneById(req, res, next) {
  try {
    res.json(model.getOneById(req.params.id));
  } catch (err) {
    console.error("Error while getting products: ", err.message);
    next(err);
  }
}
// Deletes the mproduct by id 
function deleteProduct(req, res, next) {
  try {
    model.deleteProduct(req.params.id); 
    res.json(model.getAll());
  } catch (err) {
    console.error("Error while deleting product: ", err.message); 
    next(err);
  }
}
// Creates a new product, used for admin products
function createNew(req, res, next) {
  let name = req.body.name;
  let description = req.body.description;
  let image_url = req.body.image_url;
  let price = parseFloat(req.body.price);
  let category_id = parseInt(req.body.category_id);
  let featured = req.body.featured ? 1 : 0; // Convert boolean to 1 or 0

  if (name && price && category_id) {  // Check if required fields are present
    let params = [name, description || null, image_url || null, price, category_id, featured];
    try {
      res.json(model.createNew(params)); // Call the model function createNew 
    } catch (err) {
      console.error("Error while creating product: ", err.message); 
      next(err);
    }
  } else {
    res.status(400).send("Invalid Request: Missing required fields");
  }
}
// Adds a product to the cart, used for cart page
function addCart(req, res, next) {
  const cartId = req.body.cartId;
  const productId = req.body.productId;
  const quantity = req.body.quantity;

  if (cartId && productId && quantity) {
    try {
      const result = model.addCart(cartId, productId, quantity);
      res.json(result);
    } catch (err) {
      console.error("Error while adding to cart: ", err.message);
      next(err);
    }
  }
}
// Deletes a product from the cart, used for cart page
function checkout(req, res, next) {
  const cartId = req.body.cartId;
  if (cartId) {
    try {
      const result = model.checkout(cartId);
      res.json(result);
    } catch (err) {
      console.error("Error during checkout: ", err.message);
      next(err);
    }
  } 
}
// Updates a product, used for admin products
function updateProduct(req, res, next) {
  const productId = req.params.id;
  const {
    products_name,
    products_description,
    products_image_url,
    products_price,
    products_category_id,
    featured
  } = req.body;

  if (productId) {
    try {
      const result = model.updateProduct(productId, {
        products_name,
        products_description,
        products_image_url,
        products_price,
        products_category_id,
        featured,
      });
      res.json(result);
    } catch (err) {
      console.error("Error while updating product: ", err.message);
      next(err);
    }
  }
}
// I can't tell if it works 
function adminBulkUpload(req, res, next) {
  const products = req.body.products;
  // I can't figure it out 
}

module.exports = {
  getAll,
  getAllByOneAttribute,
  getOneById,
  deleteProduct,
  createNew,
  addCart,
  checkout,
  updateProduct,
  adminBulkUpload
};