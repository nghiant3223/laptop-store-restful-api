const express = require("express");
const router = express.Router();

const { logInWithFacebook, logIn } = require("../controllers/auth_controller");
const { facebookAuthenticator } = require("../middlewares/social_middleware");

router.post("/facebook", facebookAuthenticator, logInWithFacebook);
router.post("/login", logIn);

module.exports = router;
