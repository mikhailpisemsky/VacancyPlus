const sequelize = require('../config/db'); // Импортируем настроенный пул из db.js

const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

const EmployersVacancies = sequelize.define('EmployersVacancies', {
    vacancyId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },

    employerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
},
    {
        tableName: 'employers_vacancies',
        timestamps: false,
        createdAt: false,
    });

async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log('Connection to PostgreSQL has been established successfully.');
        console.log(User === sequelize.models.EmployersVacancies); // true
    } catch (error) {
        console.error('Unable to connect to the PostgreSQL database:', error);
    }
}

testConnection();

module.exports = EmployersVacancies;