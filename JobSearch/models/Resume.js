module.exports = (sequelize, DataTypes) => {
    const Resume = sequelize.define('Resume', {
        studentId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'students', // Убедитесь, что имя таблицы в нижнем регистре
                key: 'studentId'
            },
            onDelete: 'CASCADE'
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

    return Resume;
};
