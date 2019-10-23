module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("user", {
        username: {
            type: DataTypes.STRING,
            unique: true
        },
        password: DataTypes.STRING,
        email: {
            type: DataTypes.STRING,
            unique: true
        },
        fbId: {
            type: DataTypes.BIGINT,
            unique: true
        },
        firstName: DataTypes.STRING,
        lastName: DataTypes.STRING,
        profileImage: DataTypes.STRING
    });

    User.associate = function(models) {
        models.User.hasMany(models.Order);
    };

    User.findBy = function(field, value, many = false) {
        if (many) {
            return this.findAll({ where: { [field]: value } });
        }

        return this.findOne({ where: { [field]: value } });
    };

    User.find = function(id) {
        return this.findByPk(id);
    };

    User.save = function(user) {
        return this.create(user);
    };

    return User;
};
