const sequelize = require('../config/db'); // Импортируем настроенный пул из db.js

const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

const Position = sequelize.define('Position', {
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

async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log('Подключение к БД PostgreSQL прошло успешно.');
        console.log(Position == sequelize.models.Position); // true
    } catch (error) {
        console.error('Ошибка подключения к БД PostgreSQL:', error);
    }
}

testConnection();

module.exports = Position;