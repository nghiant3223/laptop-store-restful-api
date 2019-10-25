const express = require("express");
const router = express.Router();

const { createOrder, getOrders } = require("../controllers/order_controller");
const { needAuthentication, needAdminRole } = require("../middlewares/auth_middleware");

router.post("/", needAuthentication(), createOrder);
router.get("/", needAuthentication(), needAdminRole, getOrders);

module.exports = router;
