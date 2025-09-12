const sequelize = require('../config/db'); // Импортируем настроенный пул из db.js

const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = (sequelize, DataTypes) => {
    const EmployerVacancy = sequelize.define('EmployerVacancy', {
        vacancyId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        employerId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
        {
            tableName: 'employers_vacancies',
            timestamps: false,
            createdAt: false,
        });

    return EmployerVacancy;
};