module.exports = (sequelize, DataTypes) => {
    const OrderDetail = sequelize.define("orderDetail", {
        unitPrice: DataTypes.FLOAT,
        quantity: DataTypes.INTEGER,
        discount: DataTypes.FLOAT
    });

    OrderDetail.associate = function(models) {
        models.OrderDetail.belongsTo(models.Product);
    };

    return OrderDetail;
};
