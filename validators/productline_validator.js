const Joi = require("@hapi/joi");

const CreateProductLineValidator = Joi.object().keys({
    brand: Joi.string().required(),
    name: Joi.string().required()
});

module.exports = {
    CreateProductLineValidator
};
