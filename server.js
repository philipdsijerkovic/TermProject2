"use strict";
const express = require("express");
const app = express();

const multer = require("multer");
app.use(multer().none());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set up Pug as the view engine
app.set("view engine", "pug");
app.set("views", "./views"); // Make sure your .pug files are in the 'views' folder
const fishRoutes = require("./routes/fish.route");
const { db_close } = require("./models/db-conn");

app.use("/api", fishRoutes);
app.use(express.static("public"));

// Routes for Pug views
app.get("/", (req, res) => {
  const model = require("./models/fish_model"); // Import the model
  try {
    const products = model.getAll(); // Fetch all products from the database
    res.render("index", { products }); // Pass the products to the Pug template
  } catch (err) {
    console.error("Error fetching products:", err.message); // debugging section
    res.status(500).send("Internal Server Error");
  }
});

app.get("/cart", (req, res) => {
  const model = require("./models/fish_model");
  const cartItems = model.getCartItems(1); // Fetch cart items for user with ID 1 (in a real app this would be dynamic)
  res.render("cart", { cartItems });
});

app.get("/products", (req, res) => {
  const model = require("./models/fish_model"); // Import the model
  try {
    const products = model.getAll(); // Fetch all products
    const trendingProducts = model.getAllByOneAttribute("featured", 1); // Fetch trending products
    res.render("products", { products, trendingProducts }); // Pass both to the template
  } catch (err) {
    console.error("Error fetching products:", err.message); // Debugging section
    res.status(500).send("Internal Server Error");
  }
});

app.get("/admin-upload", (req, res) => {
  res.render("admin-upload"); // Renders views/admin-upload.pug
});

app.get("/admin-products", (req, res) => {
  res.render("admin-products"); // Renders views/admin-products.pug
});

app.get("/product-edit", (req, res) => {
  const model = require("./models/fish_model");
  const products = model.getAll(); // or whatever method fetches all products
  res.render("product-edit", { products });
});

app.put("/api/admin/products/:id", (req, res) => {
  const productId = parseInt(req.params.id, 10);
  const model = require("./models/fish_model"); // Import the model
  const updateData = req.body;
  try {
    const result = model.updateProduct(productId, updateData);
    if (result.changes === 0) {
      return res.status(404).json({ error: "Product not found." });
    }
    res.json({ message: "Product updated!", result });
  } catch (err) {
    res.status(500).json({ error: "Failed to update product." });
  }
});

app.delete("/api/admin/products/:id", (req, res) => {
  const productId = parseInt(req.params.id, 10);
  const model = require("./models/fish_model"); // Import the model
  try {
    const result = model.deleteProduct(productId);
    if (result.changes === 0) {
      return res.status(404).json({ error: "Product not found." });
    }
    res.json({ message: "Product deleted!", result });
  } catch (err) {
    console.error(err); // <--- Add this line
    res.status(500).json({ error: "Failed to delete product." });
  }
});

app.get("/details/:id", (req, res) => {
  const model = require("./models/fish_model");
  const productId = parseInt(req.params.id, 10);
  try {
    const product = model.getOneById(productId);
    if (!product) {
      return res.status(404).send("Product not found");
    }
    res.render("details", { product });
  } catch (err) {
    console.error("Error fetching product details:", err.message);
    res.status(500).send("Internal Server Error");
  }
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, function () {
  console.log("App listening at http://localhost:" + PORT);
});

process.on("SIGINT", cleanUp);
function cleanUp() {
  console.log("Terminate signal received.");
  db_close();
  console.log("...Closing HTTP server.");
  server.close(() => {
    console.log("...HTTP server closed.");
  });
}