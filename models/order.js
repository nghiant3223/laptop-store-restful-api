const { PaymentMethods, ShipTypes } = require("../constants/order");
const { newError } = require("../utils/http_util");
const { ErrorTypes } = require("../constants/error");

module.exports = (sequelize, DataTypes) => {
    const Order = sequelize.define("order", {
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
        models.Order.belongsTo(models.User, { as: "owner", foreignKey: "userId" });
    };

    Order.save = async function(order) {
        return sequelize.transaction().then(async t => {
            try {
                const newOrder = await this.create(order, { transaction: t });
                const orderDetails = await Promise.all(
                    order.items.map(async item => {
                        const product = await sequelize.models.product.findByPk(item.productId, {
                            transaction: t
                        });

                        if (product == null) {
                            throw newError(
                                "Product not found",
                                404,
                                ErrorTypes.PRODUCT_NOT_FOUND,
                                order
                            );
                        }

                        if (product.availableCount < item.quantity) {
                            throw newError(
                                "Product quantity not enough",
                                409,
                                ErrorTypes.PRODUCT_QUANTITY_NOT_ENOUGH,
                                order,
                                `Only ${product.availableCount} available for productId ${item.productId}`
                            );
                        }

                        const detail = {
                            productId: item.productId,
                            quantity: item.quantity,
                            unitPrice: product.sellPrice
                        };
                        await product.decrement("availableCount", {
                            by: item.quantity,
                            transaction: t
                        });
                        return sequelize.models.orderDetail.create(detail, { transaction: t });
                    })
                );

                await Promise.all(orderDetails.map(detail => newOrder.setOrderDetails(detail)));
                const returnedOrder = await this.findByPk(newOrder.id, {
                    include: [{ model: sequelize.models.orderDetail }],
                    transaction: t
                });

                await t.commit();
                return returnedOrder;
            } catch (e) {
                if (t) {
                    await t.rollback();
                }
                throw e;
            }
        });
    };

    Order.find = function(id) {
        return this.findByPk(id);
    };

    Order.findBy = function(field, value, options = {}) {
        if (options.many) {
            if (options.many) {
                return this.findAll({ where: { [field]: value } });
            }

            return this.findOne({ where: { [field]: value } });
        }
    };

    return Order;
};
