const Db = require("../models");
const { newSuccess, newError } = require("../utils/http_util");
const { toOrderDto } = require("../mappers");
const { CreateOrderValidator } = require("../validators/order_validator");
const { extractJoiErrorDetail } = require("../utils/error_util");
const { ErrorTypes } = require("../constants/error");

const Order = Db.Order;

async function createOrder(req, res, next) {
    const { error, value: body } = CreateOrderValidator.validate(req.body);

    if (error != null) {
        next(
            newError(
                "Invalid order data",
                422,
                ErrorTypes.INVALID_ORDER_DATA,
                body,
                extractJoiErrorDetail(error)
            )
        );
        return;
    }

    const { user } = req;

    try {
        const order = await Order.save(body);
        await order.setOwner(user);

        const newOrder = await Order.find(order.id);
        const orderDto = toOrderDto(newOrder);
        res.status(201).send(newSuccess(orderDto, "Create order successfully"));
    } catch (e) {
        next(e);
    }
}

async function getOrders(req, res, next) {
    const orders = await Order.findMany();
    const orderDtos = orders.map(o => toOrderDto(o, { isAdminConsumer: true }));
    res.status(201).send(newSuccess(orderDtos, "Get orders successfully"));
}

module.exports = {
    createOrder,
    getOrders
};
