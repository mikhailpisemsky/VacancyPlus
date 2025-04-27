const sequelize = require('../config/db'); // Импортируем настроенный пул из db.js

const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

const Resume = sequelize.define('Resume', {
    studentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },

    vacancyDescription: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
},
    {
        tableName: 'resume',
        timestamps: false,
        createdAt: false,
    });

async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log('Connection to PostgreSQL has been established successfully.');
        console.log(Resume == sequelize.models.Resume); // true
    } catch (error) {
        console.error('Unable to connect to the PostgreSQL database:', error);
    }
}

testConnection();

module.exports = Resume;