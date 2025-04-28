const sequelize = require('../config/db'); // Импортируем настроенный пул из db.js

const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

const Skill = sequelize.define('Skill', {
    skillId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },

    skill: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
},
    {
        tableName: 'skills',
        timestamps: false,
        createdAt: false,
    });

async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log('Подключение к БД PostgreSQL прошло успешно.');
        console.log(Skill == sequelize.models.Skill); // true
    } catch (error) {
        console.error('Ошибка подключения к БД PostgreSQL:', error);
    }
}

testConnection();

module.exports = Skill;