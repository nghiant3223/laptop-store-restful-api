const Joi = require("@hapi/joi");

const LogInValidator = Joi.object().keys({
    username: Joi.string()
        .alphanum()
        .min(1)
        .required(),

    password: Joi.string()
        .alphanum()
        .min(1)
        .required()
});

module.exports = {
    LogInValidator
};
