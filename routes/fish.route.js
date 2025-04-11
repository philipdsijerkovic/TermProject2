"use strict";
const express = require("express");
const router = express.Router();

const fishController = require("../controllers/fish.controller");

//http://localhost:3000/api/all
router.get("/all", fishController.getAll);

//http://localhost:3000/api?attribute=platform&value=Wii
router.get("/", fishController.getAllByOneAttribute);

//http://localhost:3000/api/1
router.get("/:id", fishController.getOneById);

//http://localhost:3000/api/delete/1
router.delete("/delete/:id", fishController.deleteProduct);

//http://localhost:3000/api/add
router.post("/add", fishController.addCart);

//http://localhost:3000/api/checkout
router.post("/checkout", fishController.checkout);

//http://localhost:3000/api/admin/add
router.post("/admin/add", fishController.createNew);

//http://localhost:3000/api/admin/update/1
router.put("/admin/update/:id", fishController.updateProduct);

//http://localhost:3000/api/admin/bulk-upload
router.post("/admin/bulk-upload", fishController.adminBulkUpload);

module.exports = router;