const Db = require("../models");
const { newSuccess, newError } = require("../utils/http_util");
const { toMeDto, toOrderDto } = require("../mappers");
const { signAccessToken } = require("../utils/auth_util");

const User = Db.User;
const Order = Db.Order;

async function getMe(req, res, next) {
    const { user } = req;
    const accessToken = signAccessToken(user);
    const userDto = toMeDto(user);

    res.status(200).send(newSuccess({ accessToken, user: userDto }, "Login successfully"));
}

async function getMyOrders(req, res, next) {
    const { user } = req;

    const orders = await Order.findMany(user.id);
    const orderDtos = orders.map(o => toOrderDto(o));
    res.status(201).send(newSuccess(orderDtos, "Get orders successfully"));
}

module.exports = {
    getMe,
    getMyOrders
};
