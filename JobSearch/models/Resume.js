module.exports = (sequelize, DataTypes) => {
    const Resume = sequelize.define('Resume', {
        studentId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'students',
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
            timestamps: false
        });

    Resume.associate = (models) => {
        Resume.belongsTo(models.Student, {
            foreignKey: 'studentId',
            as: 'student'
        });
    };

    return Resume;
};
