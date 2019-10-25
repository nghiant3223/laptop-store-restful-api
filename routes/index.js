const express = require("express");
const router = express.Router();

const userRouter = require("./users");
const authRouter = require("./auth");
const productRouter = require("./product");
const categoryRouter = require("./category");
const meRouter = require("./me");
const orderRouter = require("./order");
const productlineRouter = require("./productline");
const imageRouter = require("./image");

router.use("/users", userRouter);
router.use("/auth", authRouter);
router.use("/products", productRouter);
router.use("/me", meRouter);
router.use("/orders", orderRouter);
router.use("/productlines", productlineRouter);
router.use("/categories", categoryRouter);
router.use("/images", imageRouter);

module.exports = router;
