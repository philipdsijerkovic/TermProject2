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

app.use(express.static("public"));
app.use("/api", fishRoutes);

// Example route to render a Pug view (adjust as needed)
app.get("/", (req, res) => {
  res.render("index"); // Renders views/index.pug
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
    console.log("...HTTP server closed.")
  })
}