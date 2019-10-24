const { ErrorTypes } = require("../constants/error");
const { newError } = require("../utils/http_util");
const Op = require("sequelize").Op;

module.exports = (sequelize, DataTypes) => {
    const Category = sequelize.define("category", {
        name: {
            type: DataTypes.STRING,
            unique: true
        }
    });

    Category.associate = function(models) {
        models.Category.belongsTo(models.Category, { as: "parent" });
    };

    Category.save = async function(category) {
        if (category.parentId) {
            const parentCategory = await this.findByPk(category.parentId);
            if (parentCategory == null) {
                throw newError(
                    "Parent category not exists",
                    404,
                    ErrorTypes.CATEGORY_NOT_FOUND,
                    category
                );
            }
        }

        return this.create(category);
    };

    Category.find = function(id) {
        return this.findByPk(id);
    };

    Category.delete = function(category) {
        return category.destroy();
    };

    Category.updateOne = function(category, updateValues) {
        return this.update(updateValues, { where: { id: category.id } });
    };

    Category.findBy = function(field, value, options = {}) {
        if (options.many) {
            return this.findAll({ where: { [field]: value } });
        }

        return this.findOne({ where: { [field]: value } });
    };

    Category.findParent = function() {
        return this.findAll({ where: { parentId: null } });
    };

    Category.setParent = async function(category, parentId) {
        const parentCategory = await sequelize.models.category.findByPk(parentId);

        if (parentCategory === null) {
            throw newError("Category not found", 404, ErrorTypes.CATEGORY_NOT_FOUND, parentId);
        }

        await category.setParent(parentCategory);
    };

    return Category;
};
