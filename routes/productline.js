const express = require("express");
const router = express.Router();

const {
    getProductLines,
    createProductLine,
    deleteProductLine,
    updateProductLine
} = require("../controllers/productline_controller");
const { needAuthentication, needAdminRole } = require("../middlewares/auth_middleware");

router.get("/", getProductLines);
router.post("/", needAuthentication(), needAdminRole, createProductLine);
router.delete("/:id", needAuthentication(), needAdminRole, deleteProductLine);
router.patch("/:id", needAuthentication(), needAdminRole, updateProductLine);

module.exports = router;
