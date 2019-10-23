const express = require("express");
const router = express.Router();

const { createProduct } = require("../controllers/product_controller");
const { needAuthentication, needAdminRole } = require("../middlewares/auth_middleware");

router.post("/", needAuthentication(), needAdminRole, createProduct);

module.exports = router;
