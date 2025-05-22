const sequelize = require('../config/db'); // Импортируем настроенный пул из db.js

const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = (sequlize, DataTypes) => {
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

    Student.associate = (models) => {
        Student.hasOne(models.Resume, {
            foreignKey: 'studentId',
            as: 'resume',
            onDelete: 'CASCADE'
        });

        Student.hasMany(models.StudentSkill, {
            foreignKey: 'studentId',
            as: 'skills',
            onDelete: 'CASCADE'
        });

        Student.hasMany(models.StudentApplication, {
            foreignKey: 'studentId',
            as: 'applications',
            onDelete: 'CASCADE'
        });
    };

    return Student;
};