const Joi = require("@hapi/joi");

const PatchValidator = Joi.object().keys({
    path: Joi.string().required(),
    value: Joi.any()
});

const UpdateValidator = Joi.array().items(PatchValidator);

module.exports = {
    UpdateValidator
};
