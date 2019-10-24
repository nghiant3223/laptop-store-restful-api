const express = require("express");
const router = express.Router();

const {
    createProduct,
    getProduct,
    getManyProducts,
    updateProduct,
    deleteProduct
} = require("../controllers/product_controller");
const { needAuthentication, needAdminRole } = require("../middlewares/auth_middleware");

router.post("/", needAuthentication(), needAdminRole, createProduct);
router.get("/:id", needAuthentication(false), getProduct);
router.get("/", needAuthentication(false), getManyProducts);
router.patch("/:id", needAuthentication(), needAdminRole, updateProduct);
router.delete("/:id", needAuthentication(), needAdminRole, deleteProduct);

module.exports = router;
