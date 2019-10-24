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

    try {
        const order = await Order.save(body);
        const orderDto = toOrderDto(order);
        res.status(201).send(newSuccess(orderDto, "Create order successfully"));
    } catch (e) {
        next(e);
    }
}

module.exports = {
    createOrder
};
