const sequelize = require('../config/db'); // Импортируем настроенный пул из db.js

const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = (sequelize, DataTypes) => {
    const Resume = sequelize.define('Resume', {
        studentId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        vacancyDescription: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
    },
        {
            tableName: 'resume',
            timestamps: false,
            createdAt: false,
        });

    return Resume;
};
