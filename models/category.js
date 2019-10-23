module.exports = (sequelize, DataTypes) => {
    const Category = sequelize.define("category", {
        name: DataTypes.STRING
    });

    Category.associate = function(models) {
        models.Category.belongsTo(models.Category, { as: "parent" });
    };

    return Category;
};
