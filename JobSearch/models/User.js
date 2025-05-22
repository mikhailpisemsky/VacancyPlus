const sequelize = require('../config/db'); // Импортируем настроенный пул из db.js

const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = (sequelize, DataTypes) => {
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

    User.associate = (models) => {
        User.belongsTo(models.Student, {
            foreignKey: 'email',
            targetKey: 'email',
            as: 'studentData',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });

        User.belongsTo(models.Employer, {
            foreignKey: 'email',
            targetKey: 'email',
            as: 'employerData',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });
    };

    return User;
};