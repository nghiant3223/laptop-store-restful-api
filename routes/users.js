const express = require("express");
const router = express.Router();

const { getUsers } = require("../controllers/user_controller");
const { needAuthentication, needAdminRole } = require("../middlewares/auth_middleware");

router.get("/", needAuthentication(), needAdminRole, getUsers);

module.exports = router;
