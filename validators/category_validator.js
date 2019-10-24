const Joi = require("@hapi/joi");

const CreateCategoryValidator = Joi.object().keys({
    name: Joi.string().required()
});

module.exports = {
    CreateCategoryValidator
};
