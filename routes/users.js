const express = require("express");
const router = express.Router();

const Db = require("../models");

const User = Db.User;

/* GET users listing. */
router.get("/", async function(req, res, next) {
    try {
        const users = await User.findBy("email", "ntncsebku@gmail.com", true);
        console.log("=====", users);
        res.send(users);
    } catch (e) {
        next(e);
    }
});

module.exports = router;
