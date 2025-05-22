const sequelize = require('../config/db'); // Импортируем настроенный пул из db.js

const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = (sequelize, DataTypes) => {
    const StudentApplication = sequelize.define('StudentApplication', {
        applicationId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        studentId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
        {
            tableName: 'students_application',
            timestamps: false,
            createdAt: false,
        });

    return StudentApplication;
};