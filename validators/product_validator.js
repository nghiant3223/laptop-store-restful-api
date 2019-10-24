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

const ProductFilterValidator = Joi.object().keys({
    category: Joi.string(),
    brand: Joi.string(),
    line: Joi.string(),
    limit: Joi.number().integer(),
    offset: Joi.number().integer()
});

const PathValidator = Joi.object().keys({
    path: Joi.string().required(),
    value: Joi.any()
});

const UpdateProductValidator = Joi.array().items(PathValidator);

module.exports = {
    CreateProductValidator,
    ProductFilterValidator,
    UpdateProductValidator
};
