const Db = require("../models");
const { newSuccess, newError } = require("../utils/http_util");

const User = Db.User;

async function getUsers(req, res, next) {
    const users = await User.findAll();
    const dtos = users.map(u => toUserDto(u));
    res.status(200).send(newSuccess(dtos, "Get user successfully"));
}

module.exports = {
    getUsers
};
