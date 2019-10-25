const Sequelize = require("sequelize");
const { newError } = require("../utils/http_util");
const { ErrorTypes } = require("../constants/error");

module.exports = (sequelize, DataTypes) => {
    const ProductLine = sequelize.define("productLine", {
        brand: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: "lineunique"
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: "lineunique"
        }
    });

    ProductLine.save = async line => {
        try {
            return await ProductLine.create(line);
        } catch (e) {
            if (e instanceof Sequelize.UniqueConstraintError) {
                throw newError(
                    "Combination of brand and line must be unique",
                    422,
                    ErrorTypes.PRODUCTLINE_NOT_UNIQUE,
                    line,
                    `Productline with brand ${line.brand} line ${line.name} already exists`
                );
            }

            throw e;
        }
    };

    ProductLine.updateOne = function(line, updateValues) {
        try {
            return this.update(updateValues, { where: { id: line.id } });
        } catch (e) {
            if (e instanceof Sequelize.UniqueConstraintError) {
                throw newError(
                    "Combination of brand and line must be unique",
                    422,
                    ErrorTypes.PRODUCTLINE_NOT_UNIQUE,
                    line,
                    `Productline with brand ${line.brand} line ${line.line} already exists`
                );
            }

            throw e;
        }
    };

    ProductLine.delete = function(productline) {
        return productline.destroy();
    };

    return ProductLine;
};
