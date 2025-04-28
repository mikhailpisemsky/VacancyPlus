const sequelize = require('../config/db'); // Импортируем настроенный пул из db.js

const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

const StudentsSkill = sequelize.define('StudentsSkill', {
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

async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log('Подключение к БД PostgreSQL прошло успешно.');
        console.log(StudentsSkill == sequelize.models.StudentsSkill); // true
    } catch (error) {
        console.error('Ошибка подключения к БД PostgreSQL:', error);
    }
}

testConnection();

module.exports = StudentsSkill;