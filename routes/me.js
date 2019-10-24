const express = require("express");
const router = express.Router();

const { getMe } = require("../controllers/me_controller");
const { needAuthentication } = require("../middlewares/auth_middleware");

router.get("/", needAuthentication(), getMe);

module.exports = router;
