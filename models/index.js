const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");

const config = require("../config");
const { toCapitalCase } = require("../utils/string_util");

const Db = {};
const basename = path.basename(__filename);

const sequelize = new Sequelize(config.db.url, {
    define: {
        freezeTableName: true
    }
});

fs.readdirSync(__dirname)
    .filter(file => {
        return file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js";
    })
    .forEach(file => {
        let model = sequelize.import(path.join(__dirname, file));
        Db[toCapitalCase(model.name)] = model;
    });

Object.keys(Db).forEach(modelName => {
    if (!Db[modelName].associate) {
        return;
    }
    Db[modelName].associate(Db);
});

sequelize.sync({ [config.db.sync]: true }).then(() => {
    if (config.db.sync === "force") {
        Db.User.upsert({
            username: "admin",
            password: "admin",
            email: "admin@gmail.com",
            firstName: "Admin",
            lastName: "ViTinhVui",
            profileImage: "http://icons.iconarchive.com/icons/aha-soft/free-large-boss/512/Admin-icon.png"
        });
    }
});

Db.sequelize = sequelize;
Db.Sequelize = Sequelize;

module.exports = Db;
