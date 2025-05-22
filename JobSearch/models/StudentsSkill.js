const sequelize = require('../config/db'); // Импортируем настроенный пул из db.js

const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = (sequelize, DataTypes) => {
    const StudentSkill = sequelize.define('StudentSkill', {
        studentId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        skillId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
        {
            tableName: 'students_skills',
            timestamps: false,
            createdAt: false,
        });

    return StudentSkill;
};