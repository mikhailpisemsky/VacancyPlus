module.exports = (sequelize, DataTypes) => {
    const StudentApplication = sequelize.define('StudentApplication', {
        applicationId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            references: {
                model: 'applications',
                key: 'applicationId'
            },
            onDelete: 'CASCADE'
        },
        studentId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            references: {
                model: 'students',
                key: 'studentId'
            },
            onDelete: 'CASCADE'
        }
    }, {
        tableName: 'students_application',
        timestamps: false
    });

    StudentApplication.associate = (models) => {
        StudentApplication.belongsTo(models.Application, {
            foreignKey: 'applicationId',
            as: 'application'
        });
        StudentApplication.belongsTo(models.Student, {
            foreignKey: 'studentId',
            as: 'student'
        });
    };

    return StudentApplication;
};