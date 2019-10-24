const express = require("express");
const router = express.Router();

const {
    getCategories,
    createCategory,
    deleteCategory,
    updateCategory
} = require("../controllers/category_controller");
const { needAuthentication, needAdminRole } = require("../middlewares/auth_middleware");

router.get("/", getCategories);
router.post("/", needAuthentication(), needAdminRole, createCategory);
router.delete("/:id", needAuthentication(), needAdminRole, deleteCategory);
router.patch("/:id", needAuthentication(), needAdminRole, updateCategory);

module.exports = router;
