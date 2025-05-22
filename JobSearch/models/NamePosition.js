const sequelize = require('../config/db'); // Импортируем настроенный пул из db.js

const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = (sequelize, DataTypes) => {
    const NamePosition = sequelize.define('NamePosition', {
        positionId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        position: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
    },
        {
            tableName: 'positions',
            timestamps: false,
            createdAt: false,
        });

    return NamePosition;
}