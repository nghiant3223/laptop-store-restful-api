const path = require("path");
const _ = require("lodash");

const Db = require("../models");
const { newSuccess, newError } = require("../utils/http_util");
const { ErrorTypes } = require("../constants/error");
const {
    CreateProductValidator,
    ProductFilterValidator
} = require("../validators/product_validator");
const { UpdateValidator } = require("../validators/common_validator");
const { extractJoiErrorDetail } = require("../utils/error_util");
const { toProductDto } = require("../mappers");

const Product = Db.Product;
const Image = Db.Image;
const Category = Db.Category;
const ProductLine = Db.ProductLine;

async function createProduct(req, res, next) {
    const { error, value: body } = CreateProductValidator.validate(req.body);

    if (error != null) {
        next(
            newError(
                "Invalid product data",
                422,
                ErrorTypes.INVALID_PRODUCT_DATA,
                body,
                extractJoiErrorDetail(error)
            )
        );
        return;
    }

    const category = body.categoryId && (await Category.findByPk(body.categoryId));
    const productline = body.productLineId && (await ProductLine.findByPk(body.productLineId));

    try {
        const product = await Product.save(_.omit(body, ["categoryId", "productLineId"]));
        productline != null && (await product.setProductLine(productline));
        category != null && (await product.setCategory(category));
        body.images && (await Image.saveMany(body.images, product.id));

        const newlyCreatedProduct = await Product.find(product.id);
        const options = { isAdminConsumer: true };
        const productDto = toProductDto(newlyCreatedProduct, options);

        res.status(201).send(newSuccess(productDto, "Create product successfully"));
    } catch (e) {
        next(e);
    }
}

async function getProduct(req, res, next) {
    const { id } = req.params;
    const { user } = req;

    const product = await Product.find(id);
    if (product == null) {
        next(newError("Product not found", 404, ErrorTypes.PRODUCT_NOT_FOUND, id));
        return;
    }

    const options = {};

    if (user && user.isAdmin) {
        options.isAdminConsumer = true;
    }

    const productDto = toProductDto(product, options);
    res.status(200).send(newSuccess(productDto, "Get product successfully"));
}

async function getManyProducts(req, res, next) {
    const { error, value: query } = ProductFilterValidator.validate(req.query);

    if (error != null) {
        next(
            newError(
                "Invalid filter query",
                422,
                ErrorTypes.INVALID_QUERY_DATA,
                req.query,
                extractJoiErrorDetail(error)
            )
        );
        return;
    }

    const results = await Product.filter(
        {
            categories: query.category,
            brands: query.brand,
            linenames: query.line,
            minPrice: query.min_price,
            maxPrice: query.max_price
        },
        {
            limit: query.limit,
            offset: query.offset
        }
    );

    const { user } = req;
    const options = {};

    if (user && user.isAdmin) {
        options.isAdminConsumer = true;
    }

    const dtos = results.map(r => toProductDto(r, options));
    res.status(200).send(newSuccess(dtos, "Get product successfully"));
}

async function updateProduct(req, res, next) {
    const { id } = req.params;
    const product = await Product.find(id);

    if (product == null) {
        next(newError("Product not found", 404, ErrorTypes.PRODUCT_NOT_FOUND, id));
        return;
    }

    const { error, value: body } = UpdateValidator.validate(req.body);

    if (error != null) {
        next(
            newError(
                "Invalid update data",
                422,
                ErrorTypes.UPDATE_PRODUCT_FAILED,
                body,
                extractJoiErrorDetail(error)
            )
        );
        return;
    }

    for (const patch of body) {
        try {
            switch (patch.path) {
                case "name":
                case "description":
                case "shortDescription":
                case "availableCount":
                case "originalPrice":
                case "sellPrice":
                case "attributes":
                    await Product.updateOne(product, { [patch.path]: patch.value });
                    break;
                case "categoryId":
                    await Product.setCategory(product, patch.value);
                    break;
                case "productLineId":
                    await Product.setProductLine(product, patch.value);
                    break;
            }
        } catch (e) {
            next(e);
            return;
        }
    }

    const updatedProduct = await Product.find(product.id);
    const dto = toProductDto(updatedProduct);
    res.status(200).send(newSuccess(dto, "Update product successfully"));
}

async function deleteProduct(req, res, next) {
    const { id } = req.params;
    const product = await Product.find(id);

    if (product == null) {
        next(newError("Product not found", 404, ErrorTypes.PRODUCT_NOT_FOUND, id));
        return;
    }

    await Product.delete(product);
    res.status(204).send(newSuccess(product, "Delete product successfully"));
}

module.exports = {
    createProduct,
    getProduct,
    getManyProducts,
    updateProduct,
    deleteProduct
};
