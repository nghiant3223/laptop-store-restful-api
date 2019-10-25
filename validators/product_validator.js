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
    attributes: Joi.array().items(ProductAttributeValidator),
    productLineId: Joi.number().integer(),
    categoryId: Joi.number().integer(),
    images: Joi.array().items(Joi.string())
});

const ProductFilterValidator = Joi.object().keys({
    category: Joi.string(),
    brand: Joi.string(),
    line: Joi.string(),
    min_price: Joi.number(),
    max_price: Joi.number(),
    limit: Joi.number().integer(),
    offset: Joi.number().integer()
});

module.exports = {
    CreateProductValidator,
    ProductFilterValidator
};
