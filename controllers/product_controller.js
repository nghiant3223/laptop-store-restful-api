const Db = require("../models");
const { newSuccess, newError } = require("../utils/http_util");
const { ErrorTypes } = require("../constants/error");
const { CreateProductValidator } = require("../validators/product_validator");
const { extractJoiErrorDetail } = require("../utils/error_util");

async function createProduct(req, res, next) {
    const { error, value: body } = CreateProductValidator.validate(req.body);

    if (error != null) {
        next(
            newError(
                "Fail to create product",
                422,
                ErrorTypes.CREATE_PRODUCT_FAILED,
                body,
                extractJoiErrorDetail(error)
            )
        );
        return;
    }

    res.status(200).send("Product");
}

module.exports = {
    createProduct
};
