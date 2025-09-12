module.exports = (sequelize, DataTypes) => {
    const StudentSkill = sequelize.define('StudentSkill', {
        studentId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            references: {
                model: 'students',
                key: 'studentId'
            },
            onDelete: 'CASCADE'
        },
        skillId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            references: {
                model: 'skills',
                key: 'skillId'
            },
            onDelete: 'CASCADE'
        },
    }, {
        tableName: 'students_skills',
        timestamps: false,
    });

    StudentSkill.associate = (models) => {
        StudentSkill.belongsTo(models.Student, {
            foreignKey: 'studentId',
            as: 'student'
        });

        StudentSkill.belongsTo(models.Skill, {
            foreignKey: 'skillId',
            as: 'skill'
        });
    };

    return StudentSkill;
};