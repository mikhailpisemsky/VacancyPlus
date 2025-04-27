const sequelize = require('../config/db'); // Импортируем настроенный пул из db.js

const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

const StudentsApplication = sequelize.define('StudentsApplication', {
    applicationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },

    studentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
},
    {
        tableName: 'students_application',
        timestamps: false,
        createdAt: false,
    });

async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log('Connection to PostgreSQL has been established successfully.');
        console.log(StudentsApplication == sequelize.models.StudentsApplication); // true
    } catch (error) {
        console.error('Unable to connect to the PostgreSQL database:', error);
    }
}

testConnection();

module.exports = StudentsApplication;