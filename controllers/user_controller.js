const Db = require("../models");
const { newSuccess, newError } = require("../utils/http_util");
const { toMeDto, toUserDto } = require("../mappers");
const { signAccessToken } = require("../utils/auth_util");

const User = Db.User;

async function getUsers(req, res, next) {
    const users = await User.findMany();
    const dtos = users.map(u => toUserDto(u));
    res.status(200).send(newSuccess(dtos, "Get user successfully"));
}

async function getMe(req, res, next) {
    const { user } = req;
    const accessToken = signAccessToken(user);
    const userDto = toMeDto(user);

    res.status(200).send(newSuccess({ accessToken, user: userDto }, "Login successfully"));
}

module.exports = {
    getUsers,
    getMe
};
