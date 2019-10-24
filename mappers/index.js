const _ = require("lodash");

function toUserDto(user) {
    return _.pick(user, ["firstName", "lastName", "profileImage"]);
}

function toMeDto(user) {
    return _.pick(user, ["firstName", "lastName", "profileImage"]);
}

function toProductDto(product, options = {}) {
    const dto = _.pick(product, [
        "id",
        "name",
        "description",
        "shortDescription",
        "availableCount",
        "originalPrice",
        "sellPrice",
        "attributes"
    ]);

    if (options.isAdminConsumer) {
        dto.createdAt = product.createdAt;
        dto.updatedAt = product.updatedAt;
    }

    dto.category = product.category && _.pick(product.productLine, ["id", "name"]);
    dto.productLine = product.productLine && _.pick(product.productLine, ["id", "brand", "line"]);

    return dto;
}

function toCategoryDto(category) {
    return _.pick(category, ["id", "name", "parentId"]);
}

function toOrderDto(order, options = {}) {
    const dto = _.pick(order, [
        "paymentMethod",
        "shipType",
        "shipAddress",
        "shipCity",
        "shipDistrict",
        "shipWard",
        "note"
    ]);
}

module.exports = {
    toUserDto,
    toMeDto,
    toProductDto,
    toCategoryDto,
    toOrderDto
};
