const sequelize = require('../config/db'); // Импортируем настроенный пул из db.js

const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

const Application = sequelize.define('Application', {
    applicationId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },

    vacancyId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    applicationStatus: {
        type: DataTypes.STRING,
        defaultValue: 'posted',
        validate: {
            isIn: [['posted', 'accepted', 'rejected']]
        }
    },

    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW, // Автоматическая установка времени создания
        allowNull: false
    },
},
    {
        tableName: 'applications',
        timestamps: true,
    });

async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log('Connection to PostgreSQL has been established successfully.');
        console.log(User === sequelize.models.Application); // true
    } catch (error) {
        console.error('Unable to connect to the PostgreSQL database:', error);
    }
}

testConnection();

module.exports = Application;