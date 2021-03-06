const Joi = require("@hapi/joi");

const CreateCategoryValidator = Joi.object().keys({
    name: Joi.string().required(),
    parentId: Joi.number().integer()
});

module.exports = {
    CreateCategoryValidator
};
