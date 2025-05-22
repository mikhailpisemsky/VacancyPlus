const sequelize = require('../config/db'); // Импортируем настроенный пул из db.js

const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;


module.exports = (sequelize, DataTypes) => {
    const Vacancy = sequelize.define('Vacancy', {
        vacancyId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        vacancyType: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isIn: [
                    [
                        'полная занятость',
                        'частичная занятость',
                        'удалённая работа',
                        'ассистент преподавателя',
                        'помощь в административных отделах',
                        'участие в исследовательских проектах',
                        'стажировка в партнёрских организациях'
                    ]
                ]
            }
        },

        positionId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        companyName: {
            type: DataTypes.STRING,
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
            tableName: 'vacancies',
            timestamps: true,
        });

    Vacancy.associate = (models) => {
        Vacancy.belongsTo(models.NamePosition, {
            foreignKey: 'positionId',
            as: 'position',
            onDelete: 'RESTRICT' // Не удаляем позицию при удалении вакансии
        });

        Vacancy.hasMany(models.RequiredSkill, {
            foreignKey: 'vacancyId',
            as: 'requiredSkills',
            onDelete: 'CASCADE'
        });

        Vacancy.hasMany(models.EmployerVacancy, {
            foreignKey: 'vacancyId',
            as: 'vacancyOwners',
            onDelete: 'CASCADE'
        });

        Vacancy.hasMany(models.Application, {
            foreignKey: 'vacancyId',
            as: 'jobApplications',
            onDelete: 'CASCADE'
        });
    };

    return Vacancy;
};
