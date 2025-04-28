const sequelize = require('../config/db'); // Импортируем настроенный пул из db.js

const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

const Student = sequelize.define('Student', {
    studentId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },

    email: {
        type: DataTypes.STRING,
        allowNull: true
    },

    name: {
        type: DataTypes.STRING,
    },

    phone: {
        type: DataTypes.STRING(20),
        validate: {
            is: /^[\+\d\s\-\(\)]{5,20}$/i
        }
    },

    resumeStatus: {
        type: DataTypes.STRING,
        defaultValue: 'resume not uploaded',
        validate: {
            isIn: [['resume not uploaded', 'resume uploaded']]
        }
    }
},
    {
        tableName: 'students',
        timestamps: false,
        createdAt: false,
    });

async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log('Подключение к БД PostgreSQL прошло успешно.');
        console.log(Student == sequelize.models.Student); // true
    } catch (error) {
        console.error('Ошибка подключения к БД PostgreSQL:', error);
    }
}

testConnection();

module.exports = Student