const express = require("express");
const router = express.Router();

const { deleteImage } = require("../controllers/image_controller");
const { needAuthentication, needAdminRole } = require("../middlewares/auth_middleware");

router.delete("/:id", needAuthentication(), needAdminRole, deleteImage);

module.exports = router;
