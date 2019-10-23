module.exports = (sequelize, DataTypes) => {
    const ProductLine = sequelize.define("productLine", {
        brand: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        line: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        }
    });

    return ProductLine;
};
