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
const axios = require("axios");

app.use("/api", fishRoutes);
app.use(express.static("public"));

// Routes for Pug views
app.get("/", async (req, res) => {
  const model = require("./models/fish_model"); // Import the model
  try {
    const products = model.getAll(); // Fetch all products from the database
    // Fetch random meal from TheMealDB
    let randomMeal = null;
    try {
      const response = await axios.get("https://www.themealdb.com/api/json/v1/1/random.php");
      if (response.data && response.data.meals && response.data.meals.length > 0) {
        randomMeal = response.data.meals[0];
      }
    } catch (apiErr) {
      console.error("Error fetching random meal:", apiErr.message);
    }
    res.render("index", { products, randomMeal }); // Pass the products and random meal to the Pug template
  } catch (err) {
    console.error("Error fetching products:", err.message); // debugging section
    res.status(500).send("Internal Server Error");
  }
});

app.get("/cart", (req, res) => {
  const model = require("./models/fish_model");
  const cartItems = model.getCartItems(1); // Fetch cart items for user with ID 1 (in a real app this would be dynamic)
  res.render("cart", { cartItems }); // Render to the view 
});

app.delete("/api/cart/:cartId", (req, res) => {
  const cartId = parseInt(req.params.cartId, 10); // Get cartId 
  const model = require("./models/fish_model");
  try {
    const result = model.clearCart(cartId); // result is the result of the clearCart function with the cartId parameter (I used 1 for the demo so it's not dynamic)
    res.json({ message: "Cart Emptied", result });
  } catch (err) {
    console.error("Error clearing cart:", err.message); // debugging section
    res.status(500).json({ error: "Failed to clear cart." }); // error 
  }
});

app.delete("/api/cart/:cartId/product/:productId", (req, res) => {
  const cartId = parseInt(req.params.cartId, 10); // Get cartId 
  const productId = parseInt(req.params.productId, 10); // Get productId
  const model = require("./models/fish_model");
  try {
    // Remove the product from the cart
    const result = model.removeCartItem(cartId, productId); // Call removeCart with cartId and productId as args
    res.json({ message: "Item removed from cart!", result });
  } catch (err) {
    console.error("Error removing item from cart:", err.message); // debugging section
    res.status(500).json({ error: "Failed to remove item from cart." }); //   error
  }
});

app.get("/products", (req, res) => {
  const model = require("./models/fish_model"); // Import the model
  try {
    const products = model.getAll(); // Fetch all products
    const trendingProducts = model.getAllByOneAttribute("featured", 1); // Fetch trending products
    res.render("products", { products, trendingProducts }); // Pass both to the template
  } catch (err) {
    console.error("Error fetching products:", err.message); // Debugging section
    res.status(500).send("Server Error"); // error
  }
});
// Didn't get around to implementing 
app.get("/admin-upload", (req, res) => {
  res.render("admin-upload"); // Renders views/admin-upload.pug
});

app.get("/admin-products", (req, res) => {
  const model = require("./models/fish_model");
  const products = model.getAll(); // Fetch all the products with getAll
  res.render("admin-products", { products }); // Renders the products in the pug file 
});

app.get("/product-edit", (req, res) => {
  const model = require("./models/fish_model");
  const products = model.getAll(); // Fetch all the products with getAll 
  res.render("product-edit", { products }); // Render the products in product edit
});

app.put("/api/admin/products/:id", (req, res) => {
  const productId = parseInt(req.params.id, 10);
  const model = require("./models/fish_model"); // Import the model
  const updateData = req.body; // Get the update data from the request body
  try {
    const result = model.updateProduct(productId, updateData); // the result is the after update of the product editing
    if (result.changes === 0) { // If nothing changed, return a 404 to show that the product was not found
      return res.status(404).json({ error: "Product not found." });
    }
    res.json({ message: "Product updated!", result }); // good response
  } catch (err) {
    res.status(500).json({ error: "Failed to update product." }); // very bad response
  }
});

app.delete("/api/admin/products/:id", (req, res) => {
  const productId = parseInt(req.params.id, 10);
  const model = require("./models/fish_model"); // Import the model
  try {
    const result = model.deleteProduct(productId); // result is the result of the deleted product function with the productID as the arg
    if (result.changes === 0) {
      return res.status(404).json({ error: "Product not found." });
    }
    res.json({ message: "Product deleted!", result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete product." });
  }
});

app.get("/details/:id", (req, res) => {
  const model = require("./models/fish_model");
  const productId = parseInt(req.params.id, 10);
  try {
    const product = model.getOneById(productId); // Fetch the product by its productID
    if (!product) {
      return res.status(404).send("Product not found");
    }
    res.render("details", { product }); // render it to the details pug page
  } catch (err) {
    console.error("Error fetching product details:", err.message);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/api/admin/products", (req, res) => { 
  const model = require("./models/fish_model");
  try { // destructure the body of the request down to the product details
    const {
      products_name,
      products_description,
      products_image_url,
      products_price,
      products_category_id,
      featured
    } = req.body;

    const featuredValue = featured ? 1 : 0; // I used 1 and 0 because sqlite doesn't support booleans

    const params = [
      products_name,
      products_description,
      products_image_url,
      products_price,
      products_category_id,
      featuredValue
    ];
    model.createNew(params); // Call the createNew function with the new product details
    res.redirect("/admin-products"); // Redirect to the admin products page after creating a new product, simulates a refresh
  } catch (err) {
    console.error("Error creating product:", err.message);
    res.status(500).send("Failed to create product.");
  }
});

app.post("/api/cart/:cartId/product/:productId", (req, res) => {
  const cartId = parseInt(req.params.cartId, 10); // Get cartId
  const productId = parseInt(req.params.productId, 10); // Get productId
  const quantity = parseInt(req.body.quantity, 10) || 1; // default to 1, this is the simplest way for the demo, if I had more time I would have made it dynamic
  const model = require("./models/fish_model");
  try {
    const result = model.addCart(cartId, productId, quantity);
    res.json({ message: "Item added to cart!", result }); // goo d  response
  } catch (err) {
    console.error("Error adding item to cart:", err.message); // bad response
    res.status(500).json({ error: "Failed to add item to cart." }); // worst response
  }
});

app.get("/product-search", (req, res) => {
  const model = require("./models/fish_model");
  const searchTerm = req.query.q || "";
  let products = [];
  if (searchTerm) {
    // filter function that uses the getAll function to get the products and filter them by product name only
    const allProducts = model.getAll();
    products = allProducts.filter(p =>
      p.products_name && p.products_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
  res.render("product-search", { products, searchTerm }); // render the product-search pug page with the products that match the search query
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