module.exports = (sequelize, DataTypes) => {
    const Product = sequelize.define("product", {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: DataTypes.STRING,
        shortDescription: DataTypes.STRING,
        availableCount: DataTypes.INTEGER,
        originalPrice: DataTypes.FLOAT,
        sellPrice: DataTypes.FLOAT,
        attributes: DataTypes.JSON
    });

    Product.associate = function(models) {
        models.Product.belongsTo(models.ProductLine);
        models.Product.belongsTo(models.Category);
    };

    return Product;
};
