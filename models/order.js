const { PaymentMethods, ShipTypes } = require("../constants/order");

module.exports = (sequelize, DataTypes) => {
    const Order = sequelize.define("order", {
        note: DataTypes.STRING,
        paymentMethod: {
            type: DataTypes.ENUM,
            values: [PaymentMethods.MOMO, PaymentMethods.COD],
            defaultValue: PaymentMethods.COD
        },
        shipType: {
            type: DataTypes.ENUM,
            values: [ShipTypes.NORMAL, ShipTypes.FAST],
            defaultValue: ShipTypes.NORMAL
        },
        shipAddress: DataTypes.STRING,
        shipCity: DataTypes.STRING,
        shipDistrict: DataTypes.STRING,
        shipWard: DataTypes.STRING,
        note: DataTypes.TEXT
    });

    Order.associate = function(models) {
        models.Order.hasMany(models.OrderDetail);
    };

    return Order;
};
