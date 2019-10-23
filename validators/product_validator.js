const Joi = require("@hapi/joi");

const ProductAttributeValidator = Joi.object().keys({
    key: Joi.string().required(),
    value: Joi.string(),
    subAttributes: Joi.array().items(
        Joi.object().keys({
            key: Joi.string().required(),
            value: Joi.string().required()
        })
    )
});

const CreateProductValidator = Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string().required(),
    shortDescription: Joi.string().required(),
    availableCount: Joi.number()
        .integer()
        .positive()
        .required(),
    originalPrice: Joi.number().required(),
    sellPrice: Joi.number().required(),
    attributes: Joi.array().items(ProductAttributeValidator)
});

module.exports = {
    CreateProductValidator
};
