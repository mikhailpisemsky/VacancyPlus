const sequelize = require('../config/db'); // Импортируем настроенный пул из db.js

const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

const NecessarySkill = sequelize.define('NecessarySkill', {
    vacancyId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },

    skillId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
},
    {
        tableName: 'necessary_skills',
        timestamps: false,
        createdAt: false,
    });

async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log('Подключение к БД PostgreSQL прошло успешно.');
        console.log(NecessarySkill == sequelize.models.NecessarySkill); // true
    } catch (error) {
        console.error('Ошибка подключения к БД PostgreSQL:', error);
    }
}

testConnection();

module.exports = NecessarySkill;