const sequelize = require('../config/db'); // Импортируем настроенный пул из db.js

const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

const Vacancy = sequelize.define('Vacancy', {
    vacancyId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },

    vacancyType: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    positionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },

    vacancyDescription: {
        type: DataTypes.TEXT,
        allowNull: false,
    },

    vacancyStatus: {
        type: DataTypes.STRING,
        defaultValue: 'created',
        validate: {
            isIn: [['created', 'posted', 'closed']]
        }
    },

    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW, // Автоматическая установка времени создания
        allowNull: false
    },
},
    {
        tableName: 'vacancyes',
        timestamps: true,
    });

async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log('Подключение к БД PostgreSQL прошло успешно.');
        console.log(Vacancy == sequelize.models.Vacancy); // true
    } catch (error) {
        console.error('Ошибка подключения к БД PostgreSQL:', error);
    }
}

testConnection();

module.exports = Vacancy;
