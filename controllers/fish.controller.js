"use strict";
const model = require("../models/fish_model");

function getAll(req, res, next) {
  try {
    res.json(model.getAll());
  } catch (err) {
    console.error("Error while getting product list: ", err.message);
    next(err);
  }
}

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

function getOneById(req, res, next) {
  try {
    res.json(model.getOneById(req.params.id));
  } catch (err) {
    console.error("Error while getting products: ", err.message);
    next(err);
  }
}

function deleteProduct(req, res, next) {
  try {
    model.deleteProduct(req.params.id); 
    res.json(model.getAll());
  } catch (err) {
    console.error("Error while deleting product: ", err.message); 
    next(err);
  }
}

function createNew(req, res, next) {
  let name = req.body.name;
  let description = req.body.description;
  let image_url = req.body.image_url;
  let price = parseFloat(req.body.price);
  let category_id = parseInt(req.body.category_id);
  let featured = req.body.featured || false;

  if (name && price && category_id) { 
    let params = [name, description || null, image_url || null, price, category_id, featured];
    try {
      res.json(model.createNew(params));
    } catch (err) {
      console.error("Error while creating product: ", err.message); 
      next(err);
    }
  } else {
    res.status(400).send("Invalid Request: Missing required fields");
  }
}

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

function updateProduct(req, res, next) {
  const productId = req.params.id;
  const { name, description, image_url, price, category_id, featured } = req.body;

  if (productId) {
    try {
      const result = model.updateProduct(productId, {
        name,
        description,
        image_url,
        price,
        category_id,
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
  
  if (Array.isArray(products) && products.length > 0) {
    try {
      const results = products.map((product) => {
        const { name, description, image_url, price, category_id, featured } = product;
        return model.createNew([name, description, image_url, price, category_id, featured]);
      });
      res.json(results);
    } catch (err) {
      console.error("Error during bulk upload: ", err.message);
      next(err);
    }
  } 
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