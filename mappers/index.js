const _ = require("lodash");

function toUserDto(user) {
    return _.pick(user, ["firstName", "lastName", "profileImage"]);
}

function toMeDto(user) {
    return _.pick(user, ["firstName", "lastName", "profileImage"]);
}

function toProductDto(product, options = { isAdminConsumer: false }) {
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

    dto.category = product.category && product.category.name;
    dto.productLine = product.productLine && _.pick(product.productLine, ["brand", "line"]);

    return dto;
}

module.exports = {
    toUserDto,
    toMeDto,
    toProductDto
};
