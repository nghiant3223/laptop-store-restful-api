const Joi = require("@hapi/joi");
const { ShipTypes, PaymentMethods } = require("../constants/order");

const OrderDetailValidator = Joi.object().keys({
    productId: Joi.number().required(),
    quantity: Joi.number().required()
});

const CreateOrderValidator = Joi.object().keys({
    paymentMethod: Joi.string()
        .valid(PaymentMethods.COD, PaymentMethods.MOMO)
        .required(),
    shipType: Joi.string()
        .valid(ShipTypes.FAST, ShipTypes.NORMAL)
        .required(),
    shipAddress: Joi.string().required(),
    shipCity: Joi.string().required(),
    shipDistrict: Joi.string().required(),
    shipWard: Joi.string().required(),
    note: Joi.string().allow("", null),
    items: Joi.array()
        .items(OrderDetailValidator)
        .required()
});

module.exports = {
    CreateOrderValidator
};
