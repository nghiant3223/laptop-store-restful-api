const express = require("express");
const router = express.Router();

const { getUsers, getMe } = require("../controllers/user_controller");
const { needAuthentication } = require("../middlewares/auth_middleware");

router.get("/", getUsers);
router.get("/me", needAuthentication(), getMe);

module.exports = router;
