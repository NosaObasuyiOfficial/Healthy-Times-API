"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_index_1 = require("../dbconnection/db_index");
class User extends sequelize_1.Model {
}
User.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        primaryKey: true,
        allowNull: false
    },
    userName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    firstName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    lastName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    city: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    state: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    zip: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    country: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    verification: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: true
    },
    role: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    posts: {
        type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.JSONB),
        allowNull: true
    },
}, {
    sequelize: db_index_1.db,
    tableName: "User",
    modelName: "User"
});
exports.default = User;
