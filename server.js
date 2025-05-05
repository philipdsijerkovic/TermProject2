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
  res.render("cart"); // Renders views/cart.pug
});

app.get("/products", (req, res) => {
  const model = require("./models/fish_model"); // Import the model
  try {
    const trendingProducts = model.getAllByOneAttribute("featured", 1); // If it's featured, import the product
    res.render("products", { trendingProducts });  // Render it
  } catch (err) {
    console.error("Error fetching trending products:", err.message); // debugging section
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
  res.render("product-edit"); // Renders views/product-edit.pug
});

app.get("/details", (req, res) => {
  res.render("details"); // Renders views/details.pug
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