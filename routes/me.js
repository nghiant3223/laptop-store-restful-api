const express = require("express");
const router = express.Router();

const { getMe, getMyOrders } = require("../controllers/me_controller");
const { needAuthentication } = require("../middlewares/auth_middleware");

router.get("/", needAuthentication(), getMe);
router.get("/orders", needAuthentication(), getMyOrders);

module.exports = router;
