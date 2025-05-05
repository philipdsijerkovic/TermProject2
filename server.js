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
  res.render("index"); // Renders views/index.pug
});

app.get("/cart", (req, res) => {
  res.render("cart"); // Renders views/cart.pug
});

app.get("/products", (req, res) => {
  res.render("products"); // Renders views/products.pug
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