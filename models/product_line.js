module.exports = (sequelize, DataTypes) => {
    const ProductLine = sequelize.define("productLine", {
        brand: {
            type: DataTypes.STRING,
            allowNull: false
        },
        line: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });

    return ProductLine;
};
