const { newError } = require("../utils/http_util");
const { ErrorTypes } = require("../constants/error");

module.exports = (sequelize, DataTypes) => {
    const Image = sequelize.define("image", {
        url: DataTypes.STRING,
        productId: DataTypes.INTEGER
    });

    Image.associate = function(models) {
        models.Image.belongsTo(models.Product);
    };

    Image.saveMany = async function(urls, productId) {
        return Promise.all(
            urls.map(url => {
                const image = { url, productId };
                return this.create(image);
            })
        );
    };

    Image.delete = async function(id) {
        const image = await Image.findByPk(id);

        if (image == null) {
            throw newError("Image not found", 404, ErrorTypes.IMAGE_NOT_FOUND, id);
        }

        return image.destroy();
    };

    return Image;
};
