const sequelize = require('../config/db'); // Импортируем настроенный пул из db.js

const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

const User = sequelize.define('User', {
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { isEmail: true },
        primaryKey: true,
    },

    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { isEmail: true },
        validate: { len: [6] }
    },

    status: {
        type: DataTypes.STRING,
        defaultValue: 'student',
        validate: {
            isIn: [['student', 'employer']]
        }
    }
},   

    {
        tableName: 'users',
        timestamps: false,
        createdAt: false,
    });

async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log('Подключение к БД PostgreSQL прошло успешно.');
        console.log(User == sequelize.models.User); // true
    } catch (error) {
        console.error('Ошибка подключения к БД PostgreSQL:', error);
    }
}

testConnection();

module.exports = User