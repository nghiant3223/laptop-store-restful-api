const express = require("express");
const router = express.Router();

const { createOrder } = require("../controllers/order_controller");
const { needAuthentication, needAdminRole } = require("../middlewares/auth_middleware");

router.post("/", needAuthentication(), createOrder);

module.exports = router;
