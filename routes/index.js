const express = require("express");
const router = express.Router();

const userRouter = require("./users");
const authRouter = require("./auth");
const productRouter = require("./product");

router.use("/users", userRouter);
router.use("/auth", authRouter);
router.use("/products", productRouter);

module.exports = router;
