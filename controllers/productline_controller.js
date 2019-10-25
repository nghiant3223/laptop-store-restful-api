const Db = require("../models");
const _ = require("lodash");
const { newSuccess, newError } = require("../utils/http_util");
const { ErrorTypes } = require("../constants/error");
const { CreateProductLineValidator } = require("../validators/productline_validator");
const { UpdateValidator } = require("../validators/common_validator");
const { extractJoiErrorDetail } = require("../utils/error_util");
const { toProductLineDto } = require("../mappers");

const ProductLine = Db.ProductLine;

async function createProductLine(req, res, next) {
    const { error, value: body } = CreateProductLineValidator.validate(req.body);
    if (error != null) {
        next(
            newError(
                "Invalid productline data",
                422,
                ErrorTypes.INVALID_CATEGORY_DATA,
                req.body,
                extractJoiErrorDetail(error)
            )
        );
        return;
    }

    try {
        const newLine = await ProductLine.save(body);
        const newLineDto = toProductLineDto(newLine);
        res.status(200).send(newSuccess(newLineDto, "Create productline successfully"));
    } catch (e) {
        next(e);
    }
}

async function getProductLines(req, res, next) {
    const productLines = await ProductLine.findAll();
    const productLineDtos = productLines.map(l => toProductLineDto(l));
    res.status(200).send(newSuccess(productLineDtos, "Get productLine successfully"));
}

async function deleteProductLine(req, res, next) {
    const { id } = req.params;
    const productLine = await ProductLine.findByPk(id);

    if (productLine == null) {
        next(newError("ProductLine not found", 404, ErrorTypes.CATEGORY_NOT_FOUND, id));
        return;
    }

    await ProductLine.delete(productLine);
    res.status(204).send(newSuccess(null, "Delete productLine successfully"));
}

async function updateProductLine(req, res, next) {
    const { id } = req.params;
    const productLine = await ProductLine.find(id);

    if (productLine == null) {
        next(newError("ProductLine not found", 404, ErrorTypes.CATEGORY_NOT_FOUND, id));
        return;
    }

    const { error, value: body } = UpdateValidator.validate(req.body);

    if (error != null) {
        next(
            newError(
                "Invalid update data",
                422,
                ErrorTypes.INVALID_CATEGORY_DATA,
                req.body,
                extractJoiErrorDetail(error)
            )
        );
        return;
    }

    for (const patch of body) {
        try {
            switch (patch.path) {
                case "brand":
                case "line":
                    await ProductLine.updateOne(productLine, { [patch.path]: patch.value });
                    break;
            }
        } catch (e) {
            next(e);
            return;
        }
    }

    const updatedProductLine = await ProductLine.find(productLine.id);
    const dto = toProductLineDto(updatedProductLine);
    res.status(200).send(newSuccess(dto, "Update productline successfully"));
}

module.exports = {
    getProductLines,
    createProductLine,
    deleteProductLine,
    updateProductLine
};
