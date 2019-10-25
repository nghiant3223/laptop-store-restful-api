const _ = require("lodash");
const Op = require("sequelize").Op;
const { ErrorTypes } = require("../constants/error");
const { newError } = require("../utils/http_util");
const { assignKeyValueToObject } = require("../utils/lang_util");

module.exports = (sequelize, DataTypes) => {
    const Product = sequelize.define("product", {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: DataTypes.TEXT,
        shortDescription: DataTypes.TEXT,
        availableCount: DataTypes.INTEGER,
        originalPrice: DataTypes.FLOAT,
        sellPrice: DataTypes.FLOAT,
        attributes: DataTypes.JSON,
        availableCount: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        }
    });

    Product.associate = function(models) {
        models.Product.hasMany(models.Image);
        models.Product.belongsTo(models.ProductLine);
        models.Product.belongsTo(models.Category);
    };

    Product.save = function(product) {
        return this.create(product);
    };

    Product.updateOne = function(product, updateValues) {
        return this.update(updateValues, { where: { id: product.id } });
    };

    Product.delete = function(product) {
        return product.destroy();
    };

    Product.findBy = function(field, value, options = {}) {
        const queryOptions = {};

        if (options.limit) {
            queryOptions.limit = options.limit;
        }

        if (options.offset) {
            queryOptions.offset = options.offset;
        }

        if (options.many) {
            return this.findAll({ where: { [field]: value }, ...queryOptions });
        }

        return this.findOne({ where: { [field]: value }, ...queryOptions });
    };

    Product.find = function(id) {
        return this.findByPk(id, {
            include: [
                { model: sequelize.models.category },
                { model: sequelize.models.productLine },
                { model: sequelize.models.image }
            ]
        });
    };

    Product.filter = async function(filter, options = {}) {
        const queryOptions = {};

        if (options.limit) {
            queryOptions.limit = options.limit;
        }

        if (options.offset) {
            queryOptions.offset = options.offset;
        }

        const { categories, brands, linenames } = filter;

        let categoryWhere = {};
        let productLineWhere = {};

        if (categories) {
            categoryWhere.name = {
                [Op.or]: Array.isArray(categories) ? categories : [categories]
            };
        }

        if (brands) {
            productLineWhere.brand = {
                [Op.or]: Array.isArray(brands) ? brands : [brands]
            };
        }

        if (linenames) {
            productLineWhere.name = {
                [Op.or]: Array.isArray(linenames) ? linenames : [linenames]
            };
        }

        let products = await this.findAll({
            include: [
                { model: sequelize.models.category, required: false, where: categoryWhere },
                { model: sequelize.models.productLine, required: false, where: productLineWhere }
            ],
            ...queryOptions,
            where: {
                sellPrice: {
                    [Op.lte]: filter.maxPrice || Infinity,
                    [Op.gte]: filter.minPrice || 0
                }
            }
        });

        if (categories) {
            products = products.filter(p => p.category !== null);
        }

        if (brands || linenames) {
            products = products.filter(p => p.productLine !== null);
        }

        return products;
    };

    Product.setCategory = async function(product, categoryId) {
        const category = await sequelize.models.category.findByPk(categoryId);

        if (category === null) {
            throw newError("Category not found", 404, ErrorTypes.CATEGORY_NOT_FOUND, categoryId);
        }

        await product.setCategory(category);
    };

    Product.setProductLine = async function(product, productLineId) {
        const productLine = await sequelize.models.productLine.findByPk(productLineId);

        if (productLine === null) {
            throw newError(
                "Product line not found",
                404,
                ErrorTypes.PRODUCTLINE_NOT_FOUND,
                productLineId
            );
        }

        await product.setProductLine(productLine);
    };

    return Product;
};
