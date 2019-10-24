module.exports = (sequelize, DataTypes) => {
    const OrderDetail = sequelize.define("orderDetail", {
        unitPrice: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        discount: DataTypes.FLOAT
    });

    OrderDetail.associate = function(models) {
        models.OrderDetail.belongsTo(models.Product);
    };

    return OrderDetail;
};
