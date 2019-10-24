const Db = require("../models");
const _ = require("lodash");
const { newSuccess, newError } = require("../utils/http_util");
const { ErrorTypes } = require("../constants/error");
const { CreateCategoryValidator } = require("../validators/category_validator");
const { UpdateValidator } = require("../validators/common_validator");
const { extractJoiErrorDetail } = require("../utils/error_util");
const { toCategoryDto } = require("../mappers");

const Category = Db.Category;

async function createCategory(req, res, next) {
    const { error, value: body } = CreateCategoryValidator.validate(req.body);
    if (error != null) {
        next(
            newError(
                "Invalid category data",
                422,
                ErrorTypes.INVALID_CATEGORY_DATA,
                body,
                extractJoiErrorDetail(error)
            )
        );
        return;
    }

    const category = await Category.findBy("name", body.name);
    if (category != null) {
        next(newError("Category already exists", 409, body));
        return;
    }

    try {
        const newCategory = await Category.save(body);
        const newCategoryDto = toCategoryDto(newCategory);
        res.status(200).send(newSuccess(newCategoryDto, "Create category successfully"));
    } catch (e) {
        next(e);
    }
}

async function categoryToDtoRecursive(category) {
    const dtoCategory = toCategoryDto(category);
    const children = await Category.findBy("parentId", category.id, { many: true });

    if (children.length === 0) {
        return dtoCategory;
    }

    dtoCategory.children = await Promise.all(children.map(cc => categoryToDtoRecursive(cc)));

    return dtoCategory;
}

async function getCategories(req, res, next) {
    const rootCategories = await Category.findParent();
    const categoryDtos = await Promise.all(rootCategories.map(c => categoryToDtoRecursive(c)));
    res.status(200).send(newSuccess(categoryDtos, "Get category successfully"));
}

async function deleteCategory(req, res, next) {
    const { id } = req.params;
    const category = await Category.find(id);

    if (category == null) {
        next(newError("Category not found", 404, ErrorTypes.CATEGORY_NOT_FOUND, id));
        return;
    }

    await Category.delete(category);
    res.status(204).send(newSuccess(category, "Delete category successfully"));
}

async function updateCategory(req, res, next) {
    const { id } = req.params;
    const category = await Category.find(id);

    if (category == null) {
        next(newError("Category not found", 404, ErrorTypes.CATEGORY_NOT_FOUND, id));
        return;
    }

    const { error, value: body } = UpdateValidator.validate(req.body);

    if (error != null) {
        next(
            newError(
                "Invalid update data",
                422,
                ErrorTypes.INVALID_CATEGORY_DATA,
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
                    await Category.updateOne(category, { [patch.path]: patch.value });
                    break;
                case "parentId":
                    await Category.setParent(category, patch.value);
                    break;
            }
        } catch (e) {
            next(e);
            return;
        }
    }

    const updatedCategory = await Category.find(category.id);
    const dto = toCategoryDto(updatedCategory);
    res.status(200).send(newSuccess(dto, "Update category successfully"));
}

module.exports = {
    getCategories,
    createCategory,
    deleteCategory,
    updateCategory
};
