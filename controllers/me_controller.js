const Db = require("../models");
const { newSuccess, newError } = require("../utils/http_util");
const { toMeDto } = require("../mappers");
const { signAccessToken } = require("../utils/auth_util");

const User = Db.User;

async function getMe(req, res, next) {
    const { user } = req;
    const accessToken = signAccessToken(user);
    const userDto = toMeDto(user);

    res.status(200).send(newSuccess({ accessToken, user: userDto }, "Login successfully"));
}

module.exports = {
    getMe
};
