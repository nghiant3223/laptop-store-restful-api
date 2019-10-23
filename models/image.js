module.exports = (sequelize, DataTypes) => {
    const Image = sequelize.define("image", {
        name: DataTypes.STRING
    });

    Image.associate = function(models) {
        models.Image.belongsTo(models.Product);
    };

    return Image;
};
